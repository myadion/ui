<script setup>
import { ref } from 'vue'
import { UiButton, UiDetailLayout, UiNotice, UiSection, UiStat } from '@adion-cloud/ui-vue'
import { sampleActions } from './data.js'

const tab = ref('ensemble')
const tabs = [
  { id: 'resiliation', label: 'Résiliation' },
  { id: 'historique', label: 'Historique' },
  { id: 'reglages', label: 'Réglages' },
  { id: 'ensemble', label: 'Vue d’ensemble' },
  { id: 'api', label: 'API', count: 2 },
]
</script>

<template>
  <UiDetailLayout v-model:tab="tab" title="boutique.fr" :crumbs="[{ label: 'Web' }, { label: 'Mes hébergements', to: '#' }, { label: 'boutique.fr' }]" :status="{ label: 'En ligne', tone: 'ok' }" :tabs="tabs" :actions="sampleActions">
    <template #meta><span>Hébergement Pro</span><span class="ui-header__sep">·</span><span>PHP 8.3</span></template>
    <template #actions><UiButton kind="quiet" icon="mdi-refresh" icon-only title="Actualiser" /><UiButton kind="secondary" icon="mdi-open-in-new">Voir mon site</UiButton></template>
    <template #notices><UiNotice tone="warn" title="Résiliation programmée" text="Le site s’arrêtera le 1er novembre 2026." /></template>
    <template #stats>
      <UiStat label="Visites" value="12 840" icon="mdi-chart-line" hint="ce mois" />
      <UiStat label="Espace" value="2,1 Go" icon="mdi-harddisk" hint="sur 20 Go" />
    </template>
    <UiSection first :title="`Onglet « ${tabs.find((t) => t.id === tab)?.label} »`" lead="Les onglets sont déclarés dans le désordre : le gabarit met « Vue d’ensemble » en premier, les réglages puis la résiliation à la fin." />
  </UiDetailLayout>
</template>
