import { useEffect } from 'react'
import PlayerBar from '../components/PlayerBar.jsx'
import RadioIcon from '../components/RadioIcon.jsx'
import { useAudioPlayer } from '../hooks/useAudioPlayer.js'
import { useSleepTimer } from '../hooks/useSleepTimer.js'
import { CATALOG_REVIEWED_AT, describeRadio, getRadioBySlug, getRadiosByCity, getRelatedRadios } from '../data/radioRepository.js'
import './DirectPage.css'

const SITE = 'https://www.radiofmonline.com.br'

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

function DirectHeader() {
  return <header className="direct-header"><a href="/" className="direct-brand">◉ Rádio FM Online</a><nav aria-label="Principal"><a href="/">Ouvir rádios</a><a href="/radios/sao-paulo">Rádios de São Paulo</a><a href="/guia/como-ouvir-radio-online">Guia</a></nav></header>
}

function DirectFooter() {
  return <footer className="direct-footer"><div><strong>Rádio FM Online</strong><p>Catálogo independente de estações ao vivo.</p></div><nav><a href="/">Página principal</a><a href="/privacy-policy.html">Privacidade</a><a href="/terms.html">Termos</a><a href="https://wa.me/5511974004755" target="_blank" rel="noopener noreferrer">Suporte SaaS</a></nav></footer>
}

function Breadcrumb({ current }) {
  return <nav className="direct-breadcrumb" aria-label="Navegação estrutural"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">{current}</span></nav>
}

function MiniCard({ radio, player }) {
  return <article className="direct-card"><RadioIcon radio={radio} size="sm" /><div><h3><a href={`/radio/${radio.slug}`}>{radio.name}</a></h3><p>{[radio.frequency, radio.city, radio.genreLabels.join(', ')].filter(Boolean).join(' · ')}</p></div><button type="button" onClick={() => player.play(radio)}>{player.currentRadio?.id === radio.id && player.isPlaying ? 'Pausar' : 'Ouvir'}</button></article>
}

function Player({ player, sleep }) {
  return <PlayerBar radio={player.currentRadio} isPlaying={player.isPlaying} isLoading={player.isLoading} volume={player.volume} error={player.error} isFavorite={false} hasPrevious={false} hasNext={false} onPrevious={() => {}} onNext={() => {}} onTogglePlay={player.togglePlay} onStop={player.stop} onVolumeChange={player.setVolume} onToggleFavorite={() => {}} sleepMinutes={sleep.minutes} onSleepMinutesChange={sleep.setMinutes} sleepRemainingSeconds={sleep.remainingSeconds} isSleepActive={sleep.isActive} onSleepStart={sleep.startSleep} onSleepCancel={sleep.cancelSleep} />
}

function RadioPage({ slug, player }) {
  const radio = getRadioBySlug(slug)
  const path = `/radio/${slug}`
  const description = radio ? describeRadio(radio) : 'A estação solicitada não existe no catálogo.'
  const place = radio ? [radio.city, radio.state].filter(Boolean).join(', ') : ''
  const schemas = radio ? [{ '@context': 'https://schema.org', '@type': 'RadioStation', name: radio.name, url: `${SITE}${path}`, sameAs: radio.websiteUrl, address: radio.city ? { '@type': 'PostalAddress', addressLocality: radio.city, addressRegion: radio.state, addressCountry: radio.country } : undefined }] : []
  usePageSeo({ title: radio ? `Ouvir ${radio.name} ao vivo${place ? ` — ${place}` : ''} | Rádio FM Online` : 'Rádio não encontrada | Rádio FM Online', description, path, noindex: !radio, schemas })
  if (!radio) return <main className="direct-main"><Breadcrumb current="Página não encontrada" /><h1>Rádio não encontrada</h1><p>Essa estação não existe no catálogo atual.</p><a href="/">Voltar ao catálogo</a></main>
  const related = getRelatedRadios(radio)
  return <main className="direct-main"><Breadcrumb current={radio.name} /><article className="direct-radio-hero"><RadioIcon radio={radio} size="lg" eager /><div><p className="direct-kicker">Ouça ao vivo</p><h1>{radio.name}</h1><p>{[radio.frequency, radio.city, radio.state, radio.country].filter(Boolean).join(' · ')}</p></div><button type="button" onClick={() => player.play(radio)}>{player.currentRadio?.id === radio.id && player.isPlaying ? 'Pausar' : 'Ouvir agora'}</button></article><section className="direct-copy"><div><h2>Informações da estação</h2><p>{description}</p><dl>{radio.frequency && <><dt>Frequência</dt><dd>{radio.frequency}</dd></>}{radio.band && <><dt>Banda</dt><dd>{radio.band}</dd></>}{radio.city && <><dt>Localidade</dt><dd>{[radio.city, radio.state, radio.country].filter(Boolean).join(', ')}</dd></>}{radio.genreLabels.length > 0 && <><dt>Categoria</dt><dd>{radio.genreLabels.join(', ')}</dd></>}</dl></div><aside><h2>Fonte e transparência</h2><p>Os dados são organizados a partir da fonte local do catálogo. A reprodução depende do stream público da emissora ou do distribuidor.</p><p>Última revisão estrutural: <time dateTime="2026-07-19">{CATALOG_REVIEWED_AT}</time>.</p>{radio.websiteUrl && <a href={radio.websiteUrl} target="_blank" rel="noopener noreferrer">Consultar site oficial</a>}<a href="https://wa.me/5511974004755" target="_blank" rel="noopener noreferrer">Solicitar correção</a></aside></section>{related.length > 0 && <section><h2>Rádios relacionadas</h2><div className="direct-grid">{related.map((item) => <MiniCard radio={item} player={player} key={item.id} />)}</div></section>}</main>
}

function SaoPauloPage({ player }) {
  const radios = getRadiosByCity('sao-paulo')
  const schemas = [{ '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: radios.length, itemListElement: radios.map((radio, index) => ({ '@type': 'ListItem', position: index + 1, name: radio.name, url: `${SITE}/radio/${radio.slug}` })) }]
  usePageSeo({ title: 'Rádios de São Paulo ao vivo e frequências | Rádio FM Online', description: `Compare ${radios.length} rádios de São Paulo, frequências e gêneros e ouça as estações ao vivo.`, path: '/radios/sao-paulo', schemas })
  return <main className="direct-main"><Breadcrumb current="Rádios de São Paulo" /><header className="direct-intro"><p className="direct-kicker">Guia por localidade</p><h1>Rádios de São Paulo ao vivo</h1><p>Compare as estações cadastradas na cidade de São Paulo, consulte frequências e gêneros e escolha o que ouvir. A lista não representa ranking de audiência.</p></header><div className="direct-table-wrap" tabIndex="0"><table><thead><tr><th>Estação</th><th>Frequência</th><th>Gênero</th><th>Ouvir</th></tr></thead><tbody>{radios.map((radio) => <tr key={radio.id}><td><a href={`/radio/${radio.slug}`}>{radio.name}</a></td><td>{radio.frequency || 'Não informada'}</td><td>{radio.genreLabels.join(', ')}</td><td><button type="button" onClick={() => player.play(radio)}>Ouvir</button></td></tr>)}</tbody></table></div><section className="direct-copy"><div><h2>Como escolher uma rádio</h2><p>Use a frequência se você conhece a estação pelo dial ou abra a página individual para conferir os dados disponíveis e o site oficial.</p></div><aside><h2>Sobre a lista</h2><p>Esta página usa apenas estações cuja cidade cadastrada é São Paulo. Frequências e streams podem mudar; envie uma correção quando encontrar divergências.</p></aside></section></main>
}

function GuidePage() {
  const faq = [{ q: 'O áudio começa automaticamente?', a: 'Não. A reprodução começa somente depois de uma ação do usuário.' }, { q: 'Por que uma rádio pode não tocar?', a: 'O stream pode estar em manutenção, ter mudado de endereço ou usar um formato incompatível.' }, { q: 'Rádio online consome dados móveis?', a: 'Sim. O áudio é transmitido continuamente; prefira Wi-Fi quando seu plano for limitado.' }]
  const schemas = [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }]
  usePageSeo({ title: 'Como ouvir rádio online: guia prático | Rádio FM Online', description: 'Aprenda como funcionam streams, reprodução no celular, consumo de dados e solução de falhas.', path: '/guia/como-ouvir-radio-online', schemas })
  return <main className="direct-main"><Breadcrumb current="Como ouvir rádio online" /><article className="direct-article"><p className="direct-kicker">Guia prático</p><h1>Como ouvir rádio online</h1><p className="direct-lead">Rádio online é a transmissão contínua do áudio de uma estação pela internet. Você escolhe a emissora e o navegador conecta ao stream público fornecido pela rádio ou por seu distribuidor.</p><h2>Como começar</h2><ol><li>Volte à página principal e encontre uma estação pela busca, cidade, frequência ou gênero.</li><li>Pressione o botão de reprodução e aguarde a conexão.</li><li>Use o player fixo para pausar, controlar o volume ou ativar o timer.</li><li>Ao trocar de estação, o stream anterior é encerrado.</li></ol><h2>Reprodução no celular</h2><p>O áudio começa somente após o toque do usuário. Alguns aparelhos podem interromper a reprodução ao bloquear a tela ou ativar economia de bateria, conforme as regras do sistema e do navegador.</p><h2>Consumo de dados</h2><p>Streams usam dados durante todo o período de reprodução. O consumo varia conforme o formato e a qualidade definidos pela emissora. Quando o plano móvel for limitado, use Wi-Fi e configure o timer.</p><h2>Quando uma estação estiver fora do ar</h2><p>Aguarde alguns segundos e tente novamente. Persistindo o erro, consulte o site oficial da estação ou envie uma correção ao suporte. O catálogo não retransmite nem modifica o áudio.</p><h2>Dúvidas frequentes</h2>{faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</article></main>
}

function NotFoundPage() {
  usePageSeo({ title: 'Página não encontrada | Rádio FM Online', description: 'O endereço solicitado não existe.', path: window.location.pathname, noindex: true, schemas: [] })
  return <main className="direct-main"><h1>Página não encontrada</h1><p>O endereço solicitado não existe.</p><a href="/">Voltar para a página principal</a></main>
}

export default function DirectPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const player = useAudioPlayer()
  const sleep = useSleepTimer({ onExpire: player.pause })
  let content
  if (path.startsWith('/radio/')) content = <RadioPage slug={decodeURIComponent(path.slice('/radio/'.length))} player={player} />
  else if (path === '/radios/sao-paulo') content = <SaoPauloPage player={player} />
  else if (path === '/guia/como-ouvir-radio-online') content = <GuidePage />
  else content = <NotFoundPage />
  return <div className="direct-app"><a className="direct-skip" href="#conteudo">Ir para o conteúdo</a><DirectHeader /><div id="conteudo">{content}</div><DirectFooter /><Player player={player} sleep={sleep} /></div>
}
