export default function handler(request, response) {
  response.setHeader('X-Robots-Tag', 'noindex, nofollow')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.status(410).end('O painel de analytics foi removido deste site.')
}
