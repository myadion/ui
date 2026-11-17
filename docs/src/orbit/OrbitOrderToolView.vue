<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UiBadge, UiButton, UiDetailLayout, UiKeyValue, UiNotice, UiSection, UiStat, UiTable, UiTimeline } from '@myadion/ui'
import OrbitShell from './OrbitShell.vue'
import { LINE_STATES, LIST, STATES, euros, orders } from './data.js'

/*
 * LA FICHE D'UNE COMMANDE, EN PLEINE PAGE (2026-11-17). Dans l'ordre :
 *   1. qui elle est et son etat ; un seul geste principal, le reste au menu ;
 *   2. ce qui est attendu de l'equipe, en clair, avec son geste ;
 *   3. le travail au centre (les lignes), le contexte a droite (client,
 *      paiement), l'historique dans son onglet ;
 *   4. precedente / suivante : on traite la file sans revenir a la liste.
 */
const route = useRoute()
const router = useRouter()
const order = computed(() => orders.find((o) => o.id === route.params.id) || orders[0])
const state = computed(() => STATES[order.value.state])
const back = computed(() => ({ path: LIST, query: route.query }))

// La file que l'on parcourt est celle de la liste d'ou l'on vient.
const queue = computed(() => (route.query.vue === 'toutes' ? orders : orders.filter((o) => o.team)))
const place = computed(() => queue.value.findIndex((o) => o.id === order.value.id))
const go = (step) => {
  const next = queue.value[place.value + step]
  if (next) router.push({ path: `${LIST}/${next.id}`, query: route.query })
}

const tab = ref('ensemble')
const tabs = computed(() => [
  { id: 'ensemble', label: 'Vue d’ensemble' },
  { id: 'historique', label: 'Historique', count: story.value.length },
])
const menu = [
  { key: 'invoice', label: 'Voir la facture', icon: 'mdi-receipt-text-outline' },
  { key: 'customer', label: 'Écrire au client', icon: 'mdi-email-outline' },
  { key: 'cancel', label: 'Annuler la commande', icon: 'mdi-close-circle-outline', danger: true },
]
const columns = [
  { key: 'name', label: 'Ligne', main: true, sub: (r) => r.offer },
  { key: 'state', label: 'État', value: (r) => LINE_STATES[r.state].label },
  { key: 'note', label: 'Pourquoi', muted: true },
  { key: 'price', label: 'Par mois', align: 'num', value: (r) => r.price },
]
const context = computed(() => [
  { label: 'Client', value: order.value.customer },
  { label: 'Passée par', value: order.value.who },
  { label: 'Projet', value: order.value.project },
  { label: 'Compte de facturation', value: order.value.account },
  { label: 'Paiement', value: order.value.payment },
  { label: 'Commercial', value: order.value.seller },
])
const story = computed(() => [
  ...(order.value.todo ? [{ id: 3, title: order.value.todo.title, text: order.value.todo.text, at: order.value.at, tone: state.value.tone === 'bad' ? 'bad' : 'warn' }] : []),
  ...(order.value.state === 'awaiting_payment' ? [] : [{ id: 2, title: 'Paiement reçu', text: order.value.payment, at: order.value.at, tone: 'ok' }]),
  { id: 1, title: 'Commande passée', text: `Par ${order.value.who}, depuis l’espace client.`, at: order.value.at, tone: 'accent' },
])
const done = computed(() => order.value.lines.filter((l) => l.state === 'done').length)
</script>

<template>
  <OrbitShell>
    <UiDetailLayout
      v-model:tab="tab"
      icon="mdi-cart-outline"
      :title="order.number"
      :crumbs="[{ label: 'Au quotidien' }, { label: 'Commandes', to: back }, { label: order.number }]"
      :status="{ label: state.label, tone: state.tone }"
      :tabs="tabs"
      :actions="menu"
    >
      <template #meta>
        <span>{{ order.customer }}</span><span class="ui-header__sep">·</span>
        <span>passée {{ order.at }} par {{ order.who }}</span>
      </template>
      <template #actions>
        <UiButton kind="quiet" icon="mdi-chevron-left" icon-only title="Commande précédente de la file" :disabled="place <= 0" @click="go(-1)" />
        <span v-if="place >= 0" class="ui-muted">{{ place + 1 }} sur {{ queue.length }}</span>
        <UiButton kind="quiet" icon="mdi-chevron-right" icon-only title="Commande suivante de la file" :disabled="place < 0 || place >= queue.length - 1" @click="go(1)" />
        <UiButton v-if="order.todo" kind="primary" :icon="order.todo.icon">{{ order.todo.action }}</UiButton>
      </template>
      <template v-if="order.todo" #notices>
        <UiNotice :tone="state.tone === 'bad' ? 'bad' : 'warn'" :title="order.todo.title" :text="order.todo.text" />
      </template>
      <template #stats>
        <UiStat label="Par mois" :value="euros(order.total)" />
        <UiStat label="Lignes livrées" :value="`${done} sur ${order.lines.length}`" />
        <UiStat label="Paiement" :value="order.state === 'awaiting_payment' ? 'Refusé' : 'Reçu'" :hint="order.payment" />
      </template>
      <template #aside>
        <UiSection title="Client et facturation"><UiKeyValue :items="context" dense /></UiSection>
      </template>

      <template v-if="tab === 'ensemble'">
        <UiSection first title="Lignes de la commande">
          <UiTable :columns="columns" :rows="order.lines" :row-key="(r) => r.name + r.note + order.lines.indexOf(r)" dense>
            <template #cell-state="{ row }"><UiBadge :label="LINE_STATES[row.state].label" :tone="LINE_STATES[row.state].tone" /></template>
            <template #cell-price="{ row }">{{ euros(row.price) }}</template>
            <template #row-actions="{ row }">
              <UiButton v-if="row.state === 'blocked'" kind="quiet" icon="mdi-refresh">Relancer</UiButton>
            </template>
          </UiTable>
        </UiSection>
      </template>
      <UiSection v-else first title="Historique"><UiTimeline :items="story" /></UiSection>
    </UiDetailLayout>
  </OrbitShell>
</template>
