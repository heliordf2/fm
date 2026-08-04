import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import DirectPageLoader from './pages/DirectPageLoader.jsx'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {})
  })
}

const isDirectPage = window.location.pathname.startsWith('/radio/') ||
  window.location.pathname.startsWith('/radios/') ||
  window.location.pathname === '/guia/como-ouvir-radio-online'
const isRootPage = window.location.pathname === '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isRootPage ? <App /> : <DirectPageLoader routeKey={isDirectPage ? 'direct' : 'not-found'} />}
    <Analytics />
  </StrictMode>,
)
