const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

export async function checkStream(url, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      redirect: 'follow',
      signal: controller.signal,
    })
    // Só precisamos confirmar que o servidor responde e começa a enviar áudio;
    // não faz sentido baixar o stream inteiro (ele nunca termina sozinho).
    if (response.body) {
      const reader = response.body.getReader()
      try { await reader.read() } catch { /* ignore */ }
      try { await reader.cancel() } catch { /* ignore */ }
    }
    return { ok: response.ok, status: response.status, contentType: response.headers.get('content-type') || '' }
  } catch (error) {
    return { ok: false, status: 0, error: error.name === 'AbortError' ? 'timeout' : String(error.message || error) }
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
