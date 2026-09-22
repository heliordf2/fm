export const CURIOSITY_DATE = '2026-09-22'
export const CURIOSITY_DESCRIPTION = 'Entenda instrumentos, histórias do rádio, recordes de shows e rankings musicais com fontes e critérios de comparação.'
export const CURIOSITY_EDITORIAL = 'Textos preparados com apoio de inteligência artificial e baseados nas referências indicadas. A seleção e as explicações são do Rádio FM Online; não constituem entrevistas ou apuração presencial. Rankings preservam o recorte e a data da fonte. Encontrou um erro? Envie a informação e sua referência pelo nosso canal de contato.'
export const curiosityPath = (article) => `/curiosidades/${article.slug}`
export const CURIOSITIES = [
  {
    slug: 'violao-viola-caipira-guitarra', category: 'Instrumentos',
    title: 'Violão, viola caipira e guitarra: o que muda no som?',
    description: 'Cordas, caixa acústica e captadores ajudam a explicar por que instrumentos parecidos ocupam espaços tão diferentes numa música.',
    sections: [
      { title: 'Siga o caminho da vibração', paragraphs: [
        'Ao ouvir uma introdução de cordas, tente separar três elementos: o ataque inicial, a sustentação da nota e o que acontece entre uma nota e outra. Essa escuta costuma revelar mais do que tentar identificar o instrumento apenas pela aparência. Violão, viola caipira e guitarra permitem dedilhados e acordes, mas produzem e projetam o som de maneiras distintas.',
        'No violão acústico, a vibração das cordas chega ao tampo pelo cavalete. O corpo do instrumento e o ar em seu interior participam da projeção sonora. Por isso, a caixa não funciona simplesmente como um recipiente: sua construção integra o resultado que chega ao ouvido. A explicação da Yamaha sobre o violão descreve esse percurso mecânico.'
      ] },
      { title: 'A viola e o efeito das cordas em pares', paragraphs: [
        'A viola caipira costuma ter dez cordas distribuídas em cinco pares, também chamados de ordens. Em uma apresentação de Ivan Vilela, documentada pela Prefeitura de Curitiba, essa organização aparece como característica do instrumento. Compare com a configuração habitual de seis cordas individuais do violão: a diferença não é apenas ter quatro cordas a mais, mas a maneira como os pares participam de cada gesto musical.',
        'Ao escutar uma viola, procure o brilho e a combinação de sons dentro do dedilhado. Não é seguro concluir qual afinação foi usada somente pelo nome do instrumento: a prática admite diferentes afinações e maneiras de tocar. Também não convém limitar a viola ao acompanhamento. O trabalho instrumental citado na fonte mostra que ela pode ocupar o centro da apresentação.'
      ] },
      { title: 'Na guitarra, o timbre continua depois das cordas', paragraphs: [
        'Na guitarra elétrica, captadores convertem o movimento das cordas em sinal elétrico. Esse sinal segue para amplificação e pode passar por efeitos. A posição do captador já altera o caráter do som: a Yamaha descreve diferenças entre a região próxima ao braço e a próxima à ponte. Assim, duas passagens tocadas no mesmo instrumento podem soar bastante diferentes.',
        'Distorção, som limpo e sustentação são pistas úteis, mas nenhuma identifica sozinha o gênero musical. Em uma gravação, arranjo, técnica e processamento também influenciam o resultado. Para comparar instrumentos, prefira trechos em que as cordas estejam expostas; em uma mixagem cheia, teclados e camadas de guitarra podem esconder o ataque original.'
      ] },
      { title: 'Um exercício para a próxima música no rádio', paragraphs: [
        'Escute primeiro o início de cada nota. Depois, observe se o som desaparece rapidamente ou permanece sustentado. Por fim, acompanhe a função: o instrumento marca os acordes, responde à voz ou conduz a melodia? Esse exercício transforma uma dúvida sobre nomes em uma forma prática de entender o arranjo.',
        'No catálogo, as seleções de sertanejo e rock são pontos de partida para comparar usos dessas cordas. A programação depende de cada emissora, portanto o player não garante uma faixa ou um instrumento específico. Anote o nome da música anunciada e procure os créditos da gravação quando quiser confirmar sua hipótese.'
      ] }
    ],
    sources: [
      { label: 'Yamaha: estrutura e projeção do violão acústico', url: 'https://europe.yamaha.com/en/musical-instruments/guitars-basses-amps/explore/musical-instrument-guide/acoustic-guitar/structure001.html' },
      { label: 'Prefeitura de Curitiba: a viola de Ivan Vilela', url: 'https://www.curitiba.pr.gov.br/noticias/viola-caipira-ganha-o-palco-com-o-show-de-ivan-vilela/131' },
      { label: 'Yamaha: seleção dos captadores da guitarra', url: 'https://www.yamaha.com/en/musical_instrument_guide/electric_guitar/play/play003.html' }
    ], related: { url: '/genero/sertanejo', label: 'Explorar rádios de sertanejo' }
  },
  {
    slug: 'como-saxofone-produz-som', category: 'Instrumentos',
    title: 'Por que o saxofone é um instrumento de madeira se é feito de metal?',
    description: 'A classificação acompanha a forma de produzir o som. Entenda a palheta e as diferenças que você pode perceber numa gravação.',
    sections: [
      { title: 'O material do corpo não resolve a classificação', paragraphs: [
        'É fácil associar o brilho metálico do saxofone à família dos metais. Na classificação musical usual, porém, ele integra as madeiras. A pista está na produção sonora: o músico sopra por uma boquilha com palheta, que vibra e participa da excitação da coluna de ar. A família não se define apenas pela matéria-prima visível.',
        'Essa distinção ajuda a evitar outra confusão: instrumento de sopro não é sinônimo de metal. A expressão reúne mecanismos diferentes. No caso do saxofone, olhar para a boquilha e para a palheta explica mais do funcionamento do que olhar para a cor do corpo.'
      ] },
      { title: 'Uma pequena peça com grande influência', paragraphs: [
        'A documentação da Yamaha descreve a palheta presa à boquilha por uma abraçadeira. O conjunto precisa permitir sua vibração; a montagem e o contato com a boquilha interferem na resposta. É nesse encontro entre ar, palheta e instrumento que começa o som que depois reconhecemos em um solo.',
        'Isso não significa que exista uma combinação universalmente melhor. A mesma fonte compara escolhas de boquilha e palheta em contextos de jazz e música clássica. O resultado depende do conjunto e do músico. Comprar uma peça associada a determinado estilo não reproduz automaticamente a sonoridade de uma gravação.'
      ] },
      { title: 'Soprano, alto, tenor e barítono', paragraphs: [
        'O saxofone é uma família de instrumentos. Soprano, alto, tenor e barítono são quatro de seus integrantes mais conhecidos, apresentados no guia da Yamaha. Eles ocupam regiões diferentes e têm dimensões distintas. Por isso, dizer apenas “há um saxofone nessa música” ainda deixa parte da informação em aberto.',
        'Para começar a distinguir suas participações, observe a região em que a frase se desenvolve e a relação com a voz. Uma linha pode responder ao cantor, sustentar notas longas ou assumir a melodia inteira. Timbre, registro e função ajudam na escuta, mas a identificação precisa pode exigir os créditos da gravação, especialmente quando há efeitos ou instrumentos sobrepostos.'
      ] },
      { title: 'Escute a frase, não apenas o instrumento', paragraphs: [
        'Em uma próxima audição, acompanhe onde o saxofonista respira e como termina cada frase. Há notas curtas ou prolongadas? A melodia reaparece com pequenas variações? Esse exercício permite perceber a interpretação mesmo sem conhecer teoria musical.',
        'Também vale comparar duas versões de uma mesma composição. A mudança de formação pode alterar o espaço disponível para o saxofone: uma banda com voz deixa aberturas diferentes de um conjunto instrumental. Evite tratar uma gravação como padrão de toda a família. O interesse está justamente na variedade de funções que o instrumento consegue assumir.'
      ] }
    ],
    sources: [
      { label: 'Yamaha: palheta, boquilha e produção do som', url: 'https://www.yamaha.com/en/musical_instrument_guide/saxophone/mechanism/mechanism002.html' },
      { label: 'Yamaha: soprano, alto, tenor e barítono', url: 'https://hub.yamaha.com/winds/wood/whats-the-difference-between-soprano-alto-tenor-and-baritone-saxophones/' },
      { label: 'Yamaha: diferenças de configuração para jazz e música clássica', url: 'https://www.yamaha.com/en/musical_instrument_guide/saxophone/mechanism/mechanism004.html' }
    ], related: { url: '/genero/adulto-flashback', label: 'Explorar rádios adultas e de flashback' }
  },
  {
    slug: 'musicas-mais-ouvidas-spotify-historico', category: 'Rankings explicados',
    title: 'As 10 músicas mais ouvidas no Spotify: retrato histórico de abril de 2026',
    description: 'Veja a lista divulgada nos 20 anos do Spotify e entenda por que ela não equivale às músicas mais ouvidas de toda a história.',
    sections: [
      { title: 'Qual é o universo desta lista?', paragraphs: [
        'Em 23 de abril de 2026, o Spotify publicou uma seleção histórica de suas músicas mais reproduzidas. A relação abaixo preserva os dez primeiros lugares dessa publicação oficial. O recorte é global e se refere à plataforma; esta página não é um placar atualizado em tempo real nem uma medição conjunta de rádio, discos e outros serviços.',
        'A expressão “de todos os tempos” exige uma pergunta adicional: todos os tempos de qual base? Uma faixa que circulou durante décadas em vinil, televisão e rádio pode ter uma história enorme que não aparece integralmente em streams. Por isso, mantemos a plataforma e a data no título.'
      ] },
      { title: 'Top 10 da publicação oficial do Spotify', paragraphs: ['Ordem divulgada em 23/04/2026. A fonte apresenta o ranking; não atribuímos contagens atuais às faixas.'], orderedItems: [
        'Blinding Lights — The Weeknd', 'Shape of You — Ed Sheeran', 'Sweater Weather — The Neighbourhood', 'Starboy — The Weeknd e Daft Punk', 'As It Was — Harry Styles', 'Someone You Loved — Lewis Capaldi', 'Sunflower – Spider-Man: Into the Spider-Verse — Post Malone e Swae Lee', 'One Dance — Drake, Wizkid e Kyla', 'Perfect — Ed Sheeran', 'STAY (with Justin Bieber) — The Kid LAROI e Justin Bieber'
      ] },
      { title: 'O que observar além da primeira posição', paragraphs: [
        'Na seleção, The Weeknd e Ed Sheeran aparecem com duas faixas cada. Esse é um modo simples de ler a lista: observar a recorrência de artistas. Outra possibilidade é comparar canções individuais com colaborações. Nenhum desses exercícios transforma automaticamente a ordem das músicas em um ranking de artistas, pois seria necessário somar um catálogo e definir outra metodologia.',
        'Também é diferente contar reproduções acumuladas e medir velocidade de crescimento. Uma gravação pode reunir um total elevado ao longo de anos; outra pode ter uma estreia intensa e ainda estar distante desse total. Sem uma série temporal, a posição sozinha não explica quando ocorreram as audições nem por que elas cresceram.'
      ] },
      { title: 'Um marco documentado, sem extrapolar o resultado', paragraphs: [
        'O Guinness registrou em setembro de 2025 que Blinding Lights se tornou a primeira música a atingir cinco bilhões de reproduções no Spotify. Esse marco ajuda a contextualizar sua presença no topo do levantamento posterior, mas continua sendo um recorde específico de uma plataforma. Não comprova liderança em toda forma de consumo musical.',
        'Para comparar listas, verifique quatro informações: território, período, plataforma e unidade de medida. Uma parada semanal brasileira responde a uma pergunta diferente deste acumulado global. Na seção Novidades, os rankings têm seu próprio recorte; vale observar os cabeçalhos antes de comparar posições. Se quiser ouvir essas músicas pelo rádio, lembre que cada estação escolhe sua programação.'
      ] }
    ],
    sources: [
      { label: 'Spotify: listas históricas dos 20 anos, publicadas em 23/04/2026', url: 'https://newsroom.spotify.com/2026-04-23/spotify-20-most-streamed-music-podcasts-audiobooks/' },
      { label: 'Guinness: Blinding Lights alcança cinco bilhões de streams em 2025', url: 'https://www.guinnessworldrecords.com/news/2025/9/iconic-the-weeknd-hit-becomes-first-song-ever-to-reach-five-billion-streams-on-spotify' }
    ], related: { url: '/novidades', label: 'Comparar com os rankings e matérias de Novidades' }
  },
  {
    slug: 'bandas-famosas-certificacoes-recordes', category: 'História da música',
    title: 'Eagles e Queen: o que os recordes contam sobre bandas famosas',
    description: 'Um álbum certificado e uma canção duradoura ilustram formas diferentes de sucesso — e os cuidados ao comparar bandas.',
    sections: [
      { title: 'Existe uma banda mais famosa do mundo?', paragraphs: [
        '“Mais famosa” parece uma medida simples, mas pode significar reconhecimento do nome, discos vendidos, público de shows ou audições recentes. Sem escolher um critério e um território, qualquer lista mistura respostas. Em vez de atribuir uma posição universal, esta matéria examina dois casos documentados: uma coletânea dos Eagles e uma gravação do Queen.',
        'A escolha serve para entender os indicadores. Não representa um top de qualidade, influência artística ou popularidade atual. Uma banda pode liderar uma certificação em um país e ocupar outra posição em serviços digitais, especialmente quando os públicos e os períodos observados são diferentes.'
      ] },
      { title: 'Eagles: uma coletânea como porta de entrada', paragraphs: [
        'Em janeiro de 2026, a Rhino anunciou que Their Greatest Hits 1971–1975, dos Eagles, alcançou certificação de 40 vezes platina nos Estados Unidos. O comunicado acompanha o aniversário de cinquenta anos da coletânea, lançada em fevereiro de 1976. A informação é sobre esse álbum e esse mercado; não corresponde a quarenta milhões de compradores identificados ou a uma pesquisa mundial de reconhecimento.',
        'Uma coletânea reúne um percurso já existente em um único lançamento. Para quem conhece uma banda pelas rádios, esse formato pode funcionar como ponto de encontro entre canções ouvidas separadamente. É uma leitura do papel do disco, não uma conclusão estatística sobre a motivação de cada pessoa que o ouviu ou comprou.'
      ] },
      { title: 'Queen: quando o destaque é uma faixa', paragraphs: [
        'Em 2021, um comunicado publicado no site oficial de Brian May registrou a certificação de diamante de Bohemian Rhapsody pela RIAA. Aqui, a unidade observada é uma gravação, enquanto o exemplo dos Eagles envolve um álbum. Essa diferença impede colocar os dois números lado a lado como se medissem a mesma coisa.',
        'O caso também convida a separar a trajetória da obra e a data do reconhecimento. Uma certificação é divulgada em um momento determinado, mas pode refletir consumo acumulado anteriormente. Ler apenas a data do anúncio daria uma impressão errada de lançamento ou de sucesso concentrado naquele ano.'
      ] },
      { title: 'Como ler uma certificação sem distorcer seu significado', paragraphs: [
        'A RIAA explica que suas premiações passam por verificação e seguem critérios próprios. Ao consultar uma marca de ouro, platina ou diamante, confira a categoria e o mercado. Certificações podem contemplar diferentes formas de consumo conforme as regras aplicáveis; não substitua automaticamente “unidades certificadas” por “discos físicos vendidos”.',
        'Uma boa comparação reúne registros equivalentes: álbuns com álbuns, faixas com faixas e dados do mesmo território. Para descobrir música, entretanto, você não precisa transformar toda escolha em competição. Experimente ouvir uma faixa conhecida e depois procurar o álbum de origem, observando o que muda na sequência, no clima e nos arranjos. Rádios de rock e flashback podem abrir essa pesquisa, mas os créditos e as fontes oficiais ajudam a continuá-la.'
      ] }
    ],
    sources: [
      { label: 'Rhino: certificação da coletânea dos Eagles em 2026', url: 'https://images.rhino.com/press-release/their-greatest-hits-1971-1975' },
      { label: 'Brian May: comunicado sobre Bohemian Rhapsody em 2021', url: 'https://brianmay.com/queen-news/2021/03/press-release-queens-bohemian-rhapsody-reaches-rare-riaa-diamond-status/' },
      { label: 'RIAA: critérios e verificação de certificações', url: 'https://www.riaa.com/gold-platinum/about-awards/' }
    ], related: { url: '/genero/rock', label: 'Conhecer rádios de rock' }
  },
  {
    slug: 'maiores-shows-publico-comparacao', category: 'Palcos e público',
    title: 'Milhões na praia ou ingressos contados: como comparar grandes shows',
    description: 'Copacabana em 1994 e Modena em 2017 mostram por que estimativas de multidão e público com ingresso precisam de contexto.',
    sections: [
      { title: 'Antes do recorde, entenda a contagem', paragraphs: [
        'Um show gratuito numa praia e um evento com entrada controlada podem reunir multidões, mas produzem números por processos diferentes. No espaço aberto, a presença costuma ser estimada. Em um local com ingresso, há registros relacionados à venda ou ao acesso. Até nessa segunda situação é preciso verificar qual dos dois foi informado.',
        'Por isso, esta matéria apresenta exemplos históricos e seus limites, sem declarar qual é o maior show atual do mundo. Também não soma todos os dias de um festival para comparar o resultado com uma única apresentação. A unidade do evento faz parte da informação, tanto quanto o nome do artista.'
      ] },
      { title: 'Rod Stewart em Copacabana: o contexto do réveillon', paragraphs: [
        'O Guinness registra pelo menos 3,5 milhões de pessoas na praia de Copacabana na apresentação de Rod Stewart em 31 de dezembro de 1994. A própria referência ressalva que o público também incluía pessoas presentes para os fogos de réveillon. Essa observação deve acompanhar o número sempre que ele é citado.',
        'Seria inadequado converter a estimativa em ingressos vendidos ou afirmar que cada pessoa foi à praia exclusivamente pelo cantor. O evento reuniu show e celebração pública no mesmo espaço. Essa combinação ajuda a explicar por que a dimensão da multidão é impressionante e, ao mesmo tempo, exige cuidado na comparação com uma arena.'
      ] },
      { title: 'Vasco Rossi em Modena: outro tipo de registro', paragraphs: [
        'O arquivo da emissora pública italiana RAI documenta 225.173 espectadores no Modena Park, evento de Vasco Rossi realizado em 2017. Trata-se de outro contexto de apresentação e de contagem. A referência histórica permite discutir escala sem transformar uma publicação retrospectiva em confirmação de um recorde ainda vigente.',
        'Compare o que cada exemplo permite afirmar: Copacabana mostra a dimensão estimada de uma celebração aberta; Modena fornece um número associado a um evento delimitado. A diferença entre os totais não mede automaticamente a popularidade relativa dos artistas. Local, capacidade, cobrança de entrada e formato interferem no público possível.'
      ] },
      { title: 'Quatro perguntas para qualquer manchete de “maior show”', paragraphs: [
        'Primeiro, o total se refere a uma apresentação ou a vários dias? Segundo, são ingressos vendidos, acessos registrados ou uma estimativa de pessoas na região? Terceiro, quem produziu o número e com qual método? Quarto, a afirmação de recorde vale para uma categoria específica ou pretende abranger todos os eventos?',
        'Essas perguntas ajudam também a ler números de turnês: público acumulado em muitas cidades não é público simultâneo. Ao encontrar uma nova marca, procure a data e a referência antes de compartilhar. A escala pode ser fascinante por si só; não é necessário apagar as diferenças entre os eventos para contar uma boa história sobre música ao vivo.'
      ] }
    ],
    sources: [
      { label: 'Guinness: Rod Stewart em Copacabana e a ressalva sobre o réveillon', url: 'https://www.guinnessworldrecords.com.br/world-records/73085-largest-free-rock-concert-attendance' },
      { label: 'RAI Teche: Vasco Rossi e o público do Modena Park', url: 'https://www.teche.rai.it/2021/02/vasco-rossi-cuore-rock/' }
    ], related: { url: '/genero/rock', label: 'Explorar rock no catálogo de rádios' }
  },
  {
    slug: 'radio-musica-brasileira-memoria', category: 'História do rádio',
    title: 'Como o rádio participa da história da música brasileira',
    description: 'Da Rádio Nacional aos acervos da MEC, a relação entre rádio e música vai além de colocar uma gravação no ar.',
    sections: [
      { title: 'Um lugar de produção musical', paragraphs: [
        'Pensar no rádio apenas como uma sequência de gravações deixa de fora parte de sua história. Emissoras também mantiveram artistas, conjuntos e espaços de apresentação. Nessa relação, o programa pode ser o lugar em que uma interpretação acontece, e não somente o meio que retransmite um disco pronto.',
        'A retrospectiva da EBC sobre os noventa anos da Rádio Nacional recupera esse ambiente. Fundada em 1936 e incorporada à União em 1940, a emissora reuniu um elenco que inclui nomes como Emilinha Borba, Marlene e Cauby Peixoto. A documentação citada apresenta orquestras e profissionais que ajudam a compreender a dimensão dessa produção.'
      ] },
      { title: 'A programação constrói encontros', paragraphs: [
        'Uma canção no rádio chega acompanhada de escolhas: o horário, as outras faixas, a apresentação e o contexto do programa. Nossa leitura editorial é que essa sequência funciona como uma forma de descoberta. O ouvinte encontra algo que não precisou procurar pelo nome, situação diferente de iniciar uma faixa específica sob demanda.',
        'Isso não autoriza atribuir o sucesso de um artista a uma única emissora. Para demonstrar uma influência desse tipo, seriam necessários documentos, datas e registros de circulação. É mais preciso observar o papel do programa e do repertório do que transformar uma relação complexa em uma história de causa única.'
      ] },
      { title: 'A memória preservada pela Rádio MEC', paragraphs: [
        'A Rádio MEC remonta à Rádio Sociedade do Rio de Janeiro, criada em 1923 por iniciativa de Roquette-Pinto e Henrique Morize, conforme a história institucional da emissora. Sua trajetória mostra outra dimensão do meio: educação, cultura e preservação de registros sonoros.',
        'Na celebração do centenário, a EBC destacou um acervo de cerca de cinquenta mil registros. Um arquivo permite pesquisar vozes, interpretações e maneiras de apresentar música em outros períodos. A existência do registro, porém, não significa que toda gravação esteja disponível livremente para reprodução em qualquer site: acesso ao acervo e autorização de uso são questões distintas.'
      ] },
      { title: 'Como ouvir com atenção à história', paragraphs: [
        'Na próxima transmissão, observe se o apresentador informa intérprete, compositor e ano. São dados diferentes: quem canta não é necessariamente quem compôs, e uma obra pode ter várias gravações. Anotar essas informações ajuda a continuar a pesquisa sem confundir uma interpretação recente com a estreia da composição.',
        'Também compare propostas de emissoras. Uma seleção voltada a sucessos recorrentes e um programa dedicado a repertórios menos conhecidos oferecem experiências diferentes, sem que uma medida única de popularidade descreva seu valor. No catálogo, consulte os perfis disponíveis e os sites oficiais. A programação é definida pelas próprias rádios e pode mudar; nossos links são pontos de partida para conhecer esse trabalho.'
      ] }
    ],
    sources: [
      { label: 'TV Brasil/EBC: Rádio Nacional, 90 anos em sintonia com o Brasil', url: 'https://tvbrasil.ebc.com.br/caminhos-da-reportagem/2026/09/radio-nacional-90-anos-em-sintonia-com-o-brasil' },
      { label: 'Rádio MEC: história institucional', url: 'https://radiomec.ebc.com.br/sobre' },
      { label: 'EBC: centenário e acervo da Rádio MEC', url: 'https://www.ebc.com.br/imprensa/2023/radio-mec-celebra-100-anos-e-anuncia-programacao-especial' }
    ], related: { url: '/', label: 'Descobrir emissoras e seus perfis no catálogo' }
  }
]

export function curiositySchema(article) {
  return { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, datePublished: CURIOSITY_DATE, dateModified: CURIOSITY_DATE, inLanguage: 'pt-BR', mainEntityOfPage: `https://radiofmonline.com.br${curiosityPath(article)}`, author: { '@type': 'Organization', name: 'Rádio FM Online', url: 'https://radiofmonline.com.br/sobre.html' }, publisher: { '@id': 'https://radiofmonline.com.br/#organization' }, citation: article.sources.map((source) => source.url) }
}
