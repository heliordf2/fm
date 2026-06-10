export default function HideButton({ isHidden, onToggle, radioName, className }) {
  return (
    <button
      type="button"
      className={`hide-btn ${isHidden ? 'hide-btn--active' : ''} ${className || ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-label={
        isHidden ? `Mostrar ${radioName} na lista` : `Ocultar ${radioName} da lista`
      }
      aria-pressed={isHidden}
    >
      {isHidden ? (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-10-8-10-8a18.45 18.45 0 015.06-5.94"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 8 10 8a18.5 18.5 0 01-2.16 3.19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 1l22 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14.12 14.12a3 3 0 11-4.24-4.24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
