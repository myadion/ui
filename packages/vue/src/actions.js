/*
 * LE MENU D'ACTIONS D'UNE FICHE (Adion UI). L'API envoie sur
 * chaque service `actions` : [{ key, label, available, reason, danger }]. Le
 * kit ne decide de rien : il affiche la liste telle quelle, les actions
 * indisponibles grisees avec leur raison, et rejette en bas, apres un
 * separateur, ce qui detruit (`danger`).
 */
/** L'icone de chaque action, par `key` : de la presentation, donc ici. Une `key` inconnue recoit une icone neutre, la liste reste alignee. */
export const ACTION_ICONS = {
  refresh: 'mdi-refresh',
  rename: 'mdi-pencil-outline',
  create_link: 'mdi-link-variant',
  send_sms: 'mdi-message-text-outline',
  new_campaign: 'mdi-bullhorn-outline',
  new_template: 'mdi-file-document-edit-outline',
  deploy: 'mdi-rocket-launch-outline',
  open_files: 'mdi-folder-outline',
  edit_dns: 'mdi-lan',
  transfer: 'mdi-swap-horizontal',
  change_offer: 'mdi-swap-vertical',
  terminate: 'mdi-close-circle-outline',
  cancel_termination: 'mdi-undo-variant',
}
export const DEFAULT_ACTION_ICON = 'mdi-circle-small'
export function actionIcon(key) { return ACTION_ICONS[key] || DEFAULT_ACTION_ICON }

/** Actualiser : une action du kit, premiere du menu, sans appel a l'API. */
export const REFRESH_ACTION = { key: 'refresh', label: 'Actualiser', group: 'kit', available: true, danger: false, confirm: null }

export function menuGroups(actions) {
  const items = (Array.isArray(actions) ? actions : [])
    .filter((a) => a && a.key && a.label)
    .map((a) => ({ ...a, icon: a.icon || actionIcon(a.key), available: a.available !== false, danger: Boolean(a.danger) }))
  return { normal: items.filter((a) => !a.danger), danger: items.filter((a) => a.danger) }
}

/** Les actions que l'ecran sait faire : une `key` inconnue n'est pas affichee (le contrat de l'API). */
export function handledActions(actions, keys) {
  const known = new Set(keys)
  return (Array.isArray(actions) ? actions : []).filter((a) => a && known.has(a.key))
}

/** La liste a plat, avec `sep` : un separateur avant l'entree quand le groupe change (rapides, puis cycle de vie, puis le danger). */
export function menuItems(actions) {
  const { normal, danger } = menuGroups(actions)
  const items = [...normal, ...danger]
  return items.map((item, index) => {
    const before = items[index - 1]
    return { ...item, sep: Boolean(before) && (item.danger !== before.danger || (item.group || '') !== (before.group || '')) }
  })
}

/** Les gestes que le kit fait lui-meme sur toutes les fiches. */
export const COMMON_ACTIONS = ['refresh', 'rename', 'terminate', 'cancel_termination', 'transfer', 'change_offer']
