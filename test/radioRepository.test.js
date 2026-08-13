import test from 'node:test'
import assert from 'node:assert/strict'
import {
  describeRadio, getAllRadios, getRadioByPath, getRadioBySlug, getRadioMetaDescription, getRadioPageTitle,
  getRadiosByCity, getRadiosByGenre, getRadiosByState, isIndexableListing, normalizeRadio, searchRadios, slugify,
} from '../src/data/radioRepository.js'

test('slugify removes accents and uses readable hyphens', () => {
  assert.equal(slugify('Rádio Gaúcha — São Paulo'), 'radio-gaucha-sao-paulo')
})

test('normalization creates a stable, complete slug', () => {
  const radio = normalizeRadio({ id: 'x', name: 'Mix FM', city: 'São Paulo', genre: 'pop', streamUrl: 'https://example.com' })
  assert.equal(radio.slug, 'mix-fm-sao-paulo')
  assert.equal(radio.state, 'São Paulo')
  assert.deepEqual(radio.genres, ['pop'])
})

test('all generated slugs are unique and resolve back to a radio', () => {
  const radios = getAllRadios()
  assert.equal(new Set(radios.map((radio) => radio.slug)).size, radios.length)
  for (const radio of radios) assert.equal(getRadioBySlug(radio.slug)?.id, radio.id)
})

test('all radio paths are unique, resolve back and use state/name segments', () => {
  const radios = getAllRadios()
  assert.equal(new Set(radios.map((radio) => radio.path)).size, radios.length)
  for (const radio of radios) {
    assert.equal(getRadioByPath(radio.path)?.id, radio.id)
    assert.match(radio.path, /^[a-z0-9-]+\/[a-z0-9-]+$/)
  }
})

test('page titles stay under the 70 character SEO limit', () => {
  for (const radio of getAllRadios()) {
    assert.ok(getRadioPageTitle(radio).length <= 70, `title too long for ${radio.name}`)
  }
})

test('search ignores accents and case and includes genre and frequency', () => {
  assert.ok(searchRadios('SAO PAULO').length > 0)
  assert.ok(searchRadios('noticias').some((radio) => radio.genres.includes('news')))
  assert.ok(searchRadios('100.9').some((radio) => radio.id === 'jovem-pan-sp'))
})

test('taxonomy filters return only matching records', () => {
  assert.ok(getRadiosByState('sao-paulo').every((radio) => radio.state === 'São Paulo'))
  assert.ok(getRadiosByCity('rio-de-janeiro').every((radio) => radio.city === 'Rio de Janeiro'))
  assert.ok(getRadiosByGenre('rock').every((radio) => radio.genres.includes('rock')))
})

test('editorial summary only reflects normalized fields', () => {
  const radio = getAllRadios()[0]
  const description = describeRadio(radio)
  assert.match(description, new RegExp(radio.name))
  assert.match(description, new RegExp(radio.frequency.replace('.', '\\.')))
  assert.doesNotMatch(description, /mais ouvida|audiência|líder/)
})

test('only substantial listings are eligible for indexing', () => {
  assert.equal(isIndexableListing(getRadiosByCity('paris')), false)
  assert.equal(isIndexableListing(getRadiosByCity('sao-paulo')), true)
})

test('radio meta descriptions are concise and factual', () => {
  for (const radio of getAllRadios()) {
    const description = getRadioMetaDescription(radio)
    assert.ok(description.length <= 180)
    assert.ok(description.includes(radio.name))
  }
})
