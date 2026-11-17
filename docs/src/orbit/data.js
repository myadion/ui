/*
 * LES DONNEES DE L'ESSAI ORBIT (2026-11-17) : fictives. Dans Orbit, tout
 * ceci vient de Nexus : les listes, les etats, les libelles, les gestes permis.
 */
export const LIST = '/exemple-orbit-outil'

export const menu = [
  { title: 'Au quotidien', open: true, items: [
    { label: 'Clients à traiter', icon: 'mdi-inbox-arrow-down-outline', count: 4, to: '/exemple-orbit-poste', hint: 'Les clients qui attendent l’équipe, à traiter à la chaîne.' },
    { label: 'Tickets support', icon: 'mdi-lifebuoy', count: 7, hint: 'Les demandes des clients, reçues par Zammad.' },
    { label: 'Commandes', icon: 'mdi-cart-outline', count: 3, active: true, to: LIST, hint: 'Les commandes de tous les clients : celles qui attendent l’équipe d’abord.' },
    { label: 'Interventions manuelles', icon: 'mdi-hand-back-right-outline', count: 2, hint: 'Suspendre, supprimer ou rétablir chez un fournisseur ce que Nexus ne fait pas seul.' },
    { label: 'Équipe IA', icon: 'mdi-robot-happy-outline', count: 4, hint: 'Les agents IA d’Adion : ce qu’ils attendent de vous.' },
    { label: 'Demandes de transfert', icon: 'mdi-swap-horizontal', hint: 'Déplacer un service vers un autre projet ou un autre compte.' },
  ] },
  { title: 'Clients', open: true, items: [
    { label: 'Organisations', icon: 'mdi-domain', to: '/exemple-orbit-organisation', hint: 'Les sociétés clientes, leurs membres et leurs projets.' },
    { label: 'Projets', icon: 'mdi-briefcase-outline', hint: 'Les espaces d’un client : ses services et ses abonnements.' },
    { label: 'Utilisateurs', icon: 'mdi-account-group', to: '/exemple-orbit-utilisateur', hint: 'Les comptes de connexion, des clients comme de l’équipe.' },
    { label: 'Campagnes', icon: 'mdi-email-fast-outline', hint: 'Écrire à un groupe de clients, par courriel ou par SMS.' },
  ] },
  { title: 'Facturation', items: [] },
  { title: 'Catalogue', items: [] },
  { title: 'Technique', items: [] },
  { title: 'Administration', items: [] },
]

export const STATES = {
  awaiting_payment: { label: 'En attente de paiement', tone: 'warn' },
  provisioning: { label: 'Mise en service', tone: 'info' },
  blocked: { label: 'Bloquée', tone: 'bad' },
  delivered: { label: 'Livrée', tone: 'ok' },
  cancelled: { label: 'Annulée', tone: 'muted' },
}
export const LINE_STATES = {
  done: { label: 'Livrée', tone: 'ok' },
  running: { label: 'En cours', tone: 'info' },
  blocked: { label: 'Bloquée', tone: 'bad' },
  waiting: { label: 'En attente', tone: 'warn' },
  cancelled: { label: 'Annulée', tone: 'muted' },
}

const line = (name, offer, price, state, note = '') => ({ id: name, name, offer, price, state, note })

export const orders = [
  { id: 'o1', number: 'CMD-2026-1184', customer: 'Atelier Lumière', who: 'Claire Dumas', project: 'Production', account: 'Atelier Lumière SARL', payment: 'Prélèvement SEPA', seller: 'Jean-Marc Vidal', total: 31.97, state: 'blocked', at: 'aujourd’hui 09:12', team: true,
    todo: { title: 'Une ligne est bloquée', text: 'Le fournisseur a refusé l’IP publique : plus de bloc libre à Toulouse. Libérez un bloc, puis relancez la ligne.', action: 'Relancer la ligne', icon: 'mdi-refresh' },
    lines: [line('VPS B4', 'VPS · 4 vCPU, 8 Go', 17.99, 'done'), line('IP publique', 'IP additionnelle IPv4', 2.99, 'blocked', 'Plus de bloc libre à Toulouse'), line('Sauvegarde 100 Go', 'Option du VPS', 10.99, 'waiting', 'Attend l’IP')] },
  { id: 'o2', number: 'CMD-2026-1183', customer: 'Boulangerie Martin', who: 'Paul Martin', project: 'Boutique', account: 'Boulangerie Martin', payment: 'Carte bancaire', seller: 'Aucun', total: 39.9, state: 'provisioning', at: 'aujourd’hui 08:40', team: true,
    todo: { title: 'Un rendez-vous est à poser', text: 'Le technicien fibre attend une date. Appelez le client, puis notez le rendez-vous.', action: 'Noter le rendez-vous', icon: 'mdi-calendar-check-outline' },
    lines: [line('Ligne fibre 1 Gb/s', 'Accès FTTH', 39.9, 'running', 'Rendez-vous technicien à poser')] },
  { id: 'o3', number: 'CMD-2026-1182', customer: 'Zéphyr Conseil', who: 'Inès Garnier', project: 'Site vitrine', account: 'Zéphyr Conseil SAS', payment: 'Prélèvement SEPA', seller: 'Jean-Marc Vidal', total: 22.48, state: 'awaiting_payment', at: 'hier 18:03', team: true,
    todo: { title: 'Le paiement a été refusé', text: 'La banque a refusé le prélèvement. Une relance est partie hier ; sans réponse sous 3 jours, la commande s’annule seule.', action: 'Relancer le client', icon: 'mdi-email-fast-outline' },
    lines: [line('Hébergement Pro', 'Hébergement web', 14.99, 'waiting', 'Attend le paiement'), line('zephyr.io', 'Nom de domaine, 1 an', 7.49, 'waiting', 'Attend le paiement')] },
  { id: 'o4', number: 'CMD-2026-1181', customer: 'Garage du Port', who: 'Marc Leroy', project: 'Atelier', account: 'Garage du Port', payment: 'Carte bancaire', seller: 'Aucun', total: 44.97, state: 'delivered', at: 'hier 15:22',
    lines: [line('Ligne mobile 100 Go', 'Forfait mobile', 14.99, 'done'), line('Ligne mobile 100 Go', 'Forfait mobile', 14.99, 'done'), line('Ligne mobile 100 Go', 'Forfait mobile', 14.99, 'done')] },
  { id: 'o5', number: 'CMD-2026-1180', customer: 'Atelier Lumière', who: 'Claire Dumas', project: 'Production', account: 'Atelier Lumière SARL', payment: 'Prélèvement SEPA', seller: 'Jean-Marc Vidal', total: 64.5, state: 'delivered', at: '15 nov. 11:05', lines: [line('Lilou, 5 postes', 'Standard téléphonique', 64.5, 'done')] },
  { id: 'o6', number: 'CMD-2026-1179', customer: 'Cabinet Roche', who: 'Hélène Roche', project: 'Cabinet', account: 'Cabinet Roche', payment: 'Carte bancaire', seller: 'Aucun', total: 16, state: 'cancelled', at: '14 nov. 17:48', lines: [line('Messagerie, 8 boîtes', 'Messagerie', 16, 'cancelled', 'Annulée par le client')] },
  { id: 'o7', number: 'CMD-2026-1178', customer: 'Studio Nord', who: 'Yanis Benali', project: 'Rendu 3D', account: 'Studio Nord', payment: 'Carte bancaire', seller: 'Aucun', total: 0, state: 'delivered', at: '14 nov. 10:30', lines: [line('Public Cloud', 'Projet, facturé à l’usage', 0, 'done')] },
  { id: 'o8', number: 'CMD-2026-1177', customer: 'Pharmacie des Halles', who: 'Sophie Blanc', project: 'Officine', account: 'Pharmacie des Halles', payment: 'Prélèvement SEPA', seller: 'Jean-Marc Vidal', total: 28, state: 'delivered', at: '13 nov. 16:12', lines: [line('Trunk SIP, 4 canaux', 'Téléphonie', 28, 'done')] },
  { id: 'o9', number: 'CMD-2026-1176', customer: 'Menuiserie Vidal', who: 'Luc Vidal', project: 'Site', account: 'Menuiserie Vidal', payment: 'Carte bancaire', seller: 'Aucun', total: 5.99, state: 'delivered', at: '13 nov. 09:47', lines: [line('Hébergement Starter', 'Hébergement web', 5.99, 'done')] },
  { id: 'o10', number: 'CMD-2026-1175', customer: 'Zéphyr Conseil', who: 'Inès Garnier', project: 'Site vitrine', account: 'Zéphyr Conseil SAS', payment: 'Prélèvement SEPA', seller: 'Jean-Marc Vidal', total: 49, state: 'delivered', at: '12 nov. 14:20', lines: [line('Adion SMS, 1 000 crédits', 'SMS', 49, 'done')] },
]

export const euros = (v) => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
