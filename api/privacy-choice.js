import { getSql } from './_lib/analytics-db.js'
import { countPrivacyChoice } from './_lib/privacy-counts.js'

export function createPrivacyChoiceHandler(recordChoice = (choice) => countPrivacyChoice(getSql(), choice)) {
  return async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store')
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST')
      return response.status(405).json({ error: 'Metodo nao permitido' })
    }
    // Only the site's own UI can submit. No cross-origin tracking endpoint.
    try {
      const origin = new URL(request.headers.origin)
      const host = request.headers['x-forwarded-host'] || request.headers.host
      if (origin.host !== host) return response.status(403).json({ error: 'Origem invalida' })
    } catch { return response.status(403).json({ error: 'Origem invalida' }) }
    if (/bot|crawler|spider|preview|headless|lighthouse/i.test(request.headers['user-agent'] || '')) {
      return response.status(202).json({ counted: false })
    }
    let body
    try { body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body }
    catch { return response.status(400).json({ error: 'Escolha invalida' }) }
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length !== 1 ||
      !['accepted', 'rejected'].includes(body.choice)) return response.status(400).json({ error: 'Escolha invalida' })
    try {
      await recordChoice(body.choice)
      return response.status(202).json({ counted: true })
    } catch {
      return response.status(503).json({ error: 'Contador indisponivel' })
    }
  }
}

export default createPrivacyChoiceHandler()
