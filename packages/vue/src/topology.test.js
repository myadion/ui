import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sortDevices, topologyRows } from './topology.js'

const networks = [{ id: 'pub' }, { id: 'priv' }, { id: 'fab' }]

test('le trait part de l’appareil et s’arrête à son dernier réseau', () => {
  const [row] = topologyRows(networks, [{ id: 'r', ports: [{ network: 'pub', label: '54.36.1.1' }, { network: 'priv', label: '10.0.0.1' }] }])
  assert.deepEqual(row.cells.map((c) => c.line), ['through', 'end', 'none'])
  assert.deepEqual(row.cells.map((c) => c.port), [true, true, false])
  assert.deepEqual(row.cells[1].labels, ['10.0.0.1'])
  assert.equal(row.unplugged, false)
})

test('un port sur un réseau inconnu est ignoré ; un appareil sans port est débranché', () => {
  const [a, b] = topologyRows(networks, [{ id: 'a', ports: [{ network: 'ailleurs' }] }, { id: 'b' }])
  assert.equal(a.unplugged, true)
  assert.deepEqual(b.cells.map((c) => c.line), ['none', 'none', 'none'])
})

test('plusieurs adresses sur un même réseau se suivent', () => {
  const [row] = topologyRows(networks, [{ id: 'i', ports: [{ network: 'priv', labels: ['10.0.0.5', '2001:db8::5'] }, { network: 'priv', label: '10.0.0.6' }] }])
  assert.deepEqual(row.cells[1].labels, ['10.0.0.5', '2001:db8::5', '10.0.0.6'])
})

test('les routeurs d’abord, puis les instances par nom', () => {
  const sorted = sortDevices([{ kind: 'instance', name: 'web' }, { kind: 'router', name: 'r1' }, { kind: 'instance', name: 'api' }])
  assert.deepEqual(sorted.map((d) => d.name), ['r1', 'api', 'web'])
})
