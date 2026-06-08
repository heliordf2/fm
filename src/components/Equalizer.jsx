export default function Equalizer({ active }) {
  return (
    <div className={`equalizer ${active ? 'equalizer--active' : ''}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="equalizer__bar" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  )
}
