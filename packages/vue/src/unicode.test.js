import test from 'node:test'
import assert from 'node:assert/strict'
import { unicodeChars, unicodeFacts } from './unicode.js'

test('les caractères en cause, sans doublon', () => {
  assert.deepEqual(unicodeChars({ characters: ['é', { char: '🎉' }, 'é'] }), ['é', '🎉'])
  assert.deepEqual(unicodeChars(null), [])
})
test('les SMS facturés', () => {
  assert.equal(unicodeFacts({ segments_per_recipient: 2, segments_total: 200 }), '2 SMS par destinataire · 200 SMS facturés au total')
  assert.equal(unicodeFacts(null), '')
})
