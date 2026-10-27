/*
 * LE CENTRE DE NOTIFICATIONS (Adion UI, coordination#80 point 7). Une
 * notification : { id, severity, title, message, at, read, action: { label,
 * to?|href? } }. La gravite vient de Nexus (critical, warning, info, success
 * et leurs synonymes : `tone.js`) ; le kit n'en invente aucune.
 */
import { tone } from './tone.js'

const RANK = { bad: 0, warn: 1, info: 2, accent: 3, ok: 4, muted: 5 }
/** L'ordre de Nexus : `action_required` passe avant `warning`, deux tons « warn » pour le kit. */
const SEVERITY_RANK = { critical: 0, action_required: 1, warning: 2, info: 3 }

/** Une notification, au format du volet ; le ton est celui du kit. */
export function normalizeNotification(raw, index = 0) {
  const n = raw || {}
  const action = n.action && n.action.label ? n.action : null
  return {
    id: String(n.id ?? n.key ?? index),
    tone: tone(n.severity ?? n.tone ?? n.level),
    rank: n.rank ?? SEVERITY_RANK[String(n.severity || '').toLowerCase()] ?? 10,
    title: String(n.title || ''),
    message: String(n.message || n.text || ''),
    at: n.at || n.created_at || null,
    read: Boolean(n.read || n.read_at),
    /** Une situation du compte (paiement manquant...) : elle ne se marque pas lue, elle se regle. */
    sticky: Boolean(n.sticky),
    action,
    /** Nexus : seules les gravites legeres se ferment ; les autres disparaissent quand la cause est reglee. */
    dismissible: Boolean(n.dismissible),
  }
}

/** Les plus graves d'abord, puis les plus recentes. */
export function sortNotifications(list) {
  return (Array.isArray(list) ? list : [])
    .map(normalizeNotification)
    .sort((a, b) => (a.rank - b.rank) || (RANK[a.tone] - RANK[b.tone]) || (Date.parse(b.at || '') || 0) - (Date.parse(a.at || '') || 0))
}

export const unreadCount = (list) => (Array.isArray(list) ? list : []).filter((n) => !n.read).length

/** « il y a 5 min », « hier », « le 3 nov. » ; vide sans date. */
export function whenLabel(at, now = Date.now()) {
  const time = Date.parse(at || '')
  if (!Number.isFinite(time)) return ''
  const minutes = Math.round((now - time) / 60000)
  if (minutes < 1) return 'à l’instant'
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'hier'
  if (days < 7) return `il y a ${days} jours`
  return `le ${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(time))}`
}

const pick = (value, locale) => (value && typeof value === 'object' ? value[locale] || value.fr || value.en || '' : value || '')

/** Une notification de Nexus (`GET /me/notification`) au format du volet, dans la langue demandee. */
export function fromApiNotification(item, locale = 'fr') {
  const n = item || {}
  const label = pick(n.action?.label, locale)
  return {
    id: String(n.id),
    severity: n.severity,
    title: pick(n.title, locale),
    message: pick(n.message, locale),
    at: n.occurred_at || null,
    read: Boolean(n.read),
    dismissible: Boolean(n.dismissible),
    /** Un etat grave ne se marque pas lu : il se regle, et Nexus le retire. */
    sticky: !n.dismissible && (n.severity === 'critical' || n.severity === 'action_required'),
    action: label && n.action?.url ? { label, to: n.action.url } : null,
  }
}
