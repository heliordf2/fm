import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function rejectRemovedHomeRoute() {
  const reject = (server) => {
    server.middlewares.use((req, res, next) => {
      const pathname = new URL(req.url || '/', 'http://localhost').pathname.replace(/\/+$/, '') || '/'
      if (pathname === '/home' || pathname.startsWith('/home/')) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Página não encontrada | Rádio FM Online</title></head><body><main><h1>Página não encontrada</h1><p>A rota /home foi removida.</p><a href="/">Voltar para a página principal</a></main></body></html>')
        return
      }
      next()
    })
  }
  return { name: 'reject-removed-home-route', configureServer: reject, configurePreviewServer: reject }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [rejectRemovedHomeRoute(), react()],
})
