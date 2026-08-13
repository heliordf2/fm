import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { describeFrequency, describeGenre, describeHowToListen, describeLocation, getAllRadios, getFeaturedRadios, getIndexableCitiesWithState, getIndexableStates, getRadioMetaDescription, getRadioPageTitle, getRadiosByGenre, getRelatedRadios, getStateArticle, slugify } from '../src/data/radioRepository.js'
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
const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const indexableCities = getIndexableCitiesWithState()
const indexableStates = getIndexableStates()
const indexableCitySlugs = new Set(indexableCities.map((city) => city.slug))
const indexableStateSlugs = new Set(indexableStates.map((state) => state.slug))

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
  return `<ul>${items.map((radio) => `<li><a href="/${radio.path}">${escape(radio.name)}</a>${radio.frequency ? ` — ${escape(radio.frequency)}` : ''}${radio.genreLabels.length ? ` — ${escape(radio.genreLabels.join(', '))}` : ''}</li>`).join('')}</ul>`
}

const HOME_GENRES = [
  { path: '/genero/pop', name: 'Pop' },
  { path: '/genero/rock', name: 'Rock' },
  { path: '/genero/sertanejo', name: 'Sertanejo' },
  { path: '/genero/noticias', name: 'Notícias' },
  { path: '/genero/internacional', name: 'Internacional' },
]

function exploreCatalogNav() {
  const stateLinks = indexableStates.map((state) => `<a href="/${state.slug}">${escape(state.name)}</a>`).join('')
  const cityLinks = indexableCities.map((city) => `<a href="/${city.stateSlug}/${city.slug}">${escape(city.name)}</a>`).join('')
  const genreLinks = HOME_GENRES.map((genre) => `<a href="${genre.path}">${escape(genre.name)}</a>`).join('')
  return `<nav aria-label="Explorar rádios por localidade e gênero"><h2>Explore o catálogo</h2><div><h3>Estados</h3>${stateLinks}</div><div><h3>Principais cidades</h3>${cityLinks}</div><div><h3>Gêneros</h3>${genreLinks}</div></nav>`
}

const organization = { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Rádio FM Online', url: `${SITE}/`, logo: `${SITE}/favicon.svg`, contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', telephone: '+55-11-97400-4755', availableLanguage: 'Portuguese' } }
const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Rádio FM Online', inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#organization` }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } }
const faqSchema = { '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }
const breadcrumbSchema = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: `${SITE}${item.href}` })) })
const breadcrumbNav = (items) => `<nav>${items.map((item, index) => (index === items.length - 1 ? escape(item.label) : `<a href="${item.href}">${escape(item.label)}</a> / `)).join('')}</nav>`

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

const rootContent = `<main><h1>Rádio FM Online</h1><section><h2>Ouça rádios FM ao vivo</h2><p>Descubra estações de rádio brasileiras e internacionais em um player simples, rápido e com busca por nome, frequência ou cidade. Aproveite uma experiência prática para ouvir rádios FM ao vivo, salvar favoritas e alternar entre gêneros como pop, rock, sertanejo, notícias e internacional.</p><h2>Rádios em destaque</h2><p>Uma rádio por estado brasileiro, em ordem alfabética, para representar a cobertura nacional do catálogo. O restante das ${radios.length} estações está organizado por estado, cidade e gênero logo abaixo.</p>${radioList(getFeaturedRadios())}</section>${exploreCatalogNav()}<section id="guia"><p>Guia prático</p><h2>Como ouvir rádio online</h2><p>Entenda streams, reprodução no celular, consumo de dados e como agir quando uma estação estiver fora do ar.</p><a href="/guia/como-ouvir-radio-online">Ler o guia</a></section><section id="duvidas"><p>Dúvidas frequentes</p><h2>Sobre a reprodução</h2>${faqItems.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}</section><section id="sobre"><h2>Sobre o Rádio FM Online</h2><p>Catálogo independente criado para facilitar a descoberta e reprodução de estações.</p><h2 id="metodologia">Metodologia</h2><p>Organizamos os dados disponíveis sem inventar audiência, popularidade ou programação.</p></section></main><footer><strong>Rádio FM Online</strong><p>Catálogo independente de estações ao vivo.</p><nav><a href="/guia/como-ouvir-radio-online">Guia</a> <a href="#sobre">Sobre</a> <a href="#metodologia">Metodologia</a> <a href="/privacy-policy.html">Privacidade</a> <a href="/terms.html">Termos</a> <a href="https://wa.me/5511974004755">Contato e suporte SaaS</a></nav></footer>`
const rootSchemas = [organization, website, { '@type': 'WebPage', '@id': `${SITE}/#webpage`, url: `${SITE}/`, name: 'Rádio FM Online: Ouça rádios ao vivo grátis', isPartOf: { '@id': `${SITE}/#website` }, inLanguage: 'pt-BR' }, { '@type': 'ItemList', numberOfItems: radios.length, itemListElement: radios.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/${radio.path}` })) }, faqSchema]
await writeFile(new URL('index.html', dist), render({ path: '/', title: 'Rádio FM Online: Ouça rádios ao vivo grátis', description: 'Ouça rádio FM online grátis e ao vivo. Encontre estações brasileiras e internacionais por nome, cidade, frequência ou gênero.', content: rootContent, schemas: rootSchemas }), 'utf8')

const directRoutes = radios.map((radio) => {
  const path = `/${radio.path}`
  const description = getRadioMetaDescription(radio)
  const address = radio.city ? { '@type': 'PostalAddress', addressLocality: radio.city, addressRegion: radio.state, addressCountry: radio.country } : undefined
  const schema = { '@type': 'RadioStation', name: radio.name, url: `${SITE}${path}`, sameAs: radio.websiteUrl, logo: radio.logoUrl?.startsWith('http') ? radio.logoUrl : radio.logoUrl ? `${SITE}${radio.logoUrl.split('?')[0]}` : undefined, address }
  const related = getRelatedRadios(radio)
  const citySlug = radio.city ? slugify(radio.city) : null
  const stateSlug = radio.state ? slugify(radio.state) : null
  const hasCityPage = Boolean(citySlug && indexableCitySlugs.has(citySlug))
  const hasStatePage = Boolean(stateSlug && indexableStateSlugs.has(stateSlug))
  const stateArticle = radio.state ? getStateArticle(radio.state) : 'de'
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    hasStatePage && { label: radio.state, href: `/${stateSlug}` },
    hasCityPage && { label: radio.city, href: `/radios/${citySlug}` },
    { label: radio.name, href: path },
  ].filter(Boolean)
  const frequencyText = describeFrequency(radio)
  const locationText = describeLocation(radio)
  const genreText = describeGenre(radio)
  const content = `<main>${breadcrumbNav(breadcrumbItems)}<article><p>Ouça ao vivo</p><h1>${escape(radio.name)} ao vivo</h1><p>${escape([radio.frequency, radio.city, radio.state, radio.country].filter(Boolean).join(' · '))}</p><h2>Informações da estação</h2><p>${escape(description)}</p><dl>${radio.frequency ? `<dt>Frequência</dt><dd>${escape(radio.frequency)}</dd>` : ''}${radio.band ? `<dt>Banda</dt><dd>${escape(radio.band)}</dd>` : ''}${radio.city ? `<dt>Localidade</dt><dd>${escape([radio.city, radio.state, radio.country].filter(Boolean).join(', '))}</dd>` : ''}${radio.genreLabels.length ? `<dt>Categoria</dt><dd>${escape(radio.genreLabels.join(', '))}</dd>` : ''}</dl>${radio.websiteUrl ? `<a href="${escape(radio.websiteUrl)}">Site oficial</a>` : ''}${hasCityPage && stateSlug ? ` <a href="/${stateSlug}/${citySlug}">Outras rádios de ${escape(radio.city)}</a>` : ''}${hasStatePage ? ` <a href="/${stateSlug}">Outras rádios ${stateArticle} ${escape(radio.state)}</a>` : ''}<h2>Frequência da ${escape(radio.name)}</h2><p>${escape(frequencyText || 'Frequência não informada no momento.')}</p><h2>Onde fica a ${escape(radio.name)}?</h2><p>${escape(locationText || 'Localização não informada no momento.')}</p><h2>Qual o estilo da ${escape(radio.name)}?</h2><p>${escape(genreText || 'Estilo não classificado no momento.')}</p><h2>Como ouvir a ${escape(radio.name)} online?</h2><p>${escape(describeHowToListen(radio))}</p><h2>Rádios relacionadas</h2>${radioList(related)}</article></main>`
  return { path, title: getRadioPageTitle(radio), description, content, schemas: [organization, website, { '@type': 'WebPage', url: `${SITE}${path}`, name: radio.name, isPartOf: { '@id': `${SITE}/#website` } }, breadcrumbSchema(breadcrumbItems), schema] }
})

const guideBreadcrumb = [{ label: 'Início', href: '/' }, { label: 'Como ouvir rádio online', href: '/guia/como-ouvir-radio-online' }]
directRoutes.push({ path: '/guia/como-ouvir-radio-online', title: 'Como ouvir rádio online: guia prático | Rádio FM Online', description: 'Aprenda como funcionam streams, reprodução no celular, consumo de dados e solução de falhas.', content: `<main>${breadcrumbNav(guideBreadcrumb)}<article><p>Guia prático</p><h1>Como ouvir rádio online</h1><p>Rádio online é a transmissão contínua do áudio de uma estação pela internet.</p><h2>Como começar</h2><ol><li>Encontre uma estação pela busca, frequência ou gênero.</li><li>Pressione play e aguarde a conexão.</li><li>Use o player para pausar, controlar o volume ou ativar o timer.</li></ol><h2>Reprodução no celular</h2><p>O áudio começa somente após o toque. O comportamento em segundo plano depende do aparelho e do navegador.</p><h2>Consumo de dados</h2><p>Streams usam dados continuamente. Prefira Wi-Fi quando seu plano for limitado.</p><h2>Quando a rádio estiver fora do ar</h2><p>Tente novamente e consulte o site oficial. O catálogo não retransmite nem modifica o áudio.</p><h2>Dúvidas frequentes</h2>${faqItems.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}</article></main>`, schemas: [organization, website, breadcrumbSchema(guideBreadcrumb), faqSchema] })

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
    return `<tr><td><a href="/${radio.path}">${escape(radio.name)}</a></td><td>${escape(radio.city || '—')}</td><td>${escape(radio.frequency || '—')}</td><td>Sim</td><td>${hasError ? escape(status.error) : '—'}</td></tr>`
  }).join('')
  const gapRows = gaps.map((gap) => `<tr><td>${escape(gap.name)}</td><td>${escape(gap.city)}</td><td>${escape(gap.frequency)}</td><td>Não</td><td>—</td></tr>`).join('')
  const emptyRow = active.length === 0 && gaps.length === 0 ? '<tr><td colspan="5">Nenhuma rádio mapeada ainda.</td></tr>' : ''
  return `<section id="estado-${slugify(state)}"><h2>${escape(state)}</h2><table><thead><tr><th>Rádio</th><th>Cidade</th><th>Frequência</th><th>Ativo no site</th><th>Erro no teste</th></tr></thead><tbody>${activeRows}${gapRows}${emptyRow}</tbody></table></section>`
}).join('')
const roadmapBreadcrumb = [{ label: 'Início', href: '/' }, { label: 'Roadmap de cobertura', href: '/roadmap' }]
directRoutes.push({ path: '/roadmap', title: 'Roadmap de rádios por estado | Rádio FM Online', description: roadmapDescription, noindex: true, content: `<main>${breadcrumbNav(roadmapBreadcrumb)}<p>Expansão do catálogo</p><h1>Roadmap de rádios por estado</h1><p>${escape(roadmapDescription)} A ordem segue a lista oficial de unidades da federação. Rádios "a incluir" foram levantadas em fontes externas e ainda não têm stream cadastrado no site.</p><p>Última checagem automática dos streams: ${roadmapCheckedAtLabel} · ${roadmapStatusLine}</p>${roadmapOverviewTable}${roadmapStateTables}</main>`, schemas: [organization, website, breadcrumbSchema(roadmapBreadcrumb)] })

const genreRoutes = [
  { path: '/genero/pop', name: 'Pop', label: 'gênero', items: getRadiosByGenre('pop') },
  { path: '/genero/noticias', name: 'Notícias', label: 'gênero', items: getRadiosByGenre('news') },
  { path: '/genero/rock', name: 'Rock', label: 'gênero', items: getRadiosByGenre('rock') },
  { path: '/genero/sertanejo', name: 'Sertanejo', label: 'gênero', items: getRadiosByGenre('sertanejo') },
  { path: '/genero/internacional', name: 'Internacional', label: 'gênero', items: getRadiosByGenre('international') },
]
const cityRoutes = indexableCities
  .map((city) => ({ path: `/${city.stateSlug}/${city.slug}`, name: city.name, state: city.radios[0]?.state, label: 'cidade', items: city.radios }))
const stateRoutes = indexableStates.map((state) => ({ path: `/${state.slug}`, name: state.name, label: 'estado', items: state.radios }))
const taxonomyRoutes = [...cityRoutes, ...stateRoutes, ...genreRoutes]
for (const route of taxonomyRoutes) {
  const isCity = route.label === 'cidade'
  const isState = route.label === 'estado'
  const article = isState ? getStateArticle(route.name) : 'de'
  const place = isCity && route.state ? `${route.name}, ${route.state}` : route.name
  const title = isCity
    ? `Rádios de ${route.name} ao vivo: ouça grátis | Rádio FM Online`
    : isState
      ? `Rádios ${article} ${route.name} ao vivo | Rádio FM Online`
      : `Rádios de ${route.name} ao vivo | Rádio FM Online`
  const description = isCity
    ? `Ouça ${route.items.length} rádios FM de ${place} ao vivo e grátis. Compare frequências, gêneros e emissoras locais para ouvir rádio online agora.`
    : isState
      ? `Ouça ${route.items.length} rádios FM ${article} ${route.name} ao vivo e grátis. Compare frequências, gêneros e cidades para ouvir rádio online agora.`
      : `Explore ${route.items.length} rádios de ${route.name}, consulte frequências e localidades e ouça as estações ao vivo.`
  const citySlugForState = isCity && route.state ? slugify(route.state) : null
  const hasParentStatePage = Boolean(citySlugForState && indexableStateSlugs.has(citySlugForState))
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    hasParentStatePage && { label: route.state, href: `/${citySlugForState}` },
    { label: isState ? `Rádios ${article} ${route.name}` : `Rádios de ${route.name}`, href: route.path },
  ].filter(Boolean)
  const intro = isCity
    ? `Escolha uma emissora de ${escape(route.name)} na lista abaixo e ouça ao vivo pelo navegador, sem baixar aplicativos.`
    : isState
      ? `Escolha uma emissora ${article} ${escape(route.name)} na lista abaixo e ouça ao vivo pelo navegador, sem baixar aplicativos.`
      : `${escape(description)} A ordem não representa audiência nem popularidade.`
  const copyHeading = isCity ? `Como ouvir rádio em ${escape(route.name)}` : isState ? `Como ouvir rádio ${article} ${escape(route.name)}` : 'Explore o catálogo'
  const copyText = isCity
    ? `Toque em uma estação de ${escape(route.name)} para começar a transmissão ao vivo.`
    : isState
      ? `Toque em uma estação ${article} ${escape(route.name)} para começar a transmissão ao vivo.`
      : 'Abra a página de cada estação para consultar dados, fonte oficial e rádios relacionadas.'
  const insight = (isCity || isState) ? describeCityInsight(route.items) : null
  const insightSentence = insight && (insight.rangeText || insight.genreText)
    ? escape([
        insight.rangeText && `O dial cadastrado ${isState ? `${article} ${route.name}` : `para ${route.name}`} vai de ${insight.rangeText}`,
        insight.genreText && `com destaque para emissoras de ${insight.genreText}`,
      ].filter(Boolean).join(', ') + '.')
    : ''
  directRoutes.push({ path: route.path, title, description, content: `<main>${breadcrumbNav(breadcrumbItems)}<h1>Rádios ${isState ? `${article} ${escape(route.name)}` : `de ${escape(route.name)}`} ao vivo${isCity ? ' — ouça FM grátis' : ''}</h1><p>${intro}</p>${radioList(route.items)}<h2>${copyHeading}</h2><p>${copyText}</p>${insightSentence ? `<p>${insightSentence}</p>` : ''}</main>`, schemas: [organization, website, breadcrumbSchema(breadcrumbItems), { '@type': 'ItemList', numberOfItems: route.items.length, itemListElement: route.items.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/${radio.path}` })) }] })
}

for (const route of directRoutes) {
  const directory = new URL(`.${route.path}/`, dist)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), render(route), 'utf8')
}

const notFound = render({ path: '/404', title: 'Página não encontrada | Rádio FM Online', description: 'O endereço solicitado não existe.', noindex: true, content: '<main><h1>Página não encontrada</h1><p>O endereço solicitado não existe.</p><a href="/">Voltar para a página principal</a></main>', schemas: [] })
await writeFile(new URL('404.html', dist), notFound, 'utf8')
console.log(`Pré-render concluído: página principal, ${directRoutes.length} páginas diretas e 404.`)
