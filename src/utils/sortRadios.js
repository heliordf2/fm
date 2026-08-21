export function parseFrequency(frequency) {
  if (!frequency) return Infinity
  const match = frequency.match(/(\d+(?:[.,]\d+)?)/)
  if (!match) return Infinity
  return parseFloat(match[1].replace(',', '.'))
}

export function sortRadios(radios, sortBy) {
  const sorted = [...radios]

  if (sortBy === 'name') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }

  if (sortBy === 'frequency') {
    return sorted.sort((a, b) => parseFrequency(a.frequency) - parseFrequency(b.frequency))
  }

  return sorted
}
