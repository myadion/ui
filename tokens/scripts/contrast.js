/*
 * LES CONTRASTES DES JETONS (Adion UI, 2026-10-13).
 *
 * Lit les couleurs d'un theme dans tokens.css, compose les teintes
 * translucides sur leur surface, et calcule le rapport de contraste WCAG.
 * Sert au garde-fou (contrast.test.js) et a la doc /ui, qui affiche les
 * chiffres. Aucun appel au navigateur : du texte CSS en entree.
 */

/* Les couples verifies : [texte, surface, seuil, ce que c'est]. */
export const PAIRS = [
  ['--adion-text-1', '--adion-bg-0', 4.5, 'Texte principal sur la page'],
  ['--adion-text-2', '--adion-bg-0', 4.5, 'Texte secondaire sur la page'],
  ['--adion-text-3', '--adion-bg-0', 4.5, 'Méta-informations sur la page'],
  ['--adion-text-1', '--adion-surface', 4.5, 'Texte principal sur une carte'],
  ['--adion-text-2', '--adion-surface', 4.5, 'Texte secondaire sur une carte'],
  ['--adion-text-3', '--adion-surface', 4.5, 'Méta-informations sur une carte'],
  ['--adion-text-2', '--adion-field-bg', 4.5, 'Texte secondaire dans un champ'],
  ['--adion-text-2', '--adion-nav-bg', 4.5, 'Texte secondaire dans la barre latérale'],
  ['--adion-accent-text', '--adion-bg-0', 4.5, 'Accent (lien, onglet actif) sur la page'],
  ['--adion-accent-text', '--adion-accent-soft', 4.5, 'Élément actif sur son fond'],
  ['--adion-on-primary', '--adion-primary', 4.5, 'Action principale'],
  ['--adion-ok', '--adion-bg-0', 4.5, 'Ton « ok » sur la page'],
  ['--adion-warn', '--adion-bg-0', 4.5, 'Ton « alerte » sur la page'],
  ['--adion-bad', '--adion-bg-0', 4.5, 'Ton « erreur » sur la page'],
  ['--adion-info', '--adion-bg-0', 4.5, 'Ton « info » sur la page'],
  ['--adion-ok', '--adion-ok-soft', 4.5, 'Ton « ok » sur son encadré'],
  ['--adion-warn', '--adion-warn-soft', 4.5, 'Ton « alerte » sur son encadré'],
  ['--adion-bad', '--adion-bad-soft', 4.5, 'Ton « erreur » sur son encadré'],
  ['--adion-focus', '--adion-bg-0', 3, 'Anneau de focus (élément graphique)'],
  ['--adion-family-web', '--adion-family-web-soft', 4.5, 'Famille « web » sur son fond'],
  ['--adion-family-telecom', '--adion-family-telecom-soft', 4.5, 'Famille « telecom » sur son fond'],
  ['--adion-family-payment', '--adion-family-payment-soft', 4.5, 'Famille « payment » sur son fond'],
  ['--adion-family-marketing', '--adion-family-marketing-soft', 4.5, 'Famille « marketing » sur son fond'],
  ['--adion-family-cloud', '--adion-family-cloud-soft', 4.5, 'Famille « cloud » sur son fond'],
  ['--adion-family-ai', '--adion-family-ai-soft', 4.5, 'Famille « ai » sur son fond'],
  ['--adion-family-brand', '--adion-family-brand-soft', 4.5, 'Famille « marque » sur son fond'],
  ['--adion-chart-1', '--adion-surface', 3, 'Série 1 d’un graphique sur une carte'],
  ['--adion-chart-2', '--adion-surface', 3, 'Série 2 d’un graphique sur une carte'],
  ['--adion-chart-3', '--adion-surface', 3, 'Série 3 d’un graphique sur une carte'],
  ['--adion-chart-4', '--adion-surface', 3, 'Série 4 d’un graphique sur une carte'],
  ['--adion-chart-5', '--adion-surface', 3, 'Série 5 d’un graphique sur une carte'],
  ['--adion-text-1', '--adion-tint-brand', 4.5, 'Texte principal sur le dégradé « brand »'],
  ['--adion-text-2', '--adion-tint-brand', 4.5, 'Texte secondaire sur le dégradé « brand »'],
  ['--adion-text-3', '--adion-tint-brand', 4.5, 'Texte méta sur le dégradé « brand »'],
  ['--adion-text-1', '--adion-tint-web', 4.5, 'Texte principal sur le dégradé « web »'],
  ['--adion-text-2', '--adion-tint-web', 4.5, 'Texte secondaire sur le dégradé « web »'],
  ['--adion-text-3', '--adion-tint-web', 4.5, 'Texte méta sur le dégradé « web »'],
  ['--adion-text-1', '--adion-tint-telecom', 4.5, 'Texte principal sur le dégradé « telecom »'],
  ['--adion-text-2', '--adion-tint-telecom', 4.5, 'Texte secondaire sur le dégradé « telecom »'],
  ['--adion-text-3', '--adion-tint-telecom', 4.5, 'Texte méta sur le dégradé « telecom »'],
  ['--adion-text-1', '--adion-tint-payment', 4.5, 'Texte principal sur le dégradé « payment »'],
  ['--adion-text-2', '--adion-tint-payment', 4.5, 'Texte secondaire sur le dégradé « payment »'],
  ['--adion-text-3', '--adion-tint-payment', 4.5, 'Texte méta sur le dégradé « payment »'],
  ['--adion-text-1', '--adion-tint-marketing', 4.5, 'Texte principal sur le dégradé « marketing »'],
  ['--adion-text-2', '--adion-tint-marketing', 4.5, 'Texte secondaire sur le dégradé « marketing »'],
  ['--adion-text-3', '--adion-tint-marketing', 4.5, 'Texte méta sur le dégradé « marketing »'],
  ['--adion-text-1', '--adion-tint-cloud', 4.5, 'Texte principal sur le dégradé « cloud »'],
  ['--adion-text-2', '--adion-tint-cloud', 4.5, 'Texte secondaire sur le dégradé « cloud »'],
  ['--adion-text-3', '--adion-tint-cloud', 4.5, 'Texte méta sur le dégradé « cloud »'],
  ['--adion-text-1', '--adion-tint-ai', 4.5, 'Texte principal sur le dégradé « ai »'],
  ['--adion-text-2', '--adion-tint-ai', 4.5, 'Texte secondaire sur le dégradé « ai »'],
  ['--adion-text-3', '--adion-tint-ai', 4.5, 'Texte méta sur le dégradé « ai »'],
  ['--adion-text-3', '--adion-tint-brand-to', 4.5, 'Méta-informations sur la fin du dégradé de la marque'],
  ['--adion-border-strong', '--adion-bg-0', 1.5, 'Bordure d’un champ'],
]

/* Les variables d'un bloc de tokens.css, par son selecteur (« :root, html[data-theme='dark'] »…). */
export function readTheme(css, selectorStart) {
  const vars = {}
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  for (const [, selector, body] of blocks) {
    if (!selector.includes(selectorStart)) continue
    for (const m of body.matchAll(/(--adion-[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim()
  }
  return vars
}

export function parseColor(value) {
  const v = String(value || '').trim()
  let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (m) {
    const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }
  }
  m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i)
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
  return null
}

/* Une valeur, ses var() et ses color-mix(… X%, transparent) resolus. */
export function resolve(vars, name, depth = 0) {
  if (depth > 8) return null
  const raw = vars[name]
  if (!raw) return null
  const ref = raw.match(/^var\((--[\w-]+)\)$/)
  if (ref) return resolve(vars, ref[1], depth + 1)
  const mix = raw.match(/^color-mix\(in srgb,\s*var\((--[\w-]+)\)\s+([\d.]+)%,\s*transparent\)$/)
  if (mix) {
    const base = resolve(vars, mix[1], depth + 1)
    return base ? { ...base, a: base.a * (+mix[2] / 100) } : null
  }
  return parseColor(raw)
}

export const over = (top, bottom) => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
})

const channel = (c) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
export const luminance = (c) => 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b)
export function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/* Les rapports d'un theme : chaque surface est d'abord posee sur la page. */
export function themeReport(vars) {
  const page = resolve(vars, '--adion-bg-0')
  return PAIRS.map(([fg, bg, min, label]) => {
    const back = resolve(vars, bg)
    const front = resolve(vars, fg)
    if (!page || !back || !front) return { fg, bg, min, label, value: null, ok: false }
    const surface = bg === '--adion-bg-0' ? page : over(back, page)
    const value = ratio(over(front, surface), surface)
    return { fg, bg, min, label, value: Math.round(value * 100) / 100, ok: value >= min }
  })
}

/* Les jetons d'un theme : ceux de :root, puis ceux du theme clair par-dessus. */
export function themeVars(css, theme = 'dark') {
  const vars = readTheme(css, ':root')
  return theme === 'light' ? { ...vars, ...readTheme(css, "html[data-theme='light']") } : vars
}
