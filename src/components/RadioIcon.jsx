import { useState } from 'react'
import { getLogoSources } from '../utils/getLogoSources'

function FallbackIcon({ radio }) {
  const label =
    radio.shortName ||
    radio.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')

  return (
    <span className="radio-icon__fallback" aria-hidden="true">
      {label}
    </span>
  )
}

export default function RadioIcon({ radio, className, size = 'md', eager = false }) {
  const sources = getLogoSources(radio)
  const [sourceIndex, setSourceIndex] = useState(0)

  const currentSrc = sources[sourceIndex]
  const showImage = currentSrc && sourceIndex < sources.length

  const handleError = () => {
    setSourceIndex((index) => index + 1)
  }

  return (
    <div
      className={`radio-icon radio-icon--${size} ${className || ''}`}
      style={{ '--radio-color': radio.color }}
    >
      {showImage ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={`Logo da ${radio.name}`}
          className="radio-icon__img"
          onError={handleError}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        <FallbackIcon radio={radio} />
      )}
    </div>
  )
}
