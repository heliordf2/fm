import { writeFile } from 'node:fs/promises'
import { getAllRadios, getEditorialProfile, getIndexableCitiesWithState, getIndexableStates } from '../src/data/radioRepository.js'
import { isCityEditorialReady } from '../src/data/cityEditorial.js'
import { GUIDE_ARTICLES } from '../src/data/guides.js'

const base = 'https://radiofmonline.com.br'
const urls = [
  '/',
  '/sobre.html',
  '/privacy-policy.html',
  '/terms.html',
  '/direitos-autorais.html',
  ...getIndexableStates().map((state) => `/${state.slug}`),
  ...getIndexableCitiesWithState()
    .filter((city) => isCityEditorialReady(city.stateSlug, city.slug))
    .map((city) => `/${city.stateSlug}/${city.slug}`),
  '/genero/pop',
  '/genero/popular',
  '/genero/noticias',
  '/genero/rock',
  '/genero/sertanejo',
  '/genero/adulto-flashback',
  '/genero/gospel',
  '/genero/internacional',
  '/guia/como-ouvir-radio-online',
  ...Object.keys(GUIDE_ARTICLES),
  ...getAllRadios().filter((radio) => getEditorialProfile(radio.id)).map((radio) => `/${radio.path}`),
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
