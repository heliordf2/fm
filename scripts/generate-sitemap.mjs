import { writeFile } from 'node:fs/promises'
import { getAllRadios } from '../src/data/radioRepository.js'

const base = 'https://www.radiofmonline.com.br'
const today = new Date().toISOString().slice(0, 10)
const urls = [
  '/',
  '/privacy-policy.html',
  '/terms.html',
  '/radios/sao-paulo',
  '/guia/como-ouvir-radio-online',
  ...getAllRadios().map((radio) => `/radio/${radio.slug}`),
]
const xml = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url>
    <loc>${base}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>
`
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml, 'utf8')
console.log(`Sitemap gerado com ${urls.length} URLs.`)
