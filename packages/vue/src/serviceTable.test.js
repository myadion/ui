import test from 'node:test'
import assert from 'node:assert/strict'
import { SERVICE_COLUMNS, dayLabel, renewalOf, serviceRow } from './serviceTable.js'
import { createAdionUi } from './adapter.js'

// Les libelles d'un service sont ceux que l'app branche.
createAdionUi({ labels: { stateLabel: (v) => ({ active: 'Actif', terminated: 'Résilié' })[v] || v } })

test('les colonnes du tableau sont les mêmes pour tous les produits', () => {
  assert.deepEqual(SERVICE_COLUMNS.map((c) => c.key), ['name', 'state', 'offer', 'project', 'renewal'])
})

test('un service de l’API se range à la forme du tableau', () => {
  const row = serviceRow({
    id: 's1', name: 'exemple.fr', customer_description: 'Site de l’agence',
    subscription: { status: 'active', offer: { public_label: 'Pro' }, renews_at: '2026-11-03T08:00:00Z' },
    account_service: { project_name: 'Agence' },
  })
  assert.equal(row.name, 'Site de l’agence')
  assert.equal(row.state.label, 'Actif')
  assert.equal(row.state.tone, 'ok')
  assert.equal(row.offer, 'Pro')
  assert.equal(row.project, 'Agence')
  assert.equal(row.renewal, '2026-11-03')
})

test('sans échéance ni projet, un tiret ; un état résilié est gris, la clé de over l’emporte', () => {
  const row = serviceRow({ id: 's2', name: 'x', subscription: { status: 'terminated' } }, { name: 'Autre' })
  assert.equal(row.name, 'Autre')
  assert.equal(row.project, '—')
  assert.equal(row.renewalLabel, '—')
  assert.equal(row.state.tone, 'muted')
  assert.equal(renewalOf({}), '')
  assert.equal(dayLabel('n’importe quoi'), '—')
})
