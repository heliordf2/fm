import { NEWS_ARTICLES, NEWS_DATE, NEWS_DESCRIPTION, NEWS_EDITORIAL, newsDateLabel, newsPath } from '../data/news.js'
import './NewsContent.css'
import { NEWS_CHARTS, NEWS_CHART_NOTE } from '../data/newsCharts.js'

export function NewsCharts() {
  return <section className="news-charts" aria-labelledby="charts-title">
    <h2 id="charts-title">Quem está no topo no Brasil</h2>
    <p className="news-meta">{NEWS_CHART_NOTE}</p>
    <div className="news-charts__grid">{NEWS_CHARTS.map((chart) => <section className="news-chart" key={chart.id} aria-labelledby={chart.id}>
      <h3 id={chart.id}>{chart.title}</h3>
      <p className="news-chart__method">{chart.methodology}</p>
      <ol>{chart.entries.map((entry) => <li key={entry.name}><div><strong>{entry.name}</strong>{entry.artist && <span>{entry.artist}</span>}<small>Semana anterior: {entry.previous}º</small></div></li>)}</ol>
      <p className="news-chart__insight">{chart.insight}</p>
      <a href={chart.source.url} target="_blank" rel="noopener noreferrer">Fonte: {chart.source.label}</a>
    </section>)}</div>
  </section>
}

export function NewsCards({ limit }) {
  return <div className="news-grid">{NEWS_ARTICLES.slice(0, limit).map((article) => (
    <article className="news-card" key={article.slug}>
      <span className="news-category">{article.category}</span>
      <h3><a href={newsPath(article)}>{article.title}</a></h3>
      <p>{article.description}</p>
      <small>Em pauta: {article.period}</small>
    </article>
  ))}</div>
}

export default function NewsContent({ article }) {
  return <main className="direct-main news-page">
    <nav className="news-breadcrumb" aria-label="Navegação estrutural"><a href="/">Início</a><span aria-hidden="true">/</span>{article ? <a href="/novidades">Novidades</a> : <span aria-current="page">Novidades</span>}</nav>
    {article ? <article className="news-article">
      <header>
        <p className="news-category">{article.category} · {article.period}</p>
        <h1>{article.title}</h1>
        <p className="news-lead">{article.description}</p>
        <p className="news-meta">Por Rádio FM Online · Publicado em <time dateTime={NEWS_DATE}>{newsDateLabel(NEWS_DATE)}</time></p>
      </header>
      {article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
      <aside className="news-sources"><h2>Fontes consultadas</h2><p>Consulta em {newsDateLabel(NEWS_DATE)}.</p><ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer" target="_blank">{source.label}</a></li>)}</ul></aside>
      <p><a href={article.related.url}>{article.related.label}</a>. A programação ao vivo é definida por cada emissora; não é possível escolher uma faixa pelo player.</p>
      <p className="news-editorial">{NEWS_EDITORIAL}</p>
      <a href="/novidades">← Todas as novidades</a>
    </article> : <>
      <header className="news-heading"><p className="news-category">Música, artistas e rádio</p><h1>Novidades para ampliar sua escuta</h1><p className="news-lead">{NEWS_DESCRIPTION}</p><p className="news-meta">Primeira seleção · {newsDateLabel(NEWS_DATE)} · Acontecimentos de junho a setembro de 2026</p></header>
      <NewsCharts />
      <h2 className="news-stories-title">Matérias e contexto</h2>
      <NewsCards />
      <aside className="news-editorial"><h2>Como selecionamos as pautas</h2><p>{NEWS_EDITORIAL}</p><p>As datas de publicação dos nossos textos são diferentes das datas dos acontecimentos. Esta seleção não pretende cobrir todos os lançamentos do período.</p><a href="/sobre.html">Conheça o projeto</a></aside>
    </>}
  </main>
}
