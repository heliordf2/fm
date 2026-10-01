import { readdir, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import assert from 'node:assert/strict'
import process from 'node:process'
import { CURIOSITIES, curiosityPath } from '../src/data/curiosities.js'
import { getAllRadios, getEditorialProfile } from '../src/data/radioRepository.js'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const site = 'https://radiofmonline.com.br'
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
const redirects = new Map(config.redirects.map((item) => [item.source, item.destination]))
const errors = []
const pages = new Map()
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) await visit(target)
    else if (entry.name.endsWith('.html')) {
      const relative = path.relative(dist, target).replaceAll('\\', '/')
      const route = `/${relative}`.replace(/index\.html$/, '').replace(/\/$/, '') || '/'
      pages.set(route, await readFile(target, 'utf8'))
    }
  }
}
await visit(dist)
assert.ok(pages.size > 0, 'Execute npm run build antes da auditoria')
for (const radio of getAllRadios()) {
  const route = `/${radio.path}`
  const html = pages.get(route)
  if (!html) errors.push(`Catálogo: página de rádio ausente ${route}`)
  else {
    if (!getEditorialProfile(radio.id) && !/content="noindex/.test(html)) errors.push(`${route}: ficha sem perfil editorial deve permanecer noindex`)
    if (html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')) errors.push(`${route}: publicidade não habilitada para fichas de rádio`)
  }
}
const adsTxt = await readFile(path.join(dist, 'ads.txt'), 'utf8')
const { ADSENSE_CLIENT } = await import('../src/config/adsense.js')
if (!adsTxt.split(/\r?\n/).some((line) => line.trim() === `google.com, ${ADSENSE_CLIENT.replace('ca-', '')}, DIRECT, f08c47fec0942fa0`)) errors.push('ads.txt: conta AdSense ausente ou divergente')
const missingLinks = new Set()
for (const [route, html] of pages) {
  // Arquivo de prova de propriedade, não uma página editorial. Seu conteúdo é prescrito pelo provedor.
  if (/^\/yandex_[a-f0-9]+\.html$/.test(route)) continue
  const check = (condition, message) => { if (!condition) errors.push(`${route}: ${message}`) }
  check((html.match(/<h1(?:\s|>)/g) || []).length === 1, 'esperado um h1')
  check(/<title>[^<]+<\/title>/.test(html), 'título ausente')
  check(/<meta name="description" content="[^"]+"/.test(html), 'descrição ausente')
  check(/<link rel="canonical" href="https:\/\/radiofmonline.com.br\//.test(html), 'canonical ausente ou host incorreto')
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(match[1]) } catch { errors.push(`${route}: JSON-LD inválido`) }
  }
  if (/content="noindex/.test(html)) check(!html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'), 'AdSense em página noindex')
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)[^\"]*"/g)) {
    if (href.startsWith('//')) continue
    const target = decodeURI(redirects.get(href) || href).replace(/\/$/, '') || '/'
    if (pages.has(target)) continue
    try { await stat(path.join(dist, target)) } catch { missingLinks.add(`${route} → ${target}`) }
  }
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
for (const url of urls) {
  const route = url.replace(site, '')
  const html = pages.get(route)
  if (!html) errors.push(`Sitemap: página ausente ${route}`)
  else if (/content="noindex/.test(html)) errors.push(`Sitemap: página noindex ${route}`)
}
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>')
for (const article of CURIOSITIES) {
  const route = curiosityPath(article)
  const html = pages.get(route) || ''
  const decoded = decode(html)
  for (const section of article.sections) {
    for (const paragraph of section.paragraphs) if (!decoded.includes(paragraph)) errors.push(`${route}: parágrafo ausente do HTML`)
    if (section.orderedItems) {
      const list = [...decoded.matchAll(/<ol>(.*?)<\/ol>/gs)].flatMap((match) => [...match[1].matchAll(/<li>(.*?)<\/li>/gs)].map((item) => item[1]))
      try { assert.deepEqual(list, section.orderedItems) } catch { errors.push(`${route}: ranking fora de ordem`) }
    }
  }
  for (const source of article.sources) if (!decoded.includes(source.url)) errors.push(`${route}: fonte ausente`)
  if (!urls.includes(`${site}${route}`)) errors.push(`${route}: ausente do sitemap`)
  if (!html.includes(`href="${site}${route}"`)) errors.push(`${route}: canonical incorreto`)
}
errors.push(...[...missingLinks].map((item) => `Link local sem destino: ${item}`))
console.log(JSON.stringify({ htmlPages: pages.size, sitemapUrls: urls.length, noindexPages: [...pages.values()].filter((html) => /content="noindex/.test(html)).length, curiosityArticles: CURIOSITIES.length, errors }, null, 2))
if (errors.length) process.exitCode = 1
