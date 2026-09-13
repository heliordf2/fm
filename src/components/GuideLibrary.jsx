import { GUIDE_ARTICLES } from '../data/guides.js'

export default function GuideLibrary({ currentPath }) {
  return <nav className="guide-library" aria-label="Guias para aproveitar a rádio online">
    <h2>Guias para aproveitar a rádio online</h2>
    <div className="guide-library__grid">{Object.entries(GUIDE_ARTICLES).filter(([path]) => path !== currentPath).map(([path, article]) => <a key={path} href={path}><strong>{article.title}</strong><span>{article.description}</span></a>)}</div>
  </nav>
}
