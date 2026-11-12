<script setup>
import { ref } from 'vue'
import { UiBadge, UiButton, UiTable } from '@myadion/ui'

const selected = ref([])
const rows = [
  { id: 'v1', name: 'data-web', size: 50, state: { label: 'Disponible', tone: 'ok' }, free: true },
  { id: 'v2', name: 'sauvegardes', size: 200, state: { label: 'Disponible', tone: 'ok' }, free: true },
  { id: 'v3', name: 'base-prod', size: 100, state: { label: 'Attaché', tone: 'info' }, free: false },
  { id: 'v4', name: 'archives-2025', size: 20, state: { label: 'Disponible', tone: 'ok' }, free: true },
]
const columns = [
  { key: 'name', label: 'Volume', main: true, icon: 'mdi-harddisk', tone: (r) => r.state.tone },
  { key: 'size', label: 'Taille', align: 'num', value: (r) => `${r.size} Go`, sortValue: (r) => r.size },
  { key: 'state', label: 'État', value: (r) => r.state.label },
]
</script>

<template>
  <UiTable v-model:selected="selected" :columns="columns" :rows="rows" :selectable="(r) => r.free" :select-noun="['volume coché', 'volumes cochés']" search="Rechercher un volume">
    <template #cell-state="{ row }"><UiBadge :label="row.state.label" :tone="row.state.tone" /></template>
    <template #selection="{ rows: picked }">
      <UiButton kind="danger" icon="mdi-delete-outline">Supprimer {{ picked.length > 1 ? `les ${picked.length} volumes` : 'le volume' }}</UiButton>
    </template>
  </UiTable>
</template>
