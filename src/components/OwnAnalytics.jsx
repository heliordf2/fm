import { useEffect } from 'react'
import { trackOwnAnalytics } from '../utils/analytics'
import { hasAnalyticsConsent } from '../utils/privacy.js'

let pageViewSent = false
let lastPresenceAt = 0

export default function OwnAnalytics() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!pageViewSent) {
      pageViewSent = true
      trackOwnAnalytics('page_view', {
        metadata: {
          utm_source: params.get('utm_source') || '',
          utm_medium: params.get('utm_medium') || '',
          utm_campaign: params.get('utm_campaign') || '',
        },
      })
    }

    const sendPresence = () => {
      const now = Date.now()
      if (document.visibilityState === 'visible' && now - lastPresenceAt >= 10000) {
        lastPresenceAt = now
        trackOwnAnalytics('presence')
      }
    }
    sendPresence()
    const intervalId = setInterval(sendPresence, 60000)
    document.addEventListener('visibilitychange', sendPresence)
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', sendPresence)
      if (!hasAnalyticsConsent()) { pageViewSent = false; lastPresenceAt = 0 }
    }
  }, [])
  return null
}
