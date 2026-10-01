export const ADSENSE_CLIENT = 'ca-pub-5779366115279719'
// Enable only after publishing and verifying the certified CMP in AdSense.
export const ADSENSE_ENABLED = import.meta.env?.VITE_ADSENSE_ENABLED === 'true'

// Crie blocos de anúncio no painel do AdSense e cole os IDs abaixo.
// Anúncios > Por unidade > Criar unidade de anúncio > Display
export const AD_SLOTS = {
  top: '',
  bottom: '',
}
