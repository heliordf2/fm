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
import { CATALOG_REVIEWED_AT, getAllRadios, getIndexableCities } from './data/radioRepository'
import { faqItems } from './data/faq'
import './styles/shared.css'
import './App.css'

const CITY_FILTER_STORAGE_KEY = 'franca-fm-city-filter'

function getInitialCityFilter() {
  try {
    const stored = localStorage.getItem(CITY_FILTER_STORAGE_KEY)
    if (stored === 'all' || radios.some((radio) => radio.city === stored)) return stored
  } catch { /* ignore */ }
  return 'São Paulo'
}

function App() {
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const [category, setCategory] = useState('all')
  const [cityFilter, setCityFilter] = useState(getInitialCityFilter)
  const [sortBy, setSortBy] = useState('default')

  const cities = useMemo(
    () => [...new Set(radios.map((radio) => radio.city))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
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

      const matchesCity = cityFilter === 'all' || radio.city === cityFilter

      const matchesSearch =
        !query ||
        radio.name.toLowerCase().includes(query) ||
        radio.city.toLowerCase().includes(query) ||
        radio.frequency.toLowerCase().includes(query)

      return matchesCategory && matchesCity && matchesSearch
    })

    return sortRadios(filtered, sortBy)
  }, [search, category, cityFilter, favorites, hidden, sortBy])

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
  const indexableCities = getIndexableCities()

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
      localStorage.setItem(CITY_FILTER_STORAGE_KEY, cityFilter)
    } catch { /* ignore */ }
  }, [cityFilter])

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
          cities={cities}
          city={cityFilter}
          onCityChange={setCityFilter}
        />

        <SortBar value={sortBy} onChange={setSortBy} />

        <AdUnit slot={AD_SLOTS.top} format="horizontal" className="ad-unit--top" />

        <div className="app__stats">
          <span>
            {category === 'favorites'
              ? `${filteredRadios.length} favorita${filteredRadios.length !== 1 ? 's' : ''}`
              : category === 'hidden'
                ? `${filteredRadios.length} oculta${filteredRadios.length !== 1 ? 's' : ''}`
                : `${filteredRadios.length} rádio${filteredRadios.length !== 1 ? 's' : ''} disponíve${filteredRadios.length !== 1 ? 'is' : 'l'}${cityFilter !== 'all' ? ` em ${cityFilter}` : ''}`}
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
              frequência ou cidade. Ouça rádio online grátis de São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba,
              Porto Alegre, Salvador, Recife e Brasília, salve suas favoritas e alterne entre gêneros como pop, rock,
              sertanejo, notícias e internacional.
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
            {indexableCities.map((city) => (
              <a key={city.slug} href={`/radios/${city.slug}`}>Rádios de {city.name}</a>
            ))}
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
