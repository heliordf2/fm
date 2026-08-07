import { radios as sourceRadios } from './radios.js'

const CITY_LOCATION = {
  'sao-paulo': { state: 'São Paulo', country: 'Brasil' },
  'rio-de-janeiro': { state: 'Rio de Janeiro', country: 'Brasil' },
  'belo-horizonte': { state: 'Minas Gerais', country: 'Brasil' },
  curitiba: { state: 'Paraná', country: 'Brasil' },
  'porto-alegre': { state: 'Rio Grande do Sul', country: 'Brasil' },
  salvador: { state: 'Bahia', country: 'Brasil' },
  recife: { state: 'Pernambuco', country: 'Brasil' },
  brasilia: { state: 'Distrito Federal', country: 'Brasil' },
  paris: { country: 'França' },
  seattle: { state: 'Washington', country: 'Estados Unidos' },
  'san-francisco': { state: 'Califórnia', country: 'Estados Unidos' },
  eua: { country: 'Estados Unidos' },
}

export const GENRE_LABELS = {
  pop: 'Pop',
  rock: 'Rock',
  sertanejo: 'Sertanejo',
  news: 'Notícias',
  international: 'Internacional',
}

export function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function slugify(value = '') {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function radioSlug(radio) {
  const base = slugify(`${radio.name} ${radio.city}`)
  return base || slugify(radio.id)
}

export function normalizeRadio(radio) {
  const location = CITY_LOCATION[slugify(radio.city)] || {}
  return Object.freeze({
    id: String(radio.id),
    slug: radioSlug(radio),
    name: radio.name,
    city: radio.city || undefined,
    state: location.state,
    country: location.country,
    frequency: radio.frequency && radio.frequency !== '—' ? radio.frequency : undefined,
    band: radio.frequency?.includes('MHz') ? 'FM' : undefined,
    genres: radio.genre ? [radio.genre] : [],
    genreLabels: radio.genre ? [GENRE_LABELS[radio.genre] || radio.genre] : [],
    streamUrl: radio.streamUrl,
    websiteUrl: radio.domain ? `https://${radio.domain}` : undefined,
    logoUrl: radio.logo || undefined,
    logo: radio.logo || undefined,
    domain: radio.domain || undefined,
    logoFallbacks: radio.logoFallbacks || [],
    shortName: radio.shortName,
    color: radio.color,
  })
}

const allRadios = Object.freeze(sourceRadios.map(normalizeRadio))

export const MIN_INDEXABLE_LISTING_SIZE = 3
export const CATALOG_REVIEWED_AT = '19 de julho de 2026'

export function getAllRadios() {
  return allRadios
}

export function getRadioBySlug(slug) {
  return allRadios.find((radio) => radio.slug === slug)
}

export function searchRadios(query, filters = {}) {
  const term = normalizeText(query)
  return allRadios.filter((radio) => {
    const searchable = [radio.name, radio.city, radio.state, radio.frequency, ...radio.genreLabels]
      .filter(Boolean)
      .map(normalizeText)
      .join(' ')
    return (!term || searchable.includes(term)) &&
      (!filters.state || slugify(radio.state) === filters.state) &&
      (!filters.city || slugify(radio.city) === filters.city) &&
      (!filters.genre || radio.genres.includes(filters.genre)) &&
      (!filters.band || normalizeText(radio.band) === normalizeText(filters.band))
  })
}

export function getRadiosByState(slug) {
  return searchRadios('', { state: slug })
}

export function getRadiosByCity(slug, stateSlug) {
  return searchRadios('', { city: slug, state: stateSlug })
}

export function getRadiosByGenre(slug) {
  return searchRadios('', { genre: slug })
}

function uniqueTaxonomy(field) {
  const values = new Map()
  for (const radio of allRadios) {
    const value = radio[field]
    if (value) values.set(slugify(value), value)
  }
  return [...values].map(([slug, name]) => ({ slug, name }))
}

export function getStates() { return uniqueTaxonomy('state') }
export function getCities() { return uniqueTaxonomy('city') }

export function getGenres() {
  const present = new Set(allRadios.flatMap((radio) => radio.genres))
  return [...present].map((slug) => ({ slug, name: GENRE_LABELS[slug] || slug }))
}

export function getRelatedRadios(radio, limit = 4) {
  return allRadios
    .filter((candidate) => candidate.id !== radio.id)
    .map((candidate) => ({
      candidate,
      score: Number(candidate.city === radio.city) * 3 +
        Number(candidate.state && candidate.state === radio.state) * 2 +
        Number(candidate.genres.some((genre) => radio.genres.includes(genre))),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

export function describeRadio(radio) {
  const location = [radio.city, radio.state, radio.country].filter(Boolean).join(', ')
  const tuning = [radio.frequency, radio.band].filter(Boolean).join(' · ')
  const genres = radio.genreLabels.join(' e ')
  const parts = [`${radio.name} é uma estação disponível para ouvir ao vivo neste catálogo.`]
  if (location) parts.push(`A referência de localização cadastrada é ${location}.`)
  if (tuning) parts.push(`A sintonia informada é ${tuning}.`)
  if (genres) parts.push(`No catálogo, a rádio está organizada em ${genres}.`)
  parts.push('A reprodução depende do stream público fornecido pela emissora ou por seu distribuidor.')
  return parts.join(' ')
}

export function getRadioMetaDescription(radio) {
  const location = [radio.city, radio.state].filter(Boolean).join(', ')
  return `Ouça ${radio.name} ao vivo${radio.frequency ? ` em ${radio.frequency}` : ''}${location ? ` — ${location}` : ''}. Veja gênero, dados da estação e site oficial.`
}

export function getCatalogStats() {
  return {
    radios: allRadios.length,
    cities: getCities().length,
    states: getStates().length,
    genres: getGenres().length,
  }
}

export function isIndexableListing(radios) {
  return radios.length >= MIN_INDEXABLE_LISTING_SIZE
}

export function getIndexableCities() {
  return getCities()
    .map((city) => ({ ...city, radios: getRadiosByCity(city.slug) }))
    .filter((city) => isIndexableListing(city.radios))
    .sort((a, b) => b.radios.length - a.radios.length)
}
