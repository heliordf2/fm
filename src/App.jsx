import { useCallback, useMemo, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import RadioGrid from './components/RadioGrid'
import PlayerBar from './components/PlayerBar'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useSleepTimer } from './hooks/useSleepTimer'
import { useFavorites } from './hooks/useFavorites'
import { useHiddenRadios } from './hooks/useHiddenRadios'
import { useTheme } from './hooks/useTheme'
import AdUnit from './components/AdUnit'
import SortBar from './components/SortBar'
import { AD_SLOTS } from './config/adsense'
import { radios, categories } from './data/radios'
import { sortRadios } from './utils/sortRadios'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const { hidden, isHidden, hideRadio, unhideRadio } = useHiddenRadios()
  const { theme, toggleTheme } = useTheme()

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

        <section className="app__seo" aria-label="Informações sobre o site">
          <h2>Ouça rádios FM ao vivo</h2>
          <p>
            Descubra estações de rádio brasileiras e internacionais em um player simples, rápido e com busca por nome,
            frequência ou cidade. Aproveite uma experiência prática para ouvir rádios FM ao vivo, salvar favoritas e
            alternar entre gêneros como pop, rock, sertanejo, notícias e internacional.
          </p>
        </section>

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

        <footer className="app__footer">
          <a href="/privacy-policy.html">Política de Privacidade</a>
          <a href="/terms.html">Termos de Uso</a>
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
