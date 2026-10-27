/*
 * LE TON D'UN ETAT (Adion UI, 2026-10-13).
 *
 * Nexus dit l'etat d'une chose et, de plus en plus, son ton : `tone`,
 * `status_tone`, `severity`. Il le dit avec ses mots - success, warning,
 * danger, neutral - et les ecrans traduisaient chacun a sa facon. Ici, une
 * seule traduction vers les cinq tons du kit : ok, warn, bad, info, muted.
 *
 * Un ton inconnu devient `muted` : un mot gris vaut mieux qu'un vert trompeur.
 */
export const TONES = ['ok', 'warn', 'bad', 'info', 'accent', 'muted']

const MAP = {
  ok: 'ok', good: 'ok', success: 'ok', positive: 'ok', green: 'ok', valid: 'ok',
  warn: 'warn', action_required: 'warn', warning: 'warn', caution: 'warn', attention: 'warn', orange: 'warn', amber: 'warn',
  bad: 'bad', danger: 'bad', error: 'bad', critical: 'bad', negative: 'bad', red: 'bad', failed: 'bad',
  info: 'info', notice: 'info', blue: 'info',
  accent: 'accent', primary: 'accent', plan: 'accent',
  muted: 'muted', neutral: 'muted', default: 'muted', grey: 'muted', gray: 'muted', secondary: 'muted',
}

export function tone(value) {
  return MAP[String(value || '').trim().toLowerCase()] || 'muted'
}

/*
 * Le ton porte par un objet de Nexus, sous l'un des noms qu'il emploie.
 * `fallback` sert le temps que Nexus ne l'envoie pas encore.
 */
export function toneOf(item, fallback = 'muted') {
  if (!item || typeof item !== 'object') return tone(fallback)
  const raw = item.tone ?? item.status_tone ?? item.severity ?? item.level
  return raw ? tone(raw) : tone(fallback)
}

/* L'icone qui accompagne un ton, dans un encadre. */
export const TONE_ICON = {
  ok: 'mdi-check-circle-outline',
  warn: 'mdi-alert-outline',
  bad: 'mdi-alert-circle-outline',
  info: 'mdi-information-outline',
  accent: 'mdi-information-outline',
  muted: 'mdi-information-outline',
}
