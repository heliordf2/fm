import { test } from 'node:test'
import assert from 'node:assert/strict'
import collect from '../api/analytics.js'
import retired from '../api/retired-analytics.js'

function response() {
  return { headers: {}, setHeader(key, value) { this.headers[key] = value }, status(code) { this.code = code; return this }, json(body) { this.body = body; return this }, end(body) { this.body = body; return this } }
}

test('antigo painel responde 410 sem carregar scripts de medição', () => {
  const res = response()
  retired({}, res)
  assert.equal(res.code, 410)
  assert.equal(res.headers['X-Robots-Tag'], 'noindex, nofollow')
  assert.doesNotMatch(res.body, /<script/)
})

test('coletor rejeita eventos do painel antigo antes de acessar o banco', async () => {
  for (const path of ['/analytics', '/analytics/', '/analytics/sessions', '/analytics?days=7']) {
    const res = response()
    await collect({ method: 'POST', headers: {}, body: { event: 'page_view', sessionId: 'test-session', path } }, res)
    assert.equal(res.code, 202, path)
    assert.deepEqual(res.body, { accepted: false })
  }
})
