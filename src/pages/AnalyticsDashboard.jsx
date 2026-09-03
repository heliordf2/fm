import { useEffect, useMemo, useState } from 'react'
import './AnalyticsDashboard.css'

const PASSWORD_KEY = 'fm-analytics-admin-password'

function formatDuration(seconds = 0) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours ? `${hours}h ${minutes}min` : `${minutes} min`
}

function formatDate(value) {
  if (String(value).includes('T')) {
    return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatTime(value) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatLocation(row) {
  return [row.city, row.region_code, row.country_code].filter(Boolean).join(', ') || 'Local não disponível'
}

function Stat({ label, value }) {
  return <article className="analytics-stat"><span>{label}</span><strong>{value}</strong></article>
}

function Ranking({ title, rows, labelKey, valueKey, renderValue }) {
  return (
    <section className="analytics-panel">
      <h2>{title}</h2>
      {rows.length === 0 ? <p>Ainda não há dados neste período.</p> : (
        <ol className="analytics-ranking">
          {rows.map((row, index) => (
            <li key={`${row[labelKey]}-${index}`}>
              <span title={row[labelKey]}>{row[labelKey]}</span>
              <strong>{renderValue ? renderValue(row) : row[valueKey].toLocaleString('pt-BR')}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default function AnalyticsDashboard() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(PASSWORD_KEY) || '')
  const [draftPassword, setDraftPassword] = useState('')
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Analytics | Rádio FM Online'
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex,nofollow')
    document.getElementById('app-loader')?.classList.add('app-loader--done')
  }, [])

  useEffect(() => {
    if (!password) return
    const controller = new AbortController()
    fetch(`/api/analytics-dashboard?days=${days}`, {
      headers: { Authorization: `Basic ${btoa(`admin:${password}`)}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          throw new Error('A API do analytics não está sendo executada. Reinicie o servidor de desenvolvimento.')
        }
        const result = await response.json()
        if (response.status === 401) throw new Error('Senha incorreta.')
        if (!response.ok) throw new Error(result.error || 'Falha ao carregar os dados.')
        return result
      })
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
    return () => controller.abort()
  }, [password, days])

  useEffect(() => {
    if (!password) return
    const intervalId = setInterval(() => {
      fetch(`/api/analytics-dashboard?days=${days}`, {
        headers: { Authorization: `Basic ${btoa(`admin:${password}`)}` },
      }).then((response) => response.ok ? response.json() : null).then((result) => { if (result) setData(result) }).catch(() => {})
    }, 30000)
    return () => clearInterval(intervalId)
  }, [password, days])

  const chartMax = useMemo(() => Math.max(1, ...(data?.daily || []).map((row) => row.page_views)), [data])
  const sessions = data?.sessions || []

  const login = (event) => {
    event.preventDefault()
    setError('')
    setData(null)
    sessionStorage.setItem(PASSWORD_KEY, draftPassword)
    setPassword(draftPassword)
  }

  if (!password) {
    return (
      <main className="analytics-login">
        <form onSubmit={login}>
          <a href="/">← Voltar ao site</a>
          <span className="analytics-kicker">Painel privado</span>
          <h1>Analytics próprio</h1>
          <p>Informe a senha configurada em <code>PAINEL_PASS</code>.</p>
          <input type="password" value={draftPassword} onChange={(event) => setDraftPassword(event.target.value)} autoFocus required aria-label="Senha" />
          <button type="submit">Entrar</button>
        </form>
      </main>
    )
  }

  return (
    <main className="analytics-dashboard">
      <header>
        <div><a href="/">← Voltar ao site</a><span className="analytics-kicker">NeonDB</span><h1>Analytics próprio</h1></div>
        <label>Período<select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value="1">Dia (24 horas)</option><option value="7">Semana (7 dias)</option><option value="30">Mês (30 dias)</option></select></label>
      </header>

      {!data && !error && <p>Carregando métricas…</p>}
      {error && <div className="analytics-error">{error}<button type="button" onClick={() => { sessionStorage.removeItem(PASSWORD_KEY); setPassword('') }}>Trocar senha</button></div>}
      {data && <>
        <section className="analytics-stats">
          <Stat label="Online agora" value={data.summary.online.toLocaleString('pt-BR')} />
          <Stat label="Visualizações" value={data.summary.page_views.toLocaleString('pt-BR')} />
          <Stat label="Visitantes por sessão" value={data.summary.visitors.toLocaleString('pt-BR')} />
          <Stat label="Reproduções" value={data.summary.audio_starts.toLocaleString('pt-BR')} />
          <Stat label="Tempo ouvido" value={formatDuration(data.summary.listening_seconds)} />
        </section>

        <section className="analytics-panel analytics-online-panel">
          <div className="analytics-panel-heading"><h2>Sessões</h2><span>Histórico do período · atualiza a cada 30 segundos</span></div>
          {sessions.length === 0 ? <p>Nenhuma sessão registrada neste período.</p> : (
            <div className="analytics-table-wrap"><table className="analytics-online-table"><thead><tr><th>Sessão</th><th>Status</th><th>Última atividade</th><th>Local</th><th>Página</th><th>Dispositivo</th></tr></thead><tbody>
              {sessions.map((row) => <tr key={row.session}><td><code>{row.session}</code></td><td><span className={`analytics-status analytics-status--${row.online ? 'online' : 'offline'}`}>{row.online ? 'Online' : 'Offline'}</span></td><td>{formatTime(row.last_seen)}</td><td>{formatLocation(row)}</td><td title={row.path}>{row.path}</td><td>{row.device}</td></tr>)}
            </tbody></table></div>
          )}
        </section>

        <section className="analytics-panel analytics-chart-panel">
          <h2>{days === 1 ? 'Visualizações por hora' : 'Visualizações por dia'}</h2>
          <div className="analytics-chart-scroll">
            <div className="analytics-chart" style={{ '--chart-columns': data.daily.length }}>
              {data.daily.map((row) => <div className="analytics-chart-column" key={row.date} title={`${formatDate(row.date)}: ${row.page_views} visualizações`}><div className="analytics-chart-bar-area"><strong>{row.page_views}</strong><span style={{ height: `${Math.max(3, (row.page_views / chartMax) * 100)}%` }} /></div><small>{formatDate(row.date)}</small></div>)}
            </div>
          </div>
        </section>

        <div className="analytics-grid">
          <Ranking title="Páginas mais vistas" rows={data.pages} labelKey="path" valueKey="views" />
          <Ranking title="Rádios mais ouvidas" rows={data.radios} labelKey="radio_name" valueKey="starts" renderValue={(row) => `${row.starts.toLocaleString('pt-BR')} plays · ${formatDuration(row.listening_seconds)}`} />
          <Ranking title="Origens" rows={data.sources} labelKey="source" valueKey="visits" />
          <Ranking title="Dispositivos" rows={data.devices} labelKey="device" valueKey="visits" />
        </div>
      </>}
    </main>
  )
}
