/*
 * L'ETAT D'UN SERVICE DE LA PLATEFORME (Adion UI).
 *
 * L'API envoie le code (`operational`, `degraded`, `outage`, `maintenance`,
 * `unknown`) et le libelle de la famille. Tant qu'il n'envoie pas aussi
 * `status_label` et `tone`, ce fichier dit le mot et le ton du code : c'est
 * le seul endroit, aucun ecran n'en garde la table.
 */
const HEALTH = {
  operational: { label: 'En service', tone: 'ok' },
  degraded: { label: 'Perturbé', tone: 'warn' },
  outage: { label: 'En panne', tone: 'bad' },
  maintenance: { label: 'Maintenance', tone: 'info' },
  unknown: { label: 'Inconnu', tone: 'muted' },
}

export function healthOf(item) {
  const known = HEALTH[item?.status] || HEALTH.unknown
  return { label: item?.status_label || known.label, tone: item?.tone || item?.status_tone || known.tone }
}

/* Le mot de l'etat d'ensemble, en une phrase. */
const OVERALL = {
  operational: 'Tous les services fonctionnent.',
  degraded: 'Certains services sont perturbés.',
  outage: 'Un incident est en cours.',
  maintenance: 'Une maintenance est en cours.',
  unknown: 'L’état des services n’est pas connu pour le moment.',
}

export function overallText(status) {
  return OVERALL[status] || OVERALL.unknown
}

/* La disponibilite en texte : « — » quand l'API n'a pas la mesure. */
export function uptimeText(value) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '—'
  return `${Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} %`
}

/* Le ton d'une journee de la frise : 100 % ok, 99 % et plus perturbe, dessous en panne. */
export function uptimeTone(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'none'
  const v = Number(value)
  return v >= 99.95 ? 'ok' : v >= 99 ? 'warn' : 'bad'
}

/*
 * La frise : `days` jours finissant a `today`, du plus ancien au plus recent.
 * Un jour absent de `history` ({ date, uptime }) reste « non mesure ».
 */
export function historyStrip(history, today = new Date(), days = 90) {
  const byDate = new Map((history || []).map((h) => [String(h.date).slice(0, 10), h.uptime]))
  const out = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - i))
    const date = d.toISOString().slice(0, 10)
    const uptime = byDate.has(date) ? byDate.get(date) : null
    out.push({ date, uptime, tone: uptimeTone(uptime) })
  }
  return out
}

/* « mesurée sur N jours » tant que la mesure n'atteint pas 90 jours. */
export function measuredText(days) {
  const n = Number(days)
  return Number.isFinite(n) && n > 0 && n < 90 ? `mesurée sur ${n} jour${n > 1 ? 's' : ''}` : ''
}

/* Les perturbations passees regroupees par jour, le plus recent d'abord. */
export function groupDisruptions(list) {
  const groups = new Map()
  for (const item of list || []) {
    const key = String(item.date).slice(0, 10)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([date, items]) => ({ date, items }))
}
