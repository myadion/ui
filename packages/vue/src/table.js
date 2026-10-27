/*
 * LA LOGIQUE DE UiTable, sans Vue, pour qu'elle se teste (Adion UI, 2026-10-13) :
 * chercher, filtrer, trier, decouper en pages.
 */

const norm = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .trim()

/* La valeur d'une colonne : `value(row)` si la colonne la calcule, sinon le chemin `key` (« service.name »). */
export function cellValue(row, column) {
  if (!column) return ''
  if (typeof column.value === 'function') return column.value(row)
  return String(column.key || '').split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), row)
}

/*
 * Une recherche cherche dans les colonnes `searchable` (toutes par defaut),
 * sans tenir compte des accents ni de la casse. `searchIn(row)` remplace les
 * colonnes quand la recherche doit voir ce que le tableau ne montre pas.
 */
export function searchRows(rows, needle, columns = [], searchIn = null) {
  const q = norm(needle)
  if (!q) return rows
  const cols = columns.filter((c) => c.searchable !== false)
  return rows.filter((row) => {
    const values = searchIn ? [].concat(searchIn(row)) : cols.map((c) => cellValue(row, c))
    return values.some((v) => norm(v).includes(q))
  })
}

/* Les filtres : { cle: valeur } ; une valeur vide ne filtre pas. `filters` decrit comment lire la valeur. */
export function filterRows(rows, active = {}, filters = []) {
  const on = filters.filter((f) => active[f.key] !== undefined && active[f.key] !== null && active[f.key] !== '')
  if (!on.length) return rows
  return rows.filter((row) => on.every((f) => {
    const value = typeof f.value === 'function' ? f.value(row) : cellValue(row, f)
    return String(value) === String(active[f.key])
  }))
}

/* Le tri : nombres en nombres, dates et textes en francais ; les vides a la fin. */
export function sortRows(rows, sort, columns = []) {
  if (!sort?.key) return rows
  const column = columns.find((c) => c.key === sort.key)
  if (!column) return rows
  const dir = sort.dir === 'desc' ? -1 : 1
  const read = (row) => (typeof column.sortValue === 'function' ? column.sortValue(row) : cellValue(row, column))
  const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' })
  return [...rows].sort((a, b) => {
    const x = read(a)
    const y = read(b)
    const xEmpty = x === null || x === undefined || x === ''
    const yEmpty = y === null || y === undefined || y === ''
    if (xEmpty || yEmpty) return xEmpty === yEmpty ? 0 : xEmpty ? 1 : -1
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir
    return collator.compare(String(x), String(y)) * dir
  })
}

/* Le tri suivant au clic sur une colonne : croissant, decroissant, aucun. */
export function nextSort(sort, key) {
  if (!sort || sort.key !== key) return { key, dir: 'asc' }
  if (sort.dir === 'asc') return { key, dir: 'desc' }
  return { key: '', dir: 'asc' }
}

export function paginate(rows, page = 1, size = 0) {
  if (!size || size <= 0) return { rows, page: 1, pages: 1 }
  const pages = Math.max(1, Math.ceil(rows.length / size))
  const current = Math.min(Math.max(1, page), pages)
  return { rows: rows.slice((current - 1) * size, current * size), page: current, pages }
}
