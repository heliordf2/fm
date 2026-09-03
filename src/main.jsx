import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import DirectPageLoader from './pages/DirectPageLoader.jsx'
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx'
import OwnAnalytics from './components/OwnAnalytics.jsx'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {})
  })
}

const isRootPage = window.location.pathname === '/'
const isAnalyticsPage = window.location.pathname.replace(/\/+$/, '') === '/analytics'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAnalyticsPage ? <AnalyticsDashboard /> : isRootPage ? <App /> : <DirectPageLoader routeKey="direct" />}
    <OwnAnalytics />
    <Analytics />
  </StrictMode>,
)
