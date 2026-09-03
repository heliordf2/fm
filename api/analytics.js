import { createHash } from 'node:crypto'
import process from 'node:process'
import { ensureSchema, getSql } from './_lib/analytics-db.js'

const ALLOWED_EVENTS = new Set(['page_view', 'presence', 'audio_start', 'audio_heartbeat', 'audio_error'])
const BOT_PATTERN = /bot|crawler|spider|preview|headless|lighthouse|monitoring|uptime/i

function cleanString(value, maxLength) {
  if (typeof value !== 'string') return null
  const clean = Array.from(value.trim()).filter((character) => {
    const code = character.charCodeAt(0)
    return code >= 32 && code !== 127
  }).join('')
  return clean ? clean.slice(0, maxLength) : null
}

function deviceType(userAgent = '') {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet'
  if (/mobile|android|iphone|ipod/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

function decodeCity(value) {
  const city = cleanString(value, 240)
  if (!city) return null
  try {
    return cleanString(decodeURIComponent(city), 120)
  } catch {
    return cleanString(city, 120)
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Metodo nao permitido' })
  }

  const origin = cleanString(request.headers.origin, 500)
  const host = cleanString(request.headers['x-forwarded-host'] || request.headers.host, 255)
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return response.status(403).json({ error: 'Origem invalida' })
    } catch {
      return response.status(403).json({ error: 'Origem invalida' })
    }
  }

  const userAgent = cleanString(request.headers['user-agent'], 500) || ''
  if (BOT_PATTERN.test(userAgent)) return response.status(202).json({ accepted: false })

  let body
  try {
    body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : (request.body || {})
  } catch {
    return response.status(400).json({ error: 'JSON invalido' })
  }
  const eventName = cleanString(body.event, 32)
  const sessionId = cleanString(body.sessionId, 100)
  const path = cleanString(body.path, 500)

  if (!ALLOWED_EVENTS.has(eventName) || !sessionId || !path || !path.startsWith('/')) {
    return response.status(400).json({ error: 'Evento invalido' })
  }

  const salt = process.env.ANALYTICS_SALT || process.env.PAINEL_PASS
  if (!salt || salt.length < 12) {
    return response.status(503).json({ error: 'ANALYTICS_SALT nao configurado' })
  }

  const sessionHash = createHash('sha256').update(`${salt}:${sessionId}`).digest('hex')
  const duration = Math.max(0, Math.min(300, Number.parseInt(body.durationSeconds, 10) || 0))
  const metadata = body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
    ? JSON.stringify(Object.fromEntries(Object.entries(body.metadata).slice(0, 10).map(([key, value]) => [cleanString(key, 40), cleanString(String(value), 120)]).filter(([key]) => key)))
    : '{}'

  try {
    const sql = getSql()
    await ensureSchema(sql)
    await sql`
      INSERT INTO analytics_events (
        event_name, session_hash, path, referrer, radio_id, radio_name,
        duration_seconds, country_code, region_code, city, device_type, metadata
      ) VALUES (
        ${eventName}, ${sessionHash}, ${path}, ${cleanString(body.referrer, 500)},
        ${cleanString(body.radioId, 120)}, ${cleanString(body.radioName, 200)},
        ${duration}, ${cleanString(request.headers['x-vercel-ip-country'], 2)},
        ${cleanString(request.headers['x-vercel-ip-country-region'], 8)},
        ${decodeCity(request.headers['x-vercel-ip-city'])}, ${deviceType(userAgent)}, ${metadata}::jsonb
      )
    `
    response.setHeader('Cache-Control', 'no-store')
    return response.status(202).json({ accepted: true })
  } catch (error) {
    console.error('analytics_insert_failed', error)
    return response.status(500).json({ error: 'Nao foi possivel registrar o evento' })
  }
}
