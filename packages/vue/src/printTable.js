/*
 * UN TABLEAU A IMPRIMER (Adion UI, 2026-10-29) : un document a part, ouvert
 * dans un nouvel onglet et imprime aussitot (un historique, un releve). Fond
 * blanc et encre sombre quel que soit le theme : c'est du papier.
 *
 *   printTable({ title, lead, columns: ['Date', …], rows: [['…', …], …] })
 *
 * Les valeurs sont echappees ici. Renvoie false si le navigateur a bloque
 * l'onglet.
 */
const PAPER = 'body{font:12px Arial,sans-serif;color:#172033;padding:28px}h1{font-size:20px}table{width:100%;border-collapse:collapse}th,td{padding:7px;border-bottom:1px solid #dde4ec;text-align:left}th{background:#f5f7fa}'

const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export function printTable({ title = '', lead = '', columns = [], rows = [] } = {}) {
  const popup = window.open('', '_blank')
  if (!popup) return false
  popup.opener = null
  const head = columns.map((c) => `<th>${escape(c)}</th>`).join('')
  const body = rows.map((r) => `<tr>${r.map((v) => `<td>${escape(v)}</td>`).join('')}</tr>`).join('')
  popup.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escape(title)}</title><style>${PAPER}</style></head><body><h1>${escape(title)}</h1>${lead ? `<p>${escape(lead)}</p>` : ''}<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>window.print()<\/script></body></html>`)
  popup.document.close()
  return true
}
