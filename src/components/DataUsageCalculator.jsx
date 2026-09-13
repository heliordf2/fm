import { useId, useState } from 'react'
import { estimateDataUsage } from '../utils/dataUsage.js'

export default function DataUsageCalculator() {
  const id = useId()
  const [bitrate, setBitrate] = useState('128')
  const [hours, setHours] = useState('1')
  const [days, setDays] = useState('30')
  const valid = hours !== '' && days !== '' && Number(hours) >= 0.1 && Number(hours) <= 24 && Number(days) >= 1 && Number(days) <= 366 && Number.isInteger(Number(days))
  const result = valid ? estimateDataUsage(Number(bitrate), Number(hours), Number(days)) : null
  return <section className="data-calculator" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>Calcule o consumo de internet</h2>
    <p>Escolha uma taxa de áudio para simular. O catálogo não mede a taxa de cada emissora.</p>
    <div className="data-calculator__fields">
      <label htmlFor={`${id}-rate`}>Taxa do áudio<select id={`${id}-rate`} value={bitrate} onChange={(event) => setBitrate(event.target.value)}>{[32, 64, 96, 128, 192, 256, 320].map((rate) => <option key={rate} value={rate}>{rate} kbps</option>)}</select></label>
      <label htmlFor={`${id}-hours`}>Horas por dia<input id={`${id}-hours`} type="number" min="0.1" max="24" step="0.1" value={hours} onChange={(event) => setHours(event.target.value)} /></label>
      <label htmlFor={`${id}-days`}>Quantidade de dias<input id={`${id}-days`} type="number" min="1" max="366" step="1" value={days} onChange={(event) => setDays(event.target.value)} /></label>
    </div>
    <p role="status" aria-live="polite">{result === null ? 'Informe de 0,1 a 24 horas e de 1 a 366 dias inteiros.' : <>Estimativa de áudio: <strong>{result.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB ({(result / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} GB)</strong> no período.</>}</p>
    <p>Fórmula: kbps × horas por dia × dias × 0,45 = MB. Não inclui imagens, anúncios, protocolos de rede ou outros aplicativos. A taxa pode variar; confira o consumo real nas configurações do aparelho.</p>
    <p>A 128 kbps, uma hora equivale a cerca de 57,6 MB; uma hora por dia durante 30 dias equivale a 1,73 GB.</p>
  </section>
}
