import RadioCard from './RadioCard'

const emptyStates = {
  favorites: {
    icon: (
      <path
        d="M32 54l-2.2-2C18.5 41.5 12 35.6 12 28.5 12 23.5 16 20 20.5 20c2.4 0 4.7 1.1 6.2 2.9L32 28.6l5.3-5.7C38.8 21.1 41.1 20 43.5 20 48 20 52 23.5 52 28.5c0 7.1-6.5 13-17.8 23.5L32 54z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
    title: 'Nenhuma rádio favorita ainda.',
    hint: 'Toque no coração de uma rádio para salvá-la aqui.',
  },
  hidden: {
    icon: (
      <>
        <path
          d="M14 18l-8-8M22 22L10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 26c5.5-2.5 8-8 8-8s-2.5-5.5-8-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10C6.5 12.5 4 18 4 18s2.5 5.5 8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    title: 'Nenhuma rádio oculta.',
    hint: 'Use o botão ocultar em uma rádio para removê-la da lista.',
  },
}

export default function RadioGrid({
  radios,
  currentRadio,
  isPlaying,
  isLoading,
  isFavorite,
  isHidden,
  showHidden,
  onPlay,
  onToggleFavorite,
  onHide,
  onUnhide,
  emptyCategory,
}) {
  if (radios.length === 0) {
    const empty = emptyCategory ? emptyStates[emptyCategory] : null

    return (
      <div className="empty-state">
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {empty ? (
            empty.icon
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
        <p>{empty ? empty.title : 'Nenhuma rádio encontrada.'}</p>
        <span>
          {empty ? empty.hint : 'Tente outro termo de busca, categoria ou cidade.'}
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
          isHidden={isHidden(radio.id)}
          showHidden={showHidden}
          onPlay={onPlay}
          onToggleFavorite={onToggleFavorite}
          onHide={() => onHide(radio.id)}
          onUnhide={() => onUnhide(radio.id)}
        />
      ))}
    </section>
  )
}
