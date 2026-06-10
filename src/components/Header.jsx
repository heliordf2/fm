import ThemeToggle from './ThemeToggle'

export default function Header({ favoritesCount = 0, theme, onToggleTheme }) {
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
        {favoritesCount > 0 && (
          <div className="header__badge header__badge--favorites">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {favoritesCount} favorita{favoritesCount !== 1 ? 's' : ''}
          </div>
        )}
        <div className="header__badge">
          <span className="header__live-dot" />
          Ao vivo
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
