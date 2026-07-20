# Plano consolidado de SEO

## Arquitetura

- Manter intacta a experiência existente acima de “Ouça rádios FM ao vivo”.
- Concentrar catálogo, guias, FAQ, sobre e metodologia na página principal.
- Criar páginas diretas fortes, sem `/home`, somente quando possuem conteúdo real.
- Pré-renderizar todas as URLs indexáveis no build.

## Estrutura indexável

- `/`
- `/radio/{slug}`
- `/radios/sao-paulo`
- `/radios/rio-de-janeiro`
- `/radios/genero/{genero}` somente para categorias com três ou mais estações
- `/guia/como-ouvir-radio-online`
- documentos estáticos vigentes

## SEO técnico

- Canonical, title, description, Open Graph e Twitter Card por URL.
- Imagem social 1200×630.
- JSON-LD `Organization`, `WebSite`, `WebPage`, `ItemList`, `FAQPage` e `RadioStation` conforme o conteúdo.
- Busca compartilhável com `?q=` e `noindex,follow`.
- Sitemap gerado da fonte e `404.html` para caminhos inválidos.

## Critérios

- Nenhuma referência de rota ou pasta `src/home`.
- Nenhum conteúdo fictício.
- Página principal preservada antes da seção editorial.
- Lint, testes e build aprovados.
