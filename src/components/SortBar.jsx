const sortOptions = [
  { id: 'default', label: 'Padrão' },
  { id: 'name', label: 'Nome' },
  { id: 'frequency', label: 'Frequência' },
]

export default function SortBar({ value, onChange }) {
  return (
    <div className="sort-bar" role="group" aria-label="Ordenar rádios">
      <span className="sort-bar__label">Ordenar:</span>
      {sortOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`sort-bar__btn ${value === option.id ? 'sort-bar__btn--active' : ''}`}
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
