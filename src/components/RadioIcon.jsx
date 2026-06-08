import { useState } from 'react'

function FallbackIcon({ radio, className }) {
  const label = radio.shortName || radio.name.split(' ').slice(0, 2).map((w) => w[0]).join('')

  return (
    <span className={`radio-icon__fallback ${className || ''}`} aria-hidden="true">
      {label}
    </span>
  )
}

export default function RadioIcon({ radio, className, size = 'md' }) {
  const [imgError, setImgError] = useState(false)

  const showImage = radio.logo && !imgError

  return (
    <div
      className={`radio-icon radio-icon--${size} ${className || ''}`}
      style={{ '--radio-color': radio.color }}
    >
      {showImage ? (
        <img
          src={radio.logo}
          alt=""
          className="radio-icon__img"
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <FallbackIcon radio={radio} />
      )}
    </div>
  )
}
