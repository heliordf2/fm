import { useState } from 'react'

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

export default function InstallAppButton({ canInstall, installed, onInstall }) {
  const [showHelp, setShowHelp] = useState(false)
  if (installed) return null

  const handleClick = async () => {
    if (canInstall) await onInstall()
    else setShowHelp(true)
  }

  return (
    <>
      <button className="install-app" type="button" onClick={handleClick} aria-label="Instalar Rádio FM Online">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" /></svg>
        <span>Instalar</span>
      </button>
      {showHelp && (
        <div className="install-help" role="dialog" aria-modal="true" aria-labelledby="install-help-title" onClick={() => setShowHelp(false)}>
          <div className="install-help__card" onClick={(event) => event.stopPropagation()}>
            <button className="install-help__close" type="button" onClick={() => setShowHelp(false)} aria-label="Fechar">×</button>
            <img src="/fm-online.svg?v=2" alt="" />
            <h2 id="install-help-title">Instale o Rádio FM Online</h2>
            {isIos
              ? <p>No Safari, toque em <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>.</p>
              : <p>Abra o menu do navegador e escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</p>}
            <button className="install-help__ok" type="button" onClick={() => setShowHelp(false)}>Entendi</button>
          </div>
        </div>
      )}
    </>
  )
}
