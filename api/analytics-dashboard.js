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
  const requestedFrom = request.query.from ? new Date(request.query.from) : null
  const requestedTo = request.query.to ? new Date(request.query.to) : null
  const hasCustomRange = requestedFrom && requestedTo
    && !Number.isNaN(requestedFrom.getTime()) && !Number.isNaN(requestedTo.getTime())
  const to = hasCustomRange ? requestedTo : new Date()
  const from = hasCustomRange ? requestedFrom : new Date(to.getTime() - days * 86400000)

  if (from >= to || to.getTime() - from.getTime() > 90 * 86400000) {
    return response.status(400).json({ error: 'Escolha um intervalo valido de ate 90 dias' })
  }

  const range = [from.toISOString(), to.toISOString()]
  const useHourlyTimeline = to.getTime() - from.getTime() <= 86400000
  try {
    const sql = getSql()
    await ensureSchema(sql)
    const timelineQuery = useHourlyTimeline
      ? sql.query(`
          SELECT hour AS date,
            COUNT(e.id) FILTER (WHERE event_name = 'page_view')::int AS page_views,
            COUNT(DISTINCT session_hash) FILTER (WHERE event_name = 'page_view')::int AS visitors,
            COUNT(e.id) FILTER (WHERE event_name = 'audio_start')::int AS audio_starts
          FROM GENERATE_SERIES(
            DATE_TRUNC('hour', $1::timestamptz),
            DATE_TRUNC('hour', $2::timestamptz),
            INTERVAL '1 hour'
          ) hour
          LEFT JOIN analytics_events e ON e.occurred_at >= hour AND e.occurred_at < hour + INTERVAL '1 hour'
            AND e.occurred_at >= $1::timestamptz AND e.occurred_at <= $2::timestamptz
          GROUP BY hour ORDER BY hour
        `, range)
      : sql.query(`
          SELECT TO_CHAR(day, 'YYYY-MM-DD') AS date,
            COUNT(e.id) FILTER (WHERE event_name = 'page_view')::int AS page_views,
            COUNT(DISTINCT session_hash) FILTER (WHERE event_name = 'page_view')::int AS visitors,
            COUNT(e.id) FILTER (WHERE event_name = 'audio_start')::int AS audio_starts
          FROM GENERATE_SERIES(DATE_TRUNC('day', $1::timestamptz), DATE_TRUNC('day', $2::timestamptz), INTERVAL '1 day') day
          LEFT JOIN analytics_events e ON e.occurred_at >= day AND e.occurred_at < day + INTERVAL '1 day'
            AND e.occurred_at >= $1::timestamptz AND e.occurred_at <= $2::timestamptz
          GROUP BY day ORDER BY day
        `, range)
    const [summary, daily, pages, radios, sources, devices, sessions] = await Promise.all([
      sql.query(`
        SELECT
          COUNT(*) FILTER (WHERE event_name = 'page_view')::int AS page_views,
          COUNT(DISTINCT session_hash) FILTER (WHERE event_name = 'page_view')::int AS visitors,
          COUNT(*) FILTER (WHERE event_name = 'audio_start')::int AS audio_starts,
          COALESCE(SUM(duration_seconds) FILTER (WHERE event_name = 'audio_heartbeat'), 0)::int AS listening_seconds
        FROM analytics_events WHERE occurred_at >= $1::timestamptz AND occurred_at <= $2::timestamptz
      `, range),
      timelineQuery,
      sql.query(`SELECT path, COUNT(*)::int AS views, COUNT(DISTINCT session_hash)::int AS visitors FROM analytics_events WHERE event_name = 'page_view' AND occurred_at >= $1::timestamptz AND occurred_at <= $2::timestamptz GROUP BY path ORDER BY views DESC LIMIT 10`, range),
      sql.query(`SELECT radio_id, MAX(radio_name) AS radio_name, COUNT(*) FILTER (WHERE event_name = 'audio_start')::int AS starts, COALESCE(SUM(duration_seconds) FILTER (WHERE event_name = 'audio_heartbeat'), 0)::int AS listening_seconds FROM analytics_events WHERE radio_id IS NOT NULL AND occurred_at >= $1::timestamptz AND occurred_at <= $2::timestamptz GROUP BY radio_id ORDER BY starts DESC, listening_seconds DESC LIMIT 10`, range),
      sql.query(`SELECT COALESCE(NULLIF(referrer, ''), 'Direto') AS source, COUNT(*)::int AS visits FROM analytics_events WHERE event_name = 'page_view' AND occurred_at >= $1::timestamptz AND occurred_at <= $2::timestamptz GROUP BY source ORDER BY visits DESC LIMIT 10`, range),
      sql.query(`SELECT device_type AS device, COUNT(*)::int AS visits FROM analytics_events WHERE event_name = 'page_view' AND occurred_at >= $1::timestamptz AND occurred_at <= $2::timestamptz GROUP BY device_type ORDER BY visits DESC`, range),
      sql.query(`
        SELECT * FROM (
          SELECT DISTINCT ON (event.session_hash)
            SUBSTRING(event.session_hash, 1, 8) AS session,
            event.occurred_at AS last_seen,
            event.path,
            event.country_code,
            event.region_code,
            event.city,
            event.device_type AS device,
            COALESCE((
              SELECT SUM(heartbeat.duration_seconds)
              FROM analytics_events heartbeat
              WHERE heartbeat.session_hash = event.session_hash
                AND heartbeat.event_name = 'audio_heartbeat'
                AND heartbeat.occurred_at >= $1::timestamptz
                AND heartbeat.occurred_at <= $2::timestamptz
            ), 0)::int AS listening_seconds,
            EXISTS (
              SELECT 1 FROM analytics_events presence
              WHERE presence.session_hash = event.session_hash
                AND presence.event_name = 'presence'
                AND presence.occurred_at >= NOW() - INTERVAL '130 seconds'
            ) AS online
          FROM analytics_events event
          WHERE event.occurred_at >= $1::timestamptz AND event.occurred_at <= $2::timestamptz
          ORDER BY event.session_hash, event.occurred_at DESC
        ) latest_sessions
        ORDER BY online DESC, last_seen DESC
      `, range),
    ])
    const onlineCount = sessions.reduce((total, session) => total + (session.online ? 1 : 0), 0)
    response.setHeader('Cache-Control', 'private, no-store')
    return response.status(200).json({ from: range[0], to: range[1], timeline: useHourlyTimeline ? 'hour' : 'day', summary: { ...summary[0], online: onlineCount }, daily, pages, radios, sources, devices, sessions })
  } catch (error) {
    console.error('analytics_dashboard_failed', error)
    return response.status(500).json({ error: 'Nao foi possivel consultar o painel' })
  }
}
