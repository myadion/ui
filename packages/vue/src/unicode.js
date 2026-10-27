/*
 * L'AVERTISSEMENT UNICODE D'UN SMS (coordination#66). Nexus envoie `unicode`
 * dans l'estimation : les caractères en cause, les SMS par destinataire et au
 * total, la phrase à afficher. Ici on ne fait que normaliser ce qu'il dit :
 * rien n'est recalculé, rien ne bloque.
 */
export function unicodeChars(unicode) {
  const raw = unicode?.characters || unicode?.chars || []
  const list = raw.map((c) => (typeof c === 'string' ? c : c?.char || c?.character || '')).filter(Boolean)
  return [...new Set(list)]
}

export function unicodeFacts(unicode) {
  if (!unicode) return ''
  const each = Number(unicode.segments_per_recipient ?? unicode.per_recipient) || 0
  const total = Number(unicode.segments_total ?? unicode.total) || 0
  const plural = (n) => `${n} SMS`
  return [each ? `${plural(each)} par destinataire` : '', total ? `${plural(total)} facturés au total` : ''].filter(Boolean).join(' · ')
}
