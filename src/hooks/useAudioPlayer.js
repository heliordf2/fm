import { useCallback, useEffect, useRef, useState } from 'react'

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
  const isPlayingRef = useRef(false)

  const [currentRadio, setCurrentRadio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [error, setError] = useState(null)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audioRef.current = audio

    const handlePlaying = () => {
      isPlayingRef.current = true
      setIsPlaying(true)
      setIsLoading(false)
      setError(null)
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
      setError(getMediaErrorMessage(audio))
    }

    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
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

    audio.pause()
    audio.src = radio.streamUrl
    audio.load()

    currentIdRef.current = radio.id
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

    audio.pause()
    audio.removeAttribute('src')
    audio.load()

    currentIdRef.current = null
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
