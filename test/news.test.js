import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { NEWS_ARTICLES, NEWS_DATE, newsPath } from '../src/data/news.js'
import { NEWS_CHARTS, NEWS_CHART_EDITION } from '../src/data/newsCharts.js'

test('rankings têm dez posições distintas e edição identificada', () => {
  assert.equal(NEWS_CHARTS.length, 2)
  assert.match(NEWS_CHART_EDITION, /^\d{4}-\d{2}-\d{2}$/)
  for (const chart of NEWS_CHARTS) {
    assert.equal(chart.entries.length, 10)
    assert.equal(new Set(chart.entries.map((entry) => entry.name)).size, 10)
    assert.ok(chart.source.url && chart.methodology)
  }
})

test('artigos de novidades têm rotas únicas, fontes e datas explícitas', () => {
  assert.equal(new Set(NEWS_ARTICLES.map(newsPath)).size, NEWS_ARTICLES.length)
  assert.match(NEWS_DATE, /^\d{4}-\d{2}-\d{2}$/)
  for (const article of NEWS_ARTICLES) {
    assert.ok(article.period && article.title && article.description)
    assert.ok(article.sections.length >= 2)
    assert.ok(article.sources.length > 0)
    for (const source of article.sources) assert.equal(new URL(source.url).protocol, 'https:')
  }
})

test('HTML de produção preserva textos, fontes, canonical e schema dos artigos', { skip: !existsSync(new URL('../dist/novidades/index.html', import.meta.url)) }, async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  for (const article of NEWS_ARTICLES) {
    const path = newsPath(article)
    const html = await readFile(new URL(`../dist${path}/index.html`, import.meta.url), 'utf8')
    assert.ok(sitemap.includes(`https://radiofmonline.com.br${path}`))
    assert.ok(html.includes(`<link rel="canonical" href="https://radiofmonline.com.br${path}"`))
    const decodedHtml = html.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    assert.ok(decodedHtml.includes(article.sections[0].paragraphs[0]))
    for (const source of article.sources) assert.ok(html.includes(source.url))
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
    assert.ok(schema['@graph'].some((item) => item['@type'] === 'Article' && item.headline === article.title))
  }
})

test('página pré-renderizada mantém os dois top 10 na ordem da fonte', { skip: !existsSync(new URL('../dist/novidades/index.html', import.meta.url)) }, async () => {
  const html = await readFile(new URL('../dist/novidades/index.html', import.meta.url), 'utf8')
  const lists = [...html.matchAll(/<ol>(.*?)<\/ol>/gs)].map((match) => match[1])
  assert.equal(lists.length, 2)
  NEWS_CHARTS.forEach((chart, index) => {
    const entries = [...lists[index].matchAll(/<strong>(.*?)<\/strong>/gs)].map((match) => match[1].replaceAll('&amp;', '&').replaceAll('&#39;', "'"))
    assert.deepEqual(entries, chart.entries.map((entry) => entry.name))
    assert.ok(html.includes(chart.source.url))
  })
})
