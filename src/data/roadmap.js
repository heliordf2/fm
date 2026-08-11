export const BRAZIL_STATES = [
  'Acre',
  'Alagoas',
  'Amapá',
  'Amazonas',
  'Bahia',
  'Ceará',
  'Distrito Federal',
  'Espírito Santo',
  'Goiás',
  'Maranhão',
  'Mato Grosso',
  'Mato Grosso do Sul',
  'Minas Gerais',
  'Pará',
  'Paraíba',
  'Paraná',
  'Pernambuco',
  'Piauí',
  'Rio de Janeiro',
  'Rio Grande do Norte',
  'Rio Grande do Sul',
  'Rondônia',
  'Roraima',
  'Santa Catarina',
  'São Paulo',
  'Sergipe',
  'Tocantins',
]

// Estações ainda fora do catálogo, levantadas por estado para orientar a expansão de cobertura.
// Dados de nome/frequência apurados externamente (não são streams cadastrados nem verificados no site).
export const ROADMAP_GAPS = {
  Maranhão: [
    { name: 'Universidade FM', city: 'São Luís', frequency: '106.9 MHz' },
  ],
  'Mato Grosso': [
    { name: 'CBN', city: 'Cuiabá', frequency: '95.9 MHz' },
  ],
  'Mato Grosso do Sul': [
    { name: 'Rádio Patriarca FM', city: 'Cassilândia', frequency: '88.7 MHz' },
    { name: 'Super FM', city: 'Costa Rica', frequency: '98.9 MHz' },
    { name: 'Liberdade FM', city: 'Paranaíba', frequency: '101.9 MHz' },
  ],
  Pará: [
    { name: 'Rádio Povo FM', city: 'Belém', frequency: '94.3 MHz' },
  ],
  Piauí: [
    { name: 'Rádio Pioneira', city: 'Teresina', frequency: '88.7 MHz' },
    { name: 'Rádio Jornal', city: 'Teresina', frequency: '90.3 MHz' },
    { name: 'Cidade Verde FM', city: 'Teresina', frequency: '93.5 MHz' },
  ],
  'Rio Grande do Norte': [
    { name: 'Jovem Pan News', city: 'Natal', frequency: '93.5 MHz' },
  ],
  Rondônia: [
    { name: 'CBN Amazônia', city: 'Guajará-Mirim', frequency: '93.7 MHz' },
  ],
  Sergipe: [
    { name: 'Sara Brasil FM', city: 'Aracaju', frequency: '97.1 MHz' },
    { name: 'Novabrasil FM', city: 'Aracaju', frequency: '93.5 MHz' },
  ],
}
