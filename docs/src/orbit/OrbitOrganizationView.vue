<script setup>
import { computed, ref } from 'vue'
import { UiActionMenu, UiActivityFeed, UiBadge, UiComposer, UiPropertyGrid, UiRecordHeader, UiTable, UiTabs, UiWorkbench } from '@myadion/ui'
import OrbitShell from './OrbitShell.vue'
import { euros } from './data.js'
import { KINDS, customers } from './desk.js'

/*
 * LA FICHE D'UNE ORGANISATION (essai, 2026-11-17) : le meme dossier que sur
 * le poste de travail, sans la file. Le fil d'abord ; les listes longues
 * (projets, services, factures, membres) ont chacune leur onglet ; les
 * proprietes restent a droite. Un membre mene a sa fiche d'utilisateur.
 * Donnees fictives : tout vient de Nexus.
 */
const USER = '/exemple-orbit-utilisateur'
const org = customers[0]
const tab = ref('fil')
const filter = ref('')
const text = ref('')
const mode = ref('note')
const modes = [
  { key: 'note', label: 'Note interne', icon: 'mdi-note-text-outline', placeholder: 'Écrire une note pour l’équipe…', hint: 'Visible par l’équipe seulement.', submit: 'Ajouter la note' },
  { key: 'reply', label: 'Réponse au client', icon: 'mdi-reply-outline', placeholder: `Répondre à ${org.contact}…`, hint: `Sera envoyée à ${org.mail}.`, submit: 'Envoyer' },
]

const STATES = {
  ok: { label: 'Actif', tone: 'ok' },
  suspended: { label: 'Suspendu', tone: 'muted' },
  paid: { label: 'Payée', tone: 'ok' },
  late: { label: 'En retard', tone: 'bad' },
}
const services = [
  { id: 's1', name: 'VPS B4', family: 'Cloud', project: 'Production', state: 'ok', price: 17.99, renew: '9 déc.' },
  { id: 's2', name: 'Lilou, 5 postes', family: 'Téléphonie', project: 'Production', state: 'ok', price: 64.5, renew: '15 déc.' },
  { id: 's6', name: 'Ligne mobile 100 Go', family: 'Mobile', project: 'Production', state: 'suspended', price: 14.99, renew: '' },
  { id: 's3', name: 'atelier-lumiere.fr', family: 'Nom de domaine', project: 'Site vitrine', state: 'ok', price: 0.62, renew: '3 mars 2027' },
  { id: 's4', name: 'Hébergement Pro', family: 'Web', project: 'Site vitrine', state: 'ok', price: 14.99, renew: '3 déc.' },
  { id: 's5', name: 'Messagerie, 6 boîtes', family: 'Messagerie', project: 'Site vitrine', state: 'ok', price: 12, renew: '3 déc.' },
]
const projects = computed(() => [...new Set(services.map((s) => s.project))].map((name) => {
  const list = services.filter((s) => s.project === name)
  return { id: name, name, count: list.length, price: list.filter((s) => s.state === 'ok').reduce((sum, s) => sum + s.price, 0) }
}))
const invoices = [
  { id: 'f1', number: 'F-2026-11-0398', at: '5 nov.', total: 125.09, state: 'paid' },
  { id: 'f2', number: 'F-2026-10-0412', at: '5 oct.', total: 64.5, state: 'late' },
  { id: 'f3', number: 'F-2026-10-0377', at: '5 oct.', total: 60.59, state: 'paid' },
  { id: 'f4', number: 'F-2026-09-0351', at: '5 sept.', total: 125.09, state: 'paid' },
]
const members = [
  { id: 'u1', name: 'Claire Dumas', role: 'Propriétaire', mail: 'claire@atelier-lumiere.fr', seen: 'aujourd’hui' },
  { id: 'u2', name: 'Hugo Perrin', role: 'Technique', mail: 'hugo@atelier-lumiere.fr', seen: 'il y a 3 jours' },
  { id: 'u3', name: 'Sophie Roche', role: 'Comptabilité', mail: 'compta@cabinet-roche.fr', seen: 'il y a 2 mois' },
]
const tabs = computed(() => [
  { id: 'fil', label: 'Fil' },
  { id: 'projets', label: 'Projets', count: projects.value.length },
  { id: 'services', label: 'Services', count: services.length },
  { id: 'factures', label: 'Factures', count: invoices.length },
  { id: 'membres', label: 'Membres', count: members.length },
])
const groups = org.groups.map((group) => (group.key === 'members'
  ? { ...group, items: members.map((m) => ({ label: m.role, value: m.name, to: USER })) }
  : group))
const menu = [
  { key: 'space', label: 'Ouvrir son espace client', icon: 'mdi-account-eye-outline', available: true },
  { key: 'call', label: 'Noter un appel', icon: 'mdi-phone-log-outline', available: true },
  { key: 'suspend', label: 'Suspendre l’organisation', icon: 'mdi-pause-circle-outline', available: true, danger: true },
]

const projectColumns = [
  { key: 'name', label: 'Projet', main: true },
  { key: 'count', label: 'Services', align: 'num' },
  { key: 'price', label: 'Par mois', align: 'num', value: (r) => r.price },
]
const serviceColumns = [
  { key: 'name', label: 'Service', main: true, sortable: true, sub: (r) => r.family },
  { key: 'state', label: 'État', value: (r) => STATES[r.state].label },
  { key: 'project', label: 'Projet', sortable: true },
  { key: 'price', label: 'Par mois', align: 'num', sortable: true, value: (r) => r.price },
  { key: 'renew', label: 'Échéance', muted: true },
]
const serviceFilters = [{ key: 'project', label: 'Projet', items: [...new Set(services.map((s) => s.project))] }]
const invoiceColumns = [
  { key: 'number', label: 'Facture', main: true, mono: true },
  { key: 'state', label: 'État', value: (r) => STATES[r.state].label },
  { key: 'at', label: 'Émise', muted: true },
  { key: 'total', label: 'Montant', align: 'num', value: (r) => r.total },
]
const memberColumns = [
  { key: 'name', label: 'Membre', main: true, sub: (r) => r.mail },
  { key: 'role', label: 'Rôle' },
  { key: 'seen', label: 'Dernière visite', muted: true },
]
</script>

<template>
  <OrbitShell current="Organisations">
    <UiWorkbench :label="org.name">
      <UiRecordHeader icon="mdi-domain" :title="org.name" :status="org.status" :facts="org.facts" :back="{ label: 'Organisations', to: '/exemple-orbit-organisation' }">
        <template #actions><UiActionMenu :actions="menu" /></template>
      </UiRecordHeader>
      <UiTabs v-model="tab" :tabs="tabs" query="onglet" />

      <template v-if="tab === 'fil'">
        <UiComposer v-model="text" v-model:mode="mode" :modes="modes" />
        <UiActivityFeed v-model="filter" :kinds="KINDS" :items="org.events" :limit="4" />
      </template>
      <UiTable v-else-if="tab === 'projets'" :columns="projectColumns" :rows="projects" dense>
        <template #cell-price="{ row }">{{ euros(row.price) }}</template>
      </UiTable>
      <UiTable v-else-if="tab === 'services'" :columns="serviceColumns" :rows="services" search="Rechercher un service" :filters="serviceFilters" dense>
        <template #cell-state="{ row }"><UiBadge :label="STATES[row.state].label" :tone="STATES[row.state].tone" /></template>
        <template #cell-price="{ row }">{{ euros(row.price) }}</template>
      </UiTable>
      <UiTable v-else-if="tab === 'factures'" :columns="invoiceColumns" :rows="invoices" dense>
        <template #cell-state="{ row }"><UiBadge :label="STATES[row.state].label" :tone="STATES[row.state].tone" /></template>
        <template #cell-total="{ row }">{{ euros(row.total) }}</template>
      </UiTable>
      <UiTable v-else :columns="memberColumns" :rows="members" :row-to="() => USER" go-label="Ouvrir" dense />

      <template #aside><UiPropertyGrid :groups="groups" /></template>
    </UiWorkbench>
  </OrbitShell>
</template>
