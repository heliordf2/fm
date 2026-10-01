# Rádio FM Online

## Privacidade e ativação de anúncios

As estatísticas opcionais (Google Analytics, Vercel e medição própria) são iniciadas somente após o visitante permitir. A escolha pode ser revista no rodapé, em **Preferências de privacidade**, ou pelo link `/?privacy=1#privacy-settings`. Ao recusar, novos eventos são bloqueados; o histórico já enviado ao banco não é excluído automaticamente. Esse controle não substitui uma CMP certificada para publicidade.

Os anúncios ficam desativados por padrão (`VITE_ADSENSE_ENABLED=false`). A identificação da conta continua disponível pela meta tag e pelo `ads.txt`. Para ativar:

1. No AdSense, abra **Privacidade e mensagens** e configure/publique a mensagem aplicável de regulamentações europeias, usando a CMP certificada do Google, para o site e os idiomas atendidos. Consulte a [documentação oficial](https://support.google.com/adsense/answer/13554116?hl=pt-BR).
2. Verifique a mensagem publicada e os controles de aceitar, recusar e alterar a escolha. O banner local de estatísticas não concede consentimento para anúncios.
3. Confira no painel os anúncios automáticos e exclusões: mantenha anúncios afastados dos controles de reprodução, busca e navegação. O projeto permite carregar AdSense somente na home; fichas, páginas de erro e demais rotas diretas ficam sem o carregador.
4. Atualize a política de privacidade para refletir a configuração efetiva, defina `VITE_ADSENSE_ENABLED=true` no ambiente de build e publique um novo build. Essa variável não altera uma publicação já feita.
5. Teste em celular e desktop as posições reais e a CMP para o público aplicável antes de solicitar nova revisão.

Validação local: `npm run build`, `npm run audit:site`, `npm run lint` e `npm test`. Para checar e atualizar os streams: `npm run check:streams`. Se o Node no Windows não reconhecer certificados confiáveis do sistema, use `node --use-system-ca scripts/check-streams.mjs`; não desative a validação TLS. A checagem confirma resposta e início de dados de áudio, não substitui ouvir a emissora para confirmar sua identidade nem verifica permissão de uso comercial.

Player web moderno para ouvir rádios FM ao vivo.

## Como rodar

```bash
npm install
npm run dev

```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Funcionalidades

- 17 rádios FM (Brasil e internacional).
- Busca por nome, cidade ou frequência
- Filtro por gênero (Pop, Rock, Sertanejo, Notícias, Internacional)
- Player fixo com play/pause, parar e controle de volume
- Interface responsiva com tema escuro

## Build

```bash
npm run build
npm run preview
```
# Painel de analytics separado

O painel exibe **Aceites e recusas de estatísticas**: totais desde o início da coleta, taxa de aceite e decisões por dia. As escolhas são gravadas separadamente em `privacy_choice_counts`, sem IP, sessão, página ou rádio. Os totais contam decisões, não pessoas únicas: repetir a mesma escolha válida não incrementa; mudar a escolha ou decidir novamente após expiração pode incrementar. Quem fecha a página sem escolher não entra nesses totais. Falhas de rede, bloqueadores e tráfego automatizado podem afetar a contagem.

O detalhamento diário usa dias completos em `America/Sao_Paulo` abrangidos pelo filtro; não subdivide por hora. As decisões anteriores à publicação desse contador não podem ser recuperadas dos dados de analytics. Publique **o site e o painel** para habilitar a coleta e a exibição. A tabela é criada automaticamente pela API; nenhuma migração apaga o histórico existente.

O painel privado foi extraído para o projeto `E:\GIT\fm-analytics`, com repositório Git próprio. Ele consulta o mesmo banco Neon e não inclui rastreadores. Consulte o README desse projeto para executar e publicar.

Este site mantém `/api/analytics` e a coleta das visitas e reproduções dos ouvintes. A antiga rota `/analytics` responde HTTP 410, sem carregar a aplicação ou scripts de medição. Publique as alterações dos dois projetos para efetivar a separação em produção. O histórico do banco permanece intacto.

Mantenha `DATABASE_URL` e `ANALYTICS_SALT` neste projeto. Se a instalação ainda utiliza `PAINEL_PASS` como fallback do salt, preserve esse valor até configurar `ANALYTICS_SALT` com o mesmo valor, evitando trocar os identificadores de sessão.
