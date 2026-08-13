export default function SearchBar({ value, onChange, category, onCategoryChange, categories, states, state, onStateChange }) {
  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className="search-bar__input"
          placeholder="Buscar rádio, cidade ou frequência..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Buscar rádios"
        />
      </div>
      <div className={`search-bar__state-field ${state !== 'all' ? 'search-bar__state-field--active' : ''}`}>
        <svg className="search-bar__state-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21s7-6.1 7-11.5A7 7 0 105 9.5C5 14.9 12 21 12 21z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
        <select
          className="search-bar__state-select"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos os estados</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <svg className="search-bar__state-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="search-bar__filters" role="tablist" aria-label="Filtrar por gênero">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={category === cat.id}
            className={`search-bar__filter ${category === cat.id ? 'search-bar__filter--active' : ''}`}
            data-category={cat.id}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
