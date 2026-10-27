/*
 * LA RECHERCHE D'ADRESSE (Kevin, le 2026-10-13) : la Base Adresse Nationale,
 * servie par Nexus (`GET /address/search`), la même que l'inscription et
 * Orbit. Elle rend des « features » GeoJSON ; on n'en garde que de quoi
 * remplir une adresse.
 */

/** Les résultats de la BAN, quelle que soit leur enveloppe. */
export function addressRows(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.features)) return payload.features
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

/** Une proposition : son libellé, et les champs qu'elle remplit. */
export function addressOption(feature) {
  const p = feature?.properties || feature || {}
  const line1 = [p.housenumber, p.street || (p.type === 'street' ? p.name : '')].filter(Boolean).join(' ').trim() || String(p.name || '').trim()
  return {
    id: String(p.id || p.label || ''),
    label: String(p.label || line1 || '').trim(),
    line1,
    postal_code: String(p.postcode || '').trim(),
    city: String(p.city || '').trim(),
    country: 'FR',
  }
}

/** Une saisie qui vaut une recherche : trois caractères, commençant par une lettre ou un chiffre. */
export const searchable = (query) => {
  const q = String(query || '').trim()
  return q.length >= 3 && /^[a-zA-Z0-9]/.test(q) ? q : ''
}
