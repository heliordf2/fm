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
import { CATALOG_REVIEWED_AT, GENRE_LABELS, getAllRadios, getIndexableCities, getRadioBySlug, getRadioMetaDescription, getRadiosByCity, getRadiosByGenre, getRelatedRadios, slugify } from '../data/radioRepository.js'
import { faqItems } from '../data/faq.js'
import { BRAZIL_STATES, ROADMAP_GAPS } from '../data/roadmap.js'
import { STREAM_STATUS, STREAM_STATUS_CHECKED_AT } from '../data/streamStatus.js'
import { AD_SLOTS } from '../config/adsense.js'
import '../styles/shared.css'
import './DirectPage.css'

const SITE = 'https://radiofmonline.com.br'

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
    document.querySelectorAll('script[data-direct-jsonld]').forEach((item) => item.remove())
    schemas.forEach((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'; script.dataset.directJsonld = 'true'
      script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c')
      document.head.appendChild(script)
    })
  }, [description, noindex, path, schemas, title])
}

function DirectNav() {
  return <nav className="direct-nav" aria-label="Principal"><a href="/">Ouvir rádios</a><a href="/radios/sao-paulo">São Paulo</a><a href="/radios/rio-de-janeiro">Rio de Janeiro</a><a href="/radios/belo-horizonte">Belo Horizonte</a><a href="/radios/genero/noticias">Notícias</a><a href="/guia/como-ouvir-radio-online">Guia</a></nav>
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

function Breadcrumb({ current }) {
  return <nav className="direct-breadcrumb" aria-label="Navegação estrutural"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">{current}</span></nav>
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

function RadioPage({ slug, player, favorites, hiddenState }) {
  const radio = getRadioBySlug(slug)
  const path = `/radio/${slug}`
  const description = radio ? getRadioMetaDescription(radio) : 'A estação solicitada não existe no catálogo.'
  const place = radio ? [radio.city, radio.state].filter(Boolean).join(', ') : ''
  const schemas = radio ? [{ '@context': 'https://schema.org', '@type': 'RadioStation', name: radio.name, url: `${SITE}${path}`, sameAs: radio.websiteUrl, address: radio.city ? { '@type': 'PostalAddress', addressLocality: radio.city, addressRegion: radio.state, addressCountry: radio.country } : undefined }] : []
  usePageSeo({ title: radio ? `Ouvir ${radio.name} ao vivo${place ? ` — ${place}` : ''} | Rádio FM Online` : 'Rádio não encontrada | Rádio FM Online', description, path, noindex: !radio, schemas })
  if (!radio) return <main className="direct-main"><Breadcrumb current="Página não encontrada" /><h1>Rádio não encontrada</h1><p>Essa estação não existe no catálogo atual.</p><a href="/">Voltar ao catálogo</a></main>
  const related = getRelatedRadios(radio)
  return <main className="direct-main"><Breadcrumb current={radio.name} /><article className="direct-radio-hero"><RadioIcon radio={radio} size="lg" eager /><div><p className="direct-kicker">Ouça ao vivo</p><h1>{radio.name}</h1><p>{[radio.frequency, radio.city, radio.state, radio.country].filter(Boolean).join(' · ')}</p></div><button type="button" onClick={() => player.play(radio)}>{player.currentRadio?.id === radio.id && player.isPlaying ? 'Pausar' : 'Ouvir agora'}</button></article><section className="direct-copy"><div><h2>Informações da estação</h2><p>{description}</p><dl>{radio.frequency && <><dt>Frequência</dt><dd>{radio.frequency}</dd></>}{radio.band && <><dt>Banda</dt><dd>{radio.band}</dd></>}{radio.city && <><dt>Localidade</dt><dd>{[radio.city, radio.state, radio.country].filter(Boolean).join(', ')}</dd></>}{radio.genreLabels.length > 0 && <><dt>Categoria</dt><dd>{radio.genreLabels.join(', ')}</dd></>}</dl></div><aside><h2>Fonte e transparência</h2><p>Os dados são organizados a partir da fonte local do catálogo. A reprodução depende do stream público da emissora ou do distribuidor.</p><p>Última revisão estrutural: <time dateTime="2026-07-19">{CATALOG_REVIEWED_AT}</time>.</p>{radio.websiteUrl && <a href={radio.websiteUrl} target="_blank" rel="noopener noreferrer">Consultar site oficial</a>}<a href="https://wa.me/5511974004755" target="_blank" rel="noopener noreferrer">Solicitar correção</a></aside></section>{related.length > 0 && <section><h2>Rádios relacionadas</h2><DirectRadioGrid radios={related} player={player} favorites={favorites} hiddenState={hiddenState} /></section>}</main>
}

function SaoPauloPage({ player, favorites, hiddenState }) {
  const radios = getRadiosByCity('sao-paulo')
  const schemas = [{ '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: radios.length, itemListElement: radios.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }]
  usePageSeo({ title: 'Rádios de São Paulo ao vivo e frequências | Rádio FM Online', description: `Compare ${radios.length} rádios de São Paulo, frequências e gêneros e ouça as estações ao vivo.`, path: '/radios/sao-paulo', schemas })
  return <main className="direct-main"><Breadcrumb current="Rádios de São Paulo" /><header className="direct-intro"><p className="direct-kicker">Guia por localidade</p><h1>Rádios de São Paulo ao vivo</h1><p>Compare as estações cadastradas na cidade de São Paulo, consulte frequências e gêneros e escolha o que ouvir. A lista não representa ranking de audiência.</p></header><DirectRadioGrid radios={radios} player={player} favorites={favorites} hiddenState={hiddenState} /><section className="direct-copy"><div><h2>Como escolher uma rádio</h2><p>Use a frequência se você conhece a estação pelo dial ou abra a página individual para conferir os dados disponíveis e o site oficial.</p></div><aside><h2>Sobre a lista</h2><p>Esta página usa apenas estações cuja cidade cadastrada é São Paulo. Frequências e streams podem mudar; envie uma correção quando encontrar divergências.</p></aside></section></main>
}

const GENRE_ROUTES = {
  '/radios/genero/pop': { name: 'Pop', label: 'gênero', radios: () => getRadiosByGenre('pop') },
  '/radios/genero/noticias': { name: GENRE_LABELS.news, label: 'gênero', radios: () => getRadiosByGenre('news') },
  '/radios/genero/rock': { name: 'Rock', label: 'gênero', radios: () => getRadiosByGenre('rock') },
  '/radios/genero/internacional': { name: GENRE_LABELS.international, label: 'gênero', radios: () => getRadiosByGenre('international') },
}

function getCityRouteConfig(path) {
  if (!path.startsWith('/radios/') || path === '/radios/sao-paulo' || path.startsWith('/radios/genero/')) return null
  const slug = path.slice('/radios/'.length)
  const city = getIndexableCities().find((item) => item.slug === slug)
  if (!city) return null
  return { name: city.name, label: 'cidade', state: city.radios[0]?.state, radios: () => city.radios }
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
  const place = isCity && config.state ? `${config.name}, ${config.state}` : config.name
  const title = isCity ? `Rádios de ${config.name} ao vivo: ouça FM online grátis | Rádio FM Online` : `Rádios de ${config.name} ao vivo | Rádio FM Online`
  const description = isCity
    ? `Ouça ${radios.length} rádios FM de ${place} ao vivo e grátis. Compare frequências, gêneros e emissoras locais para ouvir rádio online agora.`
    : `Explore ${radios.length} rádios de ${config.name}, consulte frequências e localidades e ouça as estações ao vivo.`
  const schemas = [{ '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: radios.length, itemListElement: radios.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }]
  usePageSeo({ title, description, path, schemas })
  const insight = isCity ? describeCityInsight(radios) : null
  const insightSentence = insight && (insight.rangeText || insight.genreText)
    ? [
        insight.rangeText && `O dial cadastrado para ${config.name} vai de ${insight.rangeText}`,
        insight.genreText && `com destaque para emissoras de ${insight.genreText}`,
      ].filter(Boolean).join(', ') + '.'
    : null
  return <main className="direct-main"><Breadcrumb current={`Rádios de ${config.name}`} /><header className="direct-intro"><p className="direct-kicker">{isCity ? `Rádio online em ${config.name}` : `Catálogo por ${config.label}`}</p><h1>Rádios de {config.name} ao vivo{isCity ? ' — ouça FM grátis' : ''}</h1><p>{description} A ordem não representa audiência nem popularidade.</p></header><DirectRadioGrid radios={radios} player={player} favorites={favorites} hiddenState={hiddenState} /><section className="direct-copy"><div><h2>{isCity ? `Como ouvir rádio em ${config.name}` : 'Explore o catálogo'}</h2><p>{isCity ? `Escolha uma emissora de ${config.name} na lista acima e toque em ouvir para começar a transmissão ao vivo pelo navegador, sem baixar aplicativos.` : 'Abra a página de cada estação para consultar dados, fonte oficial e rádios relacionadas.'}</p>{insightSentence && <p>{insightSentence}</p>}</div></section></main>
}

function GuidePage() {
  const schemas = [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }]
  usePageSeo({ title: 'Como ouvir rádio online: guia prático | Rádio FM Online', description: 'Aprenda como funcionam streams, reprodução no celular, consumo de dados e solução de falhas.', path: '/guia/como-ouvir-radio-online', schemas })
  return <main className="direct-main"><Breadcrumb current="Como ouvir rádio online" /><article className="direct-article"><p className="direct-kicker">Guia prático</p><h1>Como ouvir rádio online</h1><p className="direct-lead">Rádio online é a transmissão contínua do áudio de uma estação pela internet. Você escolhe a emissora e o navegador conecta ao stream público fornecido pela rádio ou por seu distribuidor.</p><h2>Como começar</h2><ol><li>Volte à página principal e encontre uma estação pela busca, cidade, frequência ou gênero.</li><li>Pressione o botão de reprodução e aguarde a conexão.</li><li>Use o player fixo para pausar, controlar o volume ou ativar o timer.</li><li>Ao trocar de estação, o stream anterior é encerrado.</li></ol><h2>Reprodução no celular</h2><p>O áudio começa somente após o toque do usuário. Alguns aparelhos podem interromper a reprodução ao bloquear a tela ou ativar economia de bateria, conforme as regras do sistema e do navegador.</p><h2>Consumo de dados</h2><p>Streams usam dados durante todo o período de reprodução. O consumo varia conforme o formato e a qualidade definidos pela emissora. Quando o plano móvel for limitado, use Wi-Fi e configure o timer.</p><h2>Quando uma estação estiver fora do ar</h2><p>Aguarde alguns segundos e tente novamente. Persistindo o erro, consulte o site oficial da estação ou envie uma correção ao suporte. O catálogo não retransmite nem modifica o áudio.</p><h2>Dúvidas frequentes</h2>{faqItems.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</article></main>
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
      <Breadcrumb current="Roadmap de cobertura" />
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
                    <td><a href={`/radio/${radio.slug}`}>{radio.name}</a></td>
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
  usePageSeo({ title: 'Página não encontrada | Rádio FM Online', description: 'O endereço solicitado não existe.', path: window.location.pathname, noindex: true, schemas: [] })
  return <main className="direct-main"><h1>Página não encontrada</h1><p>O endereço solicitado não existe.</p><a href="/">Voltar para a página principal</a></main>
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
  const cityRouteConfig = getCityRouteConfig(path)
  let content
  if (path.startsWith('/radio/')) content = <RadioPage slug={decodeURIComponent(path.slice('/radio/'.length))} player={player} favorites={favorites} hiddenState={hiddenState} />
  else if (path === '/radios/sao-paulo') content = <SaoPauloPage player={player} favorites={favorites} hiddenState={hiddenState} />
  else if (GENRE_ROUTES[path]) content = <TaxonomyPage config={GENRE_ROUTES[path]} path={path} player={player} favorites={favorites} hiddenState={hiddenState} />
  else if (cityRouteConfig) content = <TaxonomyPage config={cityRouteConfig} path={path} player={player} favorites={favorites} hiddenState={hiddenState} />
  else if (path === '/guia/como-ouvir-radio-online') content = <GuidePage />
  else if (path === '/roadmap') content = <RoadmapPage />
  else content = <NotFoundPage />
  return <div className="direct-app"><a className="direct-skip" href="#conteudo">Ir para o conteúdo</a><div className="direct-header-wrap"><Header theme={theme} onToggleTheme={toggleTheme} canInstall={canInstall} installed={installed} onInstall={install} /><DirectNav /><HomeCallout canInstall={canInstall} installed={installed} onInstall={install} /></div><AdUnit slot={AD_SLOTS.top} format="horizontal" className="ad-unit--top" /><div id="conteudo">{content}</div><AdUnit slot={AD_SLOTS.bottom} format="horizontal" className="ad-unit--bottom" /><Footer /><Player player={player} sleep={sleep} favorites={favorites} /></div>
}
