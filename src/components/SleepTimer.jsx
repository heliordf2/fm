import { useState } from 'react'
import { createPortal } from 'react-dom'

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
  panelAnchor,
}) {
  const [open, setOpen] = useState(false)

  const handleStart = () => {
    if (onStart()) setOpen(false)
  }

  const panel = open ? (
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
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="minutos"
            value={minutes}
            onChange={(e) => {
              const value = e.target.value
              if (value === '') {
                onMinutesChange('')
                return
              }
              const parsed = parseInt(value, 10)
              if (!Number.isNaN(parsed) && parsed >= 0) {
                onMinutesChange(String(parsed))
              }
            }}
            className="sleep-timer__input"
            aria-label="Minutos para pausar"
          />
          <button
            type="button"
            className="sleep-timer__action"
            onClick={handleStart}
            disabled={!minutes || parseInt(minutes, 10) < 1}
          >
            Iniciar
          </button>
        </>
      )}
    </div>
  ) : null

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

      {panelAnchor && panel ? createPortal(panel, panelAnchor) : null}

      {isActive && !open && (
        <span className="sleep-timer__badge" aria-live="polite">
          {formatRemaining(remainingSeconds)}
        </span>
      )}
    </div>
  )
}
