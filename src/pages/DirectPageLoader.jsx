import { lazy, Suspense } from 'react'

const DirectPage = lazy(() => import('./DirectPage.jsx'))

export default function DirectPageLoader({ routeKey }) {
  return <Suspense fallback={<main aria-busy="true">Carregando página…</main>}><DirectPage key={routeKey} /></Suspense>
}
