// Notifica Bing (e demais buscadores participantes) via protocolo IndexNow
// sempre que o site publica conteúdo novo ou alterado, sem esperar o recrawl do sitemap.
// Uso: node scripts/submit-indexnow.mjs [url1 url2 ...]
// Sem argumentos, envia todas as URLs do public/sitemap.xml.
import { readFile } from 'node:fs/promises'

const HOST = 'radiofmonline.com.br'
const SITE = `https://${HOST}`
const KEY = '8c5f294419484549870dff99f0e2cf67'
const KEY_LOCATION = `${SITE}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

async function urlsFromSitemap() {
  const xml = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

const argUrls = process.argv.slice(2)
const urlList = argUrls.length > 0 ? argUrls : await urlsFromSitemap()

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
})

if (!response.ok) {
  const body = await response.text().catch(() => '')
  throw new Error(`IndexNow retornou ${response.status} ${response.statusText}${body ? `: ${body}` : ''}`)
}

console.log(`IndexNow: ${urlList.length} URLs enviadas com sucesso (status ${response.status}).`)
