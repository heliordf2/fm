import { reportPrivacyChoice } from './privacyCounts.js'

export const PRIVACY_KEY = 'fm-privacy-v1'
const MAX_AGE = 180 * 24 * 60 * 60 * 1000
let volatileChoice = null

export function parsePrivacyChoice(value, now = Date.now()) {
  try {
    const choice = JSON.parse(value)
    if (choice?.version !== 1 || typeof choice.analytics !== 'boolean' ||
      !Number.isFinite(choice.savedAt) || choice.savedAt > now || now - choice.savedAt >= MAX_AGE) return null
    return choice.analytics ? 'accepted' : 'rejected'
  } catch { return null }
}

export function getPrivacyChoice() {
  if (typeof window === 'undefined') return null
  try { return parsePrivacyChoice(window.localStorage.getItem(PRIVACY_KEY) ?? volatileChoice) }
  catch { return parsePrivacyChoice(volatileChoice) }
}

export function hasAnalyticsConsent() {
  return getPrivacyChoice() === 'accepted'
}

export function savePrivacyChoice(analytics) {
  const previous = getPrivacyChoice()
  const next = analytics ? 'accepted' : 'rejected'
  const value = JSON.stringify({ version: 1, analytics, savedAt: Date.now() })
  volatileChoice = null
  try {
    window.localStorage.setItem(PRIVACY_KEY, value)
  } catch { volatileChoice = value }
  if (!analytics) {
    try { window.sessionStorage.removeItem('fm-analytics-session') } catch { /* Storage unavailable. */ }
  }
  window.dispatchEvent(new Event('fm-privacy-change'))
  if (previous !== next) reportPrivacyChoice(next)
}

export function subscribePrivacy(listener) {
  const onStorage = (event) => {
    if (event.key === PRIVACY_KEY || event.key === null) {
      volatileChoice = null
      listener()
    }
  }
  window.addEventListener('fm-privacy-change', listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener('fm-privacy-change', listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function openPrivacySettings() {
  window.dispatchEvent(new Event('fm-privacy-open'))
}
