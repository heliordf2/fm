export function getRadioSupportUrl(radio) {
  const message = [
    'Olá! Quero informar um problema no Rádio FM Online.',
    `Emissora: ${radio.name}`,
    `Localidade: ${[radio.city, radio.state, radio.country].filter(Boolean).join(', ')}`,
    `Ficha: https://radiofmonline.com.br/${radio.path}`,
    'O que aconteceu: ',
    'Data e horário aproximados: ',
    'Aparelho e navegador: ',
    'Outras rádios funcionam? ',
    'O site oficial funciona? ',
  ].join('\n')
  return `https://wa.me/5511974004755?text=${encodeURIComponent(message)}`
}
