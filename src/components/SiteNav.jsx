export default function SiteNav() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const links = [['/', 'Ouvir rádios'], ['/novidades', 'Novidades'], ['/curiosidades', 'Curiosidades'], ['/guia/como-ouvir-radio-online', 'Guia'], ['/relaxar', 'Relaxar'], ['/sobre.html', 'Sobre']]
  return <nav className="site-nav" aria-label="Principal">{links.map(([href, label]) => <a key={href} href={href} aria-current={path === href ? 'page' : undefined}>{label}</a>)}</nav>
}
