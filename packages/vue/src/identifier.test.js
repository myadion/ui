import { test } from 'node:test'
import assert from 'node:assert/strict'
import { identifierKindOf } from './identifier.js'

test('identifierKindOf : une lettre ou un @ font un e-mail, des chiffres un telephone', () => {
  assert.equal(identifierKindOf(''), '')
  assert.equal(identifierKindOf('k'), 'email')
  assert.equal(identifierKindOf('nom@exemple.fr'), 'email')
  assert.equal(identifierKindOf('07'), 'phone')
  assert.equal(identifierKindOf('+41 79 123 45 67'), 'phone')
})
