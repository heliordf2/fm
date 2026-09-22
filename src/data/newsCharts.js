// Retrato da edição consultada em 22/09/2026; atualizar a edição e os dois rankings juntos.
export const NEWS_CHART_EDITION = '2026-09-14'
export const NEWS_CHART_NOTE = 'Brasil · streaming · edição de 14/09/2026. Dez primeiras posições dos charts da Billboard Brasil, com dados da Luminate. Consulta em 22/09/2026; atualização manual. Este é um recorte semanal, não um acumulado dos últimos meses ou de execução em rádio.'
export const NEWS_CHARTS = [
  {
    id: 'top-artistas', title: 'Top 10 artistas',
    source: { label: 'Billboard Brasil Artistas 25', url: 'https://billboard.com.br/billboard-brasil-artistas-25/' },
    methodology: 'O Artistas 25 considera a atividade dos artistas nas mil músicas mais ouvidas do levantamento, com ponderação de streams oficiais de áudio e vídeo.',
    insight: 'Henrique e Juliano mantêm a liderança. Zezé Di Camargo e Luciano avançam do 22º ao 8º lugar; Matuê passa do 11º ao 10º. São mudanças de posição, não percentuais de crescimento de audiência.',
    entries: [
      { name: 'Henrique e Juliano', previous: 1 },
      { name: 'Zé Neto e Cristiano', previous: 2 },
      { name: 'Murilo Huff', previous: 4 },
      { name: 'Menos é Mais', previous: 6 },
      { name: 'Anitta', previous: 3 },
      { name: 'BTS', previous: 7 },
      { name: 'Jorge e Mateus', previous: 5 },
      { name: 'Zezé Di Camargo e Luciano', previous: 22 },
      { name: 'Charlie Brown Jr.', previous: 10 },
      { name: 'Matuê', previous: 11 }
    ]
  },
  {
    id: 'top-musicas', title: 'Top 10 músicas',
    source: { label: 'Billboard Brasil Hot 100', url: 'https://billboard.com.br/billboard-brasil-hot-100/' },
    methodology: 'O Hot 100 Brasil pondera streams oficiais de áudio e vídeo dos serviços monitorados, incluindo assinaturas e modalidades com anúncios.',
    insight: '“Peão Todo Tatuado” segue em primeiro; “Postinho De Gasolina” sobe do quinto ao segundo lugar. A ordem mede desempenho no período, não a data de lançamento das faixas.',
    entries: [
      { name: 'Peão Todo Tatuado', artist: 'Jeninho & Mariana Fagundes', previous: 1 },
      { name: 'Postinho De Gasolina', artist: 'João Gustavo & Murilo', previous: 5 },
      { name: 'CADEIRA CATIVA', artist: 'Zé Neto e Cristiano', previous: 2 },
      { name: 'Eu Te Seguro', artist: 'Helton Lima', previous: 4 },
      { name: 'Cuida do Pet', artist: "MC Iguinho CT, Aaron Modesto, MC Negão Original, Oldilla, Du’L, MC Willian, DJ Aladin GDB", previous: 3 },
      { name: 'Um Peão Desse', artist: 'CountryBeat', previous: 7 },
      { name: 'Ta Pedindo Toma', artist: 'MC Leozinho ZS', previous: 6 },
      { name: 'Pau Pra Toda Obra', artist: 'MC Jacaré', previous: 9 },
      { name: 'Só Com Ela', artist: 'Murilo Huff', previous: 10 },
      { name: 'Não é Pressa, é Pressão', artist: 'Rincon, Ana Castela, DJ BOSS', previous: 8 }
    ]
  }
]
