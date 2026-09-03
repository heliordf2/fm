const ENDPOINT = '/api/analytics'
const SESSION_KEY = 'fm-analytics-session'

function getSessionId() {
  const createId = () => typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = createId()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return createId()
  }
}

function safeReferrer() {
  if (!document.referrer) return null
  try {
    const url = new URL(document.referrer)
    return `${url.origin}${url.pathname}`.slice(0, 500)
  } catch {
    return null
  }
}

export function trackOwnAnalytics(event, details = {}) {
  if (typeof window === 'undefined' || window.location.pathname === '/analytics') return
  const payload = JSON.stringify({
    event,
    sessionId: getSessionId(),
    path: `${window.location.pathname}${window.location.search}`.slice(0, 500),
    referrer: safeReferrer(),
    ...details,
  })

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }))
    return
  }
  fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {})
}
