/*
 * LES PASTILLES D'UN CHAMP (UiTagsInput) : ce qu'on tape ou colle devient une
 * liste de valeurs. On coupe aux retours a la ligne, virgules et points-
 * virgules - pas aux espaces : « 06 12 34 56 78 » reste un seul numero. Les
 * doublons et les vides tombent ; l'ordre de saisie est garde.
 */
export const TAG_SEPARATORS = /[\n\r,;\t]+/

export function splitTags(text = '', separators = TAG_SEPARATORS) {
  return String(text ?? '').split(separators).map((part) => part.trim().replace(/\s{2,}/g, ' ')).filter(Boolean)
}

export function addTags(current = [], text = '', { max = 0, separators = TAG_SEPARATORS } = {}) {
  const seen = new Set(current)
  const next = [...current]
  for (const tag of splitTags(text, separators)) {
    if (seen.has(tag)) continue
    if (max && next.length >= max) break
    seen.add(tag)
    next.push(tag)
  }
  return next
}
