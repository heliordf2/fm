import { useEffect, useState, useSyncExternalStore } from 'react'
import { Analytics } from '@vercel/analytics/react'
import OwnAnalytics from './OwnAnalytics.jsx'
import { getPrivacyChoice, hasAnalyticsConsent, savePrivacyChoice, subscribePrivacy } from '../utils/privacy.js'
import { startGoogleAnalytics, stopGoogleAnalytics } from '../utils/googleAnalytics.js'
import './PrivacyControls.css'

function ConsentedAnalytics() {
  useEffect(() => {
    startGoogleAnalytics()
    return stopGoogleAnalytics
  }, [])
  return <><OwnAnalytics /><Analytics beforeSend={(event) => hasAnalyticsConsent() ? { ...event, url: event.url.split(/[?#]/)[0] } : null} /></>
}

export default function PrivacyControls() {
  const choice = useSyncExternalStore(subscribePrivacy, getPrivacyChoice, () => null)
  const [open, setOpen] = useState(() => new URLSearchParams(window.location.search).get('privacy') === '1')
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('fm-privacy-open', show)
    return () => window.removeEventListener('fm-privacy-open', show)
  }, [])
  const choose = (analytics) => {
    savePrivacyChoice(analytics)
    setOpen(false)
    const url = new URL(window.location.href)
    if (url.searchParams.has('privacy')) {
      url.searchParams.delete('privacy')
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
  }
  return <>
    {choice === 'accepted' && <ConsentedAnalytics />}
    {(choice === null || open) && <section className="privacy-controls" id="privacy-settings" aria-labelledby="privacy-title">
      <div><h2 id="privacy-title">Sua privacidade</h2>
        <p>Podemos usar Google Analytics, Vercel Analytics e estatísticas próprias para entender visitas e reproduções. Você pode recusar e continuar ouvindo normalmente. Tema e favoritas ficam no seu aparelho. <a href="/privacy-policy.html">Saiba mais</a>.</p>
        {choice && <p>Estatísticas: {choice === 'accepted' ? 'permitidas' : 'recusadas'}.</p>}
        <p>Registramos apenas a quantidade de aceites e recusas em um contador separado, sem identificar visitantes.</p>
      </div>
      <div className="privacy-controls__actions">
        <button className="privacy-controls__allow" type="button" onClick={() => choose(true)}>Permitir estatísticas</button>
        <button type="button" onClick={() => choose(false)}>Recusar estatísticas</button>
        {choice && <button type="button" onClick={() => setOpen(false)}>Fechar</button>}
      </div>
    </section>}
  </>
}
