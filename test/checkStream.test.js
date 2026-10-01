import test from 'node:test'
import assert from 'node:assert/strict'
import { checkStream } from '../scripts/lib/checkStream.mjs'

test('checagem distingue áudio de página HTML com status 200 ou resposta vazia', async () => {
  for (const [type, body, expected] of [['audio/mpeg', new Uint8Array([255, 251]), true], ['text/html', '<h1>Erro</h1>', false], ['audio/aac', '', false]]) {
    const result = await checkStream('https://example.com/stream', 1000, async () => new Response(body, { headers: { 'content-type': type } }))
    assert.equal(result.ok, expected, type)
  }
  const result = await checkStream('https://example.com/stream', 1000, async () => new Response('not found', { status: 404 }))
  assert.equal(result.status, 404)
  assert.equal(result.ok, false)
})

test('erro na leitura do stream não é tratado como sucesso', async () => {
  const result = await checkStream('https://example.com/stream', 1000, async () => new Response(new ReadableStream({ start(controller) { controller.error(new Error('interrompido')) } }), { headers: { 'content-type': 'audio/mpeg' } }))
  assert.equal(result.ok, false)
  assert.match(result.error, /interrompido/)
})
