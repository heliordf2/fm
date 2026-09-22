# Revisão do site para AdSense — 22/09/2026

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
