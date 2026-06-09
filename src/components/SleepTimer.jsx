import { useState } from 'react'

function formatRemaining(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export default function SleepTimer({
  minutes,
  onMinutesChange,
  remainingSeconds,
  isActive,
  onStart,
  onCancel,
}) {
  const [open, setOpen] = useState(false)

  const handleStart = () => {
    if (onStart()) setOpen(false)
  }

  return (
    <div className={`sleep-timer ${open ? 'sleep-timer--open' : ''}`}>
      <button
        type="button"
        className={`player-bar__btn sleep-timer__toggle ${isActive ? 'sleep-timer__toggle--active' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Timer de sleep"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="sleep-timer__panel">
          {isActive ? (
            <>
              <span className="sleep-timer__countdown">
                Pausa em {formatRemaining(remainingSeconds)}
              </span>
              <button
                type="button"
                className="sleep-timer__action sleep-timer__action--cancel"
                onClick={onCancel}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <label className="sleep-timer__label" htmlFor="sleep-minutes">
                Sleep
              </label>
              <input
                id="sleep-minutes"
                type="number"
                min="0.1"
                step="any"
                inputMode="decimal"
                placeholder="min"
                value={minutes}
                onChange={(e) => onMinutesChange(e.target.value)}
                className="sleep-timer__input"
                aria-label="Minutos para pausar"
              />
              <button
                type="button"
                className="sleep-timer__action"
                onClick={handleStart}
                disabled={!minutes || Number(minutes) <= 0}
              >
                Iniciar
              </button>
            </>
          )}
        </div>
      )}

      {isActive && !open && (
        <span className="sleep-timer__badge" aria-live="polite">
          {formatRemaining(remainingSeconds)}
        </span>
      )}
    </div>
  )
}
