import { writeFile } from 'node:fs/promises'
import { getAllRadios } from '../src/data/radioRepository.js'

const base = 'https://radiofmonline.com.br'
const urls = [
  '/',
  '/privacy-policy.html',
  '/terms.html',
  '/radios/sao-paulo',
  '/radios/rio-de-janeiro',
  '/radios/genero/pop',
  '/radios/genero/noticias',
  '/radios/genero/rock',
  '/radios/genero/internacional',
  '/guia/como-ouvir-radio-online',
  ...getAllRadios().map((radio) => `/radio/${radio.slug}`),
]
const lastmod = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url>
    <loc>${base}${path}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>
`
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml, 'utf8')
console.log(`Sitemap gerado com ${urls.length} URLs.`)
