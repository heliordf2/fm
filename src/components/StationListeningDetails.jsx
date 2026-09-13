import { LISTENING_DETAILS } from '../data/listeningDetails.js'

export default function StationListeningDetails({ radioId }) {
  const details = LISTENING_DETAILS[radioId]
  if (!details) return null
  return <section className="station-listening-details">
    {details.sections.map((section) => <div key={section.title}><h2>{section.title}</h2><p>{section.text}</p></div>)}
    <aside className="direct-editorial-sources"><h3>Fontes destas orientações de escuta</h3>
      <p>Consulta das fontes em <time dateTime={details.reviewedOn}>{details.reviewedOn.split('-').reverse().join('/')}</time>. As orientações não representam monitoramento ao vivo da programação.</p>
      <ul>{details.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
    </aside>
  </section>
}
