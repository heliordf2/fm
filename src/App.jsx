import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import RadioGrid from './components/RadioGrid'
import PlayerBar from './components/PlayerBar'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useSleepTimer } from './hooks/useSleepTimer'
import { useFavorites } from './hooks/useFavorites'
import { useHiddenRadios } from './hooks/useHiddenRadios'
import { useTheme } from './hooks/useTheme'
import { usePwaInstall } from './hooks/usePwaInstall'
import AdUnit from './components/AdUnit'
import SortBar from './components/SortBar'
import { AD_SLOTS } from './config/adsense'
import { radios, categories } from './data/radios'
import { sortRadios } from './utils/sortRadios'
import { CATALOG_REVIEWED_AT, getAllRadios } from './data/radioRepository'
import { faqItems } from './data/faq'
import './App.css'

function App() {
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const { hidden, isHidden, hideRadio, unhideRadio } = useHiddenRadios()
  const { theme, toggleTheme } = useTheme()
  const { canInstall, installed, install } = usePwaInstall()

  const {
    currentRadio,
    isPlaying,
    isLoading,
    volume,
    error,
    setVolume,
    play,
    pause,
    stop,
    togglePlay,
  } = useAudioPlayer()

  const {
    minutes: sleepMinutes,
    setMinutes: setSleepMinutes,
    remainingSeconds: sleepRemainingSeconds,
    isActive: isSleepActive,
    startSleep,
    cancelSleep,
  } = useSleepTimer({ onExpire: pause })

  const handleStop = () => {
    cancelSleep()
    stop()
  }

  const filteredRadios = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = radios.filter((radio) => {
      const radioHidden = hidden.includes(radio.id)

      if (category === 'hidden') {
        if (!radioHidden) return false
      } else if (radioHidden) {
        return false
      }

      const matchesCategory =
        category === 'all' ||
        category === 'hidden' ||
        (category === 'favorites' && favorites.includes(radio.id)) ||
        radio.genre === category

      const matchesSearch =
        !query ||
        radio.name.toLowerCase().includes(query) ||
        radio.city.toLowerCase().includes(query) ||
        radio.frequency.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })

    return sortRadios(filtered, sortBy)
  }, [search, category, favorites, hidden, sortBy])

  const currentIndex = useMemo(() => {
    if (!currentRadio) return -1
    return filteredRadios.findIndex((r) => r.id === currentRadio.id)
  }, [currentRadio, filteredRadios])

  const playPrevious = useCallback(() => {
    if (currentIndex > 0) play(filteredRadios[currentIndex - 1])
  }, [currentIndex, filteredRadios, play])

  const playNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < filteredRadios.length - 1) {
      play(filteredRadios[currentIndex + 1])
    }
  }, [currentIndex, filteredRadios, play])

  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < filteredRadios.length - 1
  const catalogRadios = getAllRadios()

  useEffect(() => {
    const url = new URL(window.location.href)
    if (search.trim()) url.searchParams.set('q', search.trim())
    else url.searchParams.delete('q')
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    const robots = document.head.querySelector('meta[name="robots"]')
    if (robots) robots.content = search.trim() ? 'noindex,follow' : 'index,follow'
  }, [search])

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true">
        <div className="app__orb app__orb--1" />
        <div className="app__orb app__orb--2" />
        <div className="app__orb app__orb--3" />
      </div>

      <main className="app__main">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          canInstall={canInstall}
          installed={installed}
          onInstall={install}
        />

        <SearchBar
          value={search}
          onChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />

        <SortBar value={sortBy} onChange={setSortBy} />

        <AdUnit slot={AD_SLOTS.top} format="horizontal" className="ad-unit--top" />

        <div className="app__stats">
          <span>
            {category === 'favorites'
              ? `${filteredRadios.length} favorita${filteredRadios.length !== 1 ? 's' : ''}`
              : category === 'hidden'
                ? `${filteredRadios.length} oculta${filteredRadios.length !== 1 ? 's' : ''}`
                : `${filteredRadios.length} rádios disponíveis`}
          </span>
          {currentRadio && isPlaying && (
            <span className="app__now-playing">
              Tocando agora: <strong>{currentRadio.name}</strong>
            </span>
          )}
        </div>

        <RadioGrid
          radios={filteredRadios}
          currentRadio={currentRadio}
          isPlaying={isPlaying}
          isLoading={isLoading}
          isFavorite={isFavorite}
          isHidden={isHidden}
          showHidden={category === 'hidden'}
          onPlay={play}
          onToggleFavorite={toggleFavorite}
          onHide={hideRadio}
          onUnhide={unhideRadio}
          emptyCategory={
            category === 'favorites' && favorites.length === 0
              ? 'favorites'
              : category === 'hidden' && hidden.length === 0
                ? 'hidden'
                : null
          }
        />

        <AdUnit slot={AD_SLOTS.bottom} format="horizontal" className="ad-unit--bottom" />

        <section className="app__seo-content" aria-labelledby="radio-directory-title">
          <div className="app__footer-copy">
            <h2 id="radio-directory-title">Ouça rádios FM ao vivo</h2>
            <p>
              Descubra estações de rádio brasileiras e internacionais em um player simples, rápido e com busca por nome,
              frequência ou cidade. Aproveite uma experiência prática para ouvir rádios FM ao vivo, salvar favoritas e
              alternar entre gêneros como pop, rock, sertanejo, notícias e internacional.
            </p>
          </div>

          <div className="app__station-directory">
            <div className="app__directory-heading">
              <div>
                <h2>Estações disponíveis</h2>
                <p>Consulte os dados das {catalogRadios.length} rádios cadastradas. Expanda uma estação para ver frequência, localidade, categoria e links.</p>
              </div>
              <span>{catalogRadios.length} rádios</span>
            </div>
            <div className="app__directory-list">
              {catalogRadios.map((radio) => (
                <details className="app__station" id={`radio-${radio.slug}`} key={radio.id}>
                  <summary>
                    <span className="app__station-name">{radio.name}</span>
                    <span className="app__station-summary">{[radio.frequency, radio.city].filter(Boolean).join(' · ')}</span>
                    <span className="app__station-expand" aria-hidden="true">+</span>
                  </summary>
                  <div className="app__station-data">
                    <dl>
                      {radio.frequency && <><dt>Frequência</dt><dd>{radio.frequency}</dd></>}
                      {radio.band && <><dt>Banda</dt><dd>{radio.band}</dd></>}
                      {radio.city && <><dt>Cidade</dt><dd>{radio.city}</dd></>}
                      {radio.state && <><dt>Estado</dt><dd>{radio.state}</dd></>}
                      {radio.country && <><dt>País</dt><dd>{radio.country}</dd></>}
                      {radio.genreLabels.length > 0 && <><dt>Categoria</dt><dd>{radio.genreLabels.join(', ')}</dd></>}
                    </dl>
                    <div className="app__station-links">
                      <a href={`/radio/${radio.slug}`}>Ver página da estação</a>
                      {radio.websiteUrl && <a href={radio.websiteUrl} target="_blank" rel="noopener noreferrer">Site oficial</a>}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <section className="app__guides" id="guia" aria-labelledby="guides-title">
            <div className="app__section-kicker">Guia prático</div>
            <h2 id="guides-title">Como ouvir rádio online</h2>
            <p>Entenda streams, reprodução no celular, consumo de dados e como agir quando uma estação estiver fora do ar.</p>
            <a className="app__guide-link" href="/guia/como-ouvir-radio-online">Ler o guia</a>

            <div className="app__guide-grid">
              <article id="como-ouvir-radio-online">
                <span>Guia prático</span>
                <h3>Como ouvir rádio online</h3>
                <p>Escolha uma estação na busca ou na grade e pressione o botão de reprodução. O navegador recebe um fluxo contínuo de áudio, chamado stream, diretamente do servidor da emissora ou do distribuidor.</p>
                <h4>No celular</h4>
                <p>A reprodução começa somente depois do seu toque. Como o áudio usa internet continuamente, prefira uma rede Wi-Fi quando seu plano de dados for limitado e use o timer para interromper o player automaticamente.</p>
                <h4>Quando uma estação não toca</h4>
                <p>O stream pode estar em manutenção, ter mudado de endereço ou usar um formato incompatível. Aguarde alguns segundos, tente novamente e, se necessário, consulte o site oficial exibido nos dados da estação.</p>
              </article>

              <article id="guia-radios-sao-paulo">
                <span>Explore por frequência</span>
                <h3>Guia de rádios FM de São Paulo</h3>
                <p>Veja as estações cadastradas, suas frequências e os gêneros usados para organizar o catálogo.</p>
                <a className="app__guide-link" href="/radios/sao-paulo">Abrir o guia</a>
                <div id="estacoes-sao-paulo" className="app__frequency-list">
                  {catalogRadios.filter((radio) => radio.city === 'São Paulo').map((radio) => (
                    <a href={`#radio-${radio.slug}`} key={radio.id}>
                      <strong>{radio.name}</strong>
                      <span>{[radio.frequency, radio.genreLabels.join(', ')].filter(Boolean).join(' · ')}</span>
                    </a>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <nav className="app__seo-navigation" aria-label="Explorar rádios por localidade e gênero">
            <h2>Explore o catálogo</h2>
            <a href="/radios/sao-paulo">Rádios de São Paulo</a>
            <a href="/radios/rio-de-janeiro">Rádios do Rio de Janeiro</a>
            <a href="/radios/genero/noticias">Rádios de notícias</a>
            <a href="/radios/genero/pop">Rádios pop</a>
            <a href="/radios/genero/rock">Rádios de rock</a>
            <a href="/radios/genero/internacional">Rádios internacionais</a>
          </nav>

          <section className="app__faq" id="duvidas" aria-labelledby="faq-title">
            <div className="app__section-kicker">Dúvidas frequentes</div>
            <h2 id="faq-title">Sobre a reprodução</h2>
            {faqItems.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
          </section>

          <section className="app__about" id="sobre">
            <div><h2>Sobre o Rádio FM Online</h2><p>Catálogo independente criado para facilitar a descoberta e a reprodução de estações ao vivo, sem representar as emissoras cadastradas.</p></div>
            <div id="metodologia"><h2>Metodologia</h2><p>Organizamos somente os dados disponíveis na fonte do projeto, sem inventar audiência, popularidade ou programação. Solicitações e correções são verificadas antes de atualizar o catálogo.</p><p className="app__review-date">Última revisão estrutural do catálogo: <time dateTime="2026-07-19">{CATALOG_REVIEWED_AT}</time>. A disponibilidade dos streams pode mudar a qualquer momento.</p></div>
          </section>
        </section>

        <footer className="app__footer">
          <div className="app__footer-brand">
            <strong>Rádio FM Online</strong>
            <p>Catálogo independente de estações ao vivo.</p>
            <a className="app__whatsapp" href="https://wa.me/5511974004755?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20sobre%20o%20R%C3%A1dio%20FM%20Online." target="_blank" rel="noopener noreferrer" aria-label="Falar com o suporte SaaS pelo WhatsApp no número +55 11 97400-4755">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2a9.84 9.84 0 00-8.5 14.78L2 22l5.38-1.5A9.98 9.98 0 1012.04 2zm0 17.95a8.1 8.1 0 01-4.13-1.13l-.3-.18-3.2.9.87-3.12-.2-.32a8.04 8.04 0 1114.99-4.06 8.1 8.1 0 01-8.03 7.91zm4.4-6.06c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.27 7.27 0 01-1.34-1.67c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
              </svg>
              <span>Falar com o suporte SaaS pelo WhatsApp</span>
            </a>
          </div>
          <div className="app__footer-links">
            <a href="/guia/como-ouvir-radio-online">Guia</a>
            <a href="#sobre">Sobre</a>
            <a href="#metodologia">Metodologia</a>
            <a href="/privacy-policy.html">Privacidade</a>
            <a href="/terms.html">Termos</a>
            <a href="https://wa.me/5511974004755?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20sobre%20o%20R%C3%A1dio%20FM%20Online." target="_blank" rel="noopener noreferrer">Contato</a>
            <a href="https://wa.me/5511974004755?text=Ol%C3%A1%2C%20quero%20solicitar%20uma%20r%C3%A1dio%20no%20R%C3%A1dio%20FM%20Online." target="_blank" rel="noopener noreferrer">Solicitar rádio</a>
            <a href="https://wa.me/5511974004755?text=Ol%C3%A1%2C%20quero%20corrigir%20os%20dados%20de%20uma%20r%C3%A1dio%20no%20R%C3%A1dio%20FM%20Online." target="_blank" rel="noopener noreferrer">Corrigir rádio</a>
          </div>
        </footer>
      </main>

      <PlayerBar
        radio={currentRadio}
        isPlaying={isPlaying}
        isLoading={isLoading}
        volume={volume}
        error={error}
        isFavorite={currentRadio ? isFavorite(currentRadio.id) : false}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={playPrevious}
        onNext={playNext}
        onTogglePlay={togglePlay}
        onStop={handleStop}
        onVolumeChange={setVolume}
        onToggleFavorite={toggleFavorite}
        sleepMinutes={sleepMinutes}
        onSleepMinutesChange={setSleepMinutes}
        sleepRemainingSeconds={sleepRemainingSeconds}
        isSleepActive={isSleepActive}
        onSleepStart={startSleep}
        onSleepCancel={cancelSleep}
      />
    </div>
  )
}

export default App
