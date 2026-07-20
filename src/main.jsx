import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DirectPageLoader from './pages/DirectPageLoader.jsx'

const isDirectPage = window.location.pathname.startsWith('/radio/') ||
  window.location.pathname.startsWith('/radios/') ||
  window.location.pathname === '/guia/como-ouvir-radio-online'
const isRootPage = window.location.pathname === '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isRootPage ? <App /> : <DirectPageLoader routeKey={isDirectPage ? 'direct' : 'not-found'} />}
  </StrictMode>,
)
