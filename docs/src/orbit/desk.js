import { LIST } from './data.js'

/*
 * LES DONNEES DU POSTE DE TRAVAIL (essai, 2026-11-17) : fictives. Dans Orbit,
 * Nexus envoie la file, le fil de chaque client, ses proprietes et les gestes
 * permis sur chaque evenement ; l'ecran n'en invente aucun.
 */
export const KINDS = [
  { key: 'order', label: 'Commandes', icon: 'mdi-cart-outline' },
  { key: 'invoice', label: 'Factures', icon: 'mdi-receipt-text-outline' },
  { key: 'ticket', label: 'Tickets', icon: 'mdi-lifebuoy' },
  { key: 'note', label: 'Notes', icon: 'mdi-note-text-outline' },
  { key: 'service', label: 'Services', icon: 'mdi-server-outline' },
]
const ICONS = Object.fromEntries(KINDS.map((kind) => [kind.key, kind.icon]))
const event = (id, kind, day, at, who, tone, title, text, more = {}) => ({ id, kind, day, at, who, tone, title, text, icon: ICONS[kind], ...more })
const service = (label, value, tone = 'ok') => ({ label, value, tone })

export const customers = [
  {
    id: 'c1', name: 'Atelier Lumière', status: { label: 'Client actif', tone: 'ok' },
    queue: { sub: 'Commande bloquée, facture en retard', at: '09:14', tone: 'bad', icon: 'mdi-alert-circle-outline' },
    contact: 'Claire Dumas', mail: 'claire@atelier-lumiere.fr',
    facts: [
      { label: 'Contact', value: 'Claire Dumas' },
      { label: 'Téléphone', value: '05 61 00 00 42', copy: true },
      { label: 'Par mois', value: '110,10 €' },
      { label: 'Impayé', value: '64,50 €', tone: 'bad' },
      { label: 'Suivi par', value: 'Jean-Marc Vidal' },
    ],
    events: [
      event('e1', 'order', '', 'ce matin 09:14', 'Nexus', 'bad', 'Commande CMD-2026-1184', 'IP publique refusée : plus de bloc libre à Toulouse.', { pinned: true, state: { label: 'Bloquée', tone: 'bad' }, actions: [{ key: 'retry', label: 'Relancer la ligne', icon: 'mdi-refresh' }, { key: 'open', label: 'Ouvrir', icon: 'mdi-arrow-right', to: `${LIST}/o1` }] }),
      event('e2', 'invoice', '', 'depuis 12 jours', 'Nexus', 'bad', 'Facture F-2026-10-0412', '64,50 €, prélèvement rejeté le 5 nov.', { pinned: true, state: { label: 'En retard', tone: 'bad' }, actions: [{ key: 'remind', label: 'Relancer le client', icon: 'mdi-email-fast-outline' }, { key: 'invoice', label: 'Voir la facture', icon: 'mdi-receipt-text-outline' }] }),
      event('e3', 'ticket', '', 'hier 16:40', 'Claire Dumas', 'warn', 'Ticket « Renvoi d’appel du standard »', 'Le renvoi vers son mobile ne marche plus après 18 h.', { pinned: true, state: { label: 'Sans réponse', tone: 'warn' }, actions: [{ key: 'reply', label: 'Répondre', icon: 'mdi-reply-outline' }] }),
      event('e4', 'order', 'aujourd’hui', '09:12', 'Claire Dumas', 'accent', 'Commande CMD-2026-1184 passée', 'VPS B4, IP publique, sauvegarde 100 Go : 31,97 € par mois.'),
      event('e5', 'note', 'hier', '11:05', 'Jean-Marc Vidal', 'muted', 'Note de l’équipe', 'Appelée à 11 h : veut passer Lilou à 8 postes en janvier. La rappeler début décembre.'),
      event('e6', 'invoice', '6 nov.', '08:00', 'Nexus', 'warn', 'Relance envoyée', 'Facture F-2026-10-0412, première relance par courriel.'),
      event('e7', 'invoice', '5 nov.', '08:00', 'Nexus', 'ok', 'Facture F-2026-11-0398 payée', '125,09 € prélevés.', { state: { label: 'Payée', tone: 'ok' } }),
      event('e8', 'service', '2 nov.', '11:20', 'Jean-Marc Vidal', 'muted', 'Ligne mobile 100 Go suspendue', 'À la demande du client, jusqu’à nouvel ordre.'),
      event('e9', 'note', '14 mars 2025', '10:02', 'Nexus', 'ok', 'Client créé', 'Inscription depuis adioncloud.com.'),
    ],
    groups: [
      { key: 'contact', title: 'Contact', items: [{ label: 'Contact', value: 'Claire Dumas' }, { label: 'Courriel', value: 'claire@atelier-lumiere.fr', copy: true }, { label: 'Téléphone', value: '05 61 00 00 42', copy: true }, { label: 'Dernière visite', value: 'Aujourd’hui' }] },
      { key: 'billing', title: 'Facturation', items: [{ label: 'Paiement', value: 'Prélèvement SEPA' }, { label: 'Prochaine facture', value: '110,10 € le 5 déc.' }, { label: 'Impayé', value: '64,50 €', tone: 'bad' }, { label: 'Compte', value: 'Atelier Lumière SARL' }] },
      { key: 'services', title: 'Services', count: 6, items: [service('VPS B4', '17,99 €'), service('Lilou, 5 postes', '64,50 €'), service('Hébergement Pro', '14,99 €'), service('Messagerie, 6 boîtes', '12,00 €'), service('atelier-lumiere.fr', '0,62 €'), service('Ligne mobile 100 Go', 'Suspendue', 'muted')] },
      { key: 'members', title: 'Membres', count: 3, items: [{ label: 'Claire Dumas', value: 'Propriétaire' }, { label: 'Hugo Perrin', value: 'Technique' }, { label: 'Cabinet Roche', value: 'Comptabilité' }] },
      { key: 'legal', title: 'Informations légales', open: false, items: [{ label: 'Raison sociale', value: 'Atelier Lumière SARL' }, { label: 'SIRET', value: '812 345 678 00021', mono: true, copy: true }, { label: 'Adresse', value: '12 rue des Arts, 31000 Toulouse' }, { label: 'Client depuis', value: '14 mars 2025' }] },
    ],
  },
  {
    id: 'c2', name: 'Boulangerie Martin', status: { label: 'Client actif', tone: 'ok' },
    queue: { sub: 'Rendez-vous fibre à poser', at: '08:40', tone: 'warn', icon: 'mdi-calendar-clock-outline' },
    contact: 'Paul Martin', mail: 'paul@boulangerie-martin.fr',
    facts: [{ label: 'Contact', value: 'Paul Martin' }, { label: 'Téléphone', value: '05 61 00 00 17', copy: true }, { label: 'Par mois', value: '39,90 €' }, { label: 'Impayé', value: 'Aucun' }],
    events: [
      event('e1', 'order', '', 'ce matin 08:40', 'Nexus', 'warn', 'Commande CMD-2026-1183', 'Le technicien fibre attend une date.', { pinned: true, state: { label: 'Mise en service', tone: 'info' }, actions: [{ key: 'date', label: 'Noter le rendez-vous', icon: 'mdi-calendar-check-outline' }, { key: 'open', label: 'Ouvrir', icon: 'mdi-arrow-right', to: `${LIST}/o2` }] }),
      event('e2', 'order', 'aujourd’hui', '08:38', 'Paul Martin', 'accent', 'Commande CMD-2026-1183 passée', 'Ligne fibre 1 Gb/s : 39,90 € par mois.'),
      event('e3', 'note', '9 nov.', '15:30', 'Nexus', 'ok', 'Client créé', 'Inscription depuis adioncloud.com.'),
    ],
    groups: [
      { key: 'contact', title: 'Contact', items: [{ label: 'Contact', value: 'Paul Martin' }, { label: 'Courriel', value: 'paul@boulangerie-martin.fr', copy: true }, { label: 'Téléphone', value: '05 61 00 00 17', copy: true }] },
      { key: 'billing', title: 'Facturation', items: [{ label: 'Paiement', value: 'Carte bancaire' }, { label: 'Prochaine facture', value: '39,90 € le 9 déc.' }] },
      { key: 'services', title: 'Services', count: 1, items: [service('Ligne fibre 1 Gb/s', 'En cours', 'info')] },
      { key: 'legal', title: 'Informations légales', open: false, items: [{ label: 'Raison sociale', value: 'Boulangerie Martin' }, { label: 'Adresse', value: '3 place du Marché, 31300 Toulouse' }] },
    ],
  },
  {
    id: 'c3', name: 'Zéphyr Conseil', status: { label: 'Client actif', tone: 'ok' },
    queue: { sub: 'Paiement refusé', at: 'hier', tone: 'bad', icon: 'mdi-credit-card-off-outline' },
    contact: 'Inès Garnier', mail: 'ines@zephyr.io',
    facts: [{ label: 'Contact', value: 'Inès Garnier' }, { label: 'Téléphone', value: '05 61 00 00 88', copy: true }, { label: 'Par mois', value: '49,00 €' }, { label: 'Impayé', value: '22,48 €', tone: 'bad' }],
    events: [
      event('e1', 'order', '', 'hier 18:03', 'Nexus', 'bad', 'Commande CMD-2026-1182', 'Prélèvement refusé ; annulation dans 3 jours.', { pinned: true, state: { label: 'En attente de paiement', tone: 'warn' }, actions: [{ key: 'remind', label: 'Relancer le client', icon: 'mdi-email-fast-outline' }, { key: 'open', label: 'Ouvrir', icon: 'mdi-arrow-right', to: `${LIST}/o3` }] }),
      event('e2', 'order', '12 nov.', '14:20', 'Inès Garnier', 'ok', 'Commande CMD-2026-1175 livrée', 'Adion SMS, 1 000 crédits.', { state: { label: 'Livrée', tone: 'ok' } }),
    ],
    groups: [
      { key: 'contact', title: 'Contact', items: [{ label: 'Contact', value: 'Inès Garnier' }, { label: 'Courriel', value: 'ines@zephyr.io', copy: true }, { label: 'Téléphone', value: '05 61 00 00 88', copy: true }] },
      { key: 'billing', title: 'Facturation', items: [{ label: 'Paiement', value: 'Prélèvement SEPA' }, { label: 'Impayé', value: '22,48 €', tone: 'bad' }] },
      { key: 'services', title: 'Services', count: 1, items: [service('Adion SMS', '49,00 €')] },
    ],
  },
  {
    id: 'c4', name: 'Garage du Port', status: { label: 'Client actif', tone: 'ok' },
    queue: { sub: 'Ticket sans réponse', at: 'hier', tone: 'warn', icon: 'mdi-lifebuoy' },
    contact: 'Marc Leroy', mail: 'marc@garageduport.fr',
    facts: [{ label: 'Contact', value: 'Marc Leroy' }, { label: 'Téléphone', value: '05 61 00 00 23', copy: true }, { label: 'Par mois', value: '44,97 €' }, { label: 'Impayé', value: 'Aucun' }],
    events: [
      event('e1', 'ticket', '', 'hier 17:10', 'Marc Leroy', 'warn', 'Ticket « Carte SIM non reçue »', 'La troisième carte SIM n’est pas arrivée.', { pinned: true, state: { label: 'Sans réponse', tone: 'warn' }, actions: [{ key: 'reply', label: 'Répondre', icon: 'mdi-reply-outline' }] }),
      event('e2', 'order', 'hier', '15:22', 'Marc Leroy', 'ok', 'Commande CMD-2026-1181 livrée', '3 lignes mobiles 100 Go : 44,97 € par mois.', { state: { label: 'Livrée', tone: 'ok' } }),
    ],
    groups: [
      { key: 'contact', title: 'Contact', items: [{ label: 'Contact', value: 'Marc Leroy' }, { label: 'Courriel', value: 'marc@garageduport.fr', copy: true }, { label: 'Téléphone', value: '05 61 00 00 23', copy: true }] },
      { key: 'billing', title: 'Facturation', items: [{ label: 'Paiement', value: 'Carte bancaire' }, { label: 'Prochaine facture', value: '44,97 € le 16 déc.' }] },
      { key: 'services', title: 'Services', count: 3, items: [service('Ligne mobile 100 Go', '14,99 €'), service('Ligne mobile 100 Go', '14,99 €'), service('Ligne mobile 100 Go', '14,99 €')] },
    ],
  },
]
