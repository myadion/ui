<script setup>
import { UiKeyValue, UiSection, UiSkeleton, UiStat, UiTable } from '@myadion/ui'
</script>

<template>
  <div class="ui-stats">
    <UiStat label="Instances" :value="4" />
    <UiStat label="Ce mois-ci" loading hint="Coût du projet" />
  </div>
  <UiKeyValue :items="[{ label: 'Région', value: 'Toulouse' }, { label: 'Adresse IPv4', loading: true }, { label: 'Gabarit', loading: true, skeleton: '5em' }]" />
  <UiSection title="Ports réseau" loading :lines="2" />
  <UiTable :columns="[{ key: 'name', label: 'Nom', main: true }, { key: 'ip', label: 'Adresse' }, { key: 'state', label: 'État' }]" :rows="[]" loading />
  <p>Un titre qui arrive : <UiSkeleton size="title" /></p>
</template>
