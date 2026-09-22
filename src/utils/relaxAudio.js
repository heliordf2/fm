export const RELAX_SOUNDS = [
  { id: 'rain', name: 'Chuva suave', description: 'Textura contínua inspirada na chuva.', symbol: '☂' },
  { id: 'ocean', name: 'Ondas do mar', description: 'Ruído suave que cresce e recua lentamente.', symbol: '≈' },
  { id: 'brown', name: 'Ruído grave', description: 'Um fundo sonoro constante e mais encorpado.', symbol: '≋' },
  { id: 'meditation', name: 'Tons para meditar', description: 'Acorde ambiente com variação lenta de intensidade.', symbol: '♪' },
  { id: 'classical', name: 'Piano clássico', description: 'Arpejo suave e original, sintetizado no navegador.', symbol: '♬' },
  { id: 'strings', name: 'Cordas serenas', description: 'Acordes longos inspirados em música de câmara.', symbol: '♩' },
  { id: 'forest', name: 'Brisa na floresta', description: 'Ruído leve e arejado para momentos de foco.', symbol: '♧' },
  { id: 'fireplace', name: 'Lareira tranquila', description: 'Textura grave e quente, inspirada em brasas.', symbol: '♨' },
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
    if (kind === 'ocean' || kind === 'meditation' || kind === 'strings') {
      const lfo = context.createOscillator()
      const depth = context.createGain()
      nodes.push(lfo, depth); sources.push(lfo)
      lfo.frequency.value = kind === 'ocean' ? 0.09 : kind === 'strings' ? 0.035 : 0.05
      depth.gain.value = kind === 'ocean' ? 0.35 : kind === 'strings' ? 0.1 : 0.15
      lfo.connect(depth); depth.connect(envelope.gain)
    }
    if (kind === 'meditation' || kind === 'strings' || kind === 'classical') {
      const frequencies = kind === 'meditation' ? [130.81, 196, 261.63] : kind === 'strings' ? [146.83, 220, 293.66] : [261.63, 329.63, 392, 523.25]
      for (const [index, frequency] of frequencies.entries()) {
        const tone = context.createOscillator()
        const level = context.createGain()
        nodes.push(tone, level); sources.push(tone)
        tone.type = kind === 'strings' ? 'triangle' : 'sine'; tone.frequency.value = frequency
        level.gain.value = kind === 'classical' ? 0 : kind === 'strings' ? 0.08 : 0.16
        if (kind === 'classical') {
          const noteLength = 1.6
          const duration = minutes > 0 ? minutes * 60 : 3600
          for (let time = 0; time < duration; time += noteLength * frequencies.length) {
            const start = context.currentTime + time + index * noteLength
            level.gain.setValueAtTime(0.001, start)
            level.gain.exponentialRampToValueAtTime(0.12, start + 0.04)
            level.gain.exponentialRampToValueAtTime(0.001, start + noteLength * 0.9)
          }
        }
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
      filter.frequency.value = kind === 'rain' ? 3500 : kind === 'ocean' ? 900 : kind === 'forest' ? 5200 : kind === 'fireplace' ? 550 : 300
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
    return { resume: () => context.resume(), pause: () => context.suspend(), close, setVolume }
  } catch (error) {
    close()
    throw error
  }
}
