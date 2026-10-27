/**
 * Une ligne de tableau qui s'ouvre au clic.
 *
 * Le bouton « Ouvrir » reste a droite : c'est lui qui annonce ce que fait la
 * ligne, et c'est par lui qu'on y accede au clavier. Rendre la ligne entiere
 * cliquable ne le remplace pas, ca evite juste d'avoir a viser.
 *
 * Restent deux gestes qu'un clic sur la ligne ne doit surtout pas confisquer :
 * cliquer sur une commande de la ligne - « Renommer », un lien, une case - et
 * selectionner du texte. Le premier se reconnait a la cible, le second au fait
 * qu'une selection est ouverte quand le bouton se releve.
 */
const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"], .v-btn, .v-input'

export function rowActivates(event) {
  if (event.target?.closest?.(INTERACTIVE)) return false

  const selection = window.getSelection?.()

  return !(selection && !selection.isCollapsed)
}
