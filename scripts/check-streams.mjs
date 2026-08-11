import { writeFile } from 'node:fs/promises'
import { getAllRadios } from '../src/data/radioRepository.js'
import { checkStream, pool } from './lib/checkStream.mjs'

const CONCURRENCY = 15
const radios = getAllRadios()
const checkedAt = new Date().toISOString()

const entries = await pool(radios, async (radio) => {
  const result = await checkStream(radio.streamUrl)
  const status = {
    ok: result.ok,
    httpStatus: result.status,
    error: result.ok ? null : (result.error || `HTTP ${result.status}`),
  }
  return [radio.id, status]
}, CONCURRENCY)

const statusMap = Object.fromEntries(entries)
const failing = entries.filter(([, s]) => !s.ok)

const banner = '// Gerado por `npm run check:streams`. Não editar manualmente — rode o script para atualizar.\n'
const content = `${banner}export const STREAM_STATUS_CHECKED_AT = '${checkedAt}'\n\nexport const STREAM_STATUS = ${JSON.stringify(statusMap, null, 2)}\n`

await writeFile(new URL('../src/data/streamStatus.js', import.meta.url), content, 'utf8')

console.log(`Checagem concluída: ${entries.length - failing.length} ok, ${failing.length} com erro.`)
for (const [id, status] of failing) console.log(`  falhou: ${id} — ${status.error}`)
