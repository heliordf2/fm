const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

export async function checkStream(url, timeoutMs = 10000, fetchStream = fetch) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetchStream(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      redirect: 'follow',
      signal: controller.signal,
    })
    const contentType = response.headers.get('content-type') || ''
    const result = { ok: false, status: response.status, contentType }
    if (!response.ok) {
      await response.body?.cancel().catch(() => {})
      return { ...result, error: `HTTP ${response.status}` }
    }
    if (!response.body) return { ...result, error: 'Resposta sem áudio' }
    // A successful HTML error page is not a working radio stream.
    if (!/^(audio\/|application\/(octet-stream|ogg|vnd\.apple\.mpegurl|x-mpegurl))/i.test(contentType)) {
      await response.body.cancel().catch(() => {})
      return { ...result, error: `Tipo de conteúdo inesperado: ${contentType || 'ausente'}` }
    }
    const reader = response.body.getReader()
    try {
      const { value, done } = await reader.read()
      return { ...result, ok: !done && value?.byteLength > 0, ...(!done && value?.byteLength > 0 ? {} : { error: 'Stream sem dados' }) }
    } finally { await reader.cancel().catch(() => {}) }
  } catch (error) {
    return { ok: false, status: 0, error: error.name === 'AbortError' ? 'timeout' : [error.message || error, error.cause?.code].filter(Boolean).join(' — ') }
  } finally {
    clearTimeout(timer)
  }
}

export async function pool(items, worker, concurrency) {
  const results = new Array(items.length)
  let i = 0
  async function run() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await worker(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, run))
  return results
}
