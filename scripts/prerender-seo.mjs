import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { getAllRadios, getIndexableCities, getRadioMetaDescription, getRadiosByCity, getRadiosByGenre, getRelatedRadios, slugify } from '../src/data/radioRepository.js'
import { faqItems } from '../src/data/faq.js'
import { BRAZIL_STATES, ROADMAP_GAPS } from '../src/data/roadmap.js'
import { STREAM_STATUS, STREAM_STATUS_CHECKED_AT } from '../src/data/streamStatus.js'

const SITE = 'https://radiofmonline.com.br'
const dist = new URL('../dist/', import.meta.url)
const rawTemplate = await readFile(new URL('index.html', dist), 'utf8')
// A folha de estilo é carregada de forma assíncrona (preload + swap) para sair do caminho crítico de renderização.
// O #app-loader já cobre a tela com seu próprio <style> inline, então não há flash de conteúdo sem estilo.
const template = rawTemplate.replace(
  /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/,
  (_match, href) =>
    `<link rel="preload" as="style" href="${href}" />` +
    `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'" />` +
    `<noscript><link rel="stylesheet" href="${href}" /></noscript>`,
)
const radios = getAllRadios()
const saoPaulo = getRadiosByCity('sao-paulo')
const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function stationDetails(items) {
  return items.map((radio) => `<details id="radio-${radio.slug}"><summary>${escape(radio.name)} — ${escape([radio.frequency, radio.city].filter(Boolean).join(' · '))}</summary><dl>${radio.frequency ? `<dt>Frequência</dt><dd>${escape(radio.frequency)}</dd>` : ''}${radio.city ? `<dt>Cidade</dt><dd>${escape(radio.city)}</dd>` : ''}${radio.state ? `<dt>Estado</dt><dd>${escape(radio.state)}</dd>` : ''}${radio.genreLabels.length ? `<dt>Categoria</dt><dd>${escape(radio.genreLabels.join(', '))}</dd>` : ''}</dl><a href="/radio/${radio.slug}">Ver página da estação</a>${radio.websiteUrl ? ` <a href="${escape(radio.websiteUrl)}">Site oficial</a>` : ''}</details>`).join('')
}

function describeCityInsight(items) {
  const genreCounts = new Map()
  const frequencies = []
  for (const radio of items) {
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

function radioList(items) {
  return `<ul>${items.map((radio) => `<li><a href="/radio/${radio.slug}">${escape(radio.name)}</a>${radio.frequency ? ` — ${escape(radio.frequency)}` : ''}${radio.genreLabels.length ? ` — ${escape(radio.genreLabels.join(', '))}` : ''}</li>`).join('')}</ul>`
}

const organization = { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Rádio FM Online', url: `${SITE}/`, logo: `${SITE}/favicon.svg`, contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', telephone: '+55-11-97400-4755', availableLanguage: 'Portuguese' } }
const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Rádio FM Online', inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#organization` }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } }
const faqSchema = { '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }
const breadcrumb = (name, path) => ({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` }] })

function render({ path, title, description, content, schemas, noindex = false }) {
  const canonical = `${SITE}${path}`
  const graph = { '@context': 'https://schema.org', '@graph': schemas }
  return template
    .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escape(description)}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escape(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escape(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escape(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escape(description)}" />`)
    .replace(/<script type="application\/ld\+json">.*?<\/script>/s, `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
}

const rootContent = `<main><h1>Rádio FM Online</h1><section><h2>Ouça rádios FM ao vivo</h2><p>Descubra estações de rádio brasileiras e internacionais em um player simples, rápido e com busca por nome, frequência ou cidade. Aproveite uma experiência prática para ouvir rádios FM ao vivo, salvar favoritas e alternar entre gêneros como pop, rock, sertanejo, notícias e internacional.</p><h2>Estações disponíveis</h2>${stationDetails(radios)}</section><section id="guia"><p>Guia prático</p><h2>Como ouvir rádio online</h2><p>Entenda streams, reprodução no celular, consumo de dados e como agir quando uma estação estiver fora do ar.</p><a href="/guia/como-ouvir-radio-online">Ler o guia</a><h3>Explore por frequência</h3><h2>Guia de rádios FM de São Paulo</h2><p>Veja as estações cadastradas, suas frequências e os gêneros usados para organizar o catálogo.</p><a href="/radios/sao-paulo">Abrir o guia</a></section><section id="duvidas"><p>Dúvidas frequentes</p><h2>Sobre a reprodução</h2>${faqItems.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}</section><section id="sobre"><h2>Sobre o Rádio FM Online</h2><p>Catálogo independente criado para facilitar a descoberta e reprodução de estações.</p><h2 id="metodologia">Metodologia</h2><p>Organizamos os dados disponíveis sem inventar audiência, popularidade ou programação.</p></section></main><footer><strong>Rádio FM Online</strong><p>Catálogo independente de estações ao vivo.</p><nav><a href="/guia/como-ouvir-radio-online">Guia</a> <a href="#sobre">Sobre</a> <a href="#metodologia">Metodologia</a> <a href="/privacy-policy.html">Privacidade</a> <a href="/terms.html">Termos</a> <a href="https://wa.me/5511974004755">Contato e suporte SaaS</a></nav></footer>`
const rootSchemas = [organization, website, { '@type': 'WebPage', '@id': `${SITE}/#webpage`, url: `${SITE}/`, name: 'Rádio FM Online: Ouça rádios ao vivo grátis', isPartOf: { '@id': `${SITE}/#website` }, inLanguage: 'pt-BR' }, { '@type': 'ItemList', numberOfItems: radios.length, itemListElement: radios.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }, faqSchema]
await writeFile(new URL('index.html', dist), render({ path: '/', title: 'Rádio FM Online: Ouça rádios ao vivo grátis', description: 'Ouça rádio FM online grátis e ao vivo. Encontre estações brasileiras e internacionais por nome, cidade, frequência ou gênero.', content: rootContent, schemas: rootSchemas }), 'utf8')

const directRoutes = radios.map((radio) => {
  const path = `/radio/${radio.slug}`
  const description = getRadioMetaDescription(radio)
  const address = radio.city ? { '@type': 'PostalAddress', addressLocality: radio.city, addressRegion: radio.state, addressCountry: radio.country } : undefined
  const schema = { '@type': 'RadioStation', name: radio.name, url: `${SITE}${path}`, sameAs: radio.websiteUrl, logo: radio.logoUrl?.startsWith('http') ? radio.logoUrl : radio.logoUrl ? `${SITE}${radio.logoUrl.split('?')[0]}` : undefined, address }
  const related = getRelatedRadios(radio)
  const content = `<main><nav><a href="/">Início</a> / ${escape(radio.name)}</nav><article><p>Ouça ao vivo</p><h1>${escape(radio.name)}</h1><p>${escape([radio.frequency, radio.city, radio.state, radio.country].filter(Boolean).join(' · '))}</p><h2>Informações da estação</h2><p>${escape(description)}</p><dl>${radio.frequency ? `<dt>Frequência</dt><dd>${escape(radio.frequency)}</dd>` : ''}${radio.band ? `<dt>Banda</dt><dd>${escape(radio.band)}</dd>` : ''}${radio.city ? `<dt>Localidade</dt><dd>${escape([radio.city, radio.state, radio.country].filter(Boolean).join(', '))}</dd>` : ''}${radio.genreLabels.length ? `<dt>Categoria</dt><dd>${escape(radio.genreLabels.join(', '))}</dd>` : ''}</dl>${radio.websiteUrl ? `<a href="${escape(radio.websiteUrl)}">Site oficial</a>` : ''}<h2>Rádios relacionadas</h2>${radioList(related)}</article></main>`
  const place = [radio.city, radio.state].filter(Boolean).join(', ')
  return { path, title: `Ouvir ${radio.name} ao vivo${place ? ` — ${place}` : ''} | Rádio FM Online`, description, content, schemas: [organization, website, { '@type': 'WebPage', url: `${SITE}${path}`, name: radio.name, isPartOf: { '@id': `${SITE}/#website` } }, breadcrumb(radio.name, path), schema] }
})

directRoutes.push({ path: '/radios/sao-paulo', title: 'Rádios de São Paulo ao vivo e frequências | Rádio FM Online', description: `Compare ${saoPaulo.length} rádios de São Paulo, suas frequências e gêneros e ouça as estações ao vivo.`, content: `<main><nav><a href="/">Início</a> / Rádios de São Paulo</nav><h1>Rádios de São Paulo ao vivo</h1><p>Compare estações cadastradas na cidade, consulte frequências e gêneros e escolha o que ouvir. A lista não representa ranking de audiência.</p>${radioList(saoPaulo)}<h2>Como escolher uma rádio</h2><p>Use a frequência se você conhece a estação pelo dial ou abra a página individual para consultar o site oficial.</p></main>`, schemas: [organization, website, breadcrumb('Rádios de São Paulo', '/radios/sao-paulo'), { '@type': 'ItemList', numberOfItems: saoPaulo.length, itemListElement: saoPaulo.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }] })
directRoutes.push({ path: '/guia/como-ouvir-radio-online', title: 'Como ouvir rádio online: guia prático | Rádio FM Online', description: 'Aprenda como funcionam streams, reprodução no celular, consumo de dados e solução de falhas.', content: `<main><nav><a href="/">Início</a> / Guia</nav><article><p>Guia prático</p><h1>Como ouvir rádio online</h1><p>Rádio online é a transmissão contínua do áudio de uma estação pela internet.</p><h2>Como começar</h2><ol><li>Encontre uma estação pela busca, frequência ou gênero.</li><li>Pressione play e aguarde a conexão.</li><li>Use o player para pausar, controlar o volume ou ativar o timer.</li></ol><h2>Reprodução no celular</h2><p>O áudio começa somente após o toque. O comportamento em segundo plano depende do aparelho e do navegador.</p><h2>Consumo de dados</h2><p>Streams usam dados continuamente. Prefira Wi-Fi quando seu plano for limitado.</p><h2>Quando a rádio estiver fora do ar</h2><p>Tente novamente e consulte o site oficial. O catálogo não retransmite nem modifica o áudio.</p><h2>Dúvidas frequentes</h2>${faqItems.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}</article></main>`, schemas: [organization, website, breadcrumb('Como ouvir rádio online', '/guia/como-ouvir-radio-online'), faqSchema] })

const roadmapRows = BRAZIL_STATES.map((state) => {
  const active = radios.filter((radio) => radio.state === state)
  const failing = active.filter((radio) => STREAM_STATUS[radio.id] && !STREAM_STATUS[radio.id].ok)
  return { state, active, gaps: ROADMAP_GAPS[state] || [], failing }
})
const roadmapCovered = roadmapRows.filter((row) => row.active.length > 0).length
const roadmapGapsTotal = roadmapRows.reduce((sum, row) => sum + row.gaps.length, 0)
const roadmapFailingTotal = roadmapRows.reduce((sum, row) => sum + row.failing.length, 0)
const roadmapCheckedAtLabel = new Date(STREAM_STATUS_CHECKED_AT).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const roadmapDescription = `Panorama de cobertura do catálogo por estado: ${roadmapCovered} de ${BRAZIL_STATES.length} estados brasileiros já têm rádios ativas, e ${roadmapGapsTotal} estações mapeadas ainda precisam ser incluídas.`
const roadmapStatusLine = roadmapFailingTotal > 0
  ? `${roadmapFailingTotal} rádio${roadmapFailingTotal !== 1 ? 's' : ''} ativa${roadmapFailingTotal !== 1 ? 's' : ''} com erro no teste mais recente.`
  : 'nenhum erro encontrado no teste mais recente.'
const roadmapOverviewTable = `<table><thead><tr><th>Estado</th><th>Rádios ativas</th><th>A incluir</th><th>Com erro no teste</th></tr></thead><tbody>${roadmapRows.map(({ state, active, gaps, failing }) => `<tr><td><a href="#estado-${slugify(state)}">${escape(state)}</a></td><td>${active.length}</td><td>${gaps.length}</td><td>${failing.length > 0 ? failing.length : '—'}</td></tr>`).join('')}</tbody></table>`
const roadmapStateTables = roadmapRows.map(({ state, active, gaps }) => {
  const activeRows = active.map((radio) => {
    const status = STREAM_STATUS[radio.id]
    const hasError = status && !status.ok
    return `<tr><td><a href="/radio/${radio.slug}">${escape(radio.name)}</a></td><td>${escape(radio.city || '—')}</td><td>${escape(radio.frequency || '—')}</td><td>Sim</td><td>${hasError ? escape(status.error) : '—'}</td></tr>`
  }).join('')
  const gapRows = gaps.map((gap) => `<tr><td>${escape(gap.name)}</td><td>${escape(gap.city)}</td><td>${escape(gap.frequency)}</td><td>Não</td><td>—</td></tr>`).join('')
  const emptyRow = active.length === 0 && gaps.length === 0 ? '<tr><td colspan="5">Nenhuma rádio mapeada ainda.</td></tr>' : ''
  return `<section id="estado-${slugify(state)}"><h2>${escape(state)}</h2><table><thead><tr><th>Rádio</th><th>Cidade</th><th>Frequência</th><th>Ativo no site</th><th>Erro no teste</th></tr></thead><tbody>${activeRows}${gapRows}${emptyRow}</tbody></table></section>`
}).join('')
directRoutes.push({ path: '/roadmap', title: 'Roadmap de rádios por estado | Rádio FM Online', description: roadmapDescription, noindex: true, content: `<main><nav><a href="/">Início</a> / Roadmap de cobertura</nav><p>Expansão do catálogo</p><h1>Roadmap de rádios por estado</h1><p>${escape(roadmapDescription)} A ordem segue a lista oficial de unidades da federação. Rádios "a incluir" foram levantadas em fontes externas e ainda não têm stream cadastrado no site.</p><p>Última checagem automática dos streams: ${roadmapCheckedAtLabel} · ${roadmapStatusLine}</p>${roadmapOverviewTable}${roadmapStateTables}</main>`, schemas: [organization, website, breadcrumb('Roadmap de cobertura', '/roadmap')] })

const genreRoutes = [
  { path: '/radios/genero/pop', name: 'Pop', label: 'gênero', items: getRadiosByGenre('pop') },
  { path: '/radios/genero/noticias', name: 'Notícias', label: 'gênero', items: getRadiosByGenre('news') },
  { path: '/radios/genero/rock', name: 'Rock', label: 'gênero', items: getRadiosByGenre('rock') },
  { path: '/radios/genero/internacional', name: 'Internacional', label: 'gênero', items: getRadiosByGenre('international') },
]
const cityRoutes = getIndexableCities()
  .filter((city) => city.slug !== 'sao-paulo')
  .map((city) => ({ path: `/radios/${city.slug}`, name: city.name, state: city.radios[0]?.state, label: 'cidade', items: city.radios }))
const taxonomyRoutes = [...cityRoutes, ...genreRoutes]
for (const route of taxonomyRoutes) {
  const isCity = route.label === 'cidade'
  const place = isCity && route.state ? `${route.name}, ${route.state}` : route.name
  const title = isCity ? `Rádios de ${route.name} ao vivo: ouça FM online grátis | Rádio FM Online` : `Rádios de ${route.name} ao vivo | Rádio FM Online`
  const description = isCity
    ? `Ouça ${route.items.length} rádios FM de ${place} ao vivo e grátis. Compare frequências, gêneros e emissoras locais para ouvir rádio online agora.`
    : `Explore ${route.items.length} rádios de ${route.name}, consulte frequências e localidades e ouça as estações ao vivo.`
  const intro = isCity
    ? `Escolha uma emissora de ${escape(route.name)} na lista abaixo e ouça ao vivo pelo navegador, sem baixar aplicativos.`
    : `${escape(description)} A ordem não representa audiência nem popularidade.`
  const copyHeading = isCity ? `Como ouvir rádio em ${escape(route.name)}` : 'Explore o catálogo'
  const copyText = isCity
    ? `Toque em uma estação de ${escape(route.name)} para começar a transmissão ao vivo.`
    : 'Abra a página de cada estação para consultar dados, fonte oficial e rádios relacionadas.'
  const insight = isCity ? describeCityInsight(route.items) : null
  const insightSentence = insight && (insight.rangeText || insight.genreText)
    ? escape([
        insight.rangeText && `O dial cadastrado para ${route.name} vai de ${insight.rangeText}`,
        insight.genreText && `com destaque para emissoras de ${insight.genreText}`,
      ].filter(Boolean).join(', ') + '.')
    : ''
  directRoutes.push({ path: route.path, title, description, content: `<main><nav><a href="/">Início</a> / Rádios de ${escape(route.name)}</nav><h1>Rádios de ${escape(route.name)} ao vivo${isCity ? ' — ouça FM grátis' : ''}</h1><p>${intro}</p>${radioList(route.items)}<h2>${copyHeading}</h2><p>${copyText}</p>${insightSentence ? `<p>${insightSentence}</p>` : ''}</main>`, schemas: [organization, website, breadcrumb(`Rádios de ${route.name}`, route.path), { '@type': 'ItemList', numberOfItems: route.items.length, itemListElement: route.items.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }] })
}

for (const route of directRoutes) {
  const directory = new URL(`.${route.path}/`, dist)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), render(route), 'utf8')
}

const notFound = render({ path: '/404', title: 'Página não encontrada | Rádio FM Online', description: 'O endereço solicitado não existe.', noindex: true, content: '<main><h1>Página não encontrada</h1><p>O endereço solicitado não existe.</p><a href="/">Voltar para a página principal</a></main>', schemas: [] })
await writeFile(new URL('404.html', dist), notFound, 'utf8')
console.log(`Pré-render concluído: página principal, ${directRoutes.length} páginas diretas e 404.`)
