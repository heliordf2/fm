// Perfis editoriais são adicionados somente após pesquisa em fonte primária.
// Não complete lacunas por inferência ou por texto de terceiros.
export const EDITORIAL_REVIEWED_AT = '20 de novembro de 2026'

export const EDITORIAL_PROFILES = {
  'tropical-fm-sp': {
    reviewedOn: '2026-11-20',
    profile: 'A Tropical FM ocupou a frequência 107,9 MHz na Grande São Paulo até outubro de 2026. Segundo a cobertura especializada da época, a programação regular com locutores terminou em 30 de setembro; entre 1º e 7 de outubro, a frequência manteve músicas, chamadas e vinhetas da Tropical. Às 20h de 7 de outubro, a Rádio Eldorado assumiu os 107,9 MHz, encerrando a fase da Tropical nessa frequência. O site da Tropical segue acessível com conteúdos e arquivos, mas isso não confirma que seu antigo stream continue transmitindo ao vivo.',
    listeningNote: 'Esta é uma ficha histórica e não inicia áudio. Para ouvir a emissora que ocupa atualmente os 107,9 MHz em São Paulo, acesse a Rádio Eldorado. O stream antigo da Tropical não foi confirmado como transmissão ao vivo.',
    sources: [
      { label: 'São Paulo Broadcast — transição da frequência para a Eldorado', url: 'https://www.saopaulobroadcast.com.br/2026/10/radio-eldorado-estreia-107-9-mhz-programa-especial-tulipa-ruiz.html' },
      { label: 'Rádio Tropical — site e arquivos publicados', url: 'https://radiotropicalfm.com/' },
      { label: 'Rádio Eldorado — portal oficial', url: 'https://radioeldorado.com.br/' },
    ],
  },
  'cbn-sp': {
    reviewedOn: '2026-10-01',
    profile: 'A CBN São Paulo é uma emissora jornalística da rede CBN, com cobertura de notícias, economia, serviço, cultura e esportes. A praça paulista combina programação local com conteúdos compartilhados pela rede.',
    listeningNote: 'Para acompanhar um assunto local, confira a identificação da praça e a programação no portal da CBN. A grade pode alternar entradas locais e nacionais.',
    sources: [{ label: 'CBN — portal oficial', url: 'https://cbn.globoradio.globo.com/' }],
  },
  'cbn-rj': {
    reviewedOn: '2026-10-01',
    profile: 'A CBN Rio de Janeiro integra a rede de jornalismo da CBN e concentra informações sobre a cidade, o estado, trânsito, serviços, cultura e esportes. A programação local é apresentada junto a faixas da rede.',
    listeningNote: 'Confira a praça indicada na programação para diferenciar notícias do Rio de Janeiro dos conteúdos nacionais da rede.',
    sources: [{ label: 'CBN — portal oficial', url: 'https://cbn.globoradio.globo.com/' }],
  },
  'nova-brasil-fm': {
    reviewedOn: '2026-10-01',
    profile: 'A Novabrasil FM se dedica à música brasileira e mantém uma operação de rádio, jornalismo cultural, promoções e eventos. O portal oficial reúne notícias musicais e ações para ouvintes além da transmissão ao vivo.',
    listeningNote: 'A programação pode combinar música, entrevistas e projetos especiais. Consulte a grade oficial para confirmar o conteúdo que está no ar.',
    sources: [{ label: 'Novabrasil — portal oficial', url: 'https://novabrasilfm.com.br/' }],
  },
  'jovem-pan-news': {
    reviewedOn: '2026-10-01',
    profile: 'A Jovem Pan News de São Paulo integra a operação de informação, opinião, entretenimento e esportes da Jovem Pan. A marca distribui conteúdo por rádio e canais digitais, com programação identificada para a praça paulista.',
    listeningNote: 'Como a operação reúne rádio e plataformas digitais, confirme a grade e a transmissão ao vivo na página oficial antes de procurar um programa específico.',
    sources: [
      { label: 'Jovem Pan — sobre a empresa', url: 'https://jovempan.com.br/sobre-a-jovem-pan/' },
      { label: 'Jovem Pan — ao vivo', url: 'https://jovempan.com.br/ao-vivo/' },
    ],
  },
  'metropolitana-fm': {
    reviewedOn: '2026-10-01',
    profile: 'A Metropolitana FM de São Paulo é uma emissora musical identificada no catálogo pela frequência 98,5 MHz. A ficha mantém a distinção entre a marca da rádio e a transmissão online, que pode depender de um servidor externo ao portal oficial.',
    listeningNote: 'Use a programação e o player publicados pela emissora para confirmar a atração atual. A classificação pop ajuda na descoberta, mas não substitui a grade do dia.',
    sources: [{ label: 'Metropolitana FM — portal oficial', url: 'https://metropolitana.com.br/' }],
  },
  'energia-97': {
    reviewedOn: '2026-10-01',
    profile: 'A Energia 97 é uma rádio de São Paulo identificada pela frequência 97,7 MHz. O portal oficial combina a transmissão ao vivo com notícias, programas e conteúdos ligados à música e ao entretenimento.',
    listeningNote: 'Para encontrar um programa específico, confira a grade publicada pela emissora. O stream ao vivo pode estar em outra atração quando a página for aberta.',
    sources: [{ label: 'Energia 97 — portal oficial', url: 'https://www.97fm.com.br/' }],
  },
  'radio-globo-rj': {
    reviewedOn: '2026-10-01',
    profile: 'A Rádio Globo do Rio de Janeiro é identificada no catálogo pela frequência 98,1 MHz e integra o sistema de rádio do Grupo Globo. O conteúdo oficial combina programação geral com cobertura esportiva e jornalística produzida para a praça carioca.',
    listeningNote: 'A programação esportiva pode incluir transmissões e programas próprios em horários específicos. Consulte a grade oficial antes de procurar uma atração ou partida.',
    sources: [
      { label: 'Sistema Globo de Rádio — Rádio Globo', url: 'https://globoradio.globo.com/' },
      { label: 'Futebol Globo CBN — programação do Rio', url: 'https://futebolglobocbn.globo.com/programacao' },
    ],
  },
  'cidade-fm': {
    reviewedOn: '2026-10-01',
    profile: 'A Rádio Cidade do Rio de Janeiro se apresenta como uma rádio voltada ao rock. O portal oficial reúne notícias, promoções, podcasts, seleção de bandas e acesso ao áudio ao vivo.',
    listeningNote: 'Além do stream, a página oficial oferece conteúdos sobre bandas e novidades. A grade pode mudar, então confirme o programa diretamente no portal da emissora.',
    sources: [{ label: 'Rádio Cidade — portal oficial', url: 'https://www.radiocidade.fm/' }],
  },
  'band-fm-sp': {
    reviewedOn: '2026-10-01',
    profile: 'A Band FM de São Paulo integra o conjunto de rádios do Grupo Bandeirantes. Seu portal reúne conteúdos de entretenimento, encontros com artistas e histórias do quadro Quem Ama Não Esquece. Em notícia de fevereiro de 2023, a própria Band descreve esse quadro como baseado em relatos de amor enviados por ouvintes.',
    listeningNote: 'Para acompanhar uma história completa, prefira o episódio publicado pela emissora. O player desta ficha recebe a sequência ao vivo, que pode estar em outro programa quando você entrar.',
    sources: [
      { label: 'Band FM — portal oficial', url: 'https://www.band.com.br/band-fm' },
      { label: 'Band — formato do Quem Ama Não Esquece, 08/02/2023', url: 'https://www.band.com.br/nacional/brasil/quem-ama-nao-esquece-premio-apca-melhor-programa-de-radio-2022-16580872' },
    ],
  },
  'kiss-fm-sp': {
    reviewedOn: '2026-10-01',
    profile: 'A Kiss FM identifica São Paulo pela frequência 92,5 MHz e mantém uma grade dedicada ao rock, com atrações de propostas diferentes. A página de programas inclui BR Kiss, Nasi & Os Irmãos do Blues e Rock Cine. Essa divisão permite procurar uma seleção temática além da programação musical geral.',
    listeningNote: 'Se o interesse é uma vertente específica, confira a atração na grade: rock brasileiro, blues e trilhas ligadas ao cinema têm espaços próprios. A frequência de São Paulo não é a mesma das demais praças da rede.',
    sources: [
      { label: 'Kiss FM — programas e praças', url: 'https://kissfm.com.br/programas/' },
      { label: 'Kiss FM — São Paulo ao vivo', url: 'https://kissfm.com.br/aovivo/' },
    ],
  },
  'alpha-fm': {
    reviewedOn: '2026-10-01',
    profile: 'A Alpha FM de São Paulo combina seleção musical, informação e agenda cultural. Na grade oficial, Música e Informação reúne notícias e música, Alpha Ilustrada apresenta opções de atividades na cidade e Sequência de Classe organiza blocos musicais. O site também distingue a operação de São Paulo da de Brasília.',
    listeningNote: 'Para planejar uma saída em São Paulo, os quadros de agenda têm uma função diferente dos blocos musicais. Para acompanhar notícias, procure as faixas de informação na grade oficial; a classificação musical do catálogo não descreve todos os horários.',
    sources: [
      { label: 'Alpha FM — programação', url: 'https://alphafm.com.br/programacao' },
      { label: 'Alpha FM — portal e seleção de praça', url: 'https://www.alphafm.com.br/' },
    ],
  },
  'antena-1': {
    reviewedOn: '2026-10-01',
    profile: 'A Antena 1 apresenta sua programação como voltada à música internacional e identifica a estação de São Paulo em 94,7 MHz na lista de afiliadas. A grade reúne faixas como DayLight, Clássicos e As 10 Mais. Segundo a emissora, As 10 Mais considera pedidos feitos pelos ouvintes durante a semana.',
    listeningNote: 'A lista de pedidos da Antena 1 retrata a participação do público da rádio. Ela não equivale ao ranking nacional de streaming exibido em Novidades; são seleções de universos diferentes.',
    sources: [
      { label: 'Antena 1 — programação e critérios dos quadros', url: 'https://www.antena1.com.br/programacao' },
      { label: 'Antena 1 — afiliadas e frequência de São Paulo', url: 'https://www.antena1.com.br/afiliadas' },
    ],
  },
  'itatiaia-bh': {
    profile: 'A Rádio Itatiaia apresenta uma programação que combina jornalismo, esportes, prestação de serviço e entretenimento. A grade oficial inclui noticiários, cobertura do futebol mineiro, informações de trânsito e programas de debate e participação do público.',
    listeningNote: 'É uma alternativa para quem procura notícias e esporte de Minas Gerais, além de conteúdo de serviço. Para horários e programas em atividade, consulte a grade oficial.',
    sources: [
      { label: 'Rádio Itatiaia — programação', url: 'https://www.itatiaia.com.br/programacao/' },
      { label: 'Rádio Itatiaia — ouça ao vivo', url: 'https://www.itatiaia.com.br/aovivo/' },
    ],
  },
  'jovem-pan-sp': {
    profile: 'A Jovem Pan FM faz parte da operação multiplataforma da Jovem Pan, que reúne rádio, canais digitais e outras frentes de conteúdo. A própria empresa apresenta a marca como atuante em informação, entretenimento e esportes, com transmissões ao vivo identificadas para a FM de São Paulo.',
    listeningNote: 'A programação e os horários podem variar. Consulte a grade e a página ao vivo da Jovem Pan para confirmar o conteúdo disponível no momento.',
    sources: [
      { label: 'Jovem Pan — sobre a empresa', url: 'https://jovempan.com.br/sobre-a-jovem-pan/' },
      { label: 'Jovem Pan — rádio ao vivo e frequências', url: 'https://jovempan.com.br/ao-vivo/' },
    ],
  },
  'mix-fm-sp': {
    profile: 'A Mix FM mantém uma programação musical com blocos, paradas e atrações temáticas. A página oficial de programas lista conteúdos como Top Mix, Super Mix, Club Mix e SP-UM, este último voltado a informações de trânsito e clima de São Paulo.',
    listeningNote: 'É uma opção para quem procura programação musical pop e entretenimento. A grade e os horários divulgados pela emissora podem ser atualizados.',
    sources: [{ label: 'Rádio Mix FM — programas', url: 'https://radiomixfm.com.br/programas/' }],
  },
  '89-fm': {
    profile: 'A 89 FM A Rádio Rock é organizada no catálogo como uma emissora de rock. Em seu projeto Arena 89, a própria rádio apresenta uma vitrine para bandas independentes do rock brasileiro, com agenda, notícias e seleção por curadoria.',
    listeningNote: 'Além da transmissão, o site oficial da emissora reúne conteúdo ligado ao circuito de rock. Confira a programação atual diretamente na fonte oficial.',
    sources: [{ label: 'Arena 89 — projeto da 89 FM A Rádio Rock', url: 'https://arena.radiorock.com.br/' }],
  },
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
  'a-tarde-fm-salvador': {
    reviewedOn: '2026-11-20',
    profile: 'A TARDE FM combina música e jornalismo com foco na Bahia e em Salvador. A programação oficial consultada lista faixas de MPB, informação diária, notícias, agenda cultural e programas de entrevistas e música; o portal também publica podcasts e cobertura de eventos locais.',
    listeningNote: 'Para acompanhar assuntos locais, a grade apresenta espaços como Isso é Bahia e A TARDE Notícias. A programação musical também varia por horário; consulte a grade oficial atualizada antes de procurar um programa específico.',
    sources: [
      { label: 'A TARDE FM — programação e conteúdo', url: 'https://atardefm.com.br/' },
      { label: 'A TARDE FM — programas', url: 'https://atardefm.com.br/programas' },
    ],
  },
  'arapuan-fm-joao-pessoa': {
    reviewedOn: '2026-11-20',
    profile: 'A Arapuan FM, em João Pessoa, apresenta uma grade que combina jornalismo local, prestação de serviço, música e programas interativos. A emissora informa que sua programação e cobertura se estendem a municípios da Paraíba e a áreas de Pernambuco e Rio Grande do Norte; o sistema também identifica afiliadas em outras cidades paraibanas.',
    listeningNote: 'A grade oficial inclui noticiários como Paraíba Verdade e Arapuan Verdade, além de faixas musicais. Confira a praça e o programa na fonte oficial, pois a rede mantém frequências diferentes fora de João Pessoa.',
    sources: [
      { label: 'Arapuan FM — sobre a rádio e praças', url: 'https://www.arapuanfm.com.br/2023/site/radio' },
      { label: 'Arapuan FM — programação semanal', url: 'https://www.arapuanfm.com.br/2023/site/programacao' },
    ],
  },
  'fm-terra-imperatriz': {
    reviewedOn: '2026-11-20',
    profile: 'A Rádio FM Terra publica notícias de Imperatriz e mantém programas ligados à música, ao cotidiano local e à participação da comunidade. Sua grade de segunda a sexta inclui Canto da Terra, Trânsito Livre, O Som que a Terra Não Esqueceu e Terra Online; aos fins de semana, a programação muda.',
    listeningNote: 'A faixa Trânsito Livre ocupa a manhã dos dias úteis, enquanto a grade também traz seleções musicais e programas de fim de semana. Os horários podem mudar; consulte a programação oficial antes de buscar uma atração específica.',
    sources: [
      { label: 'Rádio FM Terra — programação', url: 'https://fmterra.com.br/programacao/' },
      { label: 'Rádio FM Terra — portal e notícias de Imperatriz', url: 'https://fmterra.com.br/' },
    ],
  },
  'capital-95-fm-campo-grande': {
    reviewedOn: '2026-11-20',
    profile: 'A Capital 95 FM é uma emissora de Campo Grande, identificada pela própria estação em 95,9 MHz. A apresentação institucional descreve uma programação musical com interação e participação do público, além de notícias, promoções e cobertura de eventos. A grade publicada inclui faixas locais de informação e entretenimento.',
    listeningNote: 'A programação local é útil para quem busca música e informações de Campo Grande. Consulte a grade oficial para horários e atrações, que podem ser alterados pela emissora.',
    sources: [
      { label: 'Capital 95 — apresentação institucional', url: 'https://www.capital95.com.br/index.php?acao=sobre' },
      { label: 'Capital 95 — programação', url: 'https://www.capital95.com.br/10/index.php?acao=programacao' },
    ],
  },
  'fm98-curitiba': {
    reviewedOn: '2026-11-20',
    profile: 'A 98FM Curitiba apresenta uma programação popular com programas ao vivo, interação e quadros voltados à rotina dos ouvintes. Entre as atrações descritas pela própria emissora estão o Show da Manhã, com crônicas e participação do público, e As Coleguinhas, programa produzido e apresentado por mulheres.',
    listeningNote: 'A grade oferece formatos diferentes ao longo do dia, de conversa e participação a faixas musicais e promoções. Confira os horários no portal oficial, pois a programação é atualizada pela rádio.',
    sources: [
      { label: '98FM Curitiba — Show da Manhã', url: 'https://98fmcuritiba.com.br/programa/show-da-manha' },
      { label: '98FM Curitiba — As Coleguinhas', url: 'https://98fmcuritiba.com.br/programa/as-coleguinhas-da-98fm' },
    ],
  },
}

export function getEditorialProfile(radioId) {
  const profile = EDITORIAL_PROFILES[radioId]
  return profile ? { ...profile, reviewedOn: profile.reviewedOn || '2026-08-28' } : null
}
