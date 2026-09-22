import { lazy, Suspense, useState } from 'react'
import './RelaxSpace.css'

const RelaxPlayer = lazy(() => import('./RelaxPlayer.jsx'))

export default function RelaxSpace({ onBeforePlay }) {
  const [open, setOpen] = useState(false)
  return <section className="relax-space" id="relaxar" aria-labelledby="relax-title">
    <div className="relax-heading"><div><p className="relax-kicker">Uma pausa no seu dia</p><h2 id="relax-title">Sons para relaxar</h2><p>Chuva, ondas e tons suaves para acompanhar seus momentos de descanso.</p></div><button type="button" className="relax-open" aria-expanded={open} aria-controls="relax-content" onClick={() => setOpen(!open)}>{open ? 'Fechar e parar' : 'Explorar sons'}</button></div>
    <div id="relax-content" hidden={!open}>{open && <Suspense fallback={<p role="status">Carregando controles…</p>}><RelaxPlayer onBeforePlay={onBeforePlay} /></Suspense>}</div>
    <p className="relax-note">Ambientes sintetizados, inspirados na natureza, e tons instrumentais contínuos. Escolha um som para ouvir; ao iniciar uma rádio, o ambiente para.</p>
  </section>
}
