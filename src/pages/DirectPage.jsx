import { useEffect } from 'react'
import Header from '../components/Header.jsx'
import InstallAppButton from '../components/InstallAppButton.jsx'
import PlayerBar from '../components/PlayerBar.jsx'
import RadioIcon from '../components/RadioIcon.jsx'
import RadioCard from '../components/RadioCard.jsx'
import AdUnit from '../components/AdUnit.jsx'
import Footer from '../components/Footer.jsx'
import { useAudioPlayer } from '../hooks/useAudioPlayer.js'
import { useSleepTimer } from '../hooks/useSleepTimer.js'
import { useTheme } from '../hooks/useTheme.js'
import { usePwaInstall } from '../hooks/usePwaInstall.js'
import { useFavorites } from '../hooks/useFavorites.js'
import { useHiddenRadios } from '../hooks/useHiddenRadios.js'
import { CATALOG_REVIEWED_AT, GENRE_DESCRIPTIONS, GENRE_LABELS, describeFrequency, describeGenre, describeHowToListen, describeLocation, getAllRadios, getIndexableCities, getIndexableStates, getLocationBreakdown, getRadioByPath, getRadioMetaDescription, getRadioPageTitle, getRadiosByCity, getRadiosByGenre, getRelatedRadios, getStateArticle, isIndexableListing, slugify } from '../data/radioRepository.js'
import { faqItems } from '../data/faq.js'
import { guideFaqItems } from '../data/guideFaq.js'
import { BRAZIL_STATES, ROADMAP_GAPS } from '../data/roadmap.js'
import { STREAM_STATUS, STREAM_STATUS_CHECKED_AT } from '../data/streamStatus.js'
import { AD_SLOTS } from '../config/adsense.js'
import '../styles/shared.css'
import './DirectPage.css'

const SITE = 'https://radiofmonline.com.br'
const ORGANIZATION_SCHEMA = { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Rádio FM Online', url: `${SITE}/`, logo: `${SITE}/fm-online.svg`, contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', telephone: '+55-11-97400-4755', availableLanguage: 'Portuguese' } }
const WEBSITE_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Rádio FM Online', inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#organization` }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } }

function setMeta(selector, attributes) {
  let node = document.head.querySelector(selector)
  if (!node) { node = document.createElement('meta'); document.head.appendChild(node) }
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value))
}

function usePageSeo({ title, description, path, noindex = false, schemas = [] }) {
  useEffect(() => {
    const canonical = `${SITE}${path}`
    document.title = title
    setMeta('meta[name="description"]', { name: 'description', content: description })
    setMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex,follow' : 'index,follow' })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    const link = document.head.querySelector('link[rel="canonical"]')
    if (link) link.href = canonical
    document.querySelectorAll('script[type="application/ld+json"]').forEach((item) => item.remove())
    schemas.forEach((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'; script.dataset.directJsonld = 'true'
      script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c')
      document.head.appendChild(script)
    })
  }, [description, noindex, path, schemas, title])
}

function DirectNav() {
  return <nav className="direct-nav" aria-label="Principal"><a href="/">Ouvir rádios</a><a href="/sao-paulo/sao-paulo">São Paulo</a><a href="/rio-de-janeiro/rio-de-janeiro">Rio de Janeiro</a><a href="/minas-gerais/belo-horizonte">Belo Horizonte</a><a href="/genero/noticias">Notícias</a><a href="/guia/como-ouvir-radio-online">Guia</a></nav>
}

function HomeCallout({ canInstall, installed, onInstall }) {
  return (
    <div className="direct-callout">
      <span className="direct-callout__main">
        <span className="direct-callout__icon" aria-hidden="true">📻</span>
        <span className="direct-callout__text">
          <strong>Catálogo completo na página inicial</strong>
          Ouça todas as rádios FM disponíveis, filtre por gênero e salve suas favoritas
        </span>
      </span>
      <span className="direct-callout__actions">
        <a className="direct-callout__cta" href="/">Ver todas as rádios →</a>
        <InstallAppButton canInstall={canInstall} installed={installed} onInstall={onInstall} />
      </span>
    </div>
  )
}

function Breadcrumb({ items }) {
  return <nav className="direct-breadcrumb" aria-label="Navegação estrutural">{items.map((item, index) => (
    <span key={item.href}>
      {index > 0 && <span aria-hidden="true">/</span>}
      {index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <a href={item.href}>{item.label}</a>}
    </span>
  ))}</nav>
}

function breadcrumbSchema(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: `${SITE}${item.href}` })) }
}

function DirectRadioGrid({ radios, player, favorites, hiddenState }) {
  return (
    <div className="radio-grid">
      {radios.map((radio) => (
        <RadioCard
          key={radio.id}
          radio={radio}
          isActive={player.currentRadio?.id === radio.id}
          isPlaying={player.isPlaying}
          isLoading={player.isLoading}
          isFavorite={favorites.isFavorite(radio.id)}
          isHidden={hiddenState.isHidden(radio.id)}
          showHidden={false}
          onPlay={player.play}
          onToggleFavorite={favorites.toggleFavorite}
          onHide={() => hiddenState.hideRadio(radio.id)}
          onUnhide={() => hiddenState.unhideRadio(radio.id)}
        />
      ))}
    </div>
  )
}

function Player({ player, sleep, favorites }) {
  const isFavorite = player.currentRadio ? favorites.isFavorite(player.currentRadio.id) : false
  return <PlayerBar radio={player.currentRadio} isPlaying={player.isPlaying} isLoading={player.isLoading} volume={player.volume} error={player.error} isFavorite={isFavorite} hasPrevious={false} hasNext={false} onPrevious={() => {}} onNext={() => {}} onTogglePlay={player.togglePlay} onStop={player.stop} onVolumeChange={player.setVolume} onToggleFavorite={() => player.currentRadio && favorites.toggleFavorite(player.currentRadio.id)} sleepMinutes={sleep.minutes} onSleepMinutesChange={sleep.setMinutes} sleepRemainingSeconds={sleep.remainingSeconds} isSleepActive={sleep.isActive} onSleepStart={sleep.startSleep} onSleepCancel={sleep.cancelSleep} />
}

function RadioPage({ radio, player, favorites, hiddenState }) {
  const path = `/${radio.path}`
  const description = getRadioMetaDescription(radio)
  const citySlug = radio.city ? slugify(radio.city) : null
  const stateSlug = radio.state ? slugify(radio.state) : null
  const hasCityPage = Boolean(citySlug && getIndexableCities().some((city) => city.slug === citySlug))
  const hasStatePage = Boolean(stateSlug && getIndexableStates().some((state) => state.slug === stateSlug))
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
  const schemas = [
    ORGANIZATION_SCHEMA,
    WEBSITE_SCHEMA,
    { '@context': 'https://schema.org', '@type': 'RadioStation', name: radio.name, url: `${SITE}${path}`, sameAs: radio.websiteUrl, logo: radio.logoUrl?.startsWith('http') ? radio.logoUrl : radio.logoUrl ? `${SITE}${radio.logoUrl.split('?')[0]}` : undefined, address: radio.city ? { '@type': 'PostalAddress', addressLocality: radio.city, addressRegion: radio.state, addressCountry: radio.country } : undefined },
    breadcrumbSchema(breadcrumbItems),
  ]
  usePageSeo({ title: getRadioPageTitle(radio), description, path, noindex: false, schemas })
  const related = getRelatedRadios(radio)
  const frequencyText = describeFrequency(radio)
  const locationText = describeLocation(radio)
  const genreText = describeGenre(radio)
  return <main className="direct-main"><Breadcrumb items={breadcrumbItems} /><article className="direct-radio-hero"><RadioIcon radio={radio} size="lg" eager /><div><p className="direct-kicker">Ouça ao vivo</p><h1>{radio.name} ao vivo</h1><p>{[radio.frequency, radio.city, radio.state, radio.country].filter(Boolean).join(' · ')}</p></div><button type="button" onClick={() => player.play(radio)}>{player.currentRadio?.id === radio.id && player.isPlaying ? 'Pausar' : 'Ouvir agora'}</button></article><section className="direct-copy"><div><h2>Informações da estação</h2><p>{description}</p><dl>{radio.frequency && <><dt>Frequência</dt><dd>{radio.frequency}</dd></>}{radio.band && <><dt>Banda</dt><dd>{radio.band}</dd></>}{radio.city && <><dt>Localidade</dt><dd>{[radio.city, radio.state, radio.country].filter(Boolean).join(', ')}</dd></>}{radio.genreLabels.length > 0 && <><dt>Categoria</dt><dd>{radio.genreLabels.join(', ')}</dd></>}</dl></div><aside><h2>Fonte e transparência</h2><p>Os dados são organizados a partir da fonte local do catálogo. A reprodução depende do stream público da emissora ou do distribuidor.</p><p>Última revisão estrutural: <time dateTime="2026-07-19">{CATALOG_REVIEWED_AT}</time>.</p>{radio.websiteUrl && <a href={radio.websiteUrl} target="_blank" rel="noopener noreferrer">Consultar site oficial</a>}{hasCityPage && stateSlug && <a href={`/${stateSlug}/${citySlug}`}>{cityLinkLabel}</a>}{hasStatePage && <a href={`/${stateSlug}`}>{stateLinkLabel}</a>}<a href="https://wa.me/5511974004755" target="_blank" rel="noopener noreferrer">Solicitar correção</a></aside></section><section className="direct-article"><h2>Frequência da {radio.name}</h2>{frequencyText ? <p>{frequencyText}</p> : <p>Frequência não informada no momento.</p>}<h2>Onde fica a {radio.name}?</h2>{locationText ? <p>{locationText}</p> : <p>Localização não informada no momento.</p>}<h2>Qual o estilo da {radio.name}?</h2>{genreText ? <p>{genreText}</p> : <p>Estilo não classificado no momento.</p>}<h2>Como ouvir a {radio.name} online?</h2><p>{describeHowToListen(radio)} Veja o <a href="/guia/como-ouvir-radio-online">guia completo de como ouvir rádio online</a> para mais detalhes.</p></section>{related.length > 0 && <section><h2>Rádios relacionadas</h2><DirectRadioGrid radios={related} player={player} favorites={favorites} hiddenState={hiddenState} /></section>}</main>
}

const GENRE_ROUTES = {
  '/genero/pop': { name: 'Pop', label: 'gênero', genreKey: 'pop', radios: () => getRadiosByGenre('pop') },
  '/genero/noticias': { name: GENRE_LABELS.news, label: 'gênero', genreKey: 'news', radios: () => getRadiosByGenre('news') },
  '/genero/rock': { name: 'Rock', label: 'gênero', genreKey: 'rock', radios: () => getRadiosByGenre('rock') },
  '/genero/sertanejo': { name: GENRE_LABELS.sertanejo, label: 'gênero', genreKey: 'sertanejo', radios: () => getRadiosByGenre('sertanejo') },
  '/genero/popular': { name: GENRE_LABELS.popular, label: 'gênero', genreKey: 'popular', radios: () => getRadiosByGenre('popular') },
  '/genero/adulto-flashback': { name: GENRE_LABELS.adulto, label: 'gênero', genreKey: 'adulto', radios: () => getRadiosByGenre('adulto') },
  '/genero/gospel': { name: GENRE_LABELS.gospel, label: 'gênero', genreKey: 'gospel', radios: () => getRadiosByGenre('gospel') },
  '/genero/internacional': { name: GENRE_LABELS.international, label: 'gênero', genreKey: 'international', radios: () => getRadiosByGenre('international') },
}

function getCityUnderStateRouteConfig(path) {
  const parts = path.slice(1).split('/')
  if (parts.length !== 2) return null
  const [stateSlug, citySlug] = parts
  const state = getIndexableStates().find((item) => item.slug === stateSlug)
  if (!state) return null
  const cityRadios = getRadiosByCity(citySlug, stateSlug)
  if (!isIndexableListing(cityRadios)) return null
  const cityName = cityRadios[0]?.city
  if (!cityName) return null
  return { name: cityName, label: 'cidade', state: state.name, radios: () => cityRadios }
}

function getStateRouteConfig(path) {
  const slug = path.slice(1)
  if (!slug || slug.includes('/')) return null
  const state = getIndexableStates().find((item) => item.slug === slug)
  if (!state) return null
  return { name: state.name, label: 'estado', radios: () => state.radios }
}

function describeCityInsight(radios) {
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

function TaxonomyPage({ config, path, player, favorites, hiddenState }) {
  const radios = config.radios()
  const isCity = config.label === 'cidade'
  const isState = config.label === 'estado'
  const article = isState ? getStateArticle(config.name) : 'de'
  const place = isCity && config.state ? `${config.name}, ${config.state}` : config.name
  const title = isCity
    ? `Rádios de ${config.name} ao vivo: ouça grátis | Rádio FM Online`
    : isState
      ? `Rádios ${article} ${config.name} ao vivo | Rádio FM Online`
      : `Rádios de ${config.name} ao vivo | Rádio FM Online`
  const description = isCity
    ? `Ouça ${radios.length} rádios FM de ${place} ao vivo e grátis. Compare frequências, gêneros e emissoras locais para ouvir rádio online agora.`
    : isState
      ? `Ouça ${radios.length} rádios FM ${article} ${config.name} ao vivo e grátis. Compare frequências, gêneros e cidades para ouvir rádio online agora.`
      : `Explore ${radios.length} rádios de ${config.name}, consulte frequências e localidades e ouça as estações ao vivo.`
  const citySlugForState = isCity && config.state ? slugify(config.state) : null
  const hasParentStatePage = Boolean(citySlugForState && getIndexableStates().some((state) => state.slug === citySlugForState))
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    hasParentStatePage && { label: config.state, href: `/${citySlugForState}` },
    { label: isState ? `Rádios ${article} ${config.name}` : `Rádios de ${config.name}`, href: path },
  ].filter(Boolean)
  const schemas = [
    ORGANIZATION_SCHEMA,
    WEBSITE_SCHEMA,
    { '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: radios.length, itemListElement: radios.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/${radio.path}` })) },
    breadcrumbSchema(breadcrumbItems),
  ]
  usePageSeo({ title, description, path, schemas })
  const insight = (isCity || isState) ? describeCityInsight(radios) : null
  const insightSentence = insight && (insight.rangeText || insight.genreText)
    ? [
        insight.rangeText && `O dial cadastrado ${isState ? `${article} ${config.name}` : `para ${config.name}`} vai de ${insight.rangeText}`,
        insight.genreText && `com destaque para emissoras de ${insight.genreText}`,
      ].filter(Boolean).join(', ') + '.'
    : null
  const kicker = isCity ? `Rádio online em ${config.name}` : isState ? `Rádio online ${article} ${config.name}` : `Catálogo por ${config.label}`
  const h1 = isCity ? `Rádios de ${config.name} ao vivo — ouça FM grátis` : isState ? `Rádios ${article} ${config.name} ao vivo` : `Rádios de ${config.name} ao vivo`
  const howToHeading = isCity ? `Como ouvir rádio em ${config.name}` : isState ? `Como ouvir rádio ${article} ${config.name}` : 'Explore o catálogo'
  const howToText = isCity
    ? `Escolha uma emissora de ${config.name} na lista acima e toque em ouvir para começar a transmissão ao vivo pelo navegador, sem baixar aplicativos.`
    : isState
      ? `Escolha uma emissora ${article} ${config.name} na lista acima e toque em ouvir para começar a transmissão ao vivo pelo navegador, sem baixar aplicativos.`
      : 'Abra a página de cada estação para consultar dados, fonte oficial e rádios relacionadas.'
  const isGenre = config.label === 'gênero'
  const genreDescription = isGenre ? GENRE_DESCRIPTIONS[config.genreKey] : null
  const locationBreakdown = (isState || isGenre) ? getLocationBreakdown(radios) : []
  const indexableCitySlugs = (isState || isGenre) ? new Set(getIndexableCities().map((city) => city.slug)) : null
  const locationHeading = isState ? `Cidades ${article} ${config.name}` : `${config.name} por cidade`
  return <main className="direct-main"><Breadcrumb items={breadcrumbItems} /><header className="direct-intro"><p className="direct-kicker">{kicker}</p><h1>{h1}</h1><p>{description} A ordem não representa audiência nem popularidade.</p></header><DirectRadioGrid radios={radios} player={player} favorites={favorites} hiddenState={hiddenState} /><section className="direct-copy"><div><h2>{howToHeading}</h2><p>{howToText}</p>{insightSentence && <p>{insightSentence}</p>}</div></section>{locationBreakdown.length > 0 && <section className="direct-article"><h2>{locationHeading}</h2>{genreDescription && <p>{genreDescription}</p>}<ul>{locationBreakdown.map((entry) => {
    const hasPage = entry.citySlug && entry.stateSlug && indexableCitySlugs.has(entry.citySlug)
    const label = `${entry.city}${isGenre && entry.state ? ` (${entry.state})` : ''} — ${entry.count} rádio${entry.count !== 1 ? 's' : ''}`
    return <li key={`${entry.city}-${entry.state}`}>{hasPage ? <a href={`/${entry.stateSlug}/${entry.citySlug}`}>{label}</a> : label}</li>
  })}</ul></section>}</main>
}

function GuidePage() {
  const breadcrumbItems = [{ label: 'Início', href: '/' }, { label: 'Como ouvir rádio online', href: '/guia/como-ouvir-radio-online' }]
  const allFaqItems = [...faqItems, ...guideFaqItems]
  const schemas = [
    ORGANIZATION_SCHEMA,
    WEBSITE_SCHEMA,
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: allFaqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) },
    breadcrumbSchema(breadcrumbItems),
  ]
  usePageSeo({ title: 'Como ouvir rádio online grátis | Rádio FM Online', description: 'Guia completo sobre como ouvir rádio online grátis: pelo celular, computador ou tablet, sem aplicativo, consumo de dados e diferenças em relação ao FM tradicional.', path: '/guia/como-ouvir-radio-online', schemas })
  return (
    <main className="direct-main">
      <div className="direct-article-page">
      <Breadcrumb items={breadcrumbItems} />
      <article className="direct-article">
        <p className="direct-kicker">Guia prático</p>
        <h1>Como ouvir rádio online grátis</h1>
        <p className="direct-lead">Ouvir rádio online é uma das formas mais simples de acompanhar músicas, notícias, esportes, entretenimento e a programação de emissoras de diferentes cidades do Brasil. Hoje, você não precisa necessariamente de um aparelho de rádio nem instalar um aplicativo: em muitos casos, basta abrir o navegador, escolher uma emissora e iniciar a transmissão.</p>
        <p>No Rádio FM Online, você pode navegar por estados, cidades e gêneros para encontrar uma estação e ouvir a programação disponível pela internet.</p>

        <h2>Como ouvir rádio online pelo celular</h2>
        <p>Para ouvir rádio online pelo celular, você pode usar o próprio navegador do aparelho.</p>
        <p>O processo é simples:</p>
        <ol>
          <li>Acesse o Rádio FM Online pelo navegador.</li>
          <li>Escolha uma rádio, estado, cidade ou gênero.</li>
          <li>Abra a página da emissora desejada.</li>
          <li>Toque no botão de reprodução do player.</li>
          <li>Mantenha a conexão com a internet enquanto estiver ouvindo.</li>
        </ol>
        <p>Isso funciona em celulares Android e iPhone, desde que o navegador seja compatível com a transmissão disponibilizada pela emissora.</p>
        <p>Não é necessário instalar um aplicativo específico para começar a ouvir pelo site.</p>

        <h2>Como ouvir rádio online pelo computador</h2>
        <p>No computador, o funcionamento é semelhante.</p>
        <p>Acesse o Rádio FM Online usando um navegador como Chrome, Edge, Firefox ou Safari, encontre a estação desejada e utilize o player presente na página da rádio.</p>
        <p>Você pode procurar uma emissora pelo nome ou navegar pelas páginas de estados, cidades e gêneros.</p>
        <p>Por exemplo, é possível encontrar rádios de <a href="/sao-paulo/sao-paulo">São Paulo</a>, <a href="/parana/curitiba">Curitiba</a>, <a href="/rio-de-janeiro/rio-de-janeiro">Rio de Janeiro</a>, <a href="/minas-gerais/belo-horizonte">Belo Horizonte</a> e outras localidades diretamente pelo catálogo.</p>

        <h2>Preciso instalar algum aplicativo para ouvir rádio online?</h2>
        <p>Não necessariamente.</p>
        <p>Quando uma rádio disponibiliza sua transmissão pela internet e o player é compatível com seu navegador, você pode ouvir diretamente pelo site.</p>
        <p>Aplicativos podem oferecer recursos adicionais, mas não são obrigatórios para simplesmente reproduzir uma transmissão online.</p>
        <p>Essa é uma das vantagens da rádio pela internet: ela pode ser acessada em diferentes dispositivos sem depender de um receptor FM tradicional.</p>

        <h2>Rádio online é grátis?</h2>
        <p>O acesso às rádios disponíveis no Rádio FM Online é gratuito.</p>
        <p>Entretanto, ouvir uma transmissão utiliza sua conexão com a internet. Dependendo do seu plano de dados móveis, sua operadora pode cobrar pelo tráfego utilizado.</p>
        <p>Em uma conexão Wi-Fi residencial, normalmente o consumo faz parte do plano contratado com seu provedor de internet.</p>

        <h2>Rádio online gasta internet?</h2>
        <p>Sim.</p>
        <p>Como o áudio é transmitido continuamente pela internet, ouvir rádio online consome dados.</p>
        <p>O consumo depende principalmente da qualidade do áudio utilizada pela emissora.</p>
        <p>Como referência aproximada:</p>
        <ul>
          <li>transmissão de 64 kbps pode consumir cerca de 29 MB por hora;</li>
          <li>transmissão de 96 kbps pode consumir cerca de 43 MB por hora;</li>
          <li>transmissão de 128 kbps pode consumir cerca de 58 MB por hora;</li>
          <li>transmissão de 192 kbps pode consumir cerca de 86 MB por hora.</li>
        </ul>
        <p>Esses valores são aproximados e podem variar de acordo com o formato de áudio e a transmissão da própria rádio.</p>
        <p>Se você utiliza dados móveis e pretende ouvir por várias horas, vale acompanhar o consumo do seu plano.</p>

        <h2>Qual é a diferença entre rádio FM e rádio online?</h2>
        <p>A principal diferença está na forma como o áudio chega até você.</p>
        <p>Na rádio FM tradicional, a emissora transmite um sinal por ondas de rádio. Para recebê-lo, normalmente é necessário estar dentro da área de cobertura da estação e utilizar um aparelho compatível com FM.</p>
        <p>Na rádio online, o áudio é transmitido pela internet.</p>
        <p>Isso permite, por exemplo, ouvir uma rádio de São Paulo mesmo estando em outro estado ou até em outro país, desde que a transmissão esteja disponível online.</p>
        <p>A programação pode ser a mesma da frequência FM tradicional, embora algumas emissoras também tenham canais exclusivos para a internet.</p>

        <h2>Posso ouvir uma rádio de outro estado?</h2>
        <p>Sim.</p>
        <p>Essa é justamente uma das principais vantagens da transmissão pela internet.</p>
        <p>Uma rádio FM possui uma área física de cobertura limitada pelo sinal da emissora. Pela internet, essa limitação geográfica deixa de ser o principal obstáculo.</p>
        <p>Você pode estar em <a href="/parana/curitiba">Curitiba</a> e ouvir uma rádio de <a href="/sao-paulo/sao-paulo">São Paulo</a>, ou estar em outro país e acompanhar uma emissora brasileira.</p>
        <p>No Rádio FM Online, as rádios são organizadas por estados e cidades para facilitar essa busca.</p>

        <h2>Como encontrar rádios de um estado</h2>
        <p>Se você não procura uma emissora específica, uma opção é navegar pelo estado.</p>
        <p>Por exemplo, você pode acessar a página de <a href="/sao-paulo">rádios de São Paulo</a> para encontrar emissoras cadastradas em diferentes cidades do estado.</p>
        <p>O mesmo vale para <a href="/parana">Paraná</a>, <a href="/minas-gerais">Minas Gerais</a>, <a href="/rio-de-janeiro">Rio de Janeiro</a>, <a href="/bahia">Bahia</a> e os demais estados disponíveis no catálogo.</p>
        <p>Essa organização é útil principalmente para quem deseja conhecer rádios locais ou encontrar uma estação pela cidade de origem.</p>

        <h2>Como encontrar rádios de uma cidade</h2>
        <p>As páginas de cidade permitem filtrar ainda mais o catálogo.</p>
        <p>Em vez de visualizar todas as emissoras de um estado, você pode consultar apenas as estações cadastradas em determinada cidade.</p>
        <p>Isso facilita buscas como:</p>
        <ul>
          <li><a href="/sao-paulo/sao-paulo">rádios de São Paulo</a>;</li>
          <li><a href="/parana/curitiba">rádios de Curitiba</a>;</li>
          <li><a href="/rio-de-janeiro/rio-de-janeiro">rádios do Rio de Janeiro</a>;</li>
          <li><a href="/minas-gerais/belo-horizonte">rádios de Belo Horizonte</a>;</li>
          <li><a href="/distrito-federal/brasilia">rádios de Brasília</a>;</li>
          <li><a href="/bahia/salvador">rádios de Salvador</a>.</li>
        </ul>
        <p>Nas páginas de cidade também é possível consultar as frequências informadas para cada emissora.</p>

        <h2>Como encontrar uma rádio pela frequência</h2>
        <p>Se você conhece a frequência da estação, ela pode ajudar a identificar a rádio correta.</p>
        <p>Uma emissora pode ser apresentada, por exemplo, como <strong>89.1 FM</strong> ou <strong>100.9 FM</strong>.</p>
        <p>Nas páginas das estações cadastradas, o Rádio FM Online informa a frequência disponível, a cidade, o estado e outras informações sobre a rádio.</p>
        <p>É importante lembrar que frequências podem se repetir em cidades diferentes. Por isso, o ideal é considerar também a localização da emissora.</p>

        <h2>Como encontrar rádios pelo gênero musical</h2>
        <p>Além da localização, você pode explorar o catálogo por gênero ou tipo de programação.</p>
        <p>Isso é útil quando você quer ouvir determinado estilo, mas não tem uma rádio específica em mente.</p>
        <p>Entre as categorias disponíveis podem aparecer rádios de:</p>
        <ul>
          <li><a href="/genero/rock">Rock</a>;</li>
          <li><a href="/genero/sertanejo">Sertanejo</a>;</li>
          <li><a href="/genero/pop">Pop</a>;</li>
          <li><a href="/genero/noticias">Notícias</a>;</li>
          <li><a href="/genero/gospel">Gospel</a>;</li>
          <li>MPB e música brasileira;</li>
          <li><a href="/genero/popular">programação popular ou eclética</a>;</li>
          <li>outros formatos disponíveis no catálogo.</li>
        </ul>
        <p>Assim, em vez de pesquisar uma estação pelo nome, você pode descobrir rádios com programação semelhante ao que gosta de ouvir.</p>

        <h2>Por que uma rádio pode ficar fora do ar?</h2>
        <p>Uma rádio online pode ficar temporariamente indisponível por diferentes motivos.</p>
        <p>O Rádio FM Online organiza e disponibiliza o acesso às transmissões, mas o sinal de áudio depende da infraestrutura utilizada pela própria emissora ou pelo provedor do streaming.</p>
        <p>Entre os motivos mais comuns estão:</p>
        <ul>
          <li>manutenção no servidor da rádio;</li>
          <li>alteração no endereço da transmissão;</li>
          <li>problema técnico na emissora;</li>
          <li>limite temporário de conexões;</li>
          <li>indisponibilidade do serviço de streaming;</li>
          <li>mudança na forma como a rádio distribui seu áudio.</li>
        </ul>
        <p>Se uma estação não estiver reproduzindo, isso não significa necessariamente que ela encerrou suas atividades. O problema pode ser temporário.</p>

        <h2>O player não iniciou. O que posso fazer?</h2>
        <p>Se o player não funcionar, algumas verificações simples podem ajudar:</p>
        <ol>
          <li>Confirme que sua internet está funcionando.</li>
          <li>Atualize a página.</li>
          <li>Verifique se o navegador permite reprodução de áudio.</li>
          <li>Tente abrir a rádio novamente.</li>
          <li>Teste outro navegador, se necessário.</li>
          <li>Verifique se outras rádios do site estão funcionando.</li>
        </ol>
        <p>Se outras estações reproduzem normalmente e apenas uma rádio apresenta problema, é possível que a transmissão daquela emissora esteja temporariamente indisponível.</p>

        <h2>Posso ouvir rádio online sem internet?</h2>
        <p>Não.</p>
        <p>A transmissão online depende de uma conexão ativa com a internet.</p>
        <p>Se você estiver completamente sem conexão, o player não conseguirá receber o áudio da emissora.</p>
        <p>Isso é diferente de um aparelho com receptor FM, que consegue captar uma estação local sem utilizar internet.</p>

        <h2>Posso ouvir rádio online usando Wi-Fi?</h2>
        <p>Sim.</p>
        <p>Aliás, para quem pretende ouvir por longos períodos, utilizar Wi-Fi pode ser mais conveniente do que consumir o pacote de dados móveis.</p>
        <p>Basta que o aparelho esteja conectado à internet e que a transmissão da rádio esteja disponível.</p>

        <h2>Rádio online funciona no tablet?</h2>
        <p>Sim.</p>
        <p>Tablets funcionam de maneira semelhante aos celulares.</p>
        <p>Você pode abrir o navegador, acessar o Rádio FM Online e utilizar o player presente na página da estação.</p>

        <h2>Posso ouvir rádio online em uma Smart TV?</h2>
        <p>Depende do modelo da televisão e dos recursos disponíveis.</p>
        <p>Algumas Smart TVs possuem navegador de internet e conseguem reproduzir determinados formatos de áudio diretamente.</p>
        <p>Outra possibilidade é transmitir o conteúdo do celular ou computador para a televisão utilizando recursos compatíveis com o aparelho.</p>
        <p>Como existem muitas marcas e sistemas diferentes, a compatibilidade pode variar.</p>

        <h2>Posso deixar a rádio tocando em segundo plano?</h2>
        <p>Isso depende do navegador, sistema operacional e configurações do dispositivo.</p>
        <p>Em alguns aparelhos, o áudio continua tocando enquanto você utiliza outras funções. Em outros, o sistema pode interromper a reprodução quando o navegador é fechado ou colocado em segundo plano.</p>
        <p>Também é possível que configurações de economia de bateria interfiram na reprodução contínua.</p>

        <h2>Rádio online tem atraso em relação ao FM?</h2>
        <p>Pode ter.</p>
        <p>A transmissão pela internet passa por processos de codificação, envio ao servidor, distribuição e reprodução no aparelho do usuário.</p>
        <p>Por isso, é normal existir alguns segundos de diferença entre o áudio transmitido pelo FM tradicional e o áudio recebido pela internet.</p>
        <p>Em transmissões esportivas ao vivo, esse atraso pode ficar mais perceptível.</p>

        <h2>Posso ouvir jogos de futebol pelo rádio online?</h2>
        <p>Depende da programação e dos direitos de transmissão de cada emissora.</p>
        <p>Algumas rádios de notícias e esportes transmitem partidas, comentários, programas esportivos e cobertura de campeonatos.</p>
        <p>Se você procura esse tipo de conteúdo, vale explorar principalmente rádios classificadas como <a href="/genero/noticias">notícias</a>, esportes ou emissoras conhecidas por sua cobertura esportiva.</p>

        <h2>Como escolher uma rádio para ouvir?</h2>
        <p>Se você já conhece o nome da emissora, a maneira mais rápida é abrir diretamente sua página.</p>
        <p>Se ainda não sabe qual rádio escolher, você pode navegar por:</p>
        <ul>
          <li>estado;</li>
          <li>cidade;</li>
          <li>gênero;</li>
          <li>frequência;</li>
          <li>rádios relacionadas.</li>
        </ul>
        <p>As páginas individuais também apresentam sugestões de outras emissoras que podem ajudar você a encontrar alternativas semelhantes.</p>

        <h2>Ouça rádios de diferentes regiões do Brasil</h2>
        <p>A internet permite acompanhar emissoras que antes ficavam limitadas principalmente à sua região de transmissão.</p>
        <p>Você pode explorar rádios de diferentes estados, descobrir estações locais de outras cidades e acompanhar programas que não estão disponíveis na sua região pelo FM tradicional.</p>
        <p>Comece escolhendo um <a href="/parana">estado</a>, uma <a href="/parana/curitiba">cidade</a> ou um <a href="/genero/pop">gênero</a> no catálogo do Rádio FM Online e abra a página da estação que deseja ouvir.</p>

        <h2>Perguntas frequentes sobre rádio online</h2>
        {guideFaqItems.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}

        <h2>Dúvidas frequentes sobre o site</h2>
        {faqItems.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
      </article>
      </div>
    </main>
  )
}

function RoadmapPage() {
  const allRadios = getAllRadios()
  const rows = BRAZIL_STATES.map((state) => {
    const active = allRadios.filter((radio) => radio.state === state)
    const failing = active.filter((radio) => STREAM_STATUS[radio.id] && !STREAM_STATUS[radio.id].ok)
    return { state, active, gaps: ROADMAP_GAPS[state] || [], failing }
  })
  const coveredCount = rows.filter((row) => row.active.length > 0).length
  const totalGaps = rows.reduce((sum, row) => sum + row.gaps.length, 0)
  const totalFailing = rows.reduce((sum, row) => sum + row.failing.length, 0)
  const checkedAtLabel = new Date(STREAM_STATUS_CHECKED_AT).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const description = `Panorama de cobertura do catálogo por estado: ${coveredCount} de ${BRAZIL_STATES.length} estados brasileiros já têm rádios ativas, e ${totalGaps} estações mapeadas ainda precisam ser incluídas.`
  usePageSeo({ title: 'Roadmap de rádios por estado | Rádio FM Online', description, path: '/roadmap', noindex: true })
  return (
    <main className="direct-main">
      <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Roadmap de cobertura', href: '/roadmap' }]} />
      <header className="direct-intro">
        <p className="direct-kicker">Expansão do catálogo</p>
        <h1>Roadmap de rádios por estado</h1>
        <p>{description} A ordem segue a lista oficial de unidades da federação. Rádios "a incluir" foram levantadas em fontes externas e ainda não têm stream cadastrado no site.</p>
        <p>Última checagem automática dos streams: {checkedAtLabel} · {totalFailing > 0 ? `${totalFailing} rádio${totalFailing !== 1 ? 's' : ''} ativa${totalFailing !== 1 ? 's' : ''} com erro no teste mais recente.` : 'nenhum erro encontrado no teste mais recente.'}</p>
      </header>
      <section className="roadmap-overview">
        <table>
          <thead>
            <tr><th>Estado</th><th>Rádios ativas</th><th>A incluir</th><th>Com erro no teste</th></tr>
          </thead>
          <tbody>
            {rows.map(({ state, active, gaps, failing }) => (
              <tr key={state}>
                <td><a href={`#estado-${slugify(state)}`}>{state}</a></td>
                <td>{active.length}</td>
                <td>{gaps.length}</td>
                <td>{failing.length > 0 ? failing.length : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {rows.map(({ state, active, gaps }) => (
        <section key={state} id={`estado-${slugify(state)}`} className="roadmap-state">
          <h2>{state}</h2>
          <table className="roadmap-table">
            <thead>
              <tr><th>Rádio</th><th>Cidade</th><th>Frequência</th><th>Ativo no site</th><th>Erro no teste</th></tr>
            </thead>
            <tbody>
              {active.map((radio) => {
                const status = STREAM_STATUS[radio.id]
                const hasError = status && !status.ok
                return (
                  <tr key={radio.id}>
                    <td><a href={`/${radio.path}`}>{radio.name}</a></td>
                    <td>{radio.city || '—'}</td>
                    <td>{radio.frequency || '—'}</td>
                    <td className="roadmap-status roadmap-status--active">Sim</td>
                    <td className={hasError ? 'roadmap-status roadmap-status--error' : 'roadmap-status roadmap-status--ok'}>
                      {hasError ? status.error : '—'}
                    </td>
                  </tr>
                )
              })}
              {gaps.map((gap) => (
                <tr key={gap.name}>
                  <td>{gap.name}</td>
                  <td>{gap.city}</td>
                  <td>{gap.frequency}</td>
                  <td className="roadmap-status roadmap-status--pending">Não</td>
                  <td className="roadmap-status">—</td>
                </tr>
              ))}
              {active.length === 0 && gaps.length === 0 && (
                <tr><td colSpan={5}>Nenhuma rádio mapeada ainda.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  )
}

function NotFoundPage() {
  useEffect(() => {
    window.location.replace('/')
  }, [])
  return null
}

export default function DirectPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const player = useAudioPlayer()
  const sleep = useSleepTimer({ onExpire: player.pause })
  const { theme, toggleTheme } = useTheme()
  const { canInstall, installed, install } = usePwaInstall()
  const favorites = useFavorites()
  const hiddenState = useHiddenRadios()
  useEffect(() => {
    document.getElementById('app-loader')?.classList.add('app-loader--done')
  }, [])
  const cityUnderStateRouteConfig = getCityUnderStateRouteConfig(path)
  const stateRouteConfig = getStateRouteConfig(path)
  const radioForPath = getRadioByPath(decodeURIComponent(path).slice(1))
  let content
  if (GENRE_ROUTES[path]) content = <TaxonomyPage config={GENRE_ROUTES[path]} path={path} player={player} favorites={favorites} hiddenState={hiddenState} />
  else if (cityUnderStateRouteConfig) content = <TaxonomyPage config={cityUnderStateRouteConfig} path={path} player={player} favorites={favorites} hiddenState={hiddenState} />
  else if (stateRouteConfig) content = <TaxonomyPage config={stateRouteConfig} path={path} player={player} favorites={favorites} hiddenState={hiddenState} />
  else if (path === '/guia/como-ouvir-radio-online') content = <GuidePage />
  else if (path === '/roadmap') content = <RoadmapPage />
  else if (radioForPath) content = <RadioPage radio={radioForPath} player={player} favorites={favorites} hiddenState={hiddenState} />
  else content = <NotFoundPage />
  return <div className="direct-app"><a className="direct-skip" href="#conteudo">Ir para o conteúdo</a><div className="direct-header-wrap"><Header theme={theme} onToggleTheme={toggleTheme} canInstall={canInstall} installed={installed} onInstall={install} /><DirectNav /><HomeCallout canInstall={canInstall} installed={installed} onInstall={install} /></div><AdUnit slot={AD_SLOTS.top} format="horizontal" className="ad-unit--top" /><div id="conteudo">{content}</div><AdUnit slot={AD_SLOTS.bottom} format="horizontal" className="ad-unit--bottom" /><Footer /><Player player={player} sleep={sleep} favorites={favorites} /></div>
}
