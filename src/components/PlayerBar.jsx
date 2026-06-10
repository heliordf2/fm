import Equalizer from './Equalizer'
import RadioIcon from './RadioIcon'
import FavoriteButton from './FavoriteButton'
import SleepTimer from './SleepTimer'

export default function PlayerBar({
  radio,
  isPlaying,
  isLoading,
  volume,
  error,
  isFavorite,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onTogglePlay,
  onStop,
  onVolumeChange,
  onToggleFavorite,
  sleepMinutes,
  onSleepMinutesChange,
  sleepRemainingSeconds,
  isSleepActive,
  onSleepStart,
  onSleepCancel,
}) {
  if (!radio) return null

  return (
    <footer className="player-bar" style={{ '--radio-color': radio.color }}>
      <div className="player-bar__inner">
        <div className="player-bar__info">
          <RadioIcon radio={radio} size="sm" className="player-bar__icon" />
          <div className="player-bar__details">
            <p className="player-bar__name">{radio.name}</p>
            <p className="player-bar__meta">
              {radio.frequency} · {radio.city}
              {error && <span className="player-bar__error"> — {error}</span>}
            </p>
          </div>
          <Equalizer active={isPlaying} />
        </div>

        <div className="player-bar__controls">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite(radio.id)}
            radioName={radio.name}
            className="player-bar__favorite"
          />

          <div className="player-bar__transport">
            <button
              type="button"
              className="player-bar__btn"
              onClick={onPrevious}
              disabled={!hasPrevious}
              aria-label="Rádio anterior"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
              </svg>
            </button>

            <button
              type="button"
              className="player-bar__btn player-bar__btn--primary"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            >
            {isLoading ? (
              <span className="player-bar__spinner" />
            ) : isPlaying ? (
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

            <button
              type="button"
              className="player-bar__btn"
              onClick={onNext}
              disabled={!hasNext}
              aria-label="Próxima rádio"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 18V6h2v12h-2zM6 18l8.5-6L6 6v12z" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="player-bar__btn"
            onClick={onStop}
            aria-label="Parar"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>

          <SleepTimer
            minutes={sleepMinutes}
            onMinutesChange={onSleepMinutesChange}
            remainingSeconds={sleepRemainingSeconds}
            isActive={isSleepActive}
            onStart={onSleepStart}
            onCancel={onSleepCancel}
          />

          <div className="player-bar__volume">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M11 5L6 9H3v6h3l5 4V5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M15 9a4 4 0 010 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              aria-label="Volume"
              className="player-bar__slider"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
