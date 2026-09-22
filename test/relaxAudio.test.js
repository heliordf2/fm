import test from 'node:test'
import assert from 'node:assert/strict'
import { createRelaxAudio, fillNoise, RELAX_SOUNDS } from '../src/utils/relaxAudio.js'

class MockContext {
  static last
  constructor() { MockContext.last = this; this.sampleRate = 8000; this.currentTime = 0; this.nodes = []; this.destination = {}; this.closed = 0 }
  node() {
    const param = () => ({ value: 0, calls: [], setTargetAtTime(...args) { this.calls.push(args) } })
    const node = { gain: param(), frequency: param(), Q: param(), stops: [], connect() {}, disconnect() { this.disconnected = true }, start() { this.started = true }, stop(time) { this.stops.push(time) } }
    this.nodes.push(node)
    return node
  }
  createGain() { return this.node() }
  createOscillator() { return this.node() }
  createBufferSource() { return this.node() }
  createBiquadFilter() { return this.node() }
  createBuffer(channels, length) { this.buffer = new Float32Array(length); return { getChannelData: () => this.buffer } }
  resume() { return Promise.resolve() }
  close() { this.closed++; return Promise.resolve() }
}

test('ruído mantém amplitude limitada e suaviza a junção do loop', () => {
  const data = new Float32Array(4096)
  fillNoise(data)
  assert.equal(Math.abs(data[0]), 0)
  assert.equal(Math.abs(data.at(-1)), 0)
  assert.ok(data.every((sample) => Number.isFinite(sample) && Math.abs(sample) <= 1))
  assert.ok(data.some((sample) => Math.abs(sample) > 0.1))
})

test('ambientes programam parada no relógio de áudio e liberam recursos uma única vez', async () => {
  for (const sound of RELAX_SOUNDS) {
    const player = createRelaxAudio(sound.id, 0.35, 5, MockContext)
    const context = MockContext.last
    await player.resume()
    const sources = context.nodes.filter((node) => node.started)
    assert.ok(sources.length > 0)
    assert.ok(sources.every((node) => node.stops.includes(300)))
    if (sound.id !== 'meditation') assert.equal(context.buffer.length, 32000)
    player.setVolume(2)
    assert.equal(context.nodes[0].gain.calls.at(-1)[0], 0.3)
    player.close(); player.close()
    assert.equal(context.closed, 1)
    assert.ok(context.nodes.every((node) => node.disconnected))
  }
})

test('sessão contínua não agenda parada e navegador sem suporte é tratado', () => {
  const player = createRelaxAudio('rain', 0.2, 0, MockContext)
  assert.ok(MockContext.last.nodes.filter((node) => node.started).every((node) => node.stops.length === 0))
  player.close()
  assert.throws(() => createRelaxAudio('rain', 0.2, 0, undefined), /indisponível/)
  assert.throws(() => createRelaxAudio('invalid', 0.2, 0, MockContext), /desconhecido/)
})
