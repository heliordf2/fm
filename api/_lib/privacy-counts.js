export async function ensurePrivacyCounts(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS privacy_choice_counts (
      day DATE PRIMARY KEY,
      accepted BIGINT NOT NULL DEFAULT 0,
      rejected BIGINT NOT NULL DEFAULT 0
    )
  `
}

export async function countPrivacyChoice(sql, choice) {
  await ensurePrivacyCounts(sql)
  const accepted = choice === 'accepted' ? 1 : 0
  const rejected = choice === 'rejected' ? 1 : 0
  await sql`
    INSERT INTO privacy_choice_counts (day, accepted, rejected)
    VALUES ((NOW() AT TIME ZONE 'America/Sao_Paulo')::date, ${accepted}, ${rejected})
    ON CONFLICT (day) DO UPDATE SET
      accepted = privacy_choice_counts.accepted + EXCLUDED.accepted,
      rejected = privacy_choice_counts.rejected + EXCLUDED.rejected
  `
}
