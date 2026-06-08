import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT } from '../config/adsense'

export default function AdUnit({ slot, format = 'auto', className, label = 'Publicidade' }) {
  const insRef = useRef(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!slot || loadedRef.current || !insRef.current) return

    loadedRef.current = true

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      loadedRef.current = false
    }
  }, [slot])

  if (!slot) return null

  return (
    <aside className={`ad-unit ${className || ''}`} aria-label={label}>
      <span className="ad-unit__label">{label}</span>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  )
}
