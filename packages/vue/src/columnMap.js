/*
 * LA CORRESPONDANCE DES COLONNES (UiColumnMapper) : pour chaque colonne d'un
 * fichier, la cible que l'API propose et que le client corrige. Les cibles
 * viennent de l'API ({ value, label, group }) ; la colonne libre est propre a
 * chaque colonne (`field_target`) et « ignore » peut servir plusieurs fois.
 * Une cible du carnet (e-mail, mobile...) ne recoit qu'une colonne.
 */
export const IGNORE = 'ignore'

/* Les cibles groupees pour une liste de choix : un intitule par groupe, dans l'ordre de l'API. */
export function groupedTargets(targets = [], column = null) {
  const items = []
  const groups = []
  for (const t of targets) {
    if (t.value === IGNORE) continue
    const group = t.group || 'Autre'
    if (!groups.includes(group)) groups.push(group)
  }
  for (const group of groups) {
    items.push({ type: 'subheader', title: group })
    for (const t of targets) if (t.value !== IGNORE && (t.group || 'Autre') === group) items.push({ title: t.label, value: t.value })
  }
  if (column?.field_target) {
    items.push({ type: 'subheader', title: 'Colonne libre' })
    items.push({ title: column.field_label || column.header, value: column.field_target })
  }
  const ignore = targets.find((t) => t.value === IGNORE)
  if (ignore) {
    items.push({ type: 'divider' })
    items.push({ title: ignore.label, value: ignore.value })
  }
  return items
}

/* Les cibles du carnet prises par plusieurs colonnes : { cible: [index, ...] }. */
export function clashes(mapping = {}, targets = []) {
  const shared = new Set(targets.filter((t) => t.value !== IGNORE).map((t) => t.value))
  const taken = {}
  for (const [index, target] of Object.entries(mapping)) {
    if (!shared.has(target)) continue
    ;(taken[target] ||= []).push(Number(index))
  }
  return Object.fromEntries(Object.entries(taken).filter(([, list]) => list.length > 1))
}

/* Le message d'une colonne dont la cible est deja prise, ou ''. */
export function clashMessage(index, mapping, columns = [], targets = []) {
  const target = mapping[index]
  const others = (clashes(mapping, targets)[target] || []).filter((i) => i !== Number(index))
  if (!others.length) return ''
  const names = others.map((i) => columns.find((c) => c.index === i)?.header || `Colonne ${i + 1}`)
  return `Déjà prise par « ${names.join(' », « ')} »`
}
