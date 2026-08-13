import { writeFile } from 'node:fs/promises'
import { getAllRadios, getIndexableCitiesWithState, getIndexableStates } from '../src/data/radioRepository.js'

const base = 'https://radiofmonline.com.br'
const urls = [
  '/',
  '/privacy-policy.html',
  '/terms.html',
  ...getIndexableStates().map((state) => `/${state.slug}`),
  ...getIndexableCitiesWithState().map((city) => `/${city.stateSlug}/${city.slug}`),
  '/genero/pop',
  '/genero/noticias',
  '/genero/rock',
  '/genero/sertanejo',
  '/genero/internacional',
  '/guia/como-ouvir-radio-online',
  ...getAllRadios().map((radio) => `/${radio.path}`),
]
const xml = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url>
    <loc>${base}${path}</loc>
  </url>`).join('\n')}
</urlset>
`
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml, 'utf8')
console.log(`Sitemap gerado com ${urls.length} URLs.`)
