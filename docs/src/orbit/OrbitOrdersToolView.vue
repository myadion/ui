<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UiBadge, UiButton, UiPageHeader, UiStat, UiTable, UiTabs } from '@myadion/ui'
import OrbitShell from './OrbitShell.vue'
import { LIST, STATES, euros, orders } from './data.js'

/*
 * LA LISTE EN MODE OUTIL (2026-11-17) : un seul travail, trouver et trier.
 * Une colonne, des lignes serrees, l'etat en couleur, « À traiter » ouvert
 * d'abord. La vue ouverte est dans l'adresse : revenir d'une fiche la retrouve.
 * Un clic sur la ligne ouvre la fiche, en pleine page.
 */
const route = useRoute()
const router = useRouter()
const tab = computed({
  get: () => (route.query.vue === 'toutes' ? 'all' : 'team'),
  set: (v) => router.replace({ query: v === 'all' ? { vue: 'toutes' } : {} }),
})
const tabs = [
  { id: 'team', label: 'À traiter', count: orders.filter((o) => o.team).length, countHint: 'commandes qui attendent l’équipe' },
  { id: 'all', label: 'Toutes', count: orders.length },
]
const rows = computed(() => (tab.value === 'team' ? orders.filter((o) => o.team) : orders))
const columns = [
  { key: 'number', label: 'Commande', main: true, mono: true, sortable: true },
  { key: 'state', label: 'État', value: (r) => STATES[r.state].label },
  { key: 'customer', label: 'Client', sortable: true },
  { key: 'content', label: 'Contenu', muted: true, value: (r) => r.lines.map((l) => l.name).join(', ') },
  { key: 'wait', label: 'Ce qui est attendu', value: (r) => r.todo?.title || '' },
  { key: 'total', label: 'Par mois', align: 'num', sortable: true, value: (r) => r.total },
  { key: 'at', label: 'Passée', muted: true },
]
const filters = [{ key: 'state', label: 'État', items: Object.values(STATES).map((s) => s.label) }]
const to = (row) => ({ path: `${LIST}/${row.id}`, query: route.query })
</script>

<template>
  <OrbitShell>
    <UiPageHeader eyebrow="Au quotidien" title="Commandes">
      <template #actions><UiButton kind="quiet" icon="mdi-download">Exporter</UiButton></template>
    </UiPageHeader>

    <div class="ui-stats">
      <UiStat label="À traiter" value="3" hint="dont 1 bloquée" />
      <UiStat label="Passées ce mois" value="184" :trend="12" />
      <UiStat label="Montant mensuel ajouté" value="4 812 €" />
    </div>

    <UiTabs v-model="tab" :tabs="tabs" />
    <UiTable
      :columns="columns"
      :rows="rows"
      search="Rechercher une commande ou un client"
      :filters="filters"
      :page-size="25"
      :row-to="to"
      go-label="Ouvrir la commande"
      pref-key="orbit-orders-tool2"
      dense
      empty="Aucune commande n’attend l’équipe."
    >
      <template #cell-state="{ row }"><UiBadge :label="STATES[row.state].label" :tone="STATES[row.state].tone" /></template>
      <template #cell-total="{ row }">{{ euros(row.total) }}</template>
    </UiTable>
  </OrbitShell>
</template>
