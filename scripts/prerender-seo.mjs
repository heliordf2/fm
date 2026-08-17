import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { GENRE_DESCRIPTIONS, describeCityInsight, describeFrequency, describeGenre, describeHowToListen, describeLocation, describeStationProfile, getAllRadios, getFeaturedRadios, getIndexableCitiesWithState, getIndexableStates, getLocationBreakdown, getRadioMetaDescription, getRadioPageTitle, getRadiosByGenre, getRelatedRadios, getStateArticle, slugify } from '../src/data/radioRepository.js'
import { faqItems } from '../src/data/faq.js'
import { guideFaqItems } from '../src/data/guideFaq.js'
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
const guidePageFaqSchema = { '@type': 'FAQPage', mainEntity: [...faqItems, ...guideFaqItems].map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }
const breadcrumbSchema = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: `${SITE}${item.href}` })) })
const breadcrumbNav = (items) => `<nav>${items.map((item, index) => (index === items.length - 1 ? escape(item.label) : `<a href="${item.href}">${escape(item.label)}</a> / `)).join('')}</nav>`

const ADSENSE_SCRIPT_PATTERN = /\s*<script\s+async\s+src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"]*"\s+crossorigin="anonymous"\s*><\/script>/

function render({ path, title, description, content, schemas, noindex = false }) {
  const canonical = `${SITE}${path}`
  const graph = { '@context': 'https://schema.org', '@graph': schemas }
  const base = path === '/' ? template : template.replace(ADSENSE_SCRIPT_PATTERN, '')
  return base
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
  const sameCityStateName = Boolean(citySlug && stateSlug && citySlug === stateSlug)
  const cityLinkLabel = sameCityStateName ? `Outras rádios da cidade de ${radio.city}` : `Outras rádios de ${radio.city}`
  const stateLinkLabel = sameCityStateName ? `Rádios do estado de ${radio.state}` : `Rádios ${stateArticle} ${radio.state}`
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    hasStatePage && { label: radio.state, href: `/${stateSlug}` },
    hasCityPage && stateSlug && { label: radio.city, href: `/${stateSlug}/${citySlug}` },
    { label: radio.name, href: path },
  ].filter(Boolean)
  const frequencyText = describeFrequency(radio)
  const locationText = describeLocation(radio)
  const genreText = describeGenre(radio)
  const profileText = describeStationProfile(radio)
  const content = `<main>${breadcrumbNav(breadcrumbItems)}<article><p>Ouça ao vivo</p><h1>${escape(radio.name)} ao vivo</h1><p>${escape([radio.frequency, radio.city, radio.state, radio.country].filter(Boolean).join(' · '))}</p><h2>Informações da estação</h2><p>${escape(description)}</p><dl>${radio.frequency ? `<dt>Frequência</dt><dd>${escape(radio.frequency)}</dd>` : ''}${radio.band ? `<dt>Banda</dt><dd>${escape(radio.band)}</dd>` : ''}${radio.city ? `<dt>Localidade</dt><dd>${escape([radio.city, radio.state, radio.country].filter(Boolean).join(', '))}</dd>` : ''}${radio.genreLabels.length ? `<dt>Categoria</dt><dd>${escape(radio.genreLabels.join(', '))}</dd>` : ''}</dl>${radio.websiteUrl ? `<a href="${escape(radio.websiteUrl)}">Site oficial</a>` : ''}${hasCityPage && stateSlug ? ` <a href="/${stateSlug}/${citySlug}">${escape(cityLinkLabel)}</a>` : ''}${hasStatePage ? ` <a href="/${stateSlug}">${escape(stateLinkLabel)}</a>` : ''}${profileText ? `<h2>Sobre a ${escape(radio.name)}</h2><p>${escape(profileText)}</p>` : ''}<h2>Frequência da ${escape(radio.name)}</h2><p>${escape(frequencyText || 'Frequência não informada no momento.')}</p><h2>Onde fica a ${escape(radio.name)}?</h2><p>${escape(locationText || 'Localização não informada no momento.')}</p><h2>Qual o estilo da ${escape(radio.name)}?</h2><p>${escape(genreText || 'Estilo não classificado no momento.')}</p><h2>Como ouvir a ${escape(radio.name)} online?</h2><p>${escape(describeHowToListen(radio))} Veja o <a href="/guia/como-ouvir-radio-online">guia completo de como ouvir rádio online</a> para mais detalhes.</p><h2>Rádios relacionadas</h2>${radioList(related)}</article></main>`
  return { path, title: getRadioPageTitle(radio), description, content, schemas: [organization, website, { '@type': 'WebPage', url: `${SITE}${path}`, name: radio.name, isPartOf: { '@id': `${SITE}/#website` } }, breadcrumbSchema(breadcrumbItems), schema] }
})

const guideBreadcrumb = [{ label: 'Início', href: '/' }, { label: 'Como ouvir rádio online', href: '/guia/como-ouvir-radio-online' }]
const guideContent = `<main><div class="direct-article-page">${breadcrumbNav(guideBreadcrumb)}<article><p>Guia prático</p><h1>Como ouvir rádio online grátis</h1><p>Ouvir rádio online é uma das formas mais simples de acompanhar músicas, notícias, esportes, entretenimento e a programação de emissoras de diferentes cidades do Brasil. Hoje, você não precisa necessariamente de um aparelho de rádio nem instalar um aplicativo: em muitos casos, basta abrir o navegador, escolher uma emissora e iniciar a transmissão.</p><p>No Rádio FM Online, você pode navegar por estados, cidades e gêneros para encontrar uma estação e ouvir a programação disponível pela internet.</p><h2>Como ouvir rádio online pelo celular</h2><p>Para ouvir rádio online pelo celular, você pode usar o próprio navegador do aparelho.</p><p>O processo é simples:</p><ol><li>Acesse o Rádio FM Online pelo navegador.</li><li>Escolha uma rádio, estado, cidade ou gênero.</li><li>Abra a página da emissora desejada.</li><li>Toque no botão de reprodução do player.</li><li>Mantenha a conexão com a internet enquanto estiver ouvindo.</li></ol><p>Isso funciona em celulares Android e iPhone, desde que o navegador seja compatível com a transmissão disponibilizada pela emissora.</p><p>Não é necessário instalar um aplicativo específico para começar a ouvir pelo site.</p><h2>Como ouvir rádio online pelo computador</h2><p>No computador, o funcionamento é semelhante.</p><p>Acesse o Rádio FM Online usando um navegador como Chrome, Edge, Firefox ou Safari, encontre a estação desejada e utilize o player presente na página da rádio.</p><p>Você pode procurar uma emissora pelo nome ou navegar pelas páginas de estados, cidades e gêneros.</p><p>Por exemplo, é possível encontrar rádios de <a href="/sao-paulo/sao-paulo">São Paulo</a>, <a href="/parana/curitiba">Curitiba</a>, <a href="/rio-de-janeiro/rio-de-janeiro">Rio de Janeiro</a>, <a href="/minas-gerais/belo-horizonte">Belo Horizonte</a> e outras localidades diretamente pelo catálogo.</p><h2>Preciso instalar algum aplicativo para ouvir rádio online?</h2><p>Não necessariamente.</p><p>Quando uma rádio disponibiliza sua transmissão pela internet e o player é compatível com seu navegador, você pode ouvir diretamente pelo site.</p><p>Aplicativos podem oferecer recursos adicionais, mas não são obrigatórios para simplesmente reproduzir uma transmissão online.</p><p>Essa é uma das vantagens da rádio pela internet: ela pode ser acessada em diferentes dispositivos sem depender de um receptor FM tradicional.</p><h2>Rádio online é grátis?</h2><p>O acesso às rádios disponíveis no Rádio FM Online é gratuito.</p><p>Entretanto, ouvir uma transmissão utiliza sua conexão com a internet. Dependendo do seu plano de dados móveis, sua operadora pode cobrar pelo tráfego utilizado.</p><p>Em uma conexão Wi-Fi residencial, normalmente o consumo faz parte do plano contratado com seu provedor de internet.</p><h2>Rádio online gasta internet?</h2><p>Sim.</p><p>Como o áudio é transmitido continuamente pela internet, ouvir rádio online consome dados.</p><p>O consumo depende principalmente da qualidade do áudio utilizada pela emissora.</p><p>Como referência aproximada:</p><ul><li>transmissão de 64 kbps pode consumir cerca de 29 MB por hora;</li><li>transmissão de 96 kbps pode consumir cerca de 43 MB por hora;</li><li>transmissão de 128 kbps pode consumir cerca de 58 MB por hora;</li><li>transmissão de 192 kbps pode consumir cerca de 86 MB por hora.</li></ul><p>Esses valores são aproximados e podem variar de acordo com o formato de áudio e a transmissão da própria rádio.</p><p>Se você utiliza dados móveis e pretende ouvir por várias horas, vale acompanhar o consumo do seu plano.</p><h2>Qual é a diferença entre rádio FM e rádio online?</h2><p>A principal diferença está na forma como o áudio chega até você.</p><p>Na rádio FM tradicional, a emissora transmite um sinal por ondas de rádio. Para recebê-lo, normalmente é necessário estar dentro da área de cobertura da estação e utilizar um aparelho compatível com FM.</p><p>Na rádio online, o áudio é transmitido pela internet.</p><p>Isso permite, por exemplo, ouvir uma rádio de São Paulo mesmo estando em outro estado ou até em outro país, desde que a transmissão esteja disponível online.</p><p>A programação pode ser a mesma da frequência FM tradicional, embora algumas emissoras também tenham canais exclusivos para a internet.</p><h2>Posso ouvir uma rádio de outro estado?</h2><p>Sim.</p><p>Essa é justamente uma das principais vantagens da transmissão pela internet.</p><p>Uma rádio FM possui uma área física de cobertura limitada pelo sinal da emissora. Pela internet, essa limitação geográfica deixa de ser o principal obstáculo.</p><p>Você pode estar em <a href="/parana/curitiba">Curitiba</a> e ouvir uma rádio de <a href="/sao-paulo/sao-paulo">São Paulo</a>, ou estar em outro país e acompanhar uma emissora brasileira.</p><p>No Rádio FM Online, as rádios são organizadas por estados e cidades para facilitar essa busca.</p><h2>Como encontrar rádios de um estado</h2><p>Se você não procura uma emissora específica, uma opção é navegar pelo estado.</p><p>Por exemplo, você pode acessar a página de <a href="/sao-paulo">rádios de São Paulo</a> para encontrar emissoras cadastradas em diferentes cidades do estado.</p><p>O mesmo vale para <a href="/parana">Paraná</a>, <a href="/minas-gerais">Minas Gerais</a>, <a href="/rio-de-janeiro">Rio de Janeiro</a>, <a href="/bahia">Bahia</a> e os demais estados disponíveis no catálogo.</p><p>Essa organização é útil principalmente para quem deseja conhecer rádios locais ou encontrar uma estação pela cidade de origem.</p><h2>Como encontrar rádios de uma cidade</h2><p>As páginas de cidade permitem filtrar ainda mais o catálogo.</p><p>Em vez de visualizar todas as emissoras de um estado, você pode consultar apenas as estações cadastradas em determinada cidade.</p><p>Isso facilita buscas como:</p><ul><li><a href="/sao-paulo/sao-paulo">rádios de São Paulo</a>;</li><li><a href="/parana/curitiba">rádios de Curitiba</a>;</li><li><a href="/rio-de-janeiro/rio-de-janeiro">rádios do Rio de Janeiro</a>;</li><li><a href="/minas-gerais/belo-horizonte">rádios de Belo Horizonte</a>;</li><li><a href="/distrito-federal/brasilia">rádios de Brasília</a>;</li><li><a href="/bahia/salvador">rádios de Salvador</a>.</li></ul><p>Nas páginas de cidade também é possível consultar as frequências informadas para cada emissora.</p><h2>Como encontrar uma rádio pela frequência</h2><p>Se você conhece a frequência da estação, ela pode ajudar a identificar a rádio correta.</p><p>Uma emissora pode ser apresentada, por exemplo, como <strong>89.1 FM</strong> ou <strong>100.9 FM</strong>.</p><p>Nas páginas das estações cadastradas, o Rádio FM Online informa a frequência disponível, a cidade, o estado e outras informações sobre a rádio.</p><p>É importante lembrar que frequências podem se repetir em cidades diferentes. Por isso, o ideal é considerar também a localização da emissora.</p><h2>Como encontrar rádios pelo gênero musical</h2><p>Além da localização, você pode explorar o catálogo por gênero ou tipo de programação.</p><p>Isso é útil quando você quer ouvir determinado estilo, mas não tem uma rádio específica em mente.</p><p>Entre as categorias disponíveis podem aparecer rádios de:</p><ul><li><a href="/genero/rock">Rock</a>;</li><li><a href="/genero/sertanejo">Sertanejo</a>;</li><li><a href="/genero/pop">Pop</a>;</li><li><a href="/genero/noticias">Notícias</a>;</li><li><a href="/genero/gospel">Gospel</a>;</li><li>MPB e música brasileira;</li><li><a href="/genero/popular">programação popular ou eclética</a>;</li><li>outros formatos disponíveis no catálogo.</li></ul><p>Assim, em vez de pesquisar uma estação pelo nome, você pode descobrir rádios com programação semelhante ao que gosta de ouvir.</p><h2>Por que uma rádio pode ficar fora do ar?</h2><p>Uma rádio online pode ficar temporariamente indisponível por diferentes motivos.</p><p>O Rádio FM Online organiza e disponibiliza o acesso às transmissões, mas o sinal de áudio depende da infraestrutura utilizada pela própria emissora ou pelo provedor do streaming.</p><p>Entre os motivos mais comuns estão:</p><ul><li>manutenção no servidor da rádio;</li><li>alteração no endereço da transmissão;</li><li>problema técnico na emissora;</li><li>limite temporário de conexões;</li><li>indisponibilidade do serviço de streaming;</li><li>mudança na forma como a rádio distribui seu áudio.</li></ul><p>Se uma estação não estiver reproduzindo, isso não significa necessariamente que ela encerrou suas atividades. O problema pode ser temporário.</p><h2>O player não iniciou. O que posso fazer?</h2><p>Se o player não funcionar, algumas verificações simples podem ajudar:</p><ol><li>Confirme que sua internet está funcionando.</li><li>Atualize a página.</li><li>Verifique se o navegador permite reprodução de áudio.</li><li>Tente abrir a rádio novamente.</li><li>Teste outro navegador, se necessário.</li><li>Verifique se outras rádios do site estão funcionando.</li></ol><p>Se outras estações reproduzem normalmente e apenas uma rádio apresenta problema, é possível que a transmissão daquela emissora esteja temporariamente indisponível.</p><h2>Posso ouvir rádio online sem internet?</h2><p>Não.</p><p>A transmissão online depende de uma conexão ativa com a internet.</p><p>Se você estiver completamente sem conexão, o player não conseguirá receber o áudio da emissora.</p><p>Isso é diferente de um aparelho com receptor FM, que consegue captar uma estação local sem utilizar internet.</p><h2>Posso ouvir rádio online usando Wi-Fi?</h2><p>Sim.</p><p>Aliás, para quem pretende ouvir por longos períodos, utilizar Wi-Fi pode ser mais conveniente do que consumir o pacote de dados móveis.</p><p>Basta que o aparelho esteja conectado à internet e que a transmissão da rádio esteja disponível.</p><h2>Rádio online funciona no tablet?</h2><p>Sim.</p><p>Tablets funcionam de maneira semelhante aos celulares.</p><p>Você pode abrir o navegador, acessar o Rádio FM Online e utilizar o player presente na página da estação.</p><h2>Posso ouvir rádio online em uma Smart TV?</h2><p>Depende do modelo da televisão e dos recursos disponíveis.</p><p>Algumas Smart TVs possuem navegador de internet e conseguem reproduzir determinados formatos de áudio diretamente.</p><p>Outra possibilidade é transmitir o conteúdo do celular ou computador para a televisão utilizando recursos compatíveis com o aparelho.</p><p>Como existem muitas marcas e sistemas diferentes, a compatibilidade pode variar.</p><h2>Posso deixar a rádio tocando em segundo plano?</h2><p>Isso depende do navegador, sistema operacional e configurações do dispositivo.</p><p>Em alguns aparelhos, o áudio continua tocando enquanto você utiliza outras funções. Em outros, o sistema pode interromper a reprodução quando o navegador é fechado ou colocado em segundo plano.</p><p>Também é possível que configurações de economia de bateria interfiram na reprodução contínua.</p><h2>Rádio online tem atraso em relação ao FM?</h2><p>Pode ter.</p><p>A transmissão pela internet passa por processos de codificação, envio ao servidor, distribuição e reprodução no aparelho do usuário.</p><p>Por isso, é normal existir alguns segundos de diferença entre o áudio transmitido pelo FM tradicional e o áudio recebido pela internet.</p><p>Em transmissões esportivas ao vivo, esse atraso pode ficar mais perceptível.</p><h2>Posso ouvir jogos de futebol pelo rádio online?</h2><p>Depende da programação e dos direitos de transmissão de cada emissora.</p><p>Algumas rádios de notícias e esportes transmitem partidas, comentários, programas esportivos e cobertura de campeonatos.</p><p>Se você procura esse tipo de conteúdo, vale explorar principalmente rádios classificadas como <a href="/genero/noticias">notícias</a>, esportes ou emissoras conhecidas por sua cobertura esportiva.</p><h2>Como escolher uma rádio para ouvir?</h2><p>Se você já conhece o nome da emissora, a maneira mais rápida é abrir diretamente sua página.</p><p>Se ainda não sabe qual rádio escolher, você pode navegar por:</p><ul><li>estado;</li><li>cidade;</li><li>gênero;</li><li>frequência;</li><li>rádios relacionadas.</li></ul><p>As páginas individuais também apresentam sugestões de outras emissoras que podem ajudar você a encontrar alternativas semelhantes.</p><h2>Ouça rádios de diferentes regiões do Brasil</h2><p>A internet permite acompanhar emissoras que antes ficavam limitadas principalmente à sua região de transmissão.</p><p>Você pode explorar rádios de diferentes estados, descobrir estações locais de outras cidades e acompanhar programas que não estão disponíveis na sua região pelo FM tradicional.</p><p>Comece escolhendo um <a href="/parana">estado</a>, uma <a href="/parana/curitiba">cidade</a> ou um <a href="/genero/pop">gênero</a> no catálogo do Rádio FM Online e abra a página da estação que deseja ouvir.</p><h2>Perguntas frequentes sobre rádio online</h2>${guideFaqItems.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}<h2>Dúvidas frequentes sobre o site</h2>${faqItems.map((item) => `<h3>${escape(item.q)}</h3><p>${escape(item.a)}</p>`).join('')}</article></div></main>`
directRoutes.push({ path: '/guia/como-ouvir-radio-online', title: 'Como ouvir rádio online grátis | Rádio FM Online', description: 'Guia completo sobre como ouvir rádio online grátis: pelo celular, computador ou tablet, sem aplicativo, consumo de dados e diferenças em relação ao FM tradicional.', content: guideContent, schemas: [organization, website, breadcrumbSchema(guideBreadcrumb), guidePageFaqSchema] })

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
  { path: '/genero/pop', name: 'Pop', label: 'gênero', genreKey: 'pop', items: getRadiosByGenre('pop') },
  { path: '/genero/noticias', name: 'Notícias', label: 'gênero', genreKey: 'news', items: getRadiosByGenre('news') },
  { path: '/genero/rock', name: 'Rock', label: 'gênero', genreKey: 'rock', items: getRadiosByGenre('rock') },
  { path: '/genero/sertanejo', name: 'Sertanejo', label: 'gênero', genreKey: 'sertanejo', items: getRadiosByGenre('sertanejo') },
  { path: '/genero/popular', name: 'Popular/Eclética', label: 'gênero', genreKey: 'popular', items: getRadiosByGenre('popular') },
  { path: '/genero/adulto-flashback', name: 'Adulto/Flashback', label: 'gênero', genreKey: 'adulto', items: getRadiosByGenre('adulto') },
  { path: '/genero/gospel', name: 'Gospel', label: 'gênero', genreKey: 'gospel', items: getRadiosByGenre('gospel') },
  { path: '/genero/internacional', name: 'Internacional', label: 'gênero', genreKey: 'international', items: getRadiosByGenre('international') },
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
  const isGenre = route.label === 'gênero'
  const genreDescription = isGenre ? GENRE_DESCRIPTIONS[route.genreKey] : null
  const locationBreakdown = (isState || isGenre) ? getLocationBreakdown(route.items) : []
  const locationHeading = isState ? `Cidades ${article} ${escape(route.name)}` : `${escape(route.name)} por cidade`
  const locationSection = locationBreakdown.length > 0
    ? `<h2>${locationHeading}</h2>${genreDescription ? `<p>${escape(genreDescription)}</p>` : ''}<ul>${locationBreakdown.map((entry) => {
        const hasPage = entry.citySlug && entry.stateSlug && indexableCitySlugs.has(entry.citySlug)
        const label = `${escape(entry.city)}${isGenre && entry.state ? ` (${escape(entry.state)})` : ''} — ${entry.count} rádio${entry.count !== 1 ? 's' : ''}`
        return `<li>${hasPage ? `<a href="/${entry.stateSlug}/${entry.citySlug}">${label}</a>` : label}</li>`
      }).join('')}</ul>`
    : ''
  directRoutes.push({ path: route.path, title, description, content: `<main>${breadcrumbNav(breadcrumbItems)}<h1>Rádios ${isState ? `${article} ${escape(route.name)}` : `de ${escape(route.name)}`} ao vivo${isCity ? ' — ouça FM grátis' : ''}</h1><p>${intro}</p>${radioList(route.items)}<h2>${copyHeading}</h2><p>${copyText}</p>${insightSentence ? `<p>${insightSentence}</p>` : ''}${locationSection}</main>`, schemas: [organization, website, breadcrumbSchema(breadcrumbItems), { '@type': 'ItemList', numberOfItems: route.items.length, itemListElement: route.items.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/${radio.path}` })) }] })
}

for (const route of directRoutes) {
  const directory = new URL(`.${route.path}/`, dist)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), render(route), 'utf8')
}

const notFound = render({ path: '/404', title: 'Página não encontrada | Rádio FM Online', description: 'O endereço solicitado não existe.', noindex: true, content: '<main><h1>Página não encontrada</h1><p>O endereço solicitado não existe.</p><a href="/">Voltar para a página principal</a></main>', schemas: [] })
await writeFile(new URL('404.html', dist), notFound, 'utf8')
console.log(`Pré-render concluído: página principal, ${directRoutes.length} páginas diretas e 404.`)
