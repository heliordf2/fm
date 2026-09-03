import { ensureSchema, getSql } from '../api/_lib/analytics-db.js'

try {
  const sql = getSql()
  await ensureSchema(sql)
  const [{ event_count: eventCount }] = await sql`SELECT COUNT(*)::int AS event_count FROM analytics_events`
  console.log(`Analytics pronto no Neon (${eventCount} eventos existentes).`)
} catch (error) {
  console.error(`Falha ao inicializar o analytics: ${error.message}`)
  if (error.cause?.code) console.error(`Codigo da causa: ${error.cause.code}`)
  process.exitCode = 1
}
