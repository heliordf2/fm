import Equalizer from './Equalizer.jsx'
import { RELAX_SOUNDS } from '../utils/relaxAudio.js'

export default function RelaxPlayerBar({ active, isPlaying, isLoading, volume, minutes, onPrevious, onNext, onTogglePlay, onStop, onVolumeChange, onMinutesChange }) {
  if (!active) return null
  const sound = RELAX_SOUNDS.find((item) => item.id === active)
  const currentIndex = RELAX_SOUNDS.findIndex((item) => item.id === active)
  const previous = RELAX_SOUNDS[(currentIndex - 1 + RELAX_SOUNDS.length) % RELAX_SOUNDS.length]
  const next = RELAX_SOUNDS[(currentIndex + 1) % RELAX_SOUNDS.length]

  return <footer className="player-bar relax-player-bar" style={{ '--radio-color': '#8b5cf6' }}>
    <div className="player-bar__inner">
      <div className="player-bar__info">
        <span className="relax-player-bar__symbol" aria-hidden="true">{sound.symbol}</span>
        <div className="player-bar__details">
          <p className="player-bar__name">{sound.name}</p>
          <p className="player-bar__meta">{sound.description}</p>
        </div>
        <Equalizer active={isPlaying} />
      </div>
      <div className="player-bar__controls">
        <div className="player-bar__transport">
          <button type="button" className="player-bar__btn" onClick={onPrevious} aria-label={`Som anterior: ${previous.name}`}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" /></svg>
          </button>
          <button type="button" className="player-bar__btn player-bar__btn--primary" onClick={onTogglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pausar som' : 'Tocar som'}>
            {isLoading ? <span className="player-bar__spinner" /> : isPlaying ? <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
          </button>
          <button type="button" className="player-bar__btn" onClick={onNext} aria-label={`Próximo som: ${next.name}`}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 18V6h2v12h-2zM6 18l8.5-6L6 6v12z" /></svg>
          </button>
        </div>
        <button type="button" className="player-bar__btn player-bar__btn--stop" onClick={onStop} aria-label="Parar som"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg></button>
        <label className="relax-player-bar__timer">Sessão<select value={minutes} disabled={isPlaying || isLoading} onChange={(event) => onMinutesChange(Number(event.target.value))}><option value="0">Sem timer</option>{[5, 15, 30, 60].map((value) => <option value={value} key={value}>{value} min</option>)}</select></label>
      </div>
      <div className="player-bar__volume"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M15 9a4 4 0 010 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg><input type="range" min="0" max="100" value={volume} onChange={(event) => onVolumeChange(Number(event.target.value))} aria-label="Volume" className="player-bar__slider" /></div>
    </div>
  </footer>
}
