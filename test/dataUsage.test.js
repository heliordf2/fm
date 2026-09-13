import test from 'node:test'
import assert from 'node:assert/strict'
import { estimateDataUsage } from '../src/utils/dataUsage.js'

test('estimates decimal MB for an hour and a month of listening', () => {
  assert.equal(estimateDataUsage(128, 1), 57.6)
  assert.equal(estimateDataUsage(128, 1, 30), 1728)
  assert.equal(estimateDataUsage(64, 0.5, 22), 316.8)
  assert.equal(estimateDataUsage(128, 0), 0)
})

test('rejects invalid and overflowing consumption values', () => {
  for (const value of [-1, NaN, Infinity, '128', undefined]) {
    assert.equal(estimateDataUsage(value, 1), null)
    assert.equal(estimateDataUsage(128, value), null)
    if (value !== undefined) assert.equal(estimateDataUsage(128, 1, value), null)
  }
  assert.equal(estimateDataUsage(Number.MAX_VALUE, 24, 366), null)
})
