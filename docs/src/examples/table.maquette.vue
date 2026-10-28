<script setup>
import { ref } from 'vue'
import { UiBadge, UiTable } from '@myadion/ui'

const last = ref('')
const rows = [
  { id: 'web-1', image: 'Debian 12 · Toulouse', state: { label: 'En marche', tone: 'ok' }, flavor: 'B2', size: '2 vCPU · 4 Go · 50 Go', cost: '0,0246 €', per: 'par heure' },
  { id: 'db-1', image: 'Debian 12 · Toulouse', state: { label: 'Arrêtée', tone: 'muted' }, flavor: 'B4', size: '4 vCPU · 8 Go · 100 Go', cost: '17,99 €', per: 'par mois' },
  { id: 'worker-2', image: 'Ubuntu 24.04 · Toulouse', state: { label: 'En création', tone: 'info' }, flavor: 'B2', size: '2 vCPU · 4 Go · 50 Go', cost: '0,0246 €', per: 'par heure' },
]
const columns = [
  { key: 'id', label: 'Instance', main: true, icon: 'mdi-server-outline', tone: (r) => r.state.tone, sub: (r) => r.image },
  { key: 'state', label: 'État', value: (r) => r.state.label },
  { key: 'flavor', label: 'Gabarit', sub: (r) => r.size },
  { key: 'cost', label: 'Coût', align: 'num', sub: (r) => r.per },
]
// Les gestes viennent de l'API dans une app ; ici, d'apres l'etat.
const quick = (r) => (r.state.tone === 'info' ? [] : [
  { key: 'power', icon: r.state.tone === 'ok' ? 'mdi-power' : 'mdi-play', label: r.state.tone === 'ok' ? 'Arrêter' : 'Démarrer' },
  { key: 'console', icon: 'mdi-console', label: 'Console' },
])
</script>

<template>
  <UiTable :columns="columns" :rows="rows" :row-to="() => '#'" :quick="quick" search="Rechercher" @quick="({ key, row }) => (last = `${key} · ${row.id}`)">
    <template #cell-state="{ row }"><UiBadge :label="row.state.label" :tone="row.state.tone" /></template>
  </UiTable>
  <p class="ui-muted">{{ last ? `Geste : ${last}` : 'Survolez une ligne : ses gestes s’allument.' }}</p>
</template>
