import { neon } from '@neondatabase/serverless'
import process from 'node:process'

let schemaPromise

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL nao configurada')
  }
  return neon(process.env.DATABASE_URL)
}

export function ensureSchema(sql) {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id BIGSERIAL PRIMARY KEY,
          occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          event_name VARCHAR(32) NOT NULL,
          session_hash CHAR(64) NOT NULL,
          path VARCHAR(500) NOT NULL,
          referrer VARCHAR(500),
          radio_id VARCHAR(120),
          radio_name VARCHAR(200),
          duration_seconds INTEGER NOT NULL DEFAULT 0,
          country_code VARCHAR(2),
          region_code VARCHAR(8),
          city VARCHAR(120),
          device_type VARCHAR(16),
          metadata JSONB NOT NULL DEFAULT '{}'::jsonb
        )
      `
      await sql`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS region_code VARCHAR(8)`
      await sql`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS city VARCHAR(120)`
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_occurred_at_idx ON analytics_events (occurred_at DESC)`
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_name_time_idx ON analytics_events (event_name, occurred_at DESC)`
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_radio_time_idx ON analytics_events (radio_id, occurred_at DESC) WHERE radio_id IS NOT NULL`
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_session_time_idx ON analytics_events (session_hash, occurred_at DESC)`
    })().catch((error) => {
      schemaPromise = undefined
      throw error
    })
  }
  return schemaPromise
}
