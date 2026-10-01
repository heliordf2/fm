import { hasAnalyticsConsent } from './privacy.js'

const ID = 'G-HYS05PXX4N'
const SCRIPT_ID = 'fm-google-analytics'

export function startGoogleAnalytics() {
  if (!hasAnalyticsConsent()) return
  window[`ga-disable-${ID}`] = false
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', ID, {
    page_location: `${window.location.origin}${window.location.pathname}`,
    page_referrer: document.referrer.split(/[?#]/)[0],
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`
    document.head.append(script)
  }
}

export function stopGoogleAnalytics() {
  window[`ga-disable-${ID}`] = true
  document.getElementById(SCRIPT_ID)?.remove()
  window.dataLayer = []
  // Remove GA cookies accessible to this origin; do not erase product preferences.
  const labels = window.location.hostname.split('.')
  const domains = ['', window.location.hostname, ...labels.slice(0, -1).map((_, index) => `.${labels.slice(index).join('.')}`)]
  for (const part of document.cookie.split(';')) {
    const name = part.trim().split('=')[0]
    if (name !== '_ga' && !name.startsWith('_ga_')) continue
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}; SameSite=Lax`
  }
}
