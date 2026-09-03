import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { trackOwnAnalytics } from '../utils/analytics'

const MAX_RECONNECT_ATTEMPTS = 6
const RECONNECT_BASE_DELAY_MS = 2000
const RECONNECT_MAX_DELAY_MS = 30000

function getMediaErrorMessage(audio) {
  const code = audio?.error?.code
  if (code === MediaError.MEDIA_ERR_NETWORK) {
    return 'Não foi possível conectar à rádio. Tente novamente.'
  }
  if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
    return 'Stream indisponível ou formato não suportado.'
  }
  return 'Não foi possível reproduzir esta rádio.'
}

function getPlayErrorMessage(err, audio) {
  if (err?.name === 'NotAllowedError') {
    return 'Clique no botão play para iniciar a reprodução.'
  }
  if (err?.name === 'AbortError') {
    return null
  }
  return getMediaErrorMessage(audio)
}

export function useAudioPlayer() {
  const audioRef = useRef(null)
  const currentIdRef = useRef(null)
  const currentRadioRef = useRef(null)
  const isPlayingRef = useRef(false)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)

  const [currentRadio, setCurrentRadio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [error, setError] = useState(null)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audioRef.current = audio

    const clearReconnectTimer = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }

    const attemptReconnect = () => {
      const radio = currentRadioRef.current
      if (!radio || reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) return
      const delay = Math.min(RECONNECT_BASE_DELAY_MS * 2 ** reconnectAttemptsRef.current, RECONNECT_MAX_DELAY_MS)
      reconnectAttemptsRef.current += 1
      reconnectTimeoutRef.current = setTimeout(() => {
        if (currentRadioRef.current !== radio) return
        audio.src = radio.streamUrl
        audio.load()
        const promise = audio.play()
        if (promise) promise.catch(() => {})
      }, delay)
    }

    const handlePlaying = () => {
      isPlayingRef.current = true
      setIsPlaying(true)
      setIsLoading(false)
      setError(null)
      reconnectAttemptsRef.current = 0
      clearReconnectTimer()
      const radio = currentRadioRef.current
      trackOwnAnalytics('audio_start', { radioId: radio?.id, radioName: radio?.name })
    }

    const handlePause = () => {
      isPlayingRef.current = false
      setIsPlaying(false)
    }

    const handleWaiting = () => setIsLoading(true)

    const handleCanPlay = () => setIsLoading(false)

    const handleError = () => {
      isPlayingRef.current = false
      setIsPlaying(false)
      setIsLoading(false)
      const radio = currentRadioRef.current
      trackOwnAnalytics('audio_error', { radioId: radio?.id, radioName: radio?.name })
      if (currentRadioRef.current && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        attemptReconnect()
      } else {
        setError(getMediaErrorMessage(audio))
      }
    }

    const handleOnline = () => {
      if (isPlayingRef.current || !currentRadioRef.current) return
      clearReconnectTimer()
      reconnectAttemptsRef.current = 0
      attemptReconnect()
    }

    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    window.addEventListener('online', handleOnline)

    return () => {
      clearReconnectTimer()
      window.removeEventListener('online', handleOnline)
      audio.pause()
      audio.src = ''
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (!isPlaying || typeof window === 'undefined' || typeof window.gtag !== 'function') return

    const HEARTBEAT_MS = 20000
    const sendHeartbeat = () => {
      window.gtag('event', 'audio_heartbeat', {
        radio_id: currentRadio?.id,
        radio_name: currentRadio?.name,
        engagement_time_msec: HEARTBEAT_MS,
      })
    }

    sendHeartbeat()
    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_MS)
    return () => clearInterval(intervalId)
  }, [isPlaying, currentRadio])

  useEffect(() => {
    if (!isPlaying || !currentRadio) return

    const HEARTBEAT_SECONDS = 60
    const intervalId = setInterval(() => {
      trackOwnAnalytics('audio_heartbeat', {
        radioId: currentRadio.id,
        radioName: currentRadio.name,
        durationSeconds: HEARTBEAT_SECONDS,
      })
    }, HEARTBEAT_SECONDS * 1000)
    return () => clearInterval(intervalId)
  }, [isPlaying, currentRadio])

  useEffect(() => {
    if (!isPlaying) return

    const HEARTBEAT_MS = 60000
    const sendHeartbeat = () => {
      track('audio_heartbeat', { radio_id: currentRadio?.id, radio_name: currentRadio?.name })
    }

    sendHeartbeat()
    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_MS)
    return () => clearInterval(intervalId)
  }, [isPlaying, currentRadio])

  const play = useCallback((radio) => {
    const audio = audioRef.current
    if (!audio || !radio) return

    setError(null)

    if (currentIdRef.current === radio.id) {
      if (isPlayingRef.current) {
        audio.pause()
        return
      }

      setIsLoading(true)
      const promise = audio.play()
      if (promise) {
        promise.catch((err) => {
          setIsLoading(false)
          const message = getPlayErrorMessage(err, audio)
          if (message) setError(message)
        })
      }
      return
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    reconnectAttemptsRef.current = 0

    audio.pause()
    audio.src = radio.streamUrl
    audio.load()

    currentIdRef.current = radio.id
    currentRadioRef.current = radio
    setCurrentRadio(radio)
    setIsLoading(true)

    const promise = audio.play()
    if (promise) {
      promise.catch((err) => {
        setIsLoading(false)
        const message = getPlayErrorMessage(err, audio)
        if (message) setError(message)
      })
    }
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    reconnectAttemptsRef.current = 0

    audio.pause()
    audio.removeAttribute('src')
    audio.load()

    currentIdRef.current = null
    currentRadioRef.current = null
    isPlayingRef.current = false
    setCurrentRadio(null)
    setIsPlaying(false)
    setIsLoading(false)
    setError(null)
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !isPlayingRef.current) return

    audio.pause()
  }, [])

  const togglePlay = useCallback(() => {
    if (!currentRadio) return
    play(currentRadio)
  }, [currentRadio, play])

  return {
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
  }
}
