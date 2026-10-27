/*
 * L'ASSISTANT D'ADION (Adion UI, coordination#80 point 8). Nexus pilote la
 * conversation et envoie un flux (SSE) : ici, la lecture du flux, le fil de
 * messages qui en sort, et le rendu markdown leger. Rien d'autre.
 */

/** Lit un flux SSE par morceaux : `push(texte)` rend les evenements complets { event, data }. */
export function createSseParser() {
  let buffer = ''
  return {
    push(chunk) {
      buffer += String(chunk || '').replace(/\r\n/g, '\n')
      const out = []
      let cut
      while ((cut = buffer.indexOf('\n\n')) !== -1) {
        const block = buffer.slice(0, cut)
        buffer = buffer.slice(cut + 2)
        let event = 'message'
        const data = []
        for (const line of block.split('\n')) {
          if (line.startsWith('event:')) event = line.slice(6).trim()
          else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''))
        }
        if (!data.length) continue
        let payload = data.join('\n')
        try { payload = JSON.parse(payload) } catch { /* texte brut */ }
        out.push({ event, data: payload })
      }
      return out
    },
  }
}

/** Un fil vide. */
export const emptyThread = () => ({ messages: [], pending: [], status: '', limit: null, error: '', streaming: false })

let counter = 0
const localId = () => `local_${Date.now()}_${counter++}`

/** Une conversation relue (`GET /assistant/conversation/{id}`) au format du fil. */
export function threadFromConversation(conversation) {
  const c = conversation || {}
  return {
    ...emptyThread(),
    messages: (Array.isArray(c.messages) ? c.messages : []).map((m) => ({
      id: String(m.id ?? localId()),
      role: m.role === 'user' ? 'user' : 'assistant',
      text: String(m.text || ''),
      actions: Array.isArray(m.actions) ? m.actions : [],
      tools: [],
    })),
    pending: (Array.isArray(c.pending) ? c.pending : []).map(normalizeCard),
  }
}

/** Une carte « Confirmer / Annuler » de Nexus, a plat. */
export function normalizeCard(raw) {
  const r = raw || {}
  const card = r.card || r
  return {
    id: String(r.action_id ?? r.id ?? ''),
    expiresAt: r.expires_at || card.expires_at || null,
    title: String(card.title || ''),
    question: String(card.question || ''),
    kind: card.kind || 'write',
    danger: Boolean(card.danger),
    args: card.arguments && typeof card.arguments === 'object' ? card.arguments : null,
    method: card.method || '',
    path: card.path || '',
  }
}

/** Le message du client, ajoute au fil avant l'envoi. */
export function addUserMessage(thread, text) {
  thread.messages.push({ id: localId(), role: 'user', text: String(text || ''), actions: [], tools: [] })
  thread.status = ''
  thread.limit = null
  thread.error = ''
  // Ecrire a la place d'une carte l'annule : Nexus les ferme, on les grise.
  thread.pending = []
  thread.streaming = true
}

const lastAssistant = (thread) => {
  const last = thread.messages[thread.messages.length - 1]
  if (last && last.role === 'assistant' && last.live) return last
  const message = { id: localId(), role: 'assistant', text: '', actions: [], tools: [], live: true }
  thread.messages.push(message)
  return message
}

/** Applique un evenement du flux au fil. */
export function applyEvent(thread, { event, data }) {
  const d = data && typeof data === 'object' ? data : {}
  if (event === 'delta') {
    lastAssistant(thread).text += String(d.text || '')
  } else if (event === 'tool') {
    const message = lastAssistant(thread)
    const title = String(d.title || '')
    const known = message.tools.find((t) => t.title === title)
    if (known) known.status = d.status || known.status
    else message.tools.push({ title, status: d.status || 'running' })
  } else if (event === 'confirmation') {
    const card = normalizeCard(d)
    if (card.id && !thread.pending.some((p) => p.id === card.id)) thread.pending.push(card)
  } else if (event === 'action') {
    const id = String(d.action_id ?? d.id ?? '')
    const card = thread.pending.find((p) => p.id === id)
    thread.pending = thread.pending.filter((p) => p.id !== id)
    const message = lastAssistant(thread)
    message.actions.push({ id, status: d.status || '', title: String(d.title || card?.title || '') })
  } else if (event === 'limit') {
    thread.limit = { kind: d.kind || '', message: String(d.message || ''), resetsAt: d.resets_at || null }
  } else if (event === 'error') {
    thread.error = String(d.message || 'L’assistant a rencontré un problème.')
  } else if (event === 'done') {
    thread.status = String(d.status || 'ok')
    thread.streaming = false
    for (const m of thread.messages) {
      delete m.live
      for (const t of m.tools) if (t.status === 'running') t.status = 'done'
    }
  }
  return thread
}

/** La raison d'un refus (429 ou 503 avant l'envoi) au format de `thread.limit`. */
export function limitFromError(error) {
  const body = error?.data || error?.response?.data || {}
  const limit = body.limit || {}
  if (error?.status === 429 || limit.kind) {
    return { kind: limit.kind || body.kind || 'user_daily_messages', message: String(body.message || limit.message || error?.message || ''), resetsAt: limit.resets_at || body.resets_at || null }
  }
  if (error?.status === 503) {
    return { kind: body.reason || 'not_configured', message: String(body.message || ''), resetsAt: null }
  }
  return null
}

/** Un plafond qui se leve en ouvrant une autre conversation. */
export const limitOffersNewConversation = (limit) => limit?.kind === 'conversation_max_messages'

/**
 * « 3 / 50 messages aujourd'hui », vide si Nexus n'a pas donne le plafond.
 * Forme lue : `limits.user_daily_messages` = { limit, used } (ou un nombre,
 * avec `user_daily_used` a cote).
 */
export function counterLabel(limits) {
  const l = limits || {}
  const daily = l.user_daily_messages ?? l.daily_messages
  const max = Number(daily && typeof daily === 'object' ? daily.limit ?? daily.max : daily)
  const used = Number(daily && typeof daily === 'object' ? daily.used : l.user_daily_used ?? l.used)
  if (!Number.isFinite(max) || !Number.isFinite(used)) return ''
  return `${used} / ${max} messages aujourd’hui`
}

export const STATE_LABEL = {
  executed: 'Fait',
  failed: 'Échec',
  cancelled: 'Annulé',
  expired: 'Expiré',
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const inline = (text) => {
  const links = []
  const keep = (html) => { links.push(html); return `\u0000${links.length - 1}\u0000` }
  let s = escapeHtml(text)
  s = s.replace(/`([^`]+)`/g, (_, c) => keep(`<code>${c}</code>`))
  s = s.replace(/\[([^\]]+)\]\(((?:https:\/\/|\/(?!\/))[^\s)]*)\)/g, (_, label, url) => keep(link(label, url)))
  s = s.replace(/(^|[\s(])(https:\/\/[^\s<)]+[^\s<).,;!?])/g, (_, lead, url) => `${lead}${keep(link(url, url))}`)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => links[Number(i)])
}

const link = (label, url) => (url.startsWith('/')
  ? `<a href="${url}" data-route="${url}">${label}</a>`
  : `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`)

/**
 * Le markdown leger de l'assistant (gras, italique, code, listes, liens) en
 * HTML. Tout est echappe d'abord ; seuls les liens https:// et les chemins
 * de myadion deviennent cliquables.
 */
export function renderMarkdown(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n')
  const out = []
  let list = null
  let para = []
  const flush = () => {
    if (para.length) out.push(`<p>${para.map(inline).join('<br>')}</p>`)
    para = []
  }
  const close = () => {
    if (list) out.push(`</${list}>`)
    list = null
  }
  for (const line of lines) {
    const bullet = line.match(/^\s*[-*]\s+(.*)$/)
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (bullet || numbered) {
      flush()
      const tag = bullet ? 'ul' : 'ol'
      if (list !== tag) { close(); out.push(`<${tag}>`); list = tag }
      out.push(`<li>${inline((bullet || numbered)[1])}</li>`)
    } else if (!line.trim()) {
      flush(); close()
    } else {
      close()
      para.push(line)
    }
  }
  flush(); close()
  return out.join('')
}
