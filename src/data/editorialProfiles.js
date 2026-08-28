// Perfis editoriais são adicionados somente após pesquisa em fonte primária.
// Não complete lacunas por inferência ou por texto de terceiros.
export const EDITORIAL_REVIEWED_AT = '28 de agosto de 2026'

export const EDITORIAL_PROFILES = {
  'bandnews-fm': {
    profile: 'A BandNews FM é uma rede jornalística do Grupo Bandeirantes voltada a atualização contínua, análise e prestação de serviço. A própria rede informa que opera 24 horas por dia em FM e combina cobertura nacional com janelas e vozes locais nas praças em que está presente.',
    listeningNote: 'É uma opção mais adequada para quem procura noticiário, comentários e informação de serviço do que uma programação musical contínua.',
    sources: [
      { label: 'BandNews FM — Sobre', url: 'https://www.band.com.br/bandnews-fm/sobre/' },
      { label: 'BandNews FM — programação e praças', url: 'https://www.band.com.br/bandnews-fm' },
    ],
  },
  'bandnews-bh': {
    profile: 'A BandNews FM Belo Horizonte integra a rede jornalística do Grupo Bandeirantes. O formato da rede é baseado em notícias, análise e prestação de serviço contínuas, com presença local nas praças atendidas.',
    listeningNote: 'Para a programação e os colunistas em atividade, confira a página da praça antes de ouvir, porque a grade pode mudar.',
    sources: [
      { label: 'BandNews FM — Sobre', url: 'https://www.band.com.br/bandnews-fm/sobre/' },
      { label: 'BandNews FM — praças', url: 'https://www.band.com.br/bandnews-fm' },
    ],
  },
  'radio-paradise': {
    profile: 'A Radio Paradise se define como uma rádio independente, sem anúncios e sustentada por ouvintes. Sua proposta editorial é a descoberta musical por curadoria humana, em vez de uma lista automatizada de faixas.',
    listeningNote: 'É indicada para quem quer explorar música por seleções curadas e não procura uma rádio local brasileira.',
    sources: [
      { label: 'Radio Paradise — página inicial', url: 'https://radioparadise.com/' },
      { label: 'Radio Paradise — apoio dos ouvintes', url: 'https://radioparadise.com/support' },
    ],
  },
  'fip-radio': {
    profile: 'A FIP é uma emissora musical do grupo público Radio France. Sua identidade é uma seleção eclética conduzida por programação musical, reunindo estilos e épocas em uma mesma grade.',
    listeningNote: 'Funciona melhor para quem deseja uma escuta musical ampla, sem depender de um único gênero.',
    sources: [
      { label: 'FIP — site oficial', url: 'https://www.radiofrance.fr/fip' },
      { label: 'Radio France — FIP', url: 'https://www.radiofrance.fr/fip/la-radio' },
    ],
  },
  'france-inter': {
    profile: 'A France Inter é uma emissora generalista do grupo público Radio France. A grade reúne jornalismo, entrevistas, cultura e música, em francês, com cobertura voltada sobretudo à França.',
    listeningNote: 'É mais indicada a ouvintes que acompanham conteúdo falado em francês ou querem conhecer a rádio pública francesa.',
    sources: [
      { label: 'France Inter — site oficial', url: 'https://www.radiofrance.fr/franceinter' },
      { label: 'Radio France — grupo público', url: 'https://www.radiofrance.fr/' },
    ],
  },
  'npr-news': {
    profile: 'A NPR é uma organização de mídia independente e sem fins lucrativos dos Estados Unidos. Ela trabalha com emissoras-membro para produzir e distribuir jornalismo e conteúdo cultural de serviço público.',
    listeningNote: 'O stream é voltado a notícias e conteúdo falado em inglês; a programação e a disponibilidade podem variar conforme a emissora afiliada.',
    sources: [{ label: 'NPR — About', url: 'https://www.npr.org/about/' }],
  },
  kexp: {
    profile: 'A KEXP é uma organização sem fins lucrativos de Seattle dedicada à descoberta musical. A emissora nasceu na Universidade de Washington em 1972 e mantém programação apoiada por ouvintes, com curadoria humana e sessões ao vivo.',
    listeningNote: 'É uma boa escolha para descobrir artistas e estilos fora de playlists de grande circulação, especialmente em rock e música independente.',
    sources: [
      { label: 'KEXP — About', url: 'https://www.kexp.org/about/' },
      { label: 'KEXP — History', url: 'https://www.kexp.org/about/history/' },
    ],
  },
  'soma-groove': {
    profile: 'Groove Salad é um canal da SomaFM, rede independente de rádio pela internet sediada em São Francisco. A própria SomaFM descreve o canal como focado em ambient e chill e afirma operar sem publicidade, com apoio dos ouvintes.',
    listeningNote: 'É voltada a quem procura ambient, downtempo e uma escuta de fundo, não uma emissora local ou jornalística.',
    sources: [
      { label: 'SomaFM — About', url: 'https://store.somafm.com/pages/about-us' },
      { label: 'SomaFM — apresentação institucional', url: 'https://somafm.com/epk.pdf' },
    ],
  },
}

export function getEditorialProfile(radioId) {
  return EDITORIAL_PROFILES[radioId] || null
}
