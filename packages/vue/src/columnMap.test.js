import test from 'node:test'
import assert from 'node:assert/strict'
import { clashMessage, clashes, groupedTargets } from './columnMap.js'

const targets = [
  { value: 'email', label: 'E-mail', group: 'Canaux' },
  { value: 'mobile', label: 'Mobile', group: 'Canaux' },
  { value: 'first_name', label: 'Prénom', group: 'Identité' },
  { value: 'ignore', label: 'Ne pas importer', group: 'Autre' },
]

test('les cibles sont groupées, la colonne libre et « ne pas importer » à la fin', () => {
  const items = groupedTargets(targets, { header: 'Ville', field_label: 'Ville', field_target: 'field:ville' })
  assert.deepEqual(items.filter((i) => i.type === 'subheader').map((i) => i.title), ['Canaux', 'Identité', 'Colonne libre'])
  assert.equal(items.at(-1).value, 'ignore')
  assert.equal(items.find((i) => i.value === 'field:ville').title, 'Ville')
})

test('une cible du carnet prise deux fois est signalée, pas « ignore » ni une colonne libre', () => {
  const mapping = { 0: 'email', 1: 'email', 2: 'ignore', 3: 'ignore', 4: 'field:a', 5: 'field:a' }
  assert.deepEqual(clashes(mapping, targets), { email: [0, 1] })
  const columns = [{ index: 0, header: 'Courriel' }, { index: 1, header: '' }]
  assert.equal(clashMessage(1, mapping, columns, targets), 'Déjà prise par « Courriel »')
  assert.equal(clashMessage(2, mapping, columns, targets), '')
})
