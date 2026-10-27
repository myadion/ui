import test from 'node:test'
import assert from 'node:assert/strict'
import { fromApiNotification, sortNotifications, unreadCount, whenLabel } from './notifications.js'

test('les plus graves passent devant, puis les plus récentes', () => {
  const list = sortNotifications([
    { id: 'a', severity: 'info', title: 'A', at: '2026-10-16T10:00:00Z' },
    { id: 'b', severity: 'critical', title: 'B', at: '2026-10-01T10:00:00Z' },
    { id: 'c', severity: 'warning', title: 'C', at: '2026-10-10T10:00:00Z' },
    { id: 'd', severity: 'warning', title: 'D', at: '2026-10-15T10:00:00Z' },
  ])
  assert.deepEqual(list.map((n) => n.id), ['b', 'd', 'c', 'a'])
  assert.equal(list[0].tone, 'bad')
})

test('le compteur ne compte que les non lues', () => {
  const list = sortNotifications([{ id: 1, title: 'x' }, { id: 2, title: 'y', read: true }, { id: 3, title: 'z', read_at: '2026-10-01' }])
  assert.equal(unreadCount(list), 1)
  assert.equal(unreadCount(null), 0)
})

test('la date se dit simplement', () => {
  const now = Date.parse('2026-10-16T12:00:00Z')
  assert.equal(whenLabel('2026-10-16T11:55:00Z', now), 'il y a 5 min')
  assert.equal(whenLabel('2026-10-16T09:00:00Z', now), 'il y a 3 h')
  assert.equal(whenLabel('2026-10-15T11:00:00Z', now), 'hier')
  assert.equal(whenLabel(null, now), '')
})

test('une notification de Nexus se lit dans la langue demandée, avec son action', () => {
  const raw = {
    id: 'notif_1', severity: 'action_required', dismissible: false, read: false, occurred_at: '2026-10-16T08:00:00+00:00',
    title: { fr: 'Moyen de paiement manquant', en: 'Payment method missing' },
    message: { fr: 'Ajoutez-en un.', en: 'Add one.' },
    action: { label: { fr: 'Ajouter un moyen de paiement', en: 'Add a payment method' }, url: '/billing/billing_1' },
  }
  const fr = fromApiNotification(raw)
  assert.equal(fr.title, 'Moyen de paiement manquant')
  assert.deepEqual(fr.action, { label: 'Ajouter un moyen de paiement', to: '/billing/billing_1' })
  assert.equal(fr.sticky, true)
  assert.equal(fromApiNotification(raw, 'en').action.label, 'Add a payment method')
})

test('action requise passe avant avertissement, même re-normalisées', () => {
  const list = sortNotifications(sortNotifications([
    { id: 'w', severity: 'warning', at: '2026-10-16T10:00:00Z' },
    { id: 'a', severity: 'action_required', at: '2026-10-01T10:00:00Z' },
  ]))
  assert.deepEqual(list.map((n) => n.id), ['a', 'w'])
})
