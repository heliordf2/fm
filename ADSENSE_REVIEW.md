# Revisão do site para AdSense — 22/09/2026

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
