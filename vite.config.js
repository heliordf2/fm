import { Buffer } from 'node:buffer'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

function localAnalyticsApi(mode) {
  const env = loadEnv(mode, projectRoot, '')
  for (const key of ['DATABASE_URL', 'PAINEL_PASS', 'ANALYTICS_SALT']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }

  const handlers = {
    '/api/analytics': () => import('./api/analytics.js'),
    '/api/analytics-dashboard': () => import('./api/analytics-dashboard.js'),
  }

  const install = (server) => {
    server.middlewares.use(async (request, response, next) => {
      const url = new URL(request.url || '/', 'http://localhost')
      const loadHandler = handlers[url.pathname]
      if (!loadHandler) return next()

      response.status = (code) => {
        response.statusCode = code
        return response
      }
      response.json = (value) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify(value))
      }
      request.query = Object.fromEntries(url.searchParams)

      if (request.method === 'POST') {
        const chunks = []
        for await (const chunk of request) chunks.push(chunk)
        request.body = Buffer.concat(chunks).toString('utf8')
      }

      try {
        const { default: handler } = await loadHandler()
        await handler(request, response)
      } catch (error) {
        console.error('local_analytics_api_failed', error)
        if (!response.headersSent) response.status(500).json({ error: 'Falha na API local de analytics' })
      }
    })
  }

  return { name: 'local-analytics-api', configureServer: install, configurePreviewServer: install }
}

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
export default defineConfig(({ mode }) => ({
  plugins: [localAnalyticsApi(mode), rejectRemovedHomeRoute(), react()],
}))
