/*
 * LES REGLES DES GABARITS (Adion UI), sans Vue, pour qu'elles se testent.
 */

/* Ce qui ouvre une fiche, ce qui la ferme. */
export const FIRST_TABS = ['ensemble', 'overview', 'apercu', 'vue']
export const LAST_TABS = ['reglages', 'settings', 'configuration', 'resiliation', 'termination', 'suppression']

/*
 * L'ordre des onglets d'une fiche : « Vue d'ensemble » en premier, puis
 * l'ordre du produit, puis les reglages, puis la resiliation. Un ecran qui
 * les declare dans le desordre les retrouve ranges.
 */
export function orderTabs(tabs = []) {
  const rank = (tab) => {
    const id = String(tab?.id || '').toLowerCase()
    if (FIRST_TABS.includes(id)) return 0
    const last = LAST_TABS.indexOf(id)
    return last === -1 ? 1 : 2 + last
  }
  return tabs
    .map((tab, index) => ({ tab, index }))
    .sort((a, b) => rank(a.tab) - rank(b.tab) || a.index - b.index)
    .map(({ tab }) => tab)
}

/* Les etapes d'un assistant : ou l'on en est, en pourcentage. */
export function wizardProgress(steps = [], current = '') {
  const index = steps.findIndex((s) => s.key === current)
  if (index < 0 || !steps.length) return 0
  return Math.round(((index + 1) / steps.length) * 100)
}

/*
 * LE FIL D'ARIANE D'UNE FICHE s'arrete a la liste
 * (« Telecom › SMS › SMS » repetait le titre). Le dernier maillon sans lien,
 * c'est la page elle-meme : le titre le dit deja.
 */
export function crumbTrail(crumbs = []) {
  return crumbs.filter((crumb, index) => index < crumbs.length - 1 || crumb?.to)
}

/** Le degrade d'une famille, d'apres le nom que la page lui donne (« Web », « Télécom »…) ; la marque a defaut. */
export function gradientOf(label) {
  const key = String(label || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const map = { web: 'web', telecom: 'telecom', paiement: 'payment', payment: 'payment', marketing: 'marketing', cloud: 'cloud', ia: 'ai', ai: 'ai', plateforme: 'cloud' }
  return map[key] || 'brand'
}
