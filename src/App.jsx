import { useMemo, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import RadioGrid from './components/RadioGrid'
import PlayerBar from './components/PlayerBar'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useFavorites } from './hooks/useFavorites'
import { radios, categories } from './data/radios'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  const {
    currentRadio,
    isPlaying,
    isLoading,
    volume,
    error,
    setVolume,
    play,
    stop,
    togglePlay,
  } = useAudioPlayer()

  const filteredRadios = useMemo(() => {
    const query = search.trim().toLowerCase()

    return radios.filter((radio) => {
      const matchesCategory =
        category === 'all' ||
        (category === 'favorites' && favorites.includes(radio.id)) ||
        radio.genre === category

      const matchesSearch =
        !query ||
        radio.name.toLowerCase().includes(query) ||
        radio.city.toLowerCase().includes(query) ||
        radio.frequency.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [search, category, favorites])

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true">
        <div className="app__orb app__orb--1" />
        <div className="app__orb app__orb--2" />
        <div className="app__orb app__orb--3" />
      </div>

      <main className="app__main">
        <Header favoritesCount={favorites.length} />

        <SearchBar
          value={search}
          onChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />

        <div className="app__stats">
          <span>
            {category === 'favorites'
              ? `${filteredRadios.length} favorita${filteredRadios.length !== 1 ? 's' : ''}`
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
          onPlay={play}
          onToggleFavorite={toggleFavorite}
          emptyFavorites={category === 'favorites' && favorites.length === 0}
        />
      </main>

      <PlayerBar
        radio={currentRadio}
        isPlaying={isPlaying}
        isLoading={isLoading}
        volume={volume}
        error={error}
        isFavorite={currentRadio ? isFavorite(currentRadio.id) : false}
        onTogglePlay={togglePlay}
        onStop={stop}
        onVolumeChange={setVolume}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  )
}

export default App
