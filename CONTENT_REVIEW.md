# Revisão de conteúdo — 13/09/2026

## Novidades — 22/09/2026

- Revisão ampliada: cinco matérias com cronologia, créditos, bastidores documentados e contexto histórico; removidas as sugestões genéricas que ocupavam o lugar da informação.
- Dois top 10 em listas numeradas na página de novidades: artistas e músicas, edição Billboard Brasil de 14/09/2026, com posição anterior, fonte e metodologia. Dados de streaming/Luminate; não representam execução em rádio nem acumulado mensal. Retrato estático consultado em 22/09/2026, com atualização manual.

- Criada a seção `/novidades` com cinco artigos sobre fatos de junho a setembro de 2026: portais Nacional/MEC, Rádio Memória, Paula Fernandes e Simone Mendes, Rema e a seleção Songs of Summer do Spotify.
- Fontes oficiais da EBC, Rádio Nacional, Universal Music Brasil e Spotify identificadas em cada artigo, com data de consulta. Publicação dos textos em 22/09/2026, sem retroagir a data aos acontecimentos.
- Textos com apoio de IA explicitado, contextualização própria e sugestões de escuta. Não atribuem audição das músicas ou entrevistas ao autor, nem apresentam escolhas editoriais como ranking de execução em rádio.
- Páginas individuais com metadados, schema Article, pré-renderização e sitemap; cartões na home e acesso pelo rodapé. Sem publicação externa nesta etapa.

## Implementado

- Dez fichas receberam orientações de escuta específicas, com fontes oficiais e data da consulta: Itatiaia, Jovem Pan FM São Paulo, Mix FM São Paulo, 89 FM, BandNews FM São Paulo, BandNews Belo Horizonte, Radio Paradise, FIP, KEXP e Groove Salad.
- A seleção foi baseada na disponibilidade de fontes; não é um ranking de acesso. Não foi consultado o banco de analytics.
- Busca da página inicial integrada à normalização de acentos do repositório, com busca também por estado e formato. Acrescentado botão para limpar busca e filtros.
- Comparação de até três rádios por localidade, frequência, formato, orientação de escuta e site oficial.
- Ajuda em falhas de reprodução: nova tentativa, alternativa, fonte oficial, diagnóstico e rascunho de relato identificado. Nenhuma mensagem é enviada automaticamente.
- Página Sobre ampliada com critérios de inclusão, limites das ferramentas e informações úteis para correções.
- Espírito Santo tem apenas uma rádio cadastrada: a listagem continua acessível, mas recebe `noindex,follow` e sai do sitemap. Aplicado no React e no HTML pré-renderizado.

## Lacunas encontradas

| Item | Quantidade |
| --- | ---: |
| Emissoras cadastradas | 197 |
| Perfis editoriais associados às emissoras após a correção da Itatiaia | 12 |
| Fichas com novas orientações de escuta | 10 |
| Emissoras sem perfil editorial | 185 |
| Emissoras sem site oficial cadastrado | 39 |
| Emissoras sem cidade | 0 |
| Emissoras sem frequência | 1 |
| Listagens de cidades aguardando conteúdo editorial | 16 |
| Perfis com texto exatamente idêntico | 0 |

A ausência de frequência pode ser correta para uma rádio exclusivamente online. Nenhum dado foi inventado para preencher lacunas. Ausência de duplicação exata não significa ausência de similaridade editorial. Fichas sem perfil e cidades sem conteúdo editorial já estavam fora do sitemap e com `noindex`.

## Próxima pesquisa editorial

Executar `npm run audit:content` para obter as listas completas de fichas sem perfil ou fonte oficial e das cidades pendentes. Confirmar primeiro o domínio oficial e a identidade da praça; depois pesquisar características específicas da programação. Priorizar por acessos somente quando houver um relatório real disponível.

Helio Franca foi identificado como responsável pelo projeto na página Sobre, conforme o nome público informado pelo proprietário.

## Verificação

Build e lint passaram. 22 testes passaram; o teste de rede de streams permaneceu desativado. Os dez HTMLs gerados foram conferidos quanto a textos, fontes e datas; a regra de indexação estadual foi conferida no HTML e no sitemap. A verificação visual e a interação em navegador não foram executadas porque não havia navegador conectado na sessão. Alterações locais, sem publicação.
