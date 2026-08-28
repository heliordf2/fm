const CITY_EDITORIAL = {
  'sao-paulo/sao-paulo': {
    title: 'O rádio em São Paulo',
    introduction: 'A cidade reúne emissoras musicais e jornalísticas de alcance local e de rede. Para escolher, compare o formato da programação e a praça identificada na ficha de cada rádio.',
    sources: [{ label: 'BandNews FM São Paulo — página oficial da praça', url: 'https://www.band.com.br/radios/bandnews-fm/sao-paulo' }],
  },
  'rio-de-janeiro/rio-de-janeiro': {
    title: 'O rádio no Rio de Janeiro',
    introduction: 'A seleção do Rio de Janeiro mistura programação musical, jornalismo e transmissões voltadas à cidade. A frequência sozinha não basta para identificar uma emissora: confirme também o nome e a localidade.',
    sources: [{ label: 'BandNews FM Rio — página oficial da praça', url: 'https://www.band.com.br/bandnews-fm/rio-de-janeiro' }],
  },
  'minas-gerais/belo-horizonte': {
    title: 'O rádio em Belo Horizonte',
    introduction: 'Belo Horizonte aparece no catálogo com opções musicais, jornalísticas e de rede. As fichas ajudam a separar a origem da transmissão, o formato e as alternativas relacionadas na mesma cidade.',
    sources: [{ label: 'BandNews FM Belo Horizonte — página oficial da praça', url: 'https://www.band.com.br/bandnews-fm/belo-horizonte' }],
  },
  'parana/curitiba': {
    title: 'O rádio em Curitiba',
    introduction: 'A página concentra emissoras de Curitiba em formatos musicais, jornalísticos e esportivos. Use a classificação e as rádios relacionadas para descobrir alternativas sem confundir redes de cidades diferentes.',
    sources: [{ label: 'BandNews FM — lista oficial de praças', url: 'https://www.band.com.br/bandnews-fm' }],
  },
  'bahia/salvador': {
    title: 'O rádio em Salvador',
    introduction: 'Em Salvador, o catálogo combina emissoras de programação popular, musical e informativa. A categorização é uma ferramenta de descoberta; a programação atual deve ser confirmada no site oficial de cada rádio.',
    sources: [{ label: 'BandNews FM — lista oficial de praças', url: 'https://www.band.com.br/bandnews-fm' }],
  },
  'pernambuco/recife': {
    title: 'O rádio no Recife',
    introduction: 'A seleção do Recife reúne rádios de rede e estações identificadas com a cidade. Consulte a ficha individual para verificar frequência, formato cadastrado, site oficial e disponibilidade do stream.',
  },
  'distrito-federal/brasilia': {
    title: 'O rádio em Brasília',
    introduction: 'O catálogo de Brasília reúne alternativas musicais, jornalísticas e institucionais. A página organiza as opções por formato e facilita comparar emissoras locais com marcas de rede.',
    sources: [{ label: 'BandNews FM — lista oficial de praças', url: 'https://www.band.com.br/bandnews-fm' }],
  },
}

export function getCityEditorial(stateSlug, citySlug) {
  return CITY_EDITORIAL[`${stateSlug}/${citySlug}`] || null
}

export function getCityCatalogSummary(radios) {
  const formats = new Map()
  radios.forEach((radio) => radio.genreLabels.forEach((label) => formats.set(label, (formats.get(label) || 0) + 1)))
  const topFormats = [...formats.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
    .slice(0, 3)
    .map(([label, count]) => `${label.toLowerCase()} (${count})`)
  return { count: radios.length, topFormats }
}
