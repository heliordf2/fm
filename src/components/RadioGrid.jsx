import RadioCard from './RadioCard'

export default function RadioGrid({
  radios,
  currentRadio,
  isPlaying,
  isLoading,
  isFavorite,
  onPlay,
  onToggleFavorite,
  emptyFavorites,
}) {
  if (radios.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {emptyFavorites ? (
            <path
              d="M32 54l-2.2-2C18.5 41.5 12 35.6 12 28.5 12 23.5 16 20 20.5 20c2.4 0 4.7 1.1 6.2 2.9L32 28.6l5.3-5.7C38.8 21.1 41.1 20 43.5 20 48 20 52 23.5 52 28.5c0 7.1-6.5 13-17.8 23.5L32 54z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path
                d="M22 32c0-5.5 4.5-10 10-10s10 4.5 10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="3" fill="currentColor" />
            </>
          )}
        </svg>
        <p>{emptyFavorites ? 'Nenhuma rádio favorita ainda.' : 'Nenhuma rádio encontrada.'}</p>
        <span>
          {emptyFavorites
            ? 'Toque no coração de uma rádio para salvá-la aqui.'
            : 'Tente outro termo de busca ou categoria.'}
        </span>
      </div>
    )
  }

  return (
    <section className="radio-grid" aria-label="Lista de rádios">
      {radios.map((radio) => (
        <RadioCard
          key={radio.id}
          radio={radio}
          isActive={currentRadio?.id === radio.id}
          isPlaying={isPlaying}
          isLoading={isLoading}
          isFavorite={isFavorite(radio.id)}
          onPlay={onPlay}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  )
}
