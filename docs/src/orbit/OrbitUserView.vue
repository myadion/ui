<script setup>
import { ref } from 'vue'
import { UiActionMenu, UiActivityFeed, UiBadge, UiButton, UiComposer, UiPropertyGrid, UiRecordHeader, UiTable, UiTabs, UiWorkbench } from '@myadion/ui'
import OrbitShell from './OrbitShell.vue'

/*
 * LA FICHE D'UN UTILISATEUR (essai, 2026-11-17) : une personne et son compte
 * de connexion. Meme plan que l'organisation : l'en-tete, le fil, les
 * proprietes. Ce qui lui est propre : la securite du compte, ses sessions
 * ouvertes, les organisations dont elle est membre (chacune mene a sa fiche).
 * Donnees fictives : tout vient de Nexus.
 */
const ORG = '/exemple-orbit-organisation'
const tab = ref('fil')
const filter = ref('')
const text = ref('')

const facts = [
  { label: 'Courriel', value: 'claire@atelier-lumiere.fr', copy: true },
  { label: 'Téléphone', value: '06 12 00 00 42', copy: true },
  { label: 'Double authentification', value: 'Activée', tone: 'ok' },
  { label: 'Dernière visite', value: 'Aujourd’hui 09:10' },
]
const KINDS = [
  { key: 'login', label: 'Connexions', icon: 'mdi-login-variant' },
  { key: 'security', label: 'Sécurité', icon: 'mdi-shield-key-outline' },
  { key: 'ticket', label: 'Tickets', icon: 'mdi-lifebuoy' },
  { key: 'note', label: 'Notes', icon: 'mdi-note-text-outline' },
]
const ICONS = Object.fromEntries(KINDS.map((kind) => [kind.key, kind.icon]))
const event = (id, kind, day, at, who, tone, title, text, more = {}) => ({ id, kind, day, at, who, tone, title, text, icon: ICONS[kind], ...more })
const events = [
  event('e1', 'ticket', '', 'hier 16:40', 'Claire Dumas', 'warn', 'Ticket « Renvoi d’appel du standard »', 'Le renvoi vers son mobile ne marche plus après 18 h.', { pinned: true, state: { label: 'Sans réponse', tone: 'warn' }, actions: [{ key: 'reply', label: 'Répondre', icon: 'mdi-reply-outline' }] }),
  event('e2', 'login', 'aujourd’hui', '09:10', '', 'ok', 'Connexion', 'Chrome sur Windows, depuis Toulouse.'),
  event('e3', 'security', '12 nov.', '14:02', '', 'warn', 'Mot de passe changé', 'Depuis son espace client.'),
  event('e4', 'login', '12 nov.', '13:58', '', 'bad', '3 connexions refusées', 'Mauvais mot de passe, depuis Toulouse.'),
  event('e5', 'security', '3 sept.', '10:15', '', 'ok', 'Double authentification activée', 'Par application.'),
  event('e6', 'note', '14 mars 2025', '10:02', 'Nexus', 'ok', 'Compte créé', 'Inscription depuis adioncloud.com.'),
]
const orgs = [
  { id: 'o1', name: 'Atelier Lumière', role: 'Propriétaire', since: '14 mars 2025', state: { label: 'Actif', tone: 'ok' } },
  { id: 'o2', name: 'Studio Nord', role: 'Comptabilité', since: '2 juin 2026', state: { label: 'Actif', tone: 'ok' } },
]
const sessions = [
  { id: 's1', device: 'Chrome sur Windows', place: 'Toulouse', seen: 'maintenant', current: true },
  { id: 's2', device: 'Safari sur iPhone', place: 'Toulouse', seen: 'il y a 2 jours' },
]
const tabs = [
  { id: 'fil', label: 'Fil' },
  { id: 'organisations', label: 'Organisations', count: orgs.length },
  { id: 'sessions', label: 'Sessions', count: sessions.length },
]
const groups = [
  { key: 'identity', title: 'Identité', items: [{ label: 'Nom', value: 'Claire Dumas' }, { label: 'Courriel', value: 'claire@atelier-lumiere.fr', copy: true }, { label: 'Téléphone', value: '06 12 00 00 42', copy: true }, { label: 'Langue', value: 'Français' }] },
  { key: 'security', title: 'Sécurité', items: [{ label: 'Double authentification', value: 'Activée', tone: 'ok' }, { label: 'Courriel vérifié', value: 'Oui', tone: 'ok' }, { label: 'Mot de passe', value: 'Changé le 12 nov.' }, { label: 'Connexions refusées', value: '3 ce mois', tone: 'warn' }] },
  { key: 'orgs', title: 'Organisations', count: orgs.length, items: orgs.map((o) => ({ label: o.role, value: o.name, to: ORG })) },
  { key: 'prefs', title: 'Notifications', open: false, items: [{ label: 'Factures', value: 'Par courriel' }, { label: 'Incidents', value: 'Courriel et SMS' }, { label: 'Nouveautés', value: 'Aucune' }] },
]
const menu = [
  { key: 'reset', label: 'Envoyer un lien de nouveau mot de passe', icon: 'mdi-lock-reset', available: true },
  { key: 'as', label: 'Ouvrir son espace client', icon: 'mdi-account-eye-outline', available: true },
  { key: 'disable', label: 'Désactiver le compte', icon: 'mdi-account-off-outline', available: true, danger: true },
]
const modes = [{ key: 'note', label: 'Note interne', placeholder: 'Écrire une note pour l’équipe…', hint: 'Visible par l’équipe seulement.', submit: 'Ajouter la note' }]

const orgColumns = [
  { key: 'name', label: 'Organisation', main: true },
  { key: 'state', label: 'État', value: (r) => r.state.label },
  { key: 'role', label: 'Rôle' },
  { key: 'since', label: 'Membre depuis', muted: true },
]
const sessionColumns = [
  { key: 'device', label: 'Appareil', main: true, sub: (r) => r.place },
  { key: 'seen', label: 'Dernière activité', muted: true },
]
</script>

<template>
  <OrbitShell current="Utilisateurs">
    <UiWorkbench label="Claire Dumas">
      <UiRecordHeader icon="mdi-account-outline" title="Claire Dumas" :status="{ label: 'Compte actif', tone: 'ok' }" :facts="facts" :back="{ label: 'Utilisateurs', to: '/exemple-orbit-utilisateur' }">
        <template #actions><UiActionMenu :actions="menu" /></template>
      </UiRecordHeader>
      <UiTabs v-model="tab" :tabs="tabs" query="onglet" />

      <template v-if="tab === 'fil'">
        <UiComposer v-model="text" mode="note" :modes="modes" />
        <UiActivityFeed v-model="filter" :kinds="KINDS" :items="events" :limit="4" />
      </template>
      <UiTable v-else-if="tab === 'organisations'" :columns="orgColumns" :rows="orgs" :row-to="() => ORG" go-label="Ouvrir" dense>
        <template #cell-state="{ row }"><UiBadge :label="row.state.label" :tone="row.state.tone" /></template>
      </UiTable>
      <UiTable v-else :columns="sessionColumns" :rows="sessions" dense>
        <template #row-actions="{ row }">
          <UiBadge v-if="row.current" label="Session en cours" tone="info" />
          <UiButton v-else kind="quiet" icon="mdi-logout">Fermer la session</UiButton>
        </template>
      </UiTable>

      <template #aside><UiPropertyGrid :groups="groups" /></template>
    </UiWorkbench>
  </OrbitShell>
</template>
