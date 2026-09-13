import test from 'node:test'
import assert from 'node:assert/strict'
import { getRadioSupportUrl } from '../src/utils/radioSupport.js'

test('support draft encodes station identity without including stream credentials', () => {
  const radio = { name: 'Rádio A & B', city: 'São Paulo', state: 'São Paulo', country: 'Brasil', path: 'sao-paulo/a-b', streamUrl: 'https://private.invalid?token=secret' }
  const url = new URL(getRadioSupportUrl(radio))
  assert.equal(url.origin, 'https://wa.me')
  const message = url.searchParams.get('text')
  assert.ok(message.includes(radio.name))
  assert.ok(message.includes(radio.city))
  assert.ok(message.includes(`https://radiofmonline.com.br/${radio.path}`))
  assert.ok(message.includes('\n'))
  assert.ok(!message.includes('secret'))
})

test('support draft tolerates incomplete location data', () => {
  const message = decodeURIComponent(getRadioSupportUrl({ name: 'Web Radio', country: 'Brasil', path: 'brasil/web-radio' }))
  assert.ok(message.includes('Brasil'))
  assert.ok(!message.includes('undefined'))
})
