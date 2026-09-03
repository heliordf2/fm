import { timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { ensureSchema, getSql } from './_lib/analytics-db.js'

function isAuthorized(request) {
  const expected = process.env.PAINEL_PASS || ''
  const header = request.headers.authorization || ''
  if (!expected || !header.startsWith('Basic ')) return false
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const password = decoded.slice(decoded.indexOf(':') + 1)
    const actualBuffer = Buffer.from(password)
    const expectedBuffer = Buffer.from(expected)
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  } catch {
    return false
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Metodo nao permitido' })
  }
  if (!isAuthorized(request)) {
    response.setHeader('WWW-Authenticate', 'Basic realm="Analytics"')
    return response.status(401).json({ error: 'Senha invalida' })
  }

  const days = Math.max(1, Math.min(90, Number.parseInt(request.query.days, 10) || 30))
  try {
    const sql = getSql()
    await ensureSchema(sql)
    const [summary, daily, pages, radios, sources, devices, online] = await Promise.all([
      sql.query(`
        SELECT
          COUNT(*) FILTER (WHERE event_name = 'page_view')::int AS page_views,
          COUNT(DISTINCT session_hash) FILTER (WHERE event_name = 'page_view')::int AS visitors,
          COUNT(*) FILTER (WHERE event_name = 'audio_start')::int AS audio_starts,
          COALESCE(SUM(duration_seconds) FILTER (WHERE event_name = 'audio_heartbeat'), 0)::int AS listening_seconds
        FROM analytics_events WHERE occurred_at >= NOW() - ($1 * INTERVAL '1 day')
      `, [days]),
      sql.query(`
        SELECT TO_CHAR(day, 'YYYY-MM-DD') AS date,
          COUNT(e.id) FILTER (WHERE event_name = 'page_view')::int AS page_views,
          COUNT(DISTINCT session_hash) FILTER (WHERE event_name = 'page_view')::int AS visitors,
          COUNT(e.id) FILTER (WHERE event_name = 'audio_start')::int AS audio_starts
        FROM GENERATE_SERIES(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') day
        LEFT JOIN analytics_events e ON e.occurred_at >= day AND e.occurred_at < day + INTERVAL '1 day'
        GROUP BY day ORDER BY day
      `, [days]),
      sql.query(`SELECT path, COUNT(*)::int AS views, COUNT(DISTINCT session_hash)::int AS visitors FROM analytics_events WHERE event_name = 'page_view' AND occurred_at >= NOW() - ($1 * INTERVAL '1 day') GROUP BY path ORDER BY views DESC LIMIT 10`, [days]),
      sql.query(`SELECT radio_id, MAX(radio_name) AS radio_name, COUNT(*) FILTER (WHERE event_name = 'audio_start')::int AS starts, COALESCE(SUM(duration_seconds) FILTER (WHERE event_name = 'audio_heartbeat'), 0)::int AS listening_seconds FROM analytics_events WHERE radio_id IS NOT NULL AND occurred_at >= NOW() - ($1 * INTERVAL '1 day') GROUP BY radio_id ORDER BY starts DESC, listening_seconds DESC LIMIT 10`, [days]),
      sql.query(`SELECT COALESCE(NULLIF(referrer, ''), 'Direto') AS source, COUNT(*)::int AS visits FROM analytics_events WHERE event_name = 'page_view' AND occurred_at >= NOW() - ($1 * INTERVAL '1 day') GROUP BY source ORDER BY visits DESC LIMIT 10`, [days]),
      sql.query(`SELECT device_type AS device, COUNT(*)::int AS visits FROM analytics_events WHERE event_name = 'page_view' AND occurred_at >= NOW() - ($1 * INTERVAL '1 day') GROUP BY device_type ORDER BY visits DESC`, [days]),
      sql.query(`
        SELECT DISTINCT ON (session_hash)
          SUBSTRING(session_hash, 1, 8) AS session,
          occurred_at AS last_seen,
          path,
          country_code,
          region_code,
          city,
          device_type AS device
        FROM analytics_events
        WHERE event_name = 'presence' AND occurred_at >= NOW() - INTERVAL '130 seconds'
        ORDER BY session_hash, occurred_at DESC
      `),
    ])
    response.setHeader('Cache-Control', 'private, no-store')
    return response.status(200).json({ days, summary: { ...summary[0], online: online.length }, daily, pages, radios, sources, devices, online })
  } catch (error) {
    console.error('analytics_dashboard_failed', error)
    return response.status(500).json({ error: 'Nao foi possivel consultar o painel' })
  }
}
