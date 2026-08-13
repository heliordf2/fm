import ThemeToggle from './ThemeToggle'
import InstallAppButton from './InstallAppButton'

export default function Header({ theme, onToggleTheme, canInstall, installed, onInstall }) {
  const handleBrandClick = (event) => {
    if (window.location.pathname === '/') event.preventDefault()
  }

  return (
    <header className="header">
      <a className="header__brand" href="/" onClick={handleBrandClick} aria-label="Rádio FM Online - ir para a página inicial">
        <div className="header__logo" aria-hidden="true">
          <img src="/favicon.svg" alt="" />
        </div>
        <div>
          <p className="header__title">Rádio FM - Online</p>
          <p className="header__subtitle">Rádios FM ao vivo</p>
        </div>
      </a>
      <div className="header__aside">
        <InstallAppButton canInstall={canInstall} installed={installed} onInstall={onInstall} />
        <div className="header__badge">
          <span className="header__live-dot" />
          Ao vivo
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
