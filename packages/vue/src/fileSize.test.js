import test from 'node:test'
import assert from 'node:assert/strict'
import { acceptsFile, fileSize } from './fileSize.js'

test('la taille se dit en mots', () => {
  assert.equal(fileSize(0), '0 o')
  assert.equal(fileSize(900), '900 o')
  assert.match(fileSize(12700), /^12 Ko$/)
  assert.match(fileSize(3 * 1024 * 1024), /^3 Mo$/)
})

test('accept: extensions, types et familles', () => {
  assert.equal(acceptsFile({ name: 'Contacts.CSV', type: '' }, '.csv,text/csv'), true)
  assert.equal(acceptsFile({ name: 'a.png', type: 'image/png' }, 'image/*'), true)
  assert.equal(acceptsFile({ name: 'a.pdf', type: 'application/pdf' }, '.csv'), false)
  assert.equal(acceptsFile({ name: 'a.pdf' }, ''), true)
})
