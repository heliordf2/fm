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
  assert.doesNotMatch(main, /HomeApp|\/home\//)
  assert.doesNotMatch(main, /location\.(replace|assign)/)
})

test('sitemap exposes direct radio and guide pages without /home', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  assert.match(sitemap, /https:\/\/radiofmonline\.com\.br\//)
  assert.match(sitemap, /\/sao-paulo\/jovem-pan-fm/)
  assert.match(sitemap, /\/radios\/sao-paulo/)
  assert.match(sitemap, /\/radios\/rio-de-janeiro/)
  assert.match(sitemap, /\/radios\/genero\/noticias/)
  assert.match(sitemap, /\/guia\/como-ouvir-radio-online/)
  assert.doesNotMatch(sitemap, /\/home(?:\/|<)/)
})

test('robots permits the principal route and references the sitemap', async () => {
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8')
  assert.match(robots, /Allow: \//)
  assert.doesNotMatch(robots, /\/home/)
  assert.match(robots, /Sitemap: https:\/\/radiofmonline\.com\.br\/sitemap\.xml/)
})

test('favicon is declared on the home page and remains crawlable', async () => {
  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  const favicon = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8')
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8')
  assert.match(home, /<link rel="icon"[^>]+sizes="any"[^>]+href="\/favicon\.svg"/)
  assert.match(favicon, /viewBox="0 0 64 64"/)
  assert.doesNotMatch(robots, /Disallow:\s*\/favicon\.svg/)
})

test('sitemap uses the canonical hostname without artificial modification dates', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  assert.doesNotMatch(sitemap, /www\.radiofmonline\.com\.br/)
  assert.doesNotMatch(sitemap, /<(lastmod|changefreq|priority)>/)
})

test('Jovem Pan direct route is generated with canonical content', async () => {
  const prerender = await readFile(new URL('../scripts/prerender-seo.mjs', import.meta.url), 'utf8')
  assert.match(prerender, /\/\$\{radio\.path\}/)
  assert.match(prerender, /RadioStation/)
  assert.equal(getRadioBySlug('jovem-pan-fm-sao-paulo')?.name, 'Jovem Pan FM')
})
