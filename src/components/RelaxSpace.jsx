import { lazy, Suspense } from 'react'
import './RelaxSpace.css'

const RelaxPlayer = lazy(() => import('./RelaxPlayer.jsx'))

export default function RelaxSpace({ onBeforePlay }) {
  return <section className="relax-space" id="relaxar" aria-labelledby="relax-title">
    <div className="relax-heading"><div><p className="relax-kicker">Uma pausa no seu dia</p><h2 id="relax-title">Sons para relaxar</h2><p>Natureza, ruídos suaves e instrumentos sintetizados para acompanhar seus momentos de descanso.</p></div></div>
    <div id="relax-content"><Suspense fallback={<p role="status">Carregando controles…</p>}><RelaxPlayer onBeforePlay={onBeforePlay} /></Suspense></div>
    <p className="relax-note">Os ambientes e instrumentos são sintetizados no navegador. Escolha um som para ouvir; ao iniciar uma rádio, o ambiente para.</p>
  </section>
}
