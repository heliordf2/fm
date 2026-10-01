import { useEffect } from 'react'
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from '../config/adsense.js'

export default function AdSenseLoader() {
  useEffect(() => {
    if (!ADSENSE_ENABLED || window.location.pathname !== '/' || document.getElementById('fm-adsense')) return
    const script = document.createElement('script')
    script.id = 'fm-adsense'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
    document.head.append(script)
  }, [])
  return null
}
