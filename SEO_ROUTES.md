# Rotas SEO atuais

O namespace `/home` não existe no código, no build, no sitemap ou na navegação.

| Rota | Indexação | Conteúdo |
|---|---:|---|
| `/` | Sim | Player, busca, filtros, catálogo, guias, FAQ, sobre e metodologia |
| `/radio/{slug}` | Sim | Página factual de cada uma das 32 estações |
| `/radios/sao-paulo` | Sim | Tabela de rádios, frequências e gêneros de São Paulo |
| `/radios/rio-de-janeiro` | Sim | Rádios cadastradas no Rio de Janeiro |
| `/radios/genero/pop` | Sim | Rádios pop do catálogo |
| `/radios/genero/noticias` | Sim | Rádios de notícias do catálogo |
| `/radios/genero/rock` | Sim | Rádios de rock do catálogo |
| `/radios/genero/internacional` | Sim | Rádios internacionais do catálogo |
| `/guia/como-ouvir-radio-online` | Sim | Guia editorial completo e FAQ |
| `/privacy-policy.html` | Sim | Política vigente |
| `/terms.html` | Sim | Termos vigentes |
| qualquer outra rota | Não | `404.html` |

Buscas `/?q=` são compartilháveis, usam canonical `/` e recebem `noindex,follow` durante a interação. O sitemap contém 42 URLs canônicas.
