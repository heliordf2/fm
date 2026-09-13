import test from 'node:test'
import assert from 'node:assert/strict'
import { getAllRadios } from '../src/data/radioRepository.js'
import { EDITORIAL_PROFILES } from '../src/data/editorialProfiles.js'
import { LISTENING_DETAILS } from '../src/data/listeningDetails.js'

test('editorial profiles and listening notes belong to actual catalog stations', () => {
  const ids = new Set(getAllRadios().map((radio) => radio.id))
  for (const id of Object.keys(EDITORIAL_PROFILES)) assert.ok(ids.has(id), `Orphan editorial profile: ${id}`)
  for (const [id, details] of Object.entries(LISTENING_DETAILS)) {
    assert.ok(ids.has(id), `Orphan listening notes: ${id}`)
    assert.ok(EDITORIAL_PROFILES[id], `Missing base profile: ${id}`)
    assert.ok(details.sources.length > 0, `Missing sources: ${id}`)
  }
})
