import { useCallback, useEffect, useRef, useState } from 'react'
import { createRelaxAudio, RELAX_SOUNDS } from '../utils/relaxAudio.js'

export default function RelaxPlayer({ onBeforePlay }) {
  const engine = useRef(null)
  const generation = useRef(0)
  const deadline = useRef(null)
  const [active, setActive] = useState(null)
  const [volume, setVolume] = useState(35)
  const [minutes, setMinutes] = useState(15)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const stop = useCallback(() => {
    generation.current += 1
    engine.current?.close()
    engine.current = null
    deadline.current = null
    setActive(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    const expire = () => {
      if (deadline.current && Date.now() >= deadline.current) stop()
    }
    window.addEventListener('fm:radio-play', stop)
    document.addEventListener('visibilitychange', expire)
    const timer = window.setInterval(expire, 1000)
    return () => {
      generation.current += 1
      engine.current?.close()
      window.clearInterval(timer)
      window.removeEventListener('fm:radio-play', stop)
      document.removeEventListener('visibilitychange', expire)
    }
  }, [stop])

  const start = useCallback(async (id) => {
    stop()
    setError('')
    setLoading(true)
    const token = generation.current
    try {
      const audio = createRelaxAudio(id, volume / 100, minutes, window.AudioContext || window.webkitAudioContext)
      engine.current = audio
      onBeforePlay()
      await audio.resume()
      if (generation.current !== token) return
      deadline.current = minutes ? Date.now() + minutes * 60000 : null
      setActive(id)
      setLoading(false)
    } catch {
      if (generation.current !== token) return
      stop()
      setError('Não foi possível iniciar o som. Tente novamente ou use outro navegador.')
    }
  }, [minutes, onBeforePlay, stop, volume])

  return <div className="relax-player">
    <div className="relax-sounds">{RELAX_SOUNDS.map((sound) => <button key={sound.id} type="button" className="relax-sound" aria-pressed={active === sound.id} disabled={loading} onClick={() => active === sound.id ? stop() : start(sound.id)}>
      <span className="relax-symbol" aria-hidden="true">{sound.symbol}</span>
      <strong>{sound.name}</strong><span>{sound.description}</span>
      <small>{active === sound.id ? '■ Parar' : '▶ Ouvir'}</small>
    </button>)}</div>
    <div className="relax-controls">
      <label htmlFor="relax-volume">Volume · {volume}%<input id="relax-volume" type="range" min="0" max="100" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); engine.current?.setVolume(value / 100) }} /></label>
      <label htmlFor="relax-timer">Desligar após<select id="relax-timer" value={minutes} disabled={Boolean(active) || loading} onChange={(event) => setMinutes(Number(event.target.value))}><option value="0">Sem temporizador</option>{[5, 15, 30, 60].map((value) => <option value={value} key={value}>{value} minutos</option>)}</select></label>
      <button className="relax-stop" type="button" disabled={!active && !loading} onClick={stop}>Parar som</button>
    </div>
    <p className="relax-status" role="status">{loading ? 'Preparando som…' : active ? `${RELAX_SOUNDS.find((sound) => sound.id === active).name} em reprodução${minutes ? ` · sessão de ${minutes} minutos` : ''}.` : 'Escolha um ambiente para começar.'}</p>
    {error && <p role="alert">{error}</p>}
  </div>
}
