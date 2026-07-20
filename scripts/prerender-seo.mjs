import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { describeRadio, getAllRadios, getRadiosByCity, getRelatedRadios } from '../src/data/radioRepository.js'

const SITE = 'https://www.radiofmonline.com.br'
const dist = new URL('../dist/', import.meta.url)
const template = await readFile(new URL('index.html', dist), 'utf8')
const radios = getAllRadios()
const saoPaulo = getRadiosByCity('sao-paulo')
const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function stationDetails(items) {
  return items.map((radio) => `<details id="radio-${radio.slug}"><summary>${escape(radio.name)} — ${escape([radio.frequency, radio.city].filter(Boolean).join(' · '))}</summary><dl>${radio.frequency ? `<dt>Frequência</dt><dd>${escape(radio.frequency)}</dd>` : ''}${radio.city ? `<dt>Cidade</dt><dd>${escape(radio.city)}</dd>` : ''}${radio.state ? `<dt>Estado</dt><dd>${escape(radio.state)}</dd>` : ''}${radio.genreLabels.length ? `<dt>Categoria</dt><dd>${escape(radio.genreLabels.join(', '))}</dd>` : ''}</dl><a href="/radio/${radio.slug}">Ver página da estação</a>${radio.websiteUrl ? ` <a href="${escape(radio.websiteUrl)}">Site oficial</a>` : ''}</details>`).join('')
}

function radioList(items) {
  return `<ul>${items.map((radio) => `<li><a href="/radio/${radio.slug}">${escape(radio.name)}</a>${radio.frequency ? ` — ${escape(radio.frequency)}` : ''}${radio.genreLabels.length ? ` — ${escape(radio.genreLabels.join(', '))}` : ''}</li>`).join('')}</ul>`
}

const faq = [
  { q: 'O áudio começa automaticamente?', a: 'Não. A reprodução começa somente depois de uma ação do usuário.' },
  { q: 'Por que uma rádio pode não tocar?', a: 'O stream pode estar em manutenção, ter mudado de endereço ou usar um formato incompatível.' },
  { q: 'O Rádio FM Online representa as emissoras?', a: 'Não. Este é um catálogo independente; marcas, programação e streams pertencem às respectivas emissoras ou distribuidores.' },
]

const organization = { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Rádio FM Online', url: `${SITE}/`, logo: `${SITE}/favicon.svg`, contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', telephone: '+55-11-97400-4755', availableLanguage: 'Portuguese' } }
const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Rádio FM Online', inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#organization` }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } }
const faqSchema = { '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }

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

const rootContent = `<main><h1>Rádio FM Online</h1><section><h2>Ouça rádios FM ao vivo</h2><p>Descubra estações de rádio brasileiras e internacionais em um player simples, rápido e com busca por nome, frequência ou cidade. Aproveite uma experiência prática para ouvir rádios FM ao vivo, salvar favoritas e alternar entre gêneros como pop, rock, sertanejo, notícias e internacional.</p><h2>Estações disponíveis</h2>${stationDetails(radios)}</section><section id="guia"><p>Guia prático</p><h2>Como ouvir rádio online</h2><p>Entenda streams, reprodução no celular, consumo de dados e como agir quando uma estação estiver fora do ar.</p><a href="/guia/como-ouvir-radio-online">Ler o guia</a><h3>Explore por frequência</h3><h2>Guia de rádios FM de São Paulo</h2><p>Veja as estações cadastradas, suas frequências e os gêneros usados para organizar o catálogo.</p><a href="/radios/sao-paulo">Abrir o guia</a></section><section id="duvidas"><p>Dúvidas frequentes</p><h2>Sobre a reprodução</h2>${faq.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}</section><section id="sobre"><h2>Sobre o Rádio FM Online</h2><p>Catálogo independente criado para facilitar a descoberta e reprodução de estações.</p><h2 id="metodologia">Metodologia</h2><p>Organizamos os dados disponíveis sem inventar audiência, popularidade ou programação.</p></section></main><footer><strong>Rádio FM Online</strong><p>Catálogo independente de estações ao vivo.</p><nav><a href="/guia/como-ouvir-radio-online">Guia</a> <a href="#sobre">Sobre</a> <a href="#metodologia">Metodologia</a> <a href="/privacy-policy.html">Privacidade</a> <a href="/terms.html">Termos</a> <a href="https://wa.me/5511974004755">Contato e suporte SaaS</a></nav></footer>`
const rootSchemas = [organization, website, { '@type': 'WebPage', '@id': `${SITE}/#webpage`, url: `${SITE}/`, name: 'Rádio FM Online: Ouça rádios ao vivo grátis', isPartOf: { '@id': `${SITE}/#website` }, inLanguage: 'pt-BR' }, { '@type': 'ItemList', numberOfItems: radios.length, itemListElement: radios.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }, faqSchema]
await writeFile(new URL('index.html', dist), render({ path: '/', title: 'Rádio FM Online: Ouça rádios ao vivo grátis', description: 'Ouça rádio FM online grátis e ao vivo. Encontre estações brasileiras e internacionais por nome, cidade, frequência ou gênero.', content: rootContent, schemas: rootSchemas }), 'utf8')

const directRoutes = radios.map((radio) => {
  const path = `/radio/${radio.slug}`
  const description = describeRadio(radio)
  const address = radio.city ? { '@type': 'PostalAddress', addressLocality: radio.city, addressRegion: radio.state, addressCountry: radio.country } : undefined
  const schema = { '@type': 'RadioStation', name: radio.name, url: `${SITE}${path}`, sameAs: radio.websiteUrl, logo: radio.logoUrl?.startsWith('http') ? radio.logoUrl : radio.logoUrl ? `${SITE}${radio.logoUrl.split('?')[0]}` : undefined, address }
  const related = getRelatedRadios(radio)
  const content = `<main><nav><a href="/">Início</a> / ${escape(radio.name)}</nav><article><p>Ouça ao vivo</p><h1>${escape(radio.name)}</h1><p>${escape([radio.frequency, radio.city, radio.state, radio.country].filter(Boolean).join(' · '))}</p><h2>Informações da estação</h2><p>${escape(description)}</p><dl>${radio.frequency ? `<dt>Frequência</dt><dd>${escape(radio.frequency)}</dd>` : ''}${radio.band ? `<dt>Banda</dt><dd>${escape(radio.band)}</dd>` : ''}${radio.city ? `<dt>Localidade</dt><dd>${escape([radio.city, radio.state, radio.country].filter(Boolean).join(', '))}</dd>` : ''}${radio.genreLabels.length ? `<dt>Categoria</dt><dd>${escape(radio.genreLabels.join(', '))}</dd>` : ''}</dl>${radio.websiteUrl ? `<a href="${escape(radio.websiteUrl)}">Site oficial</a>` : ''}<h2>Rádios relacionadas</h2>${radioList(related)}</article></main>`
  const place = [radio.city, radio.state].filter(Boolean).join(', ')
  return { path, title: `Ouvir ${radio.name} ao vivo${place ? ` — ${place}` : ''} | Rádio FM Online`, description, content, schemas: [organization, website, { '@type': 'WebPage', url: `${SITE}${path}`, name: radio.name, isPartOf: { '@id': `${SITE}/#website` } }, schema] }
})

directRoutes.push({ path: '/radios/sao-paulo', title: 'Rádios de São Paulo ao vivo e frequências | Rádio FM Online', description: `Compare ${saoPaulo.length} rádios de São Paulo, suas frequências e gêneros e ouça as estações ao vivo.`, content: `<main><nav><a href="/">Início</a> / Rádios de São Paulo</nav><h1>Rádios de São Paulo ao vivo</h1><p>Compare estações cadastradas na cidade, consulte frequências e gêneros e escolha o que ouvir. A lista não representa ranking de audiência.</p>${radioList(saoPaulo)}<h2>Como escolher uma rádio</h2><p>Use a frequência se você conhece a estação pelo dial ou abra a página individual para consultar o site oficial.</p></main>`, schemas: [organization, website, { '@type': 'ItemList', numberOfItems: saoPaulo.length, itemListElement: saoPaulo.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }] })
directRoutes.push({ path: '/guia/como-ouvir-radio-online', title: 'Como ouvir rádio online: guia prático | Rádio FM Online', description: 'Aprenda como funcionam streams, reprodução no celular, consumo de dados e solução de falhas.', content: `<main><nav><a href="/">Início</a> / Guia</nav><article><p>Guia prático</p><h1>Como ouvir rádio online</h1><p>Rádio online é a transmissão contínua do áudio de uma estação pela internet.</p><h2>Como começar</h2><ol><li>Encontre uma estação pela busca, frequência ou gênero.</li><li>Pressione play e aguarde a conexão.</li><li>Use o player para pausar, controlar o volume ou ativar o timer.</li></ol><h2>Reprodução no celular</h2><p>O áudio começa somente após o toque. O comportamento em segundo plano depende do aparelho e do navegador.</p><h2>Consumo de dados</h2><p>Streams usam dados continuamente. Prefira Wi-Fi quando seu plano for limitado.</p><h2>Quando a rádio estiver fora do ar</h2><p>Tente novamente e consulte o site oficial. O catálogo não retransmite nem modifica o áudio.</p><h2>Dúvidas frequentes</h2>${faq.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}</article></main>`, schemas: [organization, website, faqSchema] })

for (const route of directRoutes) {
  const directory = new URL(`.${route.path}/`, dist)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), render(route), 'utf8')
}

const notFound = render({ path: '/404', title: 'Página não encontrada | Rádio FM Online', description: 'O endereço solicitado não existe.', noindex: true, content: '<main><h1>Página não encontrada</h1><p>O endereço solicitado não existe.</p><a href="/">Voltar para a página principal</a></main>', schemas: [] })
await writeFile(new URL('404.html', dist), notFound, 'utf8')
console.log(`Pré-render concluído: página principal, ${directRoutes.length} páginas diretas e 404.`)
