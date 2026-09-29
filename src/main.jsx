import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import DirectPageLoader from './pages/DirectPageLoader.jsx'
import OwnAnalytics from './components/OwnAnalytics.jsx'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {})
  })
}

const isRootPage = window.location.pathname === '/'
const isRetiredAnalyticsPage = /^\/analytics(?:\/|$)/.test(window.location.pathname)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isRootPage ? <App /> : <DirectPageLoader routeKey="direct" />}
    {!isRetiredAnalyticsPage && <OwnAnalytics />}
    {!isRetiredAnalyticsPage && <Analytics />}
  </StrictMode>,
)
