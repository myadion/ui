import { test } from 'node:test'
import assert from 'node:assert/strict'
import { faceFor, shouldUse3D } from './card3d.js'
import { otherTheme, pickTheme } from './theme.js'

test('le code de sécurité retourne la carte, sauf American Express', () => {
  assert.equal(faceFor('cvc', 'visa'), 'back')
  assert.equal(faceFor('cvc', 'amex'), 'front')
  assert.equal(faceFor('number', 'visa'), 'front')
  assert.equal(faceFor('', ''), 'front')
})

test('la 3D cède la place à la carte plate sur un appareil faible ou sans animation', () => {
  const win = (over = {}, reduce = false) => ({ navigator: { hardwareConcurrency: 8, ...over }, matchMedia: () => ({ matches: reduce }) })
  assert.equal(shouldUse3D(win()), true)
  assert.equal(shouldUse3D(win({}, true)), false)
  assert.equal(shouldUse3D(win({ hardwareConcurrency: 2 })), false)
  assert.equal(shouldUse3D(win({ deviceMemory: 1 })), false)
  assert.equal(shouldUse3D(null), false)
})

test('le thème d’une page publique : le choix, sinon celui du système', () => {
  assert.equal(pickTheme('adionLight', true), 'adionLight')
  assert.equal(pickTheme(null, true), 'adionDark')
  assert.equal(pickTheme(null, false), 'adionLight')
  assert.equal(pickTheme('n-importe-quoi', false), 'adionLight')
  assert.equal(otherTheme('adionDark'), 'adionLight')
})
