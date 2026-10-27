/*
 * Les donnees d'exemple de la doc. Dans une application, elles viennent de
 * Nexus ; ici, rien ne part vers un serveur.
 */
export const productLinks = [
  { key: 'documentation', label: 'Documentation', href: 'https://docs.myadion.com' },
  { key: 'offers', label: 'Offres', href: 'https://myadion.com' },
  { key: 'terms', label: 'Conditions', href: 'https://myadion.com' },
]

export const demoServices = [
  { id: 'd1', name: 'atelier-lumiere.fr', subscription: { status: 'active', offer: { public_label: 'Hébergement Pro' }, renews_at: '2026-12-04' }, account_service: { project_name: 'Atelier' } },
  { id: 'd2', name: 'boutique-nord.fr', customer_description: 'Boutique en ligne', subscription: { status: 'active', offer: { public_label: 'WordPress' }, renews_at: '2027-01-18' }, account_service: { project_name: 'Atelier' } },
  { id: 'd3', name: 'vieux-site.fr', subscription: { status: 'suspended', offer: { public_label: 'Hébergement Essentiel' } }, account_service: { project_name: 'Archives' } },
]

// Ce que Nexus envoie sur un service (coordination#54).
export const sampleActions = [
  { key: 'purge', label: 'Vider le cache', icon: 'mdi-broom' },
  { key: 'migrate', label: 'Migrer le service', icon: 'mdi-folder-swap-outline', available: false, reason: 'Un seul projet dans cette organisation.' },
  { key: 'change-offer', label: 'Changer d’offre', icon: 'mdi-swap-horizontal' },
  { key: 'terminate', label: 'Résilier', icon: 'mdi-close-circle-outline', danger: true },
]

export const demoNotifications = [
  { id: 'n1', severity: 'warning', title: 'Moyen de paiement manquant', message: 'Aucun moyen de paiement sur Compte principal. Ajoutez-en un pour que vos factures soient réglées automatiquement.', at: new Date(Date.now() - 3600e3).toISOString(), action: { label: 'Ajouter un moyen de paiement', to: '/billing' } },
  { id: 'n2', severity: 'critical', title: 'Facture en retard', message: 'Une facture de 24,00 € est en retard sur Compte principal.', at: new Date(Date.now() - 26 * 3600e3).toISOString(), action: { label: 'Voir les factures', to: '/billing' } },
  { id: 'n3', severity: 'info', title: 'Maintenance programmée', message: 'Les hébergements web redémarrent cette nuit entre 2 h et 3 h.', at: new Date(Date.now() - 3 * 86400e3).toISOString(), read: true },
]

export const assistantThread = {
  messages: [
    { id: 'm1', role: 'user', text: 'Quels sont mes domaines ?', actions: [], tools: [] },
    { id: 'm2', role: 'assistant', text: 'Vous avez **2 domaines** :\n- atelier-lumiere.fr, renouvelé le 4 décembre\n- boutique-nord.fr\n\nVoir la [liste des domaines](/domains).', actions: [], tools: [{ title: 'Lecture de vos domaines…', status: 'done' }] },
    { id: 'm3', role: 'user', text: 'Supprime boutique-nord.fr', actions: [], tools: [] },
    { id: 'm4', role: 'assistant', text: 'Je prépare la suppression, à confirmer ci-dessous.', actions: [{ id: 'a0', status: 'executed', title: 'Enregistrement TXT ajouté' }], tools: [] },
  ],
  pending: [{ id: 'a1', title: 'Supprimer le domaine boutique-nord.fr', question: 'Confirmer cette suppression ? Elle est définitive.', kind: 'delete', danger: true, args: { domain: 'boutique-nord.fr' }, method: 'DELETE', path: '/domain/dom_AbCdEf123456' }],
  limit: null, error: '', status: 'awaiting_confirmation', streaming: false,
}
export const assistantLimited = { messages: assistantThread.messages.slice(0, 2), pending: [], limit: { kind: 'conversation_max_messages', message: 'Cette conversation est arrivée à sa longueur maximale.', resetsAt: null }, error: '', status: 'limit', streaming: false }

export const chartLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')} h`)
export const chartSeries = [
  { key: 'sent', label: 'Envoyés', points: chartLabels.map((_, i) => Math.round(40 + 30 * Math.sin(i / 4) + i)) },
  { key: 'opened', label: 'Ouverts', points: chartLabels.map((_, i) => Math.round(18 + 12 * Math.sin(i / 3 + 1))) },
  { key: 'clicked', label: 'Clics', points: chartLabels.map((_, i) => Math.round(6 + 4 * Math.sin(i / 5))) },
]

export const scopes = [
  { value: 'sms.send', label: 'Envoyer des SMS', description: 'Envoyer depuis votre logiciel, au nom du service choisi.' },
  { value: 'sms.read', label: 'Lire l’historique', description: 'Lire les SMS envoyés et leur état de remise.' },
  { value: 'billing.read', label: 'Lire la facturation', description: 'Consulter factures et moyens de paiement.' },
]

export const steps = [
  { key: 'nom', label: 'Le nom' },
  { key: 'type', label: 'Le type' },
  { key: 'droits', label: 'Les droits' },
  { key: 'projets', label: 'Les projets' },
]

export const timeline = [
  { id: 1, title: 'Clé « site de réservation » créée', text: 'Par Kévin, depuis l’espace client.', at: 'aujourd’hui à 10:42', tone: 'ok' },
  { id: 2, title: 'Appel refusé : droit manquant', text: 'sms.send demandé, non accordé à cette application.', at: 'hier à 18:03', tone: 'bad' },
  { id: 3, title: 'Application enregistrée', at: '2 octobre 2026', tone: 'accent' },
]

/*
 * Un rendu minuscule de courriel. Dans l'espace, le HTML vient de Nexus
 * (MailBlockRenderer) ; ici, il pose les memes reperes pour voir le canevas vivre.
 */
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
function block(b, attrs) {
  const field = (tag, style, text) => `<${tag} data-mail-field="text" style="${style}">${esc(text)}</${tag}>`
  const inner = {
    badge: () => field('p', 'margin:0;font-size:11px;letter-spacing:.1em;text-transform:uppercase', b.text),
    heading: () => field('h2', `margin:0;font-size:${b.level === 2 ? 18 : 24}px`, b.text),
    text: () => field('p', 'margin:0;line-height:1.6', b.text),
    button: () => `<a style="display:inline-block;padding:10px 18px;border-radius:6px;background:#15803d;color:#fff;text-decoration:none" data-mail-field="label">${esc(b.label)}</a>`,
  }[b.type]
  return `<tr ${attrs}><td style="padding:8px 0">${inner ? inner() : esc(b.text || b.type)}</td></tr>`
}
export function renderMail(doc, scheme = 'light') {
  const rows = doc.blocks.map((b, i) => {
    if (b.type !== 'columns') return block(b, `data-mail-zone="body" data-mail-block="${i}"`)
    const cells = (b.columns || []).map((col, c) => `<td valign="top" style="padding:0 8px" data-mail-zone="body" data-mail-columns="${i}" data-mail-column-box="${c}"><table width="100%">${(col.blocks || []).map((child, k) => block(child, `data-mail-zone="body" data-mail-block="${i}" data-mail-column="${c}" data-mail-child="${k}"`)).join('')}</table></td>`).join('')
    return `<tr data-mail-zone="body" data-mail-block="${i}"><td><table width="100%"><tr>${cells}</tr></table></td></tr>`
  }).join('')
  const dark = scheme === 'dark'
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:${dark ? '#1c1c1f' : '#fff'};color:${dark ? '#ececec' : '#1b1b1b'};font-family:Helvetica,Arial,sans-serif"><table width="100%" style="max-width:600px;margin:0 auto">${rows}<tr data-mail-zone="footer" data-mail-block="0"><td style="padding:16px 0;font-size:12px;opacity:.7">Boulangerie Martin - 3 rue du Four, Paris</td></tr></table></body></html>`
}
export const mailDocument = () => ({
  subject: 'Nos nouvelles du mois',
  blocks: [
    { type: 'badge', text: 'Octobre' },
    { type: 'heading', level: 1, text: 'Bonjour Camille,' },
    { type: 'text', text: 'Trois nouveautés en boutique, et un conseil pour l’hiver.' },
    { type: 'columns', ratio: '50-50', columns: [{ blocks: [{ type: 'heading', level: 2, text: 'Le pain du mois' }] }, { blocks: [{ type: 'text', text: 'Au levain, cuit au feu de bois.' }] }] },
    { type: 'button', label: 'Voir la boutique', url: 'https://myadion.com' },
  ],
})
export const mailEditor = {
  fonts: [{ key: 'helvetica', label: 'Helvetica', web: false }, { key: 'playfair', label: 'Playfair Display', web: true }],
  font_web_hint: 'Police web : Gmail et Outlook montrent la police de repli.',
  weights: [{ value: 400, label: 'Normal' }, { value: 700, label: 'Gras' }],
  transforms: [{ value: 'none', label: 'Aucune' }, { value: 'uppercase', label: 'MAJUSCULES' }],
  shapes: [{ value: 'square', label: 'Carré' }, { value: 'pill', label: 'Pilule' }],
  button_sizes: [{ value: 'sm', label: 'Petit' }, { value: 'md', label: 'Moyen' }, { value: 'lg', label: 'Grand' }],
  border_styles: [{ value: 'solid', label: 'Plein' }, { value: 'dashed', label: 'Tirets' }],
}
