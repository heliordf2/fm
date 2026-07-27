export function getLogoSources(radio) {
  const sources = [
    radio.logo,
    ...(radio.logoFallbacks || []),
    radio.domain && `https://www.google.com/s2/favicons?domain=${radio.domain}&sz=128`,
  ]

  return [...new Set(sources.filter(Boolean))]
}
