/*
 * LE THEME D'UNE PAGE PUBLIQUE (Adion UI, coordination#49) : celui du
 * systeme par defaut, sauf si la personne a choisi (le petit bouton). Le
 * choix est garde sur ce poste, sous la meme cle que l'espace client.
 */
export const THEME_KEY = 'adion-theme'
export const THEMES = ['adionDark', 'adionLight']

export function pickTheme(stored, prefersDark) {
  if (THEMES.includes(stored)) return stored
  return prefersDark ? 'adionDark' : 'adionLight'
}

export function otherTheme(name) {
  return name === 'adionLight' ? 'adionDark' : 'adionLight'
}

export function readTheme(win = typeof window !== 'undefined' ? window : null) {
  let stored = null
  try { stored = win?.localStorage?.getItem(THEME_KEY) } catch (_e) { /* stockage absent */ }
  const dark = typeof win?.matchMedia === 'function' ? win.matchMedia('(prefers-color-scheme: dark)').matches : true
  return pickTheme(stored, dark)
}

export function rememberTheme(name, win = typeof window !== 'undefined' ? window : null) {
  try { win?.localStorage?.setItem(THEME_KEY, name) } catch (_e) { /* stockage absent */ }
}
