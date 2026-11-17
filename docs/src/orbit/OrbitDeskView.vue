<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UiActionMenu, UiActivityFeed, UiButton, UiCommandPalette, UiComposer, UiPropertyGrid, UiQueue, UiRecordHeader, UiWorkbench } from '@myadion/ui'
import OrbitShell from './OrbitShell.vue'
import { KINDS, customers } from './desk.js'

/*
 * LE POSTE DE TRAVAIL D'ORBIT (essai, 2026-11-17) : traiter les clients qui
 * attendent, a la chaine, sans changer d'ecran.
 *   a gauche   la file : J et K passent d'un client a l'autre ;
 *   au centre  le client : qui il est, puis son fil. Ce qui attend l'equipe
 *              est en tete, chaque evenement avec ses gestes ; on ecrit une
 *              note ou une reponse dans le fil ;
 *   a droite   ses proprietes, en groupes repliables, copiables d'un clic ;
 *   Ctrl K     chercher un client ou lancer un geste.
 * Le client ouvert est dans l'adresse. Donnees fictives, rien ne part.
 */
const route = useRoute()
const router = useRouter()
const current = computed({
  get: () => (customers.some((c) => c.id === route.query.client) ? route.query.client : customers[0].id),
  set: (id) => router.replace({ query: { client: id } }),
})
const customer = computed(() => customers.find((c) => c.id === current.value))
const queue = customers.map((c) => ({ id: c.id, title: c.name, ...c.queue }))

// Ce que l'on ecrit ici s'ajoute au fil de la demonstration, et ne part nulle part.
const added = reactive({})
const events = computed(() => [...(added[current.value] || []), ...customer.value.events])
const filter = ref('')
const text = ref('')
const mode = ref('note')
watch(current, () => { filter.value = ''; text.value = ''; mode.value = 'note' })
const modes = computed(() => [
  { key: 'note', label: 'Note interne', icon: 'mdi-note-text-outline', placeholder: 'Écrire une note pour l’équipe…', hint: 'Visible par l’équipe seulement.', submit: 'Ajouter la note' },
  { key: 'reply', label: 'Réponse au client', icon: 'mdi-reply-outline', placeholder: `Répondre à ${customer.value.contact}…`, hint: `Sera envoyée à ${customer.value.mail}.`, submit: 'Envoyer' },
])
function write({ mode: kind, text: body }) {
  const list = added[current.value] || (added[current.value] = [])
  list.unshift({ id: `n${Date.now()}`, kind: 'note', day: '', at: 'à l’instant', who: 'Vous', tone: kind === 'reply' ? 'info' : 'muted', icon: kind === 'reply' ? 'mdi-reply-outline' : 'mdi-note-text-outline', title: kind === 'reply' ? 'Réponse au client (démonstration, non envoyée)' : 'Note de l’équipe', text: body })
  text.value = ''
}
function act({ key }) {
  if (key === 'reply') { mode.value = 'reply'; document.querySelector('.ui-composer__input')?.focus() }
}

const menu = [
  { key: 'space', label: 'Ouvrir son espace client', icon: 'mdi-account-eye-outline', available: true },
  { key: 'call', label: 'Noter un appel', icon: 'mdi-phone-log-outline', available: true },
  { key: 'suspend', label: 'Suspendre le client', icon: 'mdi-pause-circle-outline', available: true, danger: true },
]

// La palette : un client, ou un geste sur le client ouvert.
const palette = ref(false)
const query = ref('')
const norm = (value) => value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const found = computed(() => {
  const q = norm(query.value.trim())
  const keep = (items) => (q ? items.filter((item) => norm(`${item.label} ${item.meta}`).includes(q)) : items)
  return [
    { key: 'clients', label: 'Clients', items: keep(customers.map((c) => ({ key: `client:${c.id}`, icon: 'mdi-domain', label: c.name, meta: c.queue.sub }))) },
    { key: 'actions', label: `Gestes sur ${customer.value.name}`, items: keep([
      { key: 'do:note', icon: 'mdi-note-text-outline', label: 'Écrire une note', meta: 'Pour l’équipe' },
      { key: 'do:reply', icon: 'mdi-reply-outline', label: 'Répondre au client', meta: customer.value.contact },
    ]) },
  ].filter((group) => group.items.length)
})
function pick(item) {
  palette.value = false
  query.value = ''
  if (item.key.startsWith('client:')) current.value = item.key.slice(7)
  else { mode.value = item.key.slice(3); setTimeout(() => document.querySelector('.ui-composer__input')?.focus(), 150) }
}
function onKey(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); palette.value = true }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <OrbitShell current="Clients à traiter" @search="palette = true">
    <UiWorkbench :label="customer.name">
      <template #queue><UiQueue v-model="current" :items="queue" label="Clients à traiter" /></template>

      <UiRecordHeader icon="mdi-domain" :title="customer.name" :status="customer.status" :facts="customer.facts">
        <template #actions>
          <UiButton kind="quiet" icon="mdi-magnify" title="Chercher un client ou un geste (Ctrl K)" @click="palette = true">Ctrl K</UiButton>
          <UiActionMenu :actions="menu" />
        </template>
      </UiRecordHeader>
      <UiComposer v-model="text" v-model:mode="mode" :modes="modes" @submit="write" />
      <UiActivityFeed :key="current" v-model="filter" :kinds="KINDS" :items="events" :limit="4" @action="act" />

      <template #aside><UiPropertyGrid :key="current" :groups="customer.groups" /></template>
    </UiWorkbench>
    <UiCommandPalette v-model="palette" v-model:query="query" :groups="found" placeholder="Chercher un client ou un geste…" hint="Un client, ou un geste sur le client ouvert." @select="pick" />
  </OrbitShell>
</template>
