import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePrivacyChoice, isAnalyticsEnabled, savePrivacyChoice, PRIVACY_KEY } from '../src/utils/privacy.js'
import { trackOwnAnalytics } from '../src/utils/analytics.js'
import collect from '../api/analytics.js'
import { startGoogleAnalytics, stopGoogleAnalytics } from '../src/utils/googleAnalytics.js'

test('consentimento exige escolha válida e expira após 180 dias', () => {
  const now = 20000000000
  const value = (analytics, savedAt = now) => JSON.stringify({ version: 1, analytics, savedAt })
  assert.equal(parsePrivacyChoice(value(true), now), 'accepted')
  assert.equal(parsePrivacyChoice(value(false), now), 'rejected')
  for (const invalid of [null, '{}', 'bad', value('true'), value(true, now + 1), value(true, now - 180 * 86400000)]) {
    assert.equal(parsePrivacyChoice(invalid, now), null)
  }
})

test('coleta exige permissão e interrompe novos eventos após revogação', async () => {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  const values = new Map()
  const sent = []
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }
  globalThis.window = { localStorage: storage, sessionStorage: storage, location: { pathname: '/' }, dispatchEvent() {} }
  globalThis.document = { referrer: '' }
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { sendBeacon: (...args) => sent.push(args) } })
  try {
    assert.equal(isAnalyticsEnabled(), false)
    trackOwnAnalytics('presence')
    savePrivacyChoice(false)
    trackOwnAnalytics('audio_start')
    assert.equal(sent.length, 0)
    savePrivacyChoice(true)
    assert.equal(isAnalyticsEnabled(), true)
    trackOwnAnalytics('page_view')
    assert.equal(sent.length, 1)
    const payload = JSON.parse(await sent[0][1].text())
    assert.equal(Object.hasOwn(payload, 'analyticsConsent'), false)
    assert.equal(payload.event, 'page_view')
    values.set('fm-analytics-session', 'old-id')
    savePrivacyChoice(false)
    trackOwnAnalytics('presence')
    assert.equal(values.has('fm-analytics-session'), false)
    assert.equal(sent.length, 1)
    assert.equal(parsePrivacyChoice(values.get(PRIVACY_KEY)), 'rejected')
  } finally {
    globalThis.window = originalWindow
    globalThis.document = originalDocument
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator)
    else delete globalThis.navigator
  }
})

test('Google Analytics só carrega após permissão e é desabilitado na revogação', () => {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document
  const values = new Map()
  const scripts = new Map()
  const deletedCookies = []
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }
  globalThis.window = { localStorage: storage, sessionStorage: storage, location: { origin: 'https://radiofmonline.com.br', hostname: 'radiofmonline.com.br', pathname: '/sao-paulo/band-fm' }, dispatchEvent() {} }
  globalThis.document = {
    referrer: 'https://example.com/?private=value',
    getElementById: (id) => scripts.get(id),
    createElement: () => ({ remove() { scripts.delete(this.id) } }),
    head: { append: (script) => scripts.set(script.id, script) },
    get cookie() { return '_ga=id; fm-theme=dark' },
    set cookie(value) { deletedCookies.push(value) },
  }
  try {
    savePrivacyChoice(false)
    startGoogleAnalytics()
    assert.equal(scripts.size, 0)
    savePrivacyChoice(true)
    startGoogleAnalytics()
    assert.equal(scripts.size, 1)
    const config = window.dataLayer.find((args) => args[0] === 'config')[2]
    assert.equal(config.page_referrer, 'https://example.com/')
    assert.equal(config.page_location, 'https://radiofmonline.com.br/sao-paulo/band-fm')
    assert.equal(config.allow_ad_personalization_signals, false)
    savePrivacyChoice(false)
    stopGoogleAnalytics()
    assert.equal(window['ga-disable-G-HYS05PXX4N'], true)
    assert.equal(scripts.size, 0)
    assert.ok(deletedCookies.some((cookie) => cookie.startsWith('_ga=')))
    assert.ok(deletedCookies.every((cookie) => !cookie.startsWith('fm-theme=')))
  } finally {
    globalThis.window = originalWindow
    globalThis.document = originalDocument
  }
})

test('servidor não exige campo de consentimento para registrar evento', async () => {
  const res = { status(code) { this.code = code; return this }, json(body) { this.body = body; return this } }
  const previousSalt = process.env.ANALYTICS_SALT
  const previousPassword = process.env.PAINEL_PASS
  delete process.env.ANALYTICS_SALT
  delete process.env.PAINEL_PASS
  try {
    await collect({ method: 'POST', headers: {}, body: { event: 'page_view', sessionId: 'session-id', path: '/' } }, res)
    assert.equal(res.code, 503)
    assert.equal(res.body.error, 'ANALYTICS_SALT nao configurado')
  } finally {
    if (previousSalt === undefined) delete process.env.ANALYTICS_SALT
    else process.env.ANALYTICS_SALT = previousSalt
    if (previousPassword === undefined) delete process.env.PAINEL_PASS
    else process.env.PAINEL_PASS = previousPassword
  }
})
