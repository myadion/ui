/*
 * LES COLONNES CHOISIES PAR LE CLIENT, sans Vue :
 * lesquelles s'affichent et dans quel ordre. La preference tient en
 * { order: [cles], hidden: [cles] } ; une colonne que la preference ne connait
 * pas (ajoutee depuis) vient a la fin, et la colonne principale
 * (`main` ou `required`) ne se masque jamais.
 */
const keyOf = (c) => c.key
const locked = (c) => Boolean(c.main || c.required)

export function normalizePref(pref) {
  return {
    order: Array.isArray(pref?.order) ? pref.order.map(String) : [],
    hidden: Array.isArray(pref?.hidden) ? pref.hidden.map(String) : [],
  }
}

/* Toutes les colonnes, dans l'ordre choisi, chacune avec `visible`. */
export function arrangeColumns(columns = [], pref = null) {
  const { order, hidden } = normalizePref(pref)
  const byKey = new Map(columns.map((c) => [keyOf(c), c]))
  const ordered = order.filter((k) => byKey.has(k)).map((k) => byKey.get(k))
  /* Une colonne que la preference ne connait pas (ajoutee depuis) vient a la fin. */
  columns.forEach((c) => { if (!ordered.includes(c)) ordered.push(c) })
  return ordered.map((c) => ({ ...c, visible: locked(c) || !hidden.includes(keyOf(c)) }))
}

export const visibleColumns = (columns, pref) => arrangeColumns(columns, pref).filter((c) => c.visible)

export function toggleColumn(columns, pref, key) {
  const column = columns.find((c) => keyOf(c) === key)
  if (!column || locked(column)) return normalizePref(pref)
  const { order, hidden } = normalizePref(pref)
  return { order: order.length ? order : columns.map(keyOf), hidden: hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key] }
}

export function moveColumn(columns, pref, key, step) {
  const arranged = arrangeColumns(columns, pref).map(keyOf)
  const from = arranged.indexOf(key)
  const to = from + step
  if (from < 0 || to < 0 || to >= arranged.length) return normalizePref(pref)
  arranged.splice(to, 0, arranged.splice(from, 1)[0])
  return { order: arranged, hidden: normalizePref(pref).hidden }
}

/* Poser une colonne au rang `to` (glisser-deposer). */
export function placeColumn(columns, pref, key, to) {
  const arranged = arrangeColumns(columns, pref).map(keyOf)
  const from = arranged.indexOf(key)
  if (from < 0 || to < 0 || to >= arranged.length || from === to) return normalizePref(pref)
  arranged.splice(to, 0, arranged.splice(from, 1)[0])
  return { order: arranged, hidden: normalizePref(pref).hidden }
}

/* La preference vaut-elle les colonnes par defaut ? (le bouton « Par defaut » s'eteint alors). */
export function isDefault(columns, pref) {
  const { order, hidden } = normalizePref(pref)
  return !hidden.length && (!order.length || order.join() === columns.map(keyOf).filter((k) => order.includes(k)).join())
}
