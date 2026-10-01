# Revisão do site para AdSense

## Ajustes implementados — 01/10/2026

Esta seção é o estado mais recente e substitui as pendências técnicas descritas nas revisões abaixo.

### Concluído no projeto

- Estatísticas opcionais exigem escolha explícita. Google Analytics e Vercel Analytics só são inicializados após permissão; eventos próprios e eventos de reprodução verificam a escolha a cada envio. O servidor ignora eventos sem a indicação de consentimento. O visitante pode recusar, permitir e rever a escolha no rodapé. Revogação interrompe novos eventos, desabilita GA, remove cookies GA acessíveis e o identificador local da sessão; não apaga o histórico do banco. Persistência da escolha: 180 dias. Preferências do player permanecem funcionais.
- Removidos os scripts estáticos de GA/AdSense e preconnects publicitários do HTML. Meta da conta e ads.txt permanecem. Anúncios desativados por padrão, inclusive unidades manuais: `VITE_ADSENSE_ENABLED=false`. O proprietário informou que ainda não configurou a CMP. Depois de publicá-la e verificá-la, a flag pode habilitar o carregador apenas na home. O banner local de estatísticas não é CMP certificada e não concede consentimento publicitário.
- Privacidade alinhada ao comportamento real e link para reabrir as preferências. GA inicializado sem sinais de personalização de anúncios e sem query string no endereço inicial/referrer enviado pela configuração local. Isso não certifica conformidade jurídica nem elimina todos os dados tratados pelos fornecedores.
- Atualizado o cache do service worker para v4, evitando preservar o shell anterior nesta versão.
- Quatro fichas pesquisadas em fontes primárias: Band FM São Paulo, Kiss FM São Paulo, Alpha FM São Paulo e Antena 1 São Paulo. Acrescentados perfis e orientações próprias, distinções entre praça/rede, ao vivo/episódio e pedidos/charts. Datas de pesquisa agora são individuais no React e no HTML. Site da Band FM aponta diretamente à seção oficial. Catálogo agora possui 16 perfis, 14 orientações de escuta e 38 emissoras sem site oficial; permanecem 181 sem perfil e 16 cidades sem editorial.
- Resolvida a falha dos testes de Relaxar, completando o mock de automação de áudio e verificando os sons tonais, envelopes e liberação de recursos.
- Verificador de streams exige início de dados e tipo de conteúdo de áudio/playlist; uma página HTML com HTTP 200 não conta mais como rádio funcional.
- Corrigidos cinco endereços de áudio a partir de players oficiais: JK FM (`/stream`), A Tarde FM (`/stream`), Interativa FM (porta 8346), Positividade FM (estação `POSITIVIDADE_FM` no StreamTheWorld) e Positiva FM (porta 9268). JK recebeu o domínio oficial.
- Retirada a frequência desatualizada da antiga SulAmérica Paradiso: a Novo Tempo informa usar 95,7 MHz no Rio. Preservada a URL existente, com aviso de cadastro histórico em revisão e fonte primária; não foi inventada uma transmissão substituta. Fichas com falha na última checagem exibem aviso e alternativa oficial quando cadastrada.

### Produção e streams

O erro inicial de rede era de confiança TLS do Node (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`), resolvido usando `--use-system-ca`, sem desativar verificação de certificados. Em 01/10/2026, confirmados: home HTTP 200, ads.txt HTTP 200 com conta correta, Band FM HTTP 200, Fortaleza HTTP 200, URL desconhecida HTTP 404 e /analytics HTTP 410. www também atende a ficha com HTTP 200; não há redirecionamento automático para o host sem www nessa requisição. As verificações foram HTTP, sem inspeção visual ou execução do React de produção. A home publicada ainda possui o carregador antigo de anúncios; os ajustes deste turno não foram publicados.

Última rodada de streams: 195 de 197 responderam com dados e tipo de áudio; SulAmérica Paradiso retornou 503 e 93 FM Mossoró retornou 404. O endereço publicado pelo próprio site da 93 FM é o mesmo que falhou. Essas duas falhas foram mantidas no relatório de disponibilidade; não se trocou o áudio por outra rádio. Resposta HTTP não comprova identidade auditiva, disponibilidade permanente, reprodução em todo navegador ou licença comercial.

### Pendências externas e editoriais

1. Proprietário precisa configurar/publicar a CMP no painel AdSense; as instruções de ativação estão no README. Depois, verificar consentimento e anúncios automáticos reais em celular/desktop antes de habilitar a flag e publicar.
2. Ainda há pesquisa editorial a fazer no restante do catálogo e nas cidades. Quatro fichas novas melhoram conteúdo, mas não resolvem sozinhas eventual rejeição por baixo valor. Não se marcou todas as páginas como editorialmente prontas.
3. Não foram obtidas autorizações comerciais dos titulares de streams, logos e marcas. Política de remoção não comprova licença. A verificação deve ser feita com as emissoras; nenhuma mensagem foi enviada em nome do proprietário.
4. Corrigir externamente/confirmar com as emissoras as duas transmissões que continuam falhando. A SulAmérica Paradiso exige confirmação da identidade e operação atual antes de voltar a anunciar frequência ou programa ao vivo como verificados.
5. Definir retenção/exclusão de estatísticas e verificar fatos/fontes dos demais artigos. O histórico de produção não foi excluído e não foi estabelecido um prazo arbitrário para apagá-lo.

Fontes da pesquisa e dos players: [Band FM](https://www.band.com.br/band-fm), [Kiss FM](https://kissfm.com.br/programas/), [Alpha FM](https://alphafm.com.br/programacao), [Antena 1](https://www.antena1.com.br/programacao), [JK FM](https://www.jkfm.com.br/), [A Tarde FM](https://atardefm.com.br/), [Interativa FM](https://interativafm.net/audio/), [Positividade FM](https://positividade.fm/player), [Positiva FM](https://positivafm.com.br/), [Novo Tempo — 95,7 MHz no Rio](https://www.novotempo.com/rio-de-janeiro-recebe-o-sinal-da-radio-novo-tempo-a-voz-da-esperanca-na-957-fm/).

### Validação final destes ajustes

Adicionado depois: contador independente de escolhas de privacidade, agregado por dia, com somente data e totais de aceite/recusa. O visitante é informado no banner e na política; o envio omite cookies e referrer. Não registra visita, reprodução ou identificador de quem recusou. O painel separado foi atualizado com totais gerais, taxa de aceite e detalhamento diário. Testes do site: 41 passaram (um teste de rede separado); painel: quatro passaram. Ambos os builds e lint passaram. Contagem começa após publicar as duas aplicações; não há histórico retroativo, deduplicação de pessoas ou garantia de entrega quando a rede falha.

Build, lint e suíte local passaram: 37 testes, zero falhas; o teste de streams da suíte padrão é separado da checagem de rede executada acima. Auditoria final: 285 HTMLs, 83 URLs no sitemap, 201 páginas `noindex` e zero erros. Não havia navegador conectado na ferramenta disponível, portanto o banner novo não recebeu inspeção visual desktop/mobile. Testes exercitaram recusa, aceitação, revogação, expiração, bloqueio do coletor e inicialização/desativação do Google Analytics. Nenhum deploy, alteração no painel AdSense ou solicitação de revisão foi feito.

## Revisão inicial da auditoria — 01/10/2026

Esta seção substitui as conclusões técnicas anteriores sobre retirar páginas do build. As seções antigas abaixo são histórico. O código atual mantém todas as fichas e listagens acessíveis, usa `noindex` onde falta conteúdo editorial e não carrega o script AdSense nas rotas diretas. `noindex` é uma regra de indexação, não uma exclusão da avaliação de qualidade pelo AdSense.

### Parecer

Ainda há risco relevante de reprovação por conteúdo de baixo valor. A navegação foi corrigida, mas 185 de 197 fichas não têm perfil editorial próprio; 39 emissoras não possuem site oficial cadastrado e 16 listagens de cidades aguardam conteúdo editorial. Ter player, campos cadastrais e parágrafos de um modelo comum não demonstra, por si só, valor editorial suficiente. Não existe garantia de aprovação por quantidade de páginas, palavras ou artigos.

### Inspeção e alterações

- Conferidos modelos da home, fichas, estados/cidades/gêneros, guias, notícias, curiosidades, Relaxar, páginas institucionais, anúncios, analytics, robots, sitemap, service worker e configuração Vercel.
- Restaurada a geração das rotas do catálogo, inclusive páginas `noindex`. Isso evita links internos para páginas inexistentes sem ampliar automaticamente o sitemap.
- Política de privacidade atualizada com anúncios baseados em visitas anteriores, cookies do Google e parceiros e opções para desativar personalização. O texto não afirma que existe CMP ou consentimento implementado.
- Corrigido o loader que permanecia cobrindo o HTML pré-renderizado quando JavaScript estava desativado.
- Auditoria passa a exigir HTML de todas as rádios, `noindex` para fichas sem perfil, ausência de script AdSense nas fichas e correspondência entre ads.txt e conta configurada.

### Pendências por prioridade

| Prioridade | Evidência e impacto | Próxima ação |
| --- | --- | --- |
| Alta | 185 fichas sem perfil e listagens com texto semelhante: risco de baixo valor. Mesmo as 12 fichas pesquisadas precisam de conteúdo útil além de resumos de fontes. | Pesquisar e revisar as emissoras prioritárias; oferecer comparação específica, identidade da praça, formato e orientação verificável. Não copiar releases nem inventar experiência de escuta. |
| Alta | Home carrega AdSense; slots manuais estão vazios. Anúncios automáticos são controlados na conta, não comprovados pelo repositório. | Verificar no painel exclusões e posições em celular, distância dos controles do player e ausência de anúncios em telas de erro ou essencialmente sem conteúdo. |
| Alta, conforme público | Google Analytics é inicializado sem fluxo local de consentimento; há apenas preconnect para Funding Choices, que não prova CMP ativa. | Conferir Privacidade e mensagens. Para anúncios personalizados no EEE/Reino Unido/Suíça, usar CMP certificada integrada à TCF. Conferir comportamento efetivo e configurações dos fornecedores. |
| Alta se houver uso não autorizado | Catálogo incorpora streams e usa marcas/logotipos de terceiros. Política de remoção e link público não comprovam autorização de uso comercial. | Verificar condições e permissões dos fornecedores/emissoras; guardar evidências e atender solicitações de remoção. Nenhuma infração específica foi comprovada nesta inspeção. |
| Média | Última checagem registrada de streams: 11/08/2026, com duas falhas. URLs são HTTPS, mas isso não comprova reprodução. | Testar streams novamente em ambiente com rede e ouvir amostras em celular/desktop para confirmar identidade e funcionamento. |
| Média | Artigos e rankings têm fontes e recortes datados. Atualização manual e fontes mutáveis exigem manutenção; referências não substituem revisão humana. | Conferir fatos e listas na edição indicada; manter data histórica e acrescentar análise própria. Não mudar somente a data para aparentar novidade. |
| Média | Páginas estaduais indexáveis usam regra de tamanho mínimo e texto calculado. | Revisar valor de cada listagem; três rádios não é critério oficial do Google para qualidade. |
| Operacional | Falha de teste em Relaxar: mock não implementa `setValueAtTime`. | Atualizar o mock e expectativas dos sons tonais; não atribuir essa falha à navegação nem inferir defeito de áudio real sem teste no navegador. |

### O que está adequado no build local

ads.txt usa a mesma conta do script (`pub-5779366115279719`). Robots permite rastreamento e referencia o sitemap. Sitemap seleciona páginas editoriais e não inclui páginas `noindex`. As rotas diretas e a página de erro não recebem o script de anúncios no HTML gerado. Há identificação do responsável, contato, termos, privacidade, canal de correção e política de remoção. O áudio depende de ação do usuário. Nenhum incentivo explícito a clicar em anúncios foi encontrado no código examinado.

### Verificação e limites

Build e lint passaram. Auditoria: 285 HTMLs, 79 URLs no sitemap, 205 páginas `noindex`, zero erros. Os 22 testes selecionados de integração, repositório, integridade editorial e notícias passaram. A falha anterior da suíte completa em Relaxar permanece pendente; os testes de rede dos streams não foram executados porque as tentativas de acesso HTTP do ambiente falharam.

As políticas oficiais do Google foram consultadas nesta rodada. A home pública foi recuperada pelo buscador, mas tentativas de obter respostas completas de fichas, ads.txt e privacidade falharam; as requisições HTTP pelo ambiente também falharam. Isso é uma limitação da verificação, não evidência de que o site esteja fora do ar. Não foi possível confirmar status HTTP, redirecionamento www, erros 404 reais, renderização móvel, anúncios reais, CMP ativa, autorizações individuais de 197 streams ou painel AdSense/Search Console. Não houve deploy nem solicitação de revisão. Nenhuma aprovação é garantida.

Fontes oficiais consultadas:

- [Preparar páginas para AdSense](https://support.google.com/adsense/answer/7299563?hl=pt-BR)
- [Telas sem conteúdo ou de baixo valor](https://support.google.com/publisherpolicies/answer/11112688?hl=pt-BR)
- [Conteúdo replicado](https://support.google.com/publisherpolicies/answer/11190248?hl=pt-BR)
- [Conteúdo obrigatório na política de privacidade](https://support.google.com/adsense/answer/1348695?hl=pt-BR)
- [CMP para EEE, Reino Unido e Suíça](https://support.google.com/adsense/answer/13554116?hl=pt-BR)
- [Políticas do programa](https://support.google.com/adsense/answer/48182/adsense-programme-policies)

---

## Histórico — setembro de 2026

## Revisão nova — 23/09/2026

Revisão do repositório após a alteração local em `src/pages/DirectPage.jsx` e `scripts/prerender-seo.mjs`. Não houve acesso ao painel AdSense, Search Console, site publicado nem resposta HTTP da Vercel; portanto, esta é uma inspeção do código e do conteúdo local, não uma confirmação do diagnóstico do Google ou do comportamento em produção. As páginas oficiais de política indicadas pelo proprietário não puderam ser abertas pelo navegador desta sessão.

### O que mudou desde a revisão anterior

- O app passou a renderizar a tela de página não encontrada para fichas de emissora sem perfil editorial.
- O pré-renderizador passou a pular rotas marcadas `noindex`, exceto a home e as rotas de emissoras que tenham perfil editorial.
- O sitemap já incluía apenas as 12 emissoras com perfil editorial; a regra permanece coerente com essa seleção.
- Nenhum build/deploy dessa alteração foi confirmado. A tentativa local de `npm run build` falhou porque Node recebeu `EPERM` ao acessar `E:\` neste ambiente.

### Lacunas e riscos que permanecem

1. **Não presumir que `noindex` ou remover HTML do build resolve a avaliação do AdSense.** Em produção, a Vercel pode encaminhar uma URL sem arquivo para a SPA ou para `404.html`; sem inspeção de status e corpo HTTP não se sabe se uma ficha retirada deixa de responder como página, se vira uma página 404 com status 200 (soft 404) ou se uma regra de rewrite serve conteúdo alternativo. A configuração tem redirecionamentos explícitos e um rewrite de `/analytics`, mas a regra efetiva para demais rotas precisa ser confirmada na hospedagem.
2. **Home contém links para as 197 fichas.** O script de pré-renderização usa `getFeaturedRadios()` para escolher as fichas mostradas diretamente, mas `rootContent` também chama `exploreCatalogNav()`; conferir se a navegação resultante ainda liga para as páginas removidas. Na SPA, a home mantém catálogo e cards completos. Assim, rotas retiradas podem continuar descobertas por links internos ou pela interface.
3. **As páginas de cidades e estados ainda usam introduções e descrições calculadas por um modelo comum.** Só cidades com registro editorial próprio recebem seções adicionais; `cityEditorial.js` cobre uma fração das listagens. As listagens continuam no sitemap quando passam os critérios atuais. Tamanho mínimo de três rádios é apenas regra técnica, não prova de valor editorial.
4. **As 12 fichas com perfil e as 10 orientações de escuta precisam de nova verificação editorial.** Fontes oficiais cadastradas são um bom ponto de partida, mas a existência de link não comprova que o texto representa fielmente a estação ou continua atualizado. A revisão anterior também registrou 39 estações sem site oficial no catálogo.
5. **O site inicializa publicidade e medição antes da interação.** `index.html` carrega AdSense e Google Analytics; `main.jsx` inicializa Vercel Analytics e `OwnAnalytics` nas rotas diretas também. Verificar configurações reais, consentimento aplicável, cookies/armazenamento e a posição de anúncios na página publicada. Não consegui inspecionar a conta nem o layout renderizado.
6. **Volume de artigos não sana sozinho as páginas do produto.** Curiosidades, Novidades e guias possuem conteúdo autoral, mas rankings e fatos datados exigem revisão de fontes e atualização real. Não afirmar que uma data antiga continua atual por ter sido republicada.

### Recomendações de correção

- Primeiro gerar um build em ambiente com acesso ao workspace e auditar os diretórios resultantes: páginas retiradas ausentes, links internos válidos, sitemap sem rotas frágeis, canonical/robots coerentes e nenhum link de conteúdo editorial apontando para soft 404.
- Publicar em preview e conferir, para uma ficha com perfil e outra sem perfil, status HTTP, HTML recebido sem JavaScript e destino final em celular e desktop. Fazer a mesma checagem em páginas de cidade, `/404`, `/analytics` e artigos.
- Escolher quais emissoras o produto quer manter acessíveis. Se o usuário ainda precisa do catálogo completo, melhorar a página da estação com pesquisa própria e fonte oficial antes de indexá-la; se a ficha for retirada, remover links e oferecer na UI alternativas válidas sem apresentar um 404 com status de sucesso.
- Priorizar auditoria de conteúdo real (precisão de nomes, frequências, cidade, formato e stream) e autoria/fontes nos perfis atuais; depois pesquisar dados suficientes para as cidades que continuarão indexáveis. Não preencher essas lacunas com texto repetitivo.
- Conferir no painel AdSense a razão e as URLs examinadas, anúncios automáticos, consentimento/CMP para regiões aplicáveis e eventuais bloqueios de rastreamento; só então decidir quando pedir revisão.

### Resultado desta rodada

Confirmado pelo diff local: duas alterações de código não commitadas, ambas direcionadas a ocultar/remover fichas sem perfil. As demais alterações locais no working tree estavam ausentes. `npm run build` não chegou ao Vite/prerender porque o Node não conseguiu atravessar a unidade `E:` (`EPERM`); lint e auditoria de site não foram executados nesta rodada. Nenhuma publicação ou solicitação de nova revisão foi feita.

Motivo informado pelo proprietário: **conteúdo de baixo valor**. O painel do AdSense não foi acessado; não há evidência de que o Google tenha apontado uma URL específica. Esta revisão identifica problemas e ações no projeto, sem prometer aprovação nem atribuir ao Google um diagnóstico mais específico do que o informado.

## Diagnóstico principal

O site oferece busca, filtros, favoritos, comparação, player, guias e sons sintéticos. Esses recursos têm utilidade, mas o catálogo ainda contém muitas fichas baseadas nos mesmos campos e explicações genéricas. Novas matérias ajudam a ampliar o conteúdo próprio; não resolvem automaticamente a qualidade das outras páginas.

O Google recomenda conteúdo original, relevante e uma experiência de navegação clara em [Preparar as páginas para o AdSense](https://support.google.com/adsense/answer/7299563?hl=pt-BR). A [política sobre telas sem conteúdo ou com conteúdo de baixo valor](https://support.google.com/publisherpolicies/answer/11112688?hl=en) trata da veiculação de anúncios. Não há uma quantidade de artigos ou palavras adotada nesta revisão como garantia de aprovação. `noindex` controla indexação e não equivale a excluir uma página da avaliação de qualidade do AdSense.

## Escopo e evidências

Revisados: home, catálogo e modelos de fichas, cidades, estados, gêneros, guias, Novidades e seus rankings, Relaxar, páginas institucionais, navegação, geração de HTML, sitemap, robots, configuração de anúncios, estatísticas e configurações de hospedagem. Foram examinados os dados do catálogo e automatizada a inspeção dos HTMLs gerados. Isso não equivale a conferir manualmente a programação e os direitos de cada uma das 197 emissoras.

| Evidência do catálogo | Resultado |
| --- | ---: |
| Emissoras | 197 |
| Com perfil editorial | 12 |
| Sem perfil editorial | 185 |
| Com orientações específicas de escuta | 10 |
| Sem site oficial cadastrado | 39 |
| Cidades aguardando conteúdo editorial | 16 |

Os dados completos podem ser reproduzidos com `npm run audit:content`. Nenhuma audiência, grade ou experiência de escuta foi inventada para preencher lacunas. A falta de frequência da estação exclusivamente online não deve ser corrigida com um número fictício.

## Alterações realizadas nesta revisão

- Criada `/curiosidades`, com seis matérias sobre instrumentos de cordas, saxofone, top 10 histórico do Spotify, Eagles/Queen e certificações, comparação de públicos de shows e memória musical no rádio.
- Cada matéria contém explicações, referências, data, sumário, links relacionados e canal de correção. O top 10 conserva a edição de abril de 2026; os shows são exemplos históricos, sem alegação de recorde mundial atual. Apoio de IA está explícito, sem alegar entrevistas ou revisão humana já realizada.
- Navegação principal e rodapé expõem as seções; a home recebeu cartões. Pré-renderização inclui as matérias completas, fontes, lista ordenada, canonical e schema Article; sete novas URLs entraram no sitemap.
- Corrigida a ausência de Novidades e Relaxar no HTML inicial da home. A presença de conteúdo no React não assegurava sua presença nesse HTML.
- Rotas desconhecidas exibem uma página de erro com `noindex` no aplicativo, em vez de redirecionar silenciosamente para a home. O status HTTP de produção ainda precisa ser conferido após publicação.
- Política de privacidade agora descreve as estatísticas próprias, Google Analytics, Vercel, Neon, identificador de sessão, localização aproximada e conexão aos streams. Removida a afirmação incorreta de uso exclusivo para preferências e a declaração genérica de conformidade legal já assegurada.
- O campo de caminho das estatísticas próprias deixou de incluir query strings. Isso não altera automaticamente os dados coletados pelo Google Analytics, pelos fornecedores ou registros antigos.
- Corrigido o link de atendimento dos Termos. A página auxiliar `/icon-options` recebeu `noindex` e metadados.
- Adicionado `npm run audit:site`: verifica HTMLs, metadados essenciais, links locais, sitemap, JSON-LD, ausência do script AdSense nas páginas `noindex` e integridade do conteúdo pré-renderizado de Curiosidades. O arquivo de verificação do Yandex é identificado como prova de propriedade, sem exigir conteúdo editorial nele.

## Prioridades antes de pedir nova revisão

### 1. Aprofundar o catálogo que sustenta o produto

Priorizar as rádios efetivamente mais consultadas, quando houver relatório real de acesso, e as destacadas na home. Para cada ficha, confirmar a identidade da emissora e a praça, cadastrar fonte oficial e pesquisar formato, diferenças de programação, público a que a proposta se dirige e orientações úteis de escuta. Informar data e fonte de cada dado variável. Não copiar releases ou criar parágrafos intercambiáveis para completar tamanho.

Critério editorial sugerido para cada ficha: ela ajuda alguém a decidir se deve ouvir aquela rádio e responde a uma dúvida que nome, frequência e player sozinhos não respondem? Sem informação verificável, manter a lacuna e evitar promovê-la como página editorial completa. As 185 fichas já ficam fora do sitemap e usam `noindex`; ainda permanecem acessíveis no site.

### 2. Revisar e manter as matérias com responsabilidade editorial

O responsável deve ler as seis novas matérias e conferir as referências antes da publicação. Complementar com repertório próprio: exemplos documentados, comparações de programação, entrevistas autorizadas ou análise de escuta realmente realizada. Não apresentar essas atividades como concluídas quando não ocorreram.

Manter os rankings de Novidades como retratos datados até uma atualização real. Não trocar somente a data de publicação para parecer recente. A lista de artistas e músicas já existente usa uma edição semanal; ela não responde sozinha a “mais ouvidas nos últimos meses”. Se esse for o objetivo, pesquisar uma fonte que forneça o acumulado do período e território pretendidos.

### 3. Confirmar direitos e fontes externas

A presença de um stream público e de um aviso de direitos autorais não prova autorização para todo uso. Conferir termos dos distribuidores, marcas/logos e permissões necessárias, e documentar pedidos de remoção. Nenhum contrato ou autorização foi fornecido para esta revisão. O Google aborda propriedade intelectual em suas [políticas para publishers](https://support.google.com/publisherpolicies/answer/10502938?hl=en-GB).

As novas matérias não adicionam letras, arquivos musicais, imagens de artistas nem gravações de terceiros. Relaxar usa síntese no aparelho; isso não resolve separadamente os direitos dos streams do catálogo.

### 4. Fechar privacidade, retenção e configurações de anúncios

A política foi alinhada ao código, mas não constitui verificação jurídica de conformidade. Falta definir e implementar prazo de retenção/exclusão para estatísticas próprias e conferir configurações de retenção dos fornecedores. O código examinado não comprova um fluxo de consentimento integrado antes de todos os scripts de medição.

Conferir no painel a gestão de consentimento aplicável aos públicos atendidos. Para anúncios personalizados no EEE, Reino Unido e Suíça, seguir os [requisitos de CMP certificada do Google](https://support.google.com/adsense/answer/13554116?hl=en). Não presumir que um banner genérico atende ao requisito ou que um preconnect para o domínio de mensagens comprova CMP ativa.

No build, o script AdSense é mantido na home e removido das rotas diretas; os slots manuais estão vazios. Isso não revela a configuração de anúncios automáticos na conta. Antes de ativar anúncios, conferir seu posicionamento no celular: separação dos botões do player, ausência de indução a cliques e conteúdo editorial acessível. O foco do espaço Relaxar em escuta não deve ser usado para criar telas praticamente vazias destinadas a anúncios.

### 5. Publicar, conferir produção e então solicitar revisão

As alterações são locais. Após a publicação, verificar `/curiosidades` e suas seis páginas, navegação, fontes, política, sitemap e erros 404; confirmar que nenhum bloqueio impede o rastreador de acessar o conteúdo. Testar player, busca e controle de áudio em celular real. A atualização do sitemap não solicita automaticamente uma nova análise no AdSense.

Não esperar um número mágico de dias ou publicar textos em massa para cumprir uma suposta cota. Solicitar a nova revisão quando as melhorias estiverem realmente publicadas e os problemas relevantes tiverem sido tratados. A decisão é do Google.

## Validação e limites

Build, lint e testes automatizados executados; resultados finais registrados em CONTENT_REVIEW.md. Auditoria local abrange os HTMLs gerados e os destinos internos, não disponibilidade de todos os links externos nem renderização de anúncios reais. Não houve navegador conectado para inspeção visual desktop/mobile, teste auditivo, Lighthouse ou conferência de Core Web Vitals. O teste de rede das 197 transmissões permaneceu desativado. Também não foram acessados AdSense, Search Console, banco de analytics ou configurações da conta Vercel. Nenhuma nova revisão foi solicitada e nenhum deploy foi realizado.
