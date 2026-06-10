import ThemeToggle from './ThemeToggle'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <circle cx="24" cy="24" r="8" fill="currentColor" />
            <path
              d="M24 2v6M24 40v6M2 24h6M40 24h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 8l4 4M36 36l4 4M8 40l4-4M36 12l4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h1 className="header__title">Franca FM</h1>
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
