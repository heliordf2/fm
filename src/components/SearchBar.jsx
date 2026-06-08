export default function SearchBar({ value, onChange, category, onCategoryChange, categories }) {
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
