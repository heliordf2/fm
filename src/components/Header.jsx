import ThemeToggle from './ThemeToggle'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo" aria-hidden="true">
          <img src="/favicon.svg" alt="" />
        </div>
        <div>
          <h1 className="header__title">Rádio FM - Online</h1>
          <p className="header__subtitle">Rádios FM ao vivo</p>
        </div>
      </div>
      <div className="header__aside">
        <div className="header__badge">
          <span className="header__live-dot" />
          Ao vivo
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
