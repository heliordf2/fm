import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DirectPage from './pages/DirectPage.jsx'

const isDirectPage = window.location.pathname.startsWith('/radio/') ||
  window.location.pathname === '/radios/sao-paulo' ||
  window.location.pathname === '/guia/como-ouvir-radio-online'
const isRootPage = window.location.pathname === '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isRootPage ? <App /> : <DirectPage key={isDirectPage ? 'direct' : 'not-found'} />}
  </StrictMode>,
)
