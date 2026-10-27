import test from 'node:test'
import assert from 'node:assert/strict'
import { handledActions, menuGroups, menuItems } from './actions.js'

test('les actions dangereuses vont en bas, les autres gardent l’ordre de Nexus', () => {
  const { normal, danger } = menuGroups([
    { key: 'a', label: 'A' },
    { key: 'r', label: 'Résilier', danger: true },
    { key: 'm', label: 'Migrer', available: false, reason: 'Un seul projet' },
  ])
  assert.deepEqual(normal.map((a) => a.key), ['a', 'm'])
  assert.deepEqual(danger.map((a) => a.key), ['r'])
  assert.equal(normal[1].available, false)
  assert.equal(normal[0].available, true)
})

test('une liste absente ou une entrée sans clé ne casse rien', () => {
  assert.deepEqual(menuGroups(null), { normal: [], danger: [] })
  assert.deepEqual(menuGroups([{ label: 'x' }, null]), { normal: [], danger: [] })
})

test('une action que l’écran ne sait pas faire n’est pas affichée', () => {
  const list = [{ key: 'deploy', label: 'Publier' }, { key: 'inconnue', label: 'Autre' }]
  assert.deepEqual(handledActions(list, ['deploy']).map((a) => a.key), ['deploy'])
  assert.deepEqual(handledActions(null, ['deploy']), [])
})

test('un séparateur quand le groupe change, et avant le danger', () => {
  const items = menuItems([
    { key: 'a', label: 'A', group: 'quick' },
    { key: 'b', label: 'B', group: 'quick' },
    { key: 'c', label: 'C', group: 'lifecycle' },
    { key: 'r', label: 'Résilier', group: 'lifecycle', danger: true },
  ])
  assert.deepEqual(items.map((a) => a.sep), [false, false, true, true])
})

test('chaque action a son icône, une clé inconnue reçoit l’icône neutre', async () => {
  const { actionIcon, ACTION_ICONS, DEFAULT_ACTION_ICON, REFRESH_ACTION } = await import('./actions.js')
  for (const key of ['create_link', 'send_sms', 'new_campaign', 'new_template', 'deploy', 'open_files', 'edit_dns', 'transfer', 'change_offer', 'terminate', 'cancel_termination', 'refresh', 'rename']) assert.ok(ACTION_ICONS[key], key)
  assert.equal(actionIcon('inconnue'), DEFAULT_ACTION_ICON)
  const items = menuItems([REFRESH_ACTION, { key: 'deploy', label: 'Publier', group: 'quick' }, { key: 'zz', label: 'Z', group: 'quick' }])
  assert.deepEqual(items.map((a) => a.icon), ['mdi-refresh', 'mdi-rocket-launch-outline', DEFAULT_ACTION_ICON])
  assert.deepEqual(items.map((a) => a.sep), [false, true, false])
})
