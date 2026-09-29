// Textos específicos compartilhados pelo HTML pré-renderizado e pela navegação React.
export const RADIO_META_DESCRIPTIONS = {
  "amapa/102-fm": "Ouça a 102 FM de Macapá, Amapá, ao vivo e grátis pela internet. Conheça a emissora de 102.9 MHz, seu formato popular e eclético e acesse o site oficial.",
  "sergipe/fan-fm": "Ouça a Fan FM de Aracaju, Sergipe, ao vivo e grátis pela internet. Confira a frequência 99.7 MHz, o formato popular e eclético e acesse o site oficial da rádio.",
  "bahia/g-fm": "Ouça a G FM de Salvador, Bahia, ao vivo e grátis pela internet. Conheça a rádio gospel de 90.1 MHz, consulte informações da emissora e acesse seu site oficial.",
  "amapa/forte-fm": "Ouça a Forte FM de Macapá, Amapá, ao vivo e grátis pela internet. Confira a frequência 99.9 MHz, seu formato popular e eclético e visite o site oficial.",
  "para/rauland-fm": "Ouça a Rauland FM de Belém, Pará, ao vivo e grátis pela internet. Confira a frequência 95.1 MHz, seu formato popular e eclético e visite o site oficial.",
  "alagoas/96-fm": "Ouça a 96 FM de Arapiraca, Alagoas, ao vivo e grátis pela internet. Conheça a emissora de notícias em 96.9 MHz, consulte seus dados e acesse o site oficial."
}

export function getGenreMetaDescription(name, count) {
  if (name === 'Sertanejo') {
    return 'Ouça rádios de sertanejo ao vivo e grátis pela internet. Compare emissoras, frequências e cidades e escolha sua estação para ouvir no celular ou no computador.'
  }
  return `Explore ${count} rádios de ${name}, consulte frequências e localidades e ouça as estações ao vivo.`
}
