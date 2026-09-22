export const RELAX_SOUNDS = [
  { id: 'rain', name: 'Chuva suave', description: 'Textura contínua inspirada na chuva.', symbol: '☂' },
  { id: 'ocean', name: 'Ondas do mar', description: 'Ruído suave que cresce e recua lentamente.', symbol: '≈' },
  { id: 'brown', name: 'Ruído grave', description: 'Um fundo sonoro constante e mais encorpado.', symbol: '≋' },
  { id: 'meditation', name: 'Tons para meditar', description: 'Acorde ambiente com variação lenta de intensidade.', symbol: '♪' },
]

export function fillNoise(data, random = Math.random) {
  for (let i = 0; i < data.length; i++) data[i] = random() * 2 - 1
  // A short fade at the seam avoids a discontinuity when the buffer loops.
  const fade = Math.min(256, Math.floor(data.length / 2))
  for (let i = 0; i < fade; i++) {
    data[i] *= i / fade
    data[data.length - 1 - i] *= i / fade
  }
}

export function createRelaxAudio(kind, volume, minutes, AudioContextClass) {
  if (!RELAX_SOUNDS.some((sound) => sound.id === kind)) throw new Error('Som desconhecido')
  if (!AudioContextClass) throw new Error('Áudio ambiente indisponível neste navegador.')
  const context = new AudioContextClass()
  const nodes = []
  const sources = []
  let closed = false
  const gain = context.createGain()
  nodes.push(gain)
  gain.gain.value = 0
  gain.connect(context.destination)
  const setVolume = (value) => {
    if (!closed) gain.gain.setTargetAtTime(Math.max(0, Math.min(1, value)) * 0.3, context.currentTime, 0.15)
  }
  const close = () => {
    if (closed) return
    closed = true
    for (const source of sources) { source.onended = null; try { source.stop() } catch { /* Already stopped. */ } }
    for (const node of nodes) node.disconnect()
    void context.close().catch(() => {})
  }
  try {
    const envelope = context.createGain()
    nodes.push(envelope)
    envelope.gain.value = kind === 'ocean' ? 0.5 : 0.7
    envelope.connect(gain)
    if (kind === 'ocean' || kind === 'meditation') {
      const lfo = context.createOscillator()
      const depth = context.createGain()
      nodes.push(lfo, depth); sources.push(lfo)
      lfo.frequency.value = kind === 'ocean' ? 0.09 : 0.05
      depth.gain.value = kind === 'ocean' ? 0.35 : 0.15
      lfo.connect(depth); depth.connect(envelope.gain)
    }
    if (kind === 'meditation') {
      for (const frequency of [130.81, 196, 261.63]) {
        const tone = context.createOscillator()
        const level = context.createGain()
        nodes.push(tone, level); sources.push(tone)
        tone.type = 'sine'; tone.frequency.value = frequency
        level.gain.value = 0.16
        tone.connect(level); level.connect(envelope)
      }
    } else {
      const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate)
      fillNoise(buffer.getChannelData(0))
      const noise = context.createBufferSource()
      const filter = context.createBiquadFilter()
      nodes.push(noise, filter); sources.push(noise)
      noise.buffer = buffer; noise.loop = true
      filter.type = 'lowpass'
      filter.frequency.value = kind === 'rain' ? 3500 : kind === 'ocean' ? 900 : 300
      filter.Q.value = 0.5
      noise.connect(filter); filter.connect(envelope)
    }
    for (const source of sources) source.start()
    setVolume(volume)
    if (minutes > 0) {
      const end = context.currentTime + minutes * 60
      for (const source of sources) source.stop(end)
      gain.gain.setTargetAtTime(0, end - 1, 0.15)
    }
    return { resume: () => context.resume(), close, setVolume }
  } catch (error) {
    close()
    throw error
  }
}
