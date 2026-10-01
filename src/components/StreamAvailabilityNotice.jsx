import { STREAM_STATUS, STREAM_STATUS_CHECKED_AT } from '../data/streamStatus.js'

export default function StreamAvailabilityNotice({ radio }) {
  const status = STREAM_STATUS[radio.id]
  if (!radio.catalogNote && status?.ok !== false) return null
  return <aside className="stream-status-notice" aria-label="Disponibilidade da transmissão">
    {radio.catalogNote && <p>{radio.catalogNote}</p>}
    {radio.verificationUrl && <a href={radio.verificationUrl} target="_blank" rel="noopener noreferrer">Consultar a fonte desta atualização</a>}
    {status?.ok === false && <p>A transmissão não respondeu com áudio no teste de <time dateTime={STREAM_STATUS_CHECKED_AT}>{STREAM_STATUS_CHECKED_AT.slice(0, 10).split('-').reverse().join('/')}</time>. A disponibilidade pode mudar; você pode tentar novamente{radio.websiteUrl ? <> ou consultar o <a href={radio.websiteUrl} target="_blank" rel="noopener noreferrer">player oficial</a></> : ''}.</p>}
  </aside>
}
