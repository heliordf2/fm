import { CURIOSITIES, CURIOSITY_DATE, CURIOSITY_DESCRIPTION, CURIOSITY_EDITORIAL, curiosityPath } from '../data/curiosities.js'
import './NewsContent.css'

export function CuriosityCards({ limit, exclude }) {
  return <div className="news-grid">{CURIOSITIES.filter((item) => item.slug !== exclude).slice(0, limit).map((item) => <article className="news-card" key={item.slug}><span className="news-category">{item.category}</span><h3><a href={curiosityPath(item)}>{item.title}</a></h3><p>{item.description}</p></article>)}</div>
}

export default function CuriosityContent({ article }) {
  return <main className="direct-main news-page">
    <nav className="news-breadcrumb" aria-label="Navegação estrutural"><a href="/">Início</a><span aria-hidden="true">/</span>{article ? <a href="/curiosidades">Curiosidades</a> : <span aria-current="page">Curiosidades</span>}</nav>
    {article ? <article className="news-article">
      <header><p className="news-category">{article.category}</p><h1>{article.title}</h1><p className="news-lead">{article.description}</p><p className="news-meta">Por Rádio FM Online · Publicado em <time dateTime={CURIOSITY_DATE}>22/09/2026</time></p></header>
      <nav aria-label="Nesta matéria"><ul>{article.sections.map((section, index) => <li key={section.title}><a href={`#secao-${index + 1}`}>{section.title}</a></li>)}</ul></nav>
      {article.sections.map((section, index) => <section id={`secao-${index + 1}`} key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.orderedItems && <ol>{section.orderedItems.map((item) => <li key={item}>{item}</li>)}</ol>}</section>)}
      <aside className="news-sources"><h2>Fontes e critérios</h2><p>Referências consultadas em 22/09/2026. Os recortes históricos estão indicados no texto.</p><ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></aside>
      <p><a href={article.related.url}>{article.related.label}</a></p>
      <p className="news-editorial">{CURIOSITY_EDITORIAL} <a href="https://wa.me/5511974004755">Solicitar correção</a>.</p>
      <a href="/curiosidades">← Todas as curiosidades</a>
    </article> : <><header className="news-heading"><p className="news-category">Escute, descubra, entenda</p><h1>Curiosidades da música e do rádio</h1><p className="news-lead">{CURIOSITY_DESCRIPTION}</p></header><CuriosityCards /><aside className="news-editorial"><h2>Como ler esta seleção</h2><p>Cada matéria apresenta uma pergunta, explica os critérios e indica as fontes. Listas históricas mantêm sua data de referência: popularidade, qualidade artística e influência cultural são conceitos diferentes.</p><p>{CURIOSITY_EDITORIAL}</p><a href="/sobre.html">Conheça o projeto e entre em contato</a></aside></>}
    {article && <section aria-labelledby="more-curiosities"><h2 id="more-curiosities">Continue descobrindo</h2><CuriosityCards limit={3} exclude={article.slug} /></section>}
  </main>
}
