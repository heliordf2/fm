import test from 'node:test'
import assert from 'node:assert/strict'
import { createPrivacyChoiceHandler } from '../api/privacy-choice.js'
import { countPrivacyChoice } from '../api/_lib/privacy-counts.js'
import { savePrivacyChoice } from '../src/utils/privacy.js'

const response = () => ({ setHeader() {}, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } })
const request = (choice) => ({ method: 'POST', headers: { origin: 'https://radiofmonline.com.br', host: 'radiofmonline.com.br' }, body: { choice } })

test('aceite e recusa contam sem sessão ou autorização de analytics', async () => {
  const choices = []
  const handler = createPrivacyChoiceHandler(async (choice) => choices.push(choice))
  for (const choice of ['accepted', 'rejected']) {
    const res = response()
    await handler(request(choice), res)
    assert.equal(res.code, 202)
    assert.equal(res.body.counted, true)
  }
  assert.deepEqual(choices, ['accepted', 'rejected'])
})

test('contador rejeita origem externa e dados adicionais sem acessar banco', async () => {
  const handler = createPrivacyChoiceHandler(() => { throw new Error('must not record') })
  for (const req of [
    { ...request('accepted'), headers: { origin: 'https://other.com', host: 'radiofmonline.com.br' } },
    { ...request('accepted'), body: { choice: 'accepted', sessionId: 'secret' } },
    request('invalid'),
  ]) {
    const res = response()
    await handler(req, res)
    assert.ok([400, 403].includes(res.code))
  }
})

test('contador mantém somente incrementos agregados por dia', async () => {
  const queries = []
  const sql = async (strings, ...values) => queries.push({ query: strings.join('?'), values })
  await countPrivacyChoice(sql, 'accepted')
  await countPrivacyChoice(sql, 'rejected')
  assert.deepEqual(queries[1].values, [1, 0])
  assert.deepEqual(queries[3].values, [0, 1])
  assert.match(queries[1].query, /ON CONFLICT.*DO UPDATE/s)
  assert.doesNotMatch(queries.map((row) => row.query).join(''), /session|referrer|radio_id|ip_address/i)
})

test('repetir escolha não conta; alterar escolha envia só valor sem cookies ou referrer', () => {
  const originalWindow = globalThis.window
  const originalFetch = globalThis.fetch
  const values = new Map()
  const submissions = []
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }
  globalThis.window = { localStorage: storage, sessionStorage: storage, dispatchEvent() {} }
  globalThis.fetch = async (url, options) => { submissions.push({ url, ...options }) }
  try {
    savePrivacyChoice(false)
    savePrivacyChoice(false)
    savePrivacyChoice(true)
    savePrivacyChoice(true)
    savePrivacyChoice(false)
    assert.deepEqual(submissions.map((item) => JSON.parse(item.body)), [{ choice: 'rejected' }, { choice: 'accepted' }, { choice: 'rejected' }])
    assert.ok(submissions.every((item) => item.credentials === 'omit' && item.referrerPolicy === 'no-referrer'))
  } finally { globalThis.window = originalWindow; globalThis.fetch = originalFetch }
})
