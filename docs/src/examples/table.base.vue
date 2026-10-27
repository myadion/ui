<script setup>
import { ref } from 'vue'
import { UiBadge, UiButton, UiSegmented, UiTable } from '@adion-cloud/ui-vue'

const state = ref('rows')
const rows = [
  { id: 'a', name: 'boutique.fr', offer: 'Pro', php: '8.3', state: { label: 'En ligne', tone: 'ok' }, visits: 12840 },
  { id: 'b', name: 'atelier-lumiere.fr', offer: 'Starter', php: '8.2', state: { label: 'Suspendu', tone: 'warn' }, visits: 310 },
  { id: 'c', name: 'ancien-site.com', offer: 'Business', php: '7.4', state: { label: 'Erreur', tone: 'bad' }, visits: 0 },
  { id: 'd', name: 'zephyr.io', offer: 'Pro', php: '8.3', state: { label: 'En ligne', tone: 'ok' }, visits: 5302 },
]
const columns = [
  { key: 'name', label: 'Site', main: true, mono: true, sortable: true },
  { key: 'offer', label: 'Offre', muted: true, sortable: true },
  { key: 'php', label: 'PHP', muted: true },
  { key: 'visits', label: 'Visites', align: 'num', sortable: true, value: (r) => r.visits },
  { key: 'state', label: 'État', value: (r) => r.state.label },
]
const filters = [{ key: 'offer', label: 'Offre', items: ['Starter', 'Pro', 'Business'] }]
</script>

<template>
  <UiSegmented v-model="state" :items="[{ value: 'rows', label: 'Lignes' }, { value: 'empty', label: 'Vide' }, { value: 'loading', label: 'Chargement' }, { value: 'error', label: 'Erreur' }]" />
  <UiTable
    :columns="columns"
    :rows="state === 'rows' ? rows : []"
    :loading="state === 'loading'"
    :error="state === 'error' ? 'La liste n’a pas pu être chargée.' : ''"
    search="Rechercher un site"
    :filters="filters"
    :page-size="3"
    :row-to="() => '#'"
    pref-key="doc-table"
    empty="Aucun hébergement dans ce projet."
  >
    <template #cell-state="{ row }"><UiBadge :label="row.state.label" :tone="row.state.tone" /></template>
    <template #toolbar><UiButton kind="quiet" icon="mdi-download">Exporter</UiButton></template>
  </UiTable>
</template>
