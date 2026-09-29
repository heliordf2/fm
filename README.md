# Rádio FM Online

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

O painel privado foi extraído para o projeto `E:\GIT\fm-analytics`, com repositório Git próprio. Ele consulta o mesmo banco Neon e não inclui rastreadores. Consulte o README desse projeto para executar e publicar.

Este site mantém `/api/analytics` e a coleta das visitas e reproduções dos ouvintes. A antiga rota `/analytics` responde HTTP 410, sem carregar a aplicação ou scripts de medição. Publique as alterações dos dois projetos para efetivar a separação em produção. O histórico do banco permanece intacto.

Mantenha `DATABASE_URL` e `ANALYTICS_SALT` neste projeto. Se a instalação ainda utiliza `PAINEL_PASS` como fallback do salt, preserve esse valor até configurar `ANALYTICS_SALT` com o mesmo valor, evitando trocar os identificadores de sessão.
