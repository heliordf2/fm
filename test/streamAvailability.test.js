// Verificação de rede real contra os streams cadastrados em src/data/radios.js.
// Não roda dentro do `npm test` padrão (ficaria lento e instável a cada execução,
// dependendo da disponibilidade de ~200 servidores externos). Para rodar de fato:
//   npm run test:streams
// Para gravar o resultado em src/data/streamStatus.js (usado na tabela do /roadmap):
//   npm run check:streams
import test from 'node:test'
import assert from 'node:assert/strict'
import { getAllRadios } from '../src/data/radioRepository.js'
import { checkStream } from '../scripts/lib/checkStream.mjs'

const shouldRun = process.env.CHECK_STREAMS === '1'
const CONCURRENCY = 15

const radios = getAllRadios()

test(
  `requisição de stream para cada rádio do catálogo (${radios.length} estações)`,
  { skip: shouldRun ? false : 'rode com `npm run test:streams` para executar esta verificação de rede real', concurrency: CONCURRENCY },
  async (t) => {
    const subtests = radios.map((radio) =>
      t.test(`${radio.name} — ${radio.city || 'sem cidade'} (${radio.streamUrl})`, async () => {
        const result = await checkStream(radio.streamUrl)
        assert.ok(
          result.ok,
          `esperado status 2xx, recebido ${result.status}${result.error ? ` — ${result.error}` : ''}${result.contentType ? ` [${result.contentType}]` : ''}`,
        )
      }),
    )
    await Promise.all(subtests)
  },
)
