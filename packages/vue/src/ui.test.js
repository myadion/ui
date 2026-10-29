import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tone, toneOf } from './tone.js'
import { filterRows, nextSort, paginate, searchRows, sortRows } from './table.js'
import { orderTabs, wizardProgress } from './layout.js'
import { isAdionStaff } from './staff.js'

test('le ton de l’API se traduit dans les cinq tons du kit', () => {
  assert.equal(tone('success'), 'ok')
  assert.equal(tone('WARNING'), 'warn')
  assert.equal(tone('danger'), 'bad')
  assert.equal(tone('neutral'), 'muted')
  assert.equal(tone('n-importe-quoi'), 'muted')
  assert.equal(toneOf({ status_tone: 'error' }), 'bad')
  assert.equal(toneOf({}, 'ok'), 'ok')
})

const rows = [
  { id: 1, name: 'Élan', n: 10, kind: 'a' },
  { id: 2, name: 'alpha', n: 2, kind: 'b' },
  { id: 3, name: 'Bravo', n: null, kind: 'a' },
]
const cols = [{ key: 'name' }, { key: 'n' }]

test('la recherche ignore accents et casse', () => {
  assert.deepEqual(searchRows(rows, 'ela', cols).map((r) => r.id), [1])
  assert.deepEqual(searchRows(rows, '', cols).length, 3)
})

test('les filtres, le tri et les pages', () => {
  assert.deepEqual(filterRows(rows, { kind: 'a' }, [{ key: 'kind' }]).map((r) => r.id), [1, 3])
  assert.deepEqual(sortRows(rows, { key: 'name', dir: 'asc' }, cols).map((r) => r.id), [2, 3, 1])
  assert.deepEqual(sortRows(rows, { key: 'n', dir: 'desc' }, cols).map((r) => r.id), [1, 2, 3])
  assert.deepEqual(nextSort({ key: 'n', dir: 'asc' }, 'n'), { key: 'n', dir: 'desc' })
  assert.deepEqual(nextSort({ key: 'n', dir: 'desc' }, 'n'), { key: '', dir: 'asc' })
  const page = paginate(rows, 5, 2)
  assert.equal(page.page, 2)
  assert.equal(page.pages, 2)
  assert.deepEqual(page.rows.map((r) => r.id), [3])
})

test('les onglets d’une fiche : vue d’ensemble d’abord, reglages puis resiliation a la fin', () => {
  const tabs = [{ id: 'resiliation' }, { id: 'api' }, { id: 'reglages' }, { id: 'ensemble' }, { id: 'historique' }]
  assert.deepEqual(orderTabs(tabs).map((t) => t.id), ['ensemble', 'api', 'historique', 'reglages', 'resiliation'])
  assert.equal(wizardProgress([{ key: 'a' }, { key: 'b' }], 'a'), 50)
})

test('le personnel d’Adion se reconnait a un role autre que ceux de tout le monde', () => {
  assert.equal(isAdionStaff({ user: { roles: ['Client', 'Tous le monde'] } }), false)
  assert.equal(isAdionStaff({ user: { roles: ['Super Admin', 'Client'] } }), true)
  assert.equal(isAdionStaff(null), false)
})

import { arrangeColumns, isDefault, moveColumn, placeColumn, toggleColumn, visibleColumns } from './columns.js'
import { accountOf, applyRouteContext, contextChanges, contextFromRoute, contextOf, contextPath, contextRoutes, inContext, stripContext } from './context.js'

const COLS = [{ key: 'name', main: true }, { key: 'a' }, { key: 'b' }, { key: 'c' }]

test('les colonnes choisies : ordre, masquées, nouvelles, la principale toujours là', () => {
  assert.deepEqual(visibleColumns(COLS, null).map((c) => c.key), ['name', 'a', 'b', 'c'])
  let pref = toggleColumn(COLS, null, 'b')
  assert.deepEqual(visibleColumns(COLS, pref).map((c) => c.key), ['name', 'a', 'c'])
  assert.deepEqual(toggleColumn(COLS, pref, 'name'), pref, 'La colonne principale ne se masque pas.')
  pref = moveColumn(COLS, pref, 'c', -1)
  assert.deepEqual(arrangeColumns(COLS, pref).map((c) => c.key), ['name', 'a', 'c', 'b'])
  const later = [...COLS, { key: 'd' }]
  assert.deepEqual(arrangeColumns(later, { order: ['name', 'c', 'a'] }).map((c) => c.key), ['name', 'c', 'a', 'b', 'd'])
  assert.equal(isDefault(COLS, null), true)
  assert.equal(isDefault(COLS, pref), false)
})

test('le contexte dans l’adresse', () => {
  assert.deepEqual(contextFromRoute({ path: '/account/org_A/project/project_B/services/web/domain/x', params: {} }), { account: 'org_A', projectId: 'project_B' })
  assert.deepEqual(contextFromRoute({ params: { account: 'personal', project: 'p1' } }), { account: 'personal', projectId: 'p1' })
  assert.deepEqual(contextFromRoute({ path: '/services/web/domain', params: {} }), { account: '', projectId: '' })
  assert.equal(contextPath({ account: 'org_A', projectId: 'p1' }, '/services/telecom/sms'), '/account/org_A/project/p1/services/telecom/sms')
  assert.equal(contextPath({ account: 'org_A', projectId: 'p2' }, '/account/org_A/project/p1/billing'), '/account/org_A/project/p2/billing')
  assert.equal(stripContext('/account/org_A/project/p1/services/telecom/sms'), '/services/telecom/sms')
  assert.equal(stripContext('/account/org_A/project/p1/services/telecom/sms/'), '/services/telecom/sms')
  assert.equal(contextPath({ account: 'personal', projectId: 'p1' }, '/services/web/domain/'), '/account/personal/project/p1/services/web/domain')
  assert.equal(accountOf({ scopeType: 'organization', selectedOrgId: 'org_A' }), 'org_A')
  assert.equal(accountOf({ scopeType: 'personal' }), 'personal')
  assert.deepEqual(contextChanges({ scopeType: 'personal', selectedProjectId: 'p1' }, { account: 'org_A', projectId: 'p2' }), [{ kind: 'organization', id: 'org_A' }, { kind: 'project', id: 'p2' }])
  assert.deepEqual(contextChanges({ scopeType: 'organization', selectedOrgId: 'org_A', selectedProjectId: 'p2' }, { account: 'org_A', projectId: 'p2' }), [])
})

test('les routes d’un projet portent le contexte, les anciennes adresses y mènent', async () => {
  const routes = contextRoutes([{ path: '/services/web/domain/:id', name: 'web-domain-detail', component: {} }])
  assert.equal(routes[0].path, '/account/:account/project/:project/services/web/domain/:id')
  assert.equal(routes[0].name, 'web-domain-detail')
  assert.equal(routes[1].path, '/services/web/domain/:id')
  assert.equal(routes[1].meta.legacyContext, true)
  assert.notEqual(routes[1].name, routes[0].name)
  assert.deepEqual(contextOf({ scopeType: 'organization', selectedOrgId: 'org_A', selectedProjectId: 'p1' }), { account: 'org_A', projectId: 'p1' })
  assert.deepEqual(contextOf({ scopeType: 'personal', selectedProjectId: '' }), { account: 'personal', projectId: '' })
  assert.equal(inContext({ scopeType: 'personal', selectedProjectId: 'p1' }, { account: 'personal', projectId: 'p1' }), true)
  assert.equal(inContext({ scopeType: 'personal', selectedProjectId: 'p1' }, { account: 'org_A', projectId: 'p1' }), false)
  // Une seule bascule, et aucune quand le store y est deja.
  const calls = []
  const ws = { scopeType: 'personal', selectedProjectId: 'p1', applyContext: async (ctx) => calls.push(ctx) }
  await applyRouteContext(ws, { account: 'personal', projectId: 'p1' })
  await applyRouteContext(ws, { account: 'org_A', projectId: 'p2' })
  assert.deepEqual(calls, [{ account: 'org_A', projectId: 'p2' }])
})

test('les pastilles : coupées aux lignes et virgules, pas aux espaces, sans doublon', async () => {
  const { splitTags, addTags } = await import('./tags.js')
  assert.deepEqual(splitTags('06 12 34 56 78\n0700000000, 0700000000;  0611  '), ['06 12 34 56 78', '0700000000', '0700000000', '0611'])
  assert.deepEqual(addTags(['0611'], '0611\n0622,0633'), ['0611', '0622', '0633'])
  assert.deepEqual(addTags([], 'a,b,c', { max: 2 }), ['a', 'b'])
})

test('le fil d’Ariane d’une fiche s’arrête à la liste', async () => {
  const { crumbTrail } = await import('./layout.js')
  assert.deepEqual(crumbTrail([{ label: 'Télécom' }, { label: 'SMS', to: '/x' }, { label: 'SMS' }]), [{ label: 'Télécom' }, { label: 'SMS', to: '/x' }])
  assert.deepEqual(crumbTrail([{ label: 'Télécom' }, { label: 'SMS', to: '/x' }]), [{ label: 'Télécom' }, { label: 'SMS', to: '/x' }])
})

import { BLOCK_TYPES, duplicateBlock, insertBlock, labelsFor, moveBlock, patchBlock, removeBlock, resizeColumns } from './mailBlocks.js'

test('les blocs d’un courriel : les gestes de l’éditeur, colonnes comprises', () => {
  const blocks = [{ type: 'heading', text: 'A' }, { type: 'columns', ratio: '50-50', columns: [{ blocks: [] }, { blocks: [{ type: 'text', text: 'x' }] }] }]
  const inserted = insertBlock(blocks, { zone: 'body', index: 1 }, 'button')
  assert.equal(inserted.blocks[1].type, 'button')
  assert.deepEqual(inserted.selection, { zone: 'body', index: 1 })
  const child = insertBlock(blocks, { zone: 'body', index: 1, column: 0, child: 0 }, 'image')
  assert.equal(child.blocks[1].columns[0].blocks[0].type, 'image')
  assert.equal(blocks[1].columns[0].blocks.length, 0, 'la liste d’origine ne bouge pas')
  assert.equal(moveBlock(blocks, { zone: 'body', index: 0 }, 1).blocks[1].type, 'heading')
  assert.equal(moveBlock(blocks, { zone: 'body', index: 0 }, 5), null)
  assert.equal(duplicateBlock(blocks, { zone: 'body', index: 0 }).blocks.length, 3)
  assert.equal(removeBlock(blocks, { zone: 'body', index: 0 }).length, 1)
  assert.equal(patchBlock(blocks, { zone: 'body', index: 1, column: 1, child: 0 }, 'text', 'y')[1].columns[1].blocks[0].text, 'y')
  const three = resizeColumns(blocks[1], 3)
  assert.equal(three.columns.length, 3)
  assert.equal(three.ratio, '33-33-33')
  assert.equal(resizeColumns(three, 2).columns[1].blocks.length, 1, 'réduire ne perd rien')
  assert.equal(labelsFor('body', blocks)['body:1:1:0'], 'Paragraphe')
  // Les treize blocs, plus la section (des colonnes a une seule colonne).
  assert.equal(BLOCK_TYPES.length, 14)
  const section = insertBlock([], { zone: 'body', index: 0 }, 'section').blocks[0]
  assert.equal(section.type, 'columns')
  assert.equal(section.columns.length, 1)
  assert.equal(labelsFor('body', [section])['body:0'], 'Section')
})

import { groupDisruptions, historyStrip, measuredText, uptimeText, uptimeTone } from './health.js'

test('etat des services : textes, frise et regroupement', () => {
  assert.equal(uptimeText(null), '—')
  assert.equal(uptimeText(99.65), '99,65 %')
  assert.equal(uptimeTone(100), 'ok')
  assert.equal(uptimeTone(99.65), 'warn')
  assert.equal(uptimeTone(90), 'bad')
  assert.equal(uptimeTone(null), 'none')
  assert.equal(measuredText(4), 'mesurée sur 4 jours')
  assert.equal(measuredText(90), '')
  const strip = historyStrip([{ date: '2026-10-15', uptime: 99.65 }], new Date(2026, 9, 16))
  assert.equal(strip.length, 90)
  assert.equal(strip[89].uptime, null)
  assert.equal(strip[88].tone, 'warn')
  assert.equal(strip[0].tone, 'none')
  const groups = groupDisruptions([{ date: '2026-10-14', service: 'a' }, { date: '2026-10-15', service: 'b' }, { date: '2026-10-15', service: 'c' }])
  assert.equal(groups[0].date, '2026-10-15')
  assert.equal(groups[0].items.length, 2)
})

test('placeColumn pose une colonne au rang voulu', () => {
  const columns = [{ key: 'a' }, { key: 'b' }, { key: 'c' }]
  assert.deepEqual(placeColumn(columns, null, 'c', 0).order, ['c', 'a', 'b'])
  assert.deepEqual(placeColumn(columns, null, 'a', 2).order, ['b', 'c', 'a'])
  assert.deepEqual(placeColumn(columns, { hidden: ['b'] }, 'a', 1), { order: ['b', 'a', 'c'], hidden: ['b'] })
})
