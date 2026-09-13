import { useId, useState } from 'react'
import { getAllRadios, getEditorialProfile } from '../data/radioRepository.js'

export default function RadioComparison({ radios }) {
  const id = useId()
  const [selected, setSelected] = useState(['', '', ''])
  const catalog = getAllRadios()
  const chosen = selected.map((value) => catalog.find((radio) => radio.id === value)).filter(Boolean)
  return <section className="radio-comparison" aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Compare antes de escolher</h2>
    <p>Selecione até três emissoras. Os filtros e a busca acima limitam as opções; as rádios já selecionadas continuam na comparação.</p>
    <div className="radio-comparison__selectors">{selected.map((value, index) => {
      const current = catalog.find((radio) => radio.id === value)
      const options = current && !radios.some((radio) => radio.id === value) ? [current, ...radios] : radios
      return <label key={index} htmlFor={`${id}-${index}`}>Emissora {index + 1}
        <select id={`${id}-${index}`} value={value} onChange={(event) => setSelected((previous) => previous.map((item, slot) => slot === index ? event.target.value : item))}>
          <option value="">Selecione uma rádio</option>
          {options.filter((radio) => radio.id === value || !selected.includes(radio.id)).map((radio) => <option key={radio.id} value={radio.id}>{radio.name} — {[radio.city, radio.state].filter(Boolean).join(', ')}</option>)}
        </select>
      </label>
    })}</div>
    {chosen.length === 0 ? <p>Compare localidade, frequência e formato lado a lado. A ordem não representa audiência ou qualidade.</p> : <>
      <div className="radio-comparison__scroll" role="region" aria-label="Tabela de comparação de emissoras" tabIndex={0}>
        <table><caption>Dados do catálogo; consulte a emissora para confirmar a programação atual.</caption>
          <thead><tr><th scope="col">Critério</th>{chosen.map((radio) => <th key={radio.id} scope="col"><a href={`/${radio.path}`}>{radio.name}</a></th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Localidade</th>{chosen.map((radio) => <td key={radio.id}>{[radio.city, radio.state, radio.country].filter(Boolean).join(', ') || 'Não informada'}</td>)}</tr>
            <tr><th scope="row">Frequência</th>{chosen.map((radio) => <td key={radio.id}>{radio.frequency || 'Não informada'}</td>)}</tr>
            <tr><th scope="row">Formato</th>{chosen.map((radio) => <td key={radio.id}>{radio.genreLabels.join(', ') || 'Não classificado'}</td>)}</tr>
            <tr><th scope="row">Para orientar a escuta</th>{chosen.map((radio) => <td key={radio.id}>{getEditorialProfile(radio.id)?.listeningNote || 'Perfil editorial ainda não disponível. Confira a programação na fonte oficial.'}</td>)}</tr>
            <tr><th scope="row">Fonte</th>{chosen.map((radio) => <td key={radio.id}>{radio.websiteUrl ? <a href={radio.websiteUrl} target="_blank" rel="noopener noreferrer">Site oficial de {radio.name}</a> : 'Site oficial não informado'}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <button type="button" onClick={() => setSelected(['', '', ''])}>Limpar comparação</button>
    </>}
  </section>
}
