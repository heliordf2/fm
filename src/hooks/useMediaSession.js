import { useEffect } from 'react'

const setHandler = (action, handler) => {
  try {
    navigator.mediaSession.setActionHandler(action, handler)
  } catch {
    // Alguns navegadores implementam apenas parte da Media Session API.
  }
}

const getArtwork = (radio) => {
  const artwork = []
  if (radio?.logo) {
    artwork.push({ src: new URL(radio.logo, window.location.origin).href })
  }
  artwork.push({ src: new URL('/fm-online.svg?v=2', window.location.origin).href, sizes: '512x512', type: 'image/svg+xml' })
  return artwork
}

export function useMediaSession({ radio, isPlaying, onPlay, onPause, onStop, onPrevious, onNext, hasPrevious, hasNext }) {
  useEffect(() => {
    if (!('mediaSession' in navigator) || !('MediaMetadata' in window)) return

    if (!radio) {
      navigator.mediaSession.metadata = null
      navigator.mediaSession.playbackState = 'none'
      return
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: radio.name,
      artist: [radio.frequency, radio.city].filter(Boolean).join(' · '),
      album: 'Rádio FM Online',
      artwork: getArtwork(radio),
    })
  }, [radio])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = radio ? (isPlaying ? 'playing' : 'paused') : 'none'
  }, [isPlaying, radio])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    setHandler('play', onPlay)
    setHandler('pause', onPause)
    setHandler('stop', onStop)
    setHandler('previoustrack', hasPrevious ? onPrevious : null)
    setHandler('nexttrack', hasNext ? onNext : null)

    return () => {
      setHandler('play', null)
      setHandler('pause', null)
      setHandler('stop', null)
      setHandler('previoustrack', null)
      setHandler('nexttrack', null)
    }
  }, [hasNext, hasPrevious, onNext, onPause, onPlay, onPrevious, onStop])
}
