import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { getRadioBySlug } from '../src/data/radioRepository.js'

test('unknown radio slug does not resolve', () => {
  assert.equal(getRadioBySlug('radio-que-nao-existe'), undefined)
})

test('root and direct SEO pages mount without /home routing', async () => {
  const main = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8')
  assert.match(main, /<App/)
  assert.match(main, /<DirectPage/)
  assert.match(main, /\/radio\//)
  assert.match(main, /\/radios\/sao-paulo/)
  assert.doesNotMatch(main, /HomeApp|\/home\//)
  assert.doesNotMatch(main, /location\.(replace|assign)/)
})

test('sitemap exposes direct radio and guide pages without /home', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  assert.match(sitemap, /https:\/\/www\.radiofmonline\.com\.br\//)
  assert.match(sitemap, /\/radio\/jovem-pan-fm-sao-paulo/)
  assert.match(sitemap, /\/radios\/sao-paulo/)
  assert.match(sitemap, /\/guia\/como-ouvir-radio-online/)
  assert.doesNotMatch(sitemap, /\/home(?:\/|<)/)
})

test('robots permits the principal route and references the sitemap', async () => {
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8')
  assert.match(robots, /Allow: \//)
  assert.doesNotMatch(robots, /\/home/)
  assert.match(robots, /Sitemap: https:\/\/www\.radiofmonline\.com\.br\/sitemap\.xml/)
})
