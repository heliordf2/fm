import { radios as sourceRadios } from './radios.js'
import { BRAZIL_STATES } from './roadmap.js'
import { getEditorialProfile } from './editorialProfiles.js'

const BRAZIL_STATE_NAMES = new Set(BRAZIL_STATES)

const CITY_LOCATION = {
  'sao-paulo': { state: 'São Paulo', country: 'Brasil' },
  'rio-de-janeiro': { state: 'Rio de Janeiro', country: 'Brasil' },
  'belo-horizonte': { state: 'Minas Gerais', country: 'Brasil' },
  curitiba: { state: 'Paraná', country: 'Brasil' },
  'porto-alegre': { state: 'Rio Grande do Sul', country: 'Brasil' },
  salvador: { state: 'Bahia', country: 'Brasil' },
  recife: { state: 'Pernambuco', country: 'Brasil' },
  'sao-lourenco-da-mata': { state: 'Pernambuco', country: 'Brasil' },
  brasilia: { state: 'Distrito Federal', country: 'Brasil' },
  campinas: { state: 'São Paulo', country: 'Brasil' },
  florianopolis: { state: 'Santa Catarina', country: 'Brasil' },
  fortaleza: { state: 'Ceará', country: 'Brasil' },
  goiania: { state: 'Goiás', country: 'Brasil' },
  vitoria: { state: 'Espírito Santo', country: 'Brasil' },
  'rio-branco': { state: 'Acre', country: 'Brasil' },
  maceio: { state: 'Alagoas', country: 'Brasil' },
  arapiraca: { state: 'Alagoas', country: 'Brasil' },
  macapa: { state: 'Amapá', country: 'Brasil' },
  manaus: { state: 'Amazonas', country: 'Brasil' },
  imperatriz: { state: 'Maranhão', country: 'Brasil' },
  codo: { state: 'Maranhão', country: 'Brasil' },
  cuiaba: { state: 'Mato Grosso', country: 'Brasil' },
  rondonopolis: { state: 'Mato Grosso', country: 'Brasil' },
  'lucas-do-rio-verde': { state: 'Mato Grosso', country: 'Brasil' },
  'campo-grande': { state: 'Mato Grosso do Sul', country: 'Brasil' },
  deodapolis: { state: 'Mato Grosso do Sul', country: 'Brasil' },
  dourados: { state: 'Mato Grosso do Sul', country: 'Brasil' },
  belem: { state: 'Pará', country: 'Brasil' },
  santarem: { state: 'Pará', country: 'Brasil' },
  'joao-pessoa': { state: 'Paraíba', country: 'Brasil' },
  'campina-grande': { state: 'Paraíba', country: 'Brasil' },
  sousa: { state: 'Paraíba', country: 'Brasil' },
  teresina: { state: 'Piauí', country: 'Brasil' },
  'pedro-ii': { state: 'Piauí', country: 'Brasil' },
  natal: { state: 'Rio Grande do Norte', country: 'Brasil' },
  mossoro: { state: 'Rio Grande do Norte', country: 'Brasil' },
  vilhena: { state: 'Rondônia', country: 'Brasil' },
  jaru: { state: 'Rondônia', country: 'Brasil' },
  'ji-parana': { state: 'Rondônia', country: 'Brasil' },
  'rolim-de-moura': { state: 'Rondônia', country: 'Brasil' },
  'boa-vista': { state: 'Roraima', country: 'Brasil' },
  aracaju: { state: 'Sergipe', country: 'Brasil' },
  itabaiana: { state: 'Sergipe', country: 'Brasil' },
  palmas: { state: 'Tocantins', country: 'Brasil' },
  'paraiso-do-tocantins': { state: 'Tocantins', country: 'Brasil' },
  gurupi: { state: 'Tocantins', country: 'Brasil' },
  paris: { country: 'França' },
  seattle: { state: 'Washington', country: 'Estados Unidos' },
  'san-francisco': { state: 'Califórnia', country: 'Estados Unidos' },
  eua: { country: 'Estados Unidos' },
}

export const GENRE_LABELS = {
  pop: 'Pop',
  popular: 'Popular/Eclética',
  rock: 'Rock',
  sertanejo: 'Sertanejo',
  news: 'Notícias',
  adulto: 'Adulto/Flashback',
  gospel: 'Gospel',
  mpb: 'MPB/Música Brasileira',
  esportes: 'Esportes',
  international: 'Internacional',
  outros: 'Outros',
}

export const GENRE_DESCRIPTIONS = {
  pop: 'Rádios pop reúnem sucessos atuais e programação voltada ao público geral, com foco em hits nacionais e internacionais em rotação frequente. É o formato mais comum entre emissoras comerciais brasileiras, presente tanto em rádios de grande alcance quanto em estações regionais.',
  popular: 'Rádios classificadas como popular ou eclética misturam diferentes estilos musicais populares no Brasil, como sertanejo, pagode, forró e sucessos nacionais, sem se limitar a um único gênero. É um formato comum em emissoras locais e regionais, voltado a um público amplo.',
  rock: 'O catálogo de rádios de rock reúne emissoras dedicadas ao gênero em diferentes vertentes, do rock clássico ao alternativo, incluindo programação especializada e estações internacionais. As estações podem ser ouvidas diretamente pelo navegador, sem necessidade de aplicativos.',
  sertanejo: 'Rádios sertanejas têm programação dedicada à música sertaneja, incluindo variações como sertanejo universitário e raiz. É um dos formatos mais populares no interior do Brasil, com forte presença em emissoras regionais.',
  news: 'Rádios de notícias oferecem cobertura jornalística contínua, com boletins, comentários, entrevistas e, em muitos casos, transmissões esportivas. Esse formato é comum em emissoras AM tradicionais e em redes que migraram para o FM mantendo o perfil informativo.',
  adulto: 'Rádios adulto contemporâneo e flashback têm programação voltada a sucessos de décadas passadas, romantismo e hits internacionais atemporais, geralmente sem os lançamentos mais recentes das paradas. É um formato tradicionalmente associado a um público adulto.',
  gospel: 'Rádios gospel têm programação voltada à música e à mensagem cristã, incluindo louvor, adoração e conteúdo de evangelização. O formato reúne tanto emissoras evangélicas quanto redes católicas de comunicação.',
  international: 'Rádios internacionais incluem emissoras estrangeiras e estações com programação voltada a conteúdo não brasileiro, seja música, notícias ou entretenimento em outros idiomas ou de outros países.',
}

export const STATION_PROFILES = {
  'radio-paradise': 'A Radio Paradise é uma rádio via internet sem fins comerciais, mantida por doações dos ouvintes desde sua fundação em 2000, na Califórnia (EUA). A programação eclética é escolhida manualmente por curadores humanos, e não por algoritmo.',
  'fip-radio': 'A FIP é uma emissora do grupo público francês Radio France, fundada em 1971. A programação musical eclética é selecionada por curadores e vai ao ar sem interrupções comerciais.',
  'france-inter': 'A France Inter é a principal emissora generalista do grupo público francês Radio France, no ar desde 1947, combinando jornalismo, entrevistas e uma programação musical variada.',
  'npr-news': 'A NPR (National Public Radio) é uma rede jornalística sem fins lucrativos dos Estados Unidos, fundada em 1970, que produz e distribui conteúdo para emissoras públicas afiliadas pelo país.',
  kexp: 'A KEXP é uma rádio independente e sem fins lucrativos de Seattle (EUA), com raízes na Universidade de Washington desde 1972, conhecida pela programação musical eclética e voltada à música indie.',
  'soma-groove': 'A SomaFM é uma rede de rádio via internet independente e sem fins comerciais, fundada em São Francisco (EUA) em 2000. O Groove Salad, um de seus canais mais tradicionais, é dedicado a ambient e downtempo.',
}

export function describeStationProfile(radio) {
  return getEditorialProfile(radio.id)?.profile || STATION_PROFILES[radio.id] || null
}

export { EDITORIAL_REVIEWED_AT, getEditorialProfile } from './editorialProfiles.js'

export function getLocationBreakdown(radios) {
  const counts = new Map()
  for (const radio of radios) {
    if (!radio.city) continue
    const key = `${radio.city}|${radio.state || ''}`
    const entry = counts.get(key) || { city: radio.city, state: radio.state, count: 0 }
    entry.count += 1
    counts.set(key, entry)
  }
  return [...counts.values()]
    .map((entry) => ({ ...entry, citySlug: slugify(entry.city), stateSlug: entry.state ? slugify(entry.state) : null }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, 'pt-BR'))
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
  const genreList = Array.isArray(radio.genre) ? radio.genre : radio.genre ? [radio.genre] : []
  return Object.freeze({
    id: String(radio.id),
    slug: radioSlug(radio),
    name: radio.name,
    city: radio.city || undefined,
    state: location.state,
    country: location.country,
    frequency: radio.frequency && radio.frequency !== '—' ? radio.frequency : undefined,
    band: radio.frequency?.includes('MHz') ? 'FM' : undefined,
    genres: genreList,
    genreLabels: genreList.map((genre) => GENRE_LABELS[genre] || genre),
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

function radioPathBase(radio) {
  const region = slugify(radio.state || radio.country || 'outros')
  return `${region}/${slugify(radio.name)}`
}

function radioPathDisambiguated(radio) {
  const region = slugify(radio.state || radio.country || 'outros')
  return `${region}/${slugify(`${radio.name} ${radio.city || radio.id}`)}`
}

function withPaths(radios) {
  const baseCounts = new Map()
  for (const radio of radios) {
    const base = radioPathBase(radio)
    baseCounts.set(base, (baseCounts.get(base) || 0) + 1)
  }
  return radios.map((radio) => {
    const base = radioPathBase(radio)
    const path = baseCounts.get(base) > 1 ? radioPathDisambiguated(radio) : base
    return Object.freeze({ ...radio, path })
  })
}

const allRadios = Object.freeze(withPaths(sourceRadios.map(normalizeRadio)))

export const MIN_INDEXABLE_LISTING_SIZE = 3
export const CATALOG_REVIEWED_AT = '19 de julho de 2026'

export function getAllRadios() {
  return allRadios
}

export function getRadioBySlug(slug) {
  return allRadios.find((radio) => radio.slug === slug)
}

export function getRadioByPath(path) {
  return allRadios.find((radio) => radio.path === path)
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

const STATE_ARTICLES = {
  Acre: 'do',
  Alagoas: 'de',
  Amapá: 'do',
  Amazonas: 'do',
  Bahia: 'da',
  Ceará: 'do',
  'Distrito Federal': 'do',
  'Espírito Santo': 'do',
  Goiás: 'de',
  Maranhão: 'do',
  'Mato Grosso': 'do',
  'Mato Grosso do Sul': 'do',
  'Minas Gerais': 'de',
  Pará: 'do',
  Paraíba: 'da',
  Paraná: 'do',
  Pernambuco: 'de',
  Piauí: 'do',
  'Rio de Janeiro': 'do',
  'Rio Grande do Norte': 'do',
  'Rio Grande do Sul': 'do',
  Rondônia: 'de',
  Roraima: 'de',
  'Santa Catarina': 'de',
  'São Paulo': 'de',
  Sergipe: 'de',
  Tocantins: 'do',
}

export function getStateArticle(stateName) {
  return STATE_ARTICLES[stateName] || 'de'
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

export function getRadioPageTitle(radio) {
  return `${radio.name} ao vivo${radio.city ? ` — ${radio.city}` : ''} | Rádio FM Online`
}

export function getRadioMetaDescription(radio) {
  const sameCityState = Boolean(radio.city && radio.state && radio.city === radio.state)
  const location = sameCityState ? radio.city : [radio.city, radio.state].filter(Boolean).join(', ')
  const genre = radio.genreLabels.length ? radio.genreLabels.join(' e ') : null
  const freqPart = radio.frequency ? ` em ${radio.frequency}` : ''
  const locPart = location ? ` — ${location}` : ''
  const genrePart = genre ? `, estilo ${genre}` : ''
  return `Ouça ${radio.name} ao vivo e grátis${freqPart}${locPart}${genrePart}. Frequência, gênero e site oficial da estação.`
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

export function getIndexableCitiesWithState() {
  return getIndexableCities()
    .map((city) => ({ ...city, stateSlug: slugify(city.radios[0]?.state || '') }))
    .filter((city) => city.stateSlug)
}

export function getIndexableStates() {
  return getStates()
    .filter((state) => BRAZIL_STATE_NAMES.has(state.name))
    .map((state) => ({ ...state, radios: getRadiosByState(state.slug) }))
    .filter((state) => state.radios.length > 0)
    .sort((a, b) => b.radios.length - a.radios.length)
}

export function getFeaturedRadios() {
  return getIndexableStates()
    .map((state) => [...state.radios].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))[0])
    .filter(Boolean)
    .sort((a, b) => a.state.localeCompare(b.state, 'pt-BR'))
}

export function describeFrequency(radio) {
  if (!radio.frequency) return null
  const place = [radio.city, radio.state].filter(Boolean).join(', ')
  const base = `A ${radio.name} transmite em ${radio.frequency}${radio.band ? ` (${radio.band})` : ''}${place ? ` para a região de ${place}` : ''}.`
  const sameFrequency = allRadios.filter((other) => other.id !== radio.id && other.frequency === radio.frequency)
  if (sameFrequency.length === 0) return base
  const examples = sameFrequency.slice(0, 2).map((other) => `${other.name}${other.city ? ` (${other.city})` : ''}`)
  const remaining = sameFrequency.length - examples.length
  return `${base} No catálogo, o mesmo dial também é usado por ${examples.join(' e ')}${remaining > 0 ? ` e mais ${remaining} emissora${remaining > 1 ? 's' : ''}` : ''} — frequências se repetem entre cidades diferentes, então vale conferir a localidade antes de sintonizar.`
}

export function describeLocation(radio) {
  const place = [radio.city, radio.state, radio.country].filter(Boolean).join(', ')
  if (!place) return null
  if (!radio.city) return `${place}.`
  const sameCity = allRadios.filter((other) => other.id !== radio.id && other.city === radio.city)
  if (sameCity.length === 0) return `${place}. É a única rádio de ${radio.city} cadastrada neste catálogo até o momento.`
  return `${place}. O catálogo reúne mais ${sameCity.length} rádio${sameCity.length > 1 ? 's' : ''} de ${radio.city} além desta.`
}

export function describeGenre(radio) {
  if (!radio.genreLabels.length) return null
  const genreLabel = radio.genreLabels.join(' e ')
  const base = `A programação da ${radio.name} é classificada como ${genreLabel} no catálogo.`
  const sameGenre = allRadios.filter((other) => other.id !== radio.id && other.genres.some((genre) => radio.genres.includes(genre)))
  const countSentence = sameGenre.length > 0
    ? ` Há outras ${sameGenre.length} rádio${sameGenre.length > 1 ? 's' : ''} do mesmo gênero no catálogo.`
    : ' É a única rádio desse gênero cadastrada até o momento.'
  const context = GENRE_DESCRIPTIONS[radio.genres[0]]
  return `${base}${countSentence}${context ? ` ${context}` : ''}`
}

export function describeHowToListen(radio) {
  return `Toque em "Ouvir agora" nesta página para iniciar a transmissão ao vivo da ${radio.name} pelo navegador, sem precisar instalar aplicativos. A reprodução usa o stream público disponibilizado pela emissora ou por seu distribuidor.`
}

export function describeCityInsight(radios) {
  const genreCounts = new Map()
  const frequencies = []
  for (const radio of radios) {
    radio.genreLabels.forEach((label) => genreCounts.set(label, (genreCounts.get(label) || 0) + 1))
    const value = parseFloat(radio.frequency)
    if (!Number.isNaN(value)) frequencies.push(value)
  }
  const topGenres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([label]) => label)
  const genreText = topGenres.length ? topGenres.join(' e ').toLowerCase() : null
  let rangeText = null
  if (frequencies.length) {
    const min = Math.min(...frequencies)
    const max = Math.max(...frequencies)
    rangeText = min === max ? `${min} MHz` : `${min} a ${max} MHz`
  }
  return { genreText, rangeText }
}
