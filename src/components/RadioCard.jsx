import Equalizer from './Equalizer'
import RadioIcon from './RadioIcon'
import FavoriteButton from './FavoriteButton'
import HideButton from './HideButton'

export default function RadioCard({
  radio,
  isActive,
  isPlaying,
  isLoading,
  isFavorite,
  isHidden,
  showHidden,
  onPlay,
  onToggleFavorite,
  onHide,
  onUnhide,
}) {
  return (
    <article
      className={`radio-card ${isActive ? 'radio-card--active' : ''}`}
      style={{ '--radio-color': radio.color }}
    >
      <div className="radio-card__glow" aria-hidden="true" />

      <RadioIcon radio={radio} size="sm" className="radio-card__icon" />

      <div className="radio-card__body">
        <h3 className="radio-card__name">{radio.name}</h3>
        <p className="radio-card__meta">
          <span className="radio-card__freq">{radio.frequency}</span>
          <span className="radio-card__dot">·</span>
          <span>{radio.city}</span>
        </p>
      </div>

      <div className="radio-card__actions">
        {isActive && isPlaying && <Equalizer active />}
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => onToggleFavorite(radio.id)}
          radioName={radio.name}
        />
        <HideButton
          isHidden={showHidden || isHidden}
          onToggle={showHidden || isHidden ? onUnhide : onHide}
          radioName={radio.name}
        />
        <button
          type="button"
          className="radio-card__play"
          onClick={() => onPlay(radio)}
          aria-label={
            isActive && isPlaying
              ? `Pausar ${radio.name}`
              : isLoading && isActive
                ? `Carregando ${radio.name}`
                : `Tocar ${radio.name}`
          }
        >
          {isActive && isLoading ? (
            <span className="radio-card__spinner" />
          ) : isActive && isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </article>
  )
}
