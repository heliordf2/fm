# Documentação da fonte de dados

## Fonte atual

A fonte canônica continua sendo `src/data/radios.js`. Ela exporta `radios` e `categories` como objetos JavaScript estáticos. Não há banco, API, ORM, migrations ou persistência no servidor.

Os registros originais oferecem: `id`, `name`, `shortName`, `frequency`, `city`, `genre`, `color`, `domain`, `logo`, `logoFallbacks` e `streamUrl`. Não existem descrição editorial, métricas de audiência, popularidade, datas, programação ou responsáveis.

## Camada normalizada

`src/data/radioRepository.js` é um repositório somente de leitura. Ele converte os registros em uma interface estável com `id`, `slug`, `name`, `city`, `state`, `country`, `frequency`, `band`, `genres`, `genreLabels`, `streamUrl`, `websiteUrl`, `logoUrl`, `logoFallbacks`, `shortName` e `color`.

Campos ausentes permanecem `undefined`; não são criados textos ou métricas fictícios. Estado/país são associados apenas a localidades inequivocamente identificáveis presentes na fonte. A lista não é duplicada.

O módulo fornece listagem, lookup por slug, busca normalizada sem acentos, filtros por cidade/estado/gênero/banda, taxonomias e relacionados. Slugs usam nome + cidade, letras minúsculas, sem acentos e hífens. Um teste impede duplicidade silenciosa.

## Atualização

Para adicionar ou corrigir uma estação, altere somente `src/data/radios.js` e execute:

```bash
npm test
npm run build
```

O build regenera o sitemap a partir da fonte. Não edite manualmente listas em páginas.

## Limitações

- Streams e logos são URLs externas, sujeitos a indisponibilidade e políticas dos provedores.
- Não há verificação automática de status dos streams para evitar SSRF e acessos do servidor a URLs não confiáveis.
- Não há métricas reais; a interface usa “em destaque”, nunca “mais ouvidas”.
