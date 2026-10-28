<script setup>
import { UiActivity, UiButton, UiSection } from '@myadion/ui'

const items = [
  { id: 1, icon: 'mdi-plus', title: 'worker-2 créée', meta: 'Kévin Paly · il y a 2 min', tone: 'brand' },
  { id: 2, icon: 'mdi-power', title: 'db-1 arrêtée', meta: 'Kévin Paly · il y a 1 h', tone: 'muted' },
  { id: 3, icon: 'mdi-wallet-outline', title: 'db-1 passée au mois', meta: 'Kévin Paly · hier', tone: 'accent' },
  { id: 4, icon: 'mdi-lan', title: '51.75.12.40 rattachée à web-1', meta: 'API · ci-deploy · 25 oct.', tone: 'info' },
]
</script>

<template>
  <UiSection title="Activité">
    <template #actions><UiButton kind="quiet" href="#">Tout voir</UiButton></template>
    <UiActivity :items="items" />
  </UiSection>
</template>
