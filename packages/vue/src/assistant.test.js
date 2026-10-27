import test from 'node:test'
import assert from 'node:assert/strict'
import { addUserMessage, applyEvent, counterLabel, createSseParser, emptyThread, limitFromError, renderMarkdown, threadFromConversation } from './assistant.js'

test('le flux se lit par morceaux, meme coupe au milieu', () => {
  const p = createSseParser()
  assert.deepEqual(p.push('event: delta\ndata: {"text":"Bon'), [])
  const out = p.push('jour"}\n\nevent: done\ndata: {"status":"ok"}\n\n')
  assert.deepEqual(out, [{ event: 'delta', data: { text: 'Bonjour' } }, { event: 'done', data: { status: 'ok' } }])
})

test('les deltas s\'ajoutent a la bulle de l\'assistant, le done la ferme', () => {
  const t = emptyThread()
  addUserMessage(t, 'Mes domaines ?')
  applyEvent(t, { event: 'tool', data: { title: 'Lecture de vos domaines…', status: 'running' } })
  applyEvent(t, { event: 'delta', data: { text: 'Vous avez ' } })
  applyEvent(t, { event: 'delta', data: { text: '2 domaines.' } })
  applyEvent(t, { event: 'done', data: { status: 'ok' } })
  assert.equal(t.messages.length, 2)
  assert.equal(t.messages[1].text, 'Vous avez 2 domaines.')
  assert.equal(t.messages[1].tools[0].status, 'done')
  assert.equal(t.streaming, false)
})

test('une carte arrive, puis se ferme en action ; un nouveau message annule les cartes ouvertes', () => {
  const t = emptyThread()
  applyEvent(t, { event: 'confirmation', data: { action_id: 'a1', expires_at: 'x', card: { title: 'Supprimer', question: 'Sûr ?', kind: 'delete', danger: true } } })
  assert.equal(t.pending[0].danger, true)
  applyEvent(t, { event: 'action', data: { action_id: 'a1', status: 'executed' } })
  assert.equal(t.pending.length, 0)
  assert.equal(t.messages[0].actions[0].status, 'executed')
  applyEvent(t, { event: 'confirmation', data: { action_id: 'a2', card: { title: 'x' } } })
  addUserMessage(t, 'autre chose')
  assert.equal(t.pending.length, 0)
})

test('une conversation relue remet les cartes en attente', () => {
  const t = threadFromConversation({ messages: [{ id: 1, role: 'user', text: 'a' }, { id: 2, role: 'assistant', text: 'b', actions: [{ status: 'executed' }] }], pending: [{ action_id: 'p', card: { title: 'T' } }] })
  assert.equal(t.messages.length, 2)
  assert.equal(t.pending[0].id, 'p')
})

test('un plafond atteint se lit du 429 et du 503', () => {
  assert.equal(limitFromError({ status: 429, data: { message: 'Stop', limit: { kind: 'conversation_max_messages', resets_at: 'd' } } }).kind, 'conversation_max_messages')
  assert.equal(limitFromError({ status: 503, data: { reason: 'paused', message: 'Pause' } }).kind, 'paused')
  assert.equal(limitFromError({ status: 500 }), null)
})

test('le compteur ne s\'affiche que si Nexus donne les chiffres', () => {
  assert.equal(counterLabel({}), '')
  assert.equal(counterLabel({ user_daily_messages: 50, user_daily_used: 3 }), '3 / 50 messages aujourd’hui')
  assert.equal(counterLabel({ user_daily_messages: { limit: 50, used: 3 } }), '3 / 50 messages aujourd’hui')
})

test('le markdown est echappe et seuls https et les chemins de myadion deviennent des liens', () => {
  const html = renderMarkdown('**Gras** <script>x</script>\n- un\n- deux\n\n[Payer](/billing) [Mal](javascript:alert(1)) https://docs.myadion.com/a.')
  assert.ok(html.includes('<strong>Gras</strong>'))
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('<ul><li>un</li><li>deux</li></ul>'))
  assert.ok(html.includes('data-route="/billing"'))
  assert.ok(!html.includes('href="javascript'))
  assert.ok(html.includes('href="https://docs.myadion.com/a"'))
})
