/* La taille d'un fichier en mots (« 12,4 Ko »). */
export function fileSize(bytes) {
  const n = Number(bytes) || 0
  if (n < 1024) return `${n} o`
  const units = ['Ko', 'Mo', 'Go']
  let value = n / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i += 1 }
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: value < 10 ? 1 : 0 })} ${units[i]}`
}

/* Le fichier respecte-t-il `accept` (« .csv,text/csv,image/* ») ? Vide : tout passe. */
export function acceptsFile(file, accept = '') {
  const rules = String(accept).split(',').map((r) => r.trim().toLowerCase()).filter(Boolean)
  if (!rules.length) return true
  const name = String(file?.name || '').toLowerCase()
  const type = String(file?.type || '').toLowerCase()
  return rules.some((r) => (r.startsWith('.') ? name.endsWith(r) : r.endsWith('/*') ? type.startsWith(r.slice(0, -1)) : type === r))
}
