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
import { useMediaSession } from './hooks/useMediaSession'
import AdUnit from './components/AdUnit'
import Footer from './components/Footer'
import SortBar from './components/SortBar'
import { AD_SLOTS } from './config/adsense'
import { radios, categories } from './data/radios'
import { sortRadios } from './utils/sortRadios'
import { CATALOG_REVIEWED_AT, getAllRadios, getFeaturedRadios, getIndexableCitiesWithState, getIndexableStates } from './data/radioRepository'
import { faqItems } from './data/faq'
import './styles/shared.css'
import './App.css'

const STATE_FILTER_STORAGE_KEY = 'franca-fm-state-filter'
const CITY_TO_STATE = Object.fromEntries(getAllRadios().map((radio) => [radio.city, radio.state]))

function getInitialStateFilter() {
  try {
    const stored = localStorage.getItem(STATE_FILTER_STORAGE_KEY)
    if (stored === 'all' || Object.values(CITY_TO_STATE).some((state) => state === stored)) return stored
  } catch { /* ignore */ }
  return 'São Paulo'
}

function App() {
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const [category, setCategory] = useState('all')
  const [stateFilter, setStateFilter] = useState(getInitialStateFilter)
  const [sortBy, setSortBy] = useState('default')

  const states = useMemo(
    () => [...new Set(Object.values(CITY_TO_STATE).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [],
  )

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

  const handleStop = useCallback(() => {
    cancelSleep()
    stop()
  }, [cancelSleep, stop])

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

      const matchesState = stateFilter === 'all' || CITY_TO_STATE[radio.city] === stateFilter

      const matchesSearch =
        !query ||
        radio.name.toLowerCase().includes(query) ||
        radio.city.toLowerCase().includes(query) ||
        radio.frequency.toLowerCase().includes(query)

      return matchesCategory && matchesState && matchesSearch
    })

    return sortRadios(filtered, sortBy)
  }, [search, category, stateFilter, favorites, hidden, sortBy])

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
  const indexableCities = getIndexableCitiesWithState()
  const indexableStates = getIndexableStates()
  const featuredRadios = getFeaturedRadios()

  const resumeCurrentRadio = useCallback(() => {
    if (!isPlaying && currentRadio) play(currentRadio)
  }, [currentRadio, isPlaying, play])

  useMediaSession({
    radio: currentRadio,
    isPlaying,
    onPlay: resumeCurrentRadio,
    onPause: pause,
    onStop: handleStop,
    onPrevious: playPrevious,
    onNext: playNext,
    hasPrevious,
    hasNext,
  })

  useEffect(() => {
    document.getElementById('app-loader')?.classList.add('app-loader--done')
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (search.trim()) url.searchParams.set('q', search.trim())
    else url.searchParams.delete('q')
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    const robots = document.head.querySelector('meta[name="robots"]')
    if (robots) robots.content = search.trim() ? 'noindex,follow' : 'index,follow'
  }, [search])

  useEffect(() => {
    try {
      localStorage.setItem(STATE_FILTER_STORAGE_KEY, stateFilter)
    } catch { /* ignore */ }
  }, [stateFilter])

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
          states={states}
          state={stateFilter}
          onStateChange={setStateFilter}
        />

        <SortBar value={sortBy} onChange={setSortBy} />

        <AdUnit slot={AD_SLOTS.top} format="horizontal" className="ad-unit--top" />

        <div className="app__stats">
          <span>
            {category === 'favorites'
              ? `${filteredRadios.length} favorita${filteredRadios.length !== 1 ? 's' : ''}`
              : category === 'hidden'
                ? `${filteredRadios.length} oculta${filteredRadios.length !== 1 ? 's' : ''}`
                : `${filteredRadios.length} rádio${filteredRadios.length !== 1 ? 's' : ''} disponíve${filteredRadios.length !== 1 ? 'is' : 'l'}${stateFilter !== 'all' ? ` em ${stateFilter}` : ''}`}
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
            <h1 id="radio-directory-title">Ouça rádios FM ao vivo</h1>
            <p>
              Descubra estações de rádio brasileiras e internacionais em um player simples, rápido e com busca por nome,
              frequência ou cidade. Ouça rádio online grátis de São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba,
              Porto Alegre, Salvador, Recife e Brasília, salve suas favoritas e alterne entre gêneros como pop, rock,
              sertanejo, notícias e internacional.
            </p>
          </div>

          <div className="app__featured-radios">
            <div className="app__directory-heading">
              <div>
                <h2>Rádios em destaque</h2>
                <p>Uma rádio por estado brasileiro, em ordem alfabética, para representar a cobertura nacional do catálogo. O restante das {catalogRadios.length} estações está organizado por estado, cidade e gênero logo abaixo.</p>
              </div>
              <span>{featuredRadios.length} rádios</span>
            </div>
            <div className="app__frequency-list">
              {featuredRadios.map((radio) => (
                <a href={`/${radio.path}`} key={radio.id}>
                  <strong>{radio.name}</strong>
                  <span>{[radio.state, radio.frequency].filter(Boolean).join(' · ')}</span>
                </a>
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
            </div>
          </section>

          <nav className="app__seo-navigation" aria-label="Explorar rádios por localidade e gênero">
            <h2>Explore o catálogo</h2>
            <div className="app__seo-navigation-group">
              <h3>Estados</h3>
              <div className="app__seo-navigation-links">
                {indexableStates.map((state) => (
                  <a key={state.slug} href={`/${state.slug}`}>{state.name}</a>
                ))}
              </div>
            </div>
            <div className="app__seo-navigation-group">
              <h3>Principais cidades</h3>
              <div className="app__seo-navigation-links">
                {indexableCities.map((city) => (
                  <a key={city.slug} href={`/${city.stateSlug}/${city.slug}`}>{city.name}</a>
                ))}
              </div>
            </div>
            <div className="app__seo-navigation-group">
              <h3>Gêneros</h3>
              <div className="app__seo-navigation-links">
                <a href="/genero/pop">Pop</a>
                <a href="/genero/popular">Popular/Eclética</a>
                <a href="/genero/rock">Rock</a>
                <a href="/genero/sertanejo">Sertanejo</a>
                <a href="/genero/noticias">Notícias</a>
                <a href="/genero/adulto-flashback">Adulto/Flashback</a>
                <a href="/genero/gospel">Gospel</a>
                <a href="/genero/internacional">Internacional</a>
              </div>
            </div>
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

        <Footer />
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
