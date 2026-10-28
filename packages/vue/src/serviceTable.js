import { useAdion } from './adapter.js'

/* Les libelles d'un service viennent de l'app (createAdionUi({ labels })). */
const label = (name, fallback) => (...args) => (useAdion().labels?.[name] || fallback)(...args)
const serviceLabel = label('serviceLabel', (s) => s?.customer_description || s?.name || '')
const offerLabel = label('offerLabel', (o) => o?.public_label || o?.name || '')
const stateLabel = label('stateLabel', (v) => v || '')

/*
 * LE TABLEAU DE TOUS LES PRODUITS (Adion UI). Hebergements,
 * domaines, e-mails, SMS, Campagnes, Pay : une liste de services a la meme
 * forme - nom, etat, offre, projet, echeance - et un clic vers la fiche. Ce
 * module range un service de l'API dans cette forme ; l'ecran ne decide de
 * rien, il passe ses services et le lien de la fiche.
 */
export const SERVICE_COLUMNS = [
  { key: 'name', label: 'Nom', main: true, sortable: true, value: (row) => row.name },
  { key: 'state', label: 'État', sortable: true, value: (row) => row.state.label },
  { key: 'offer', label: 'Offre', muted: true, sortable: true, value: (row) => row.offer },
  { key: 'project', label: 'Projet', muted: true, sortable: true, value: (row) => row.project },
  { key: 'renewal', label: 'Échéance', muted: true, nowrap: true, sortable: true, value: (row) => row.renewalLabel, sortValue: (row) => row.renewal },
]

/** Le premier champ de date que l'API donne pour la prochaine echeance de l'abonnement. */
const RENEWAL_FIELDS = ['renews_at', 'next_renewal_at', 'next_billing_at', 'current_period_end', 'billed_until']

export function renewalOf(service) {
  // L'API dit l'echeance toute faite (`due` : { date, kind, label }) ; sinon on la cherche dans l'abonnement.
  const due = Date.parse(service?.due?.date || '')
  if (Number.isFinite(due)) return new Date(due).toISOString().slice(0, 10)
  const sub = service?.subscription || {}
  for (const field of RENEWAL_FIELDS) {
    const time = Date.parse(sub[field] || '')
    if (Number.isFinite(time)) return new Date(time).toISOString().slice(0, 10)
  }
  return ''
}

export function dayLabel(iso) {
  const time = Date.parse(iso || '')
  if (!Number.isFinite(time)) return '—'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(time))
}

/**
 * Un service de l'API, a la forme du tableau. `state` ({ label, tone }) vient
 * de l'API quand il le dit (`status`, `status_tone`) ; sinon l'etat de
 * l'abonnement, dit en francais. Les cles de `over` l'emportent (un produit
 * qui nomme ses services autrement, ou qui connait deja l'etat).
 */
export function serviceRow(service, over = {}) {
  const renewal = renewalOf(service)
  const status = service?.status_label || stateLabel(service?.subscription?.status || service?.state?.state)
  const tone = service?.status_tone || (/^(Actif|En ligne)$/i.test(status) ? 'ok' : /Résili|Suspendu/i.test(status) ? 'muted' : 'warn')
  return {
    id: service?.id,
    name: serviceLabel(service),
    state: { label: status, tone },
    offer: offerLabel(service?.subscription?.offer) || '—',
    project: service?.account_service?.project_name || service?.project?.name || '—',
    renewal,
    renewalLabel: service?.due?.label && renewal ? `${dayLabel(renewal)} · ${service.due.label}` : dayLabel(renewal),
    raw: service,
    ...over,
  }
}
