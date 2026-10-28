<script setup>
import { UiKeyValue } from '@myadion/ui'
</script>

<template>
  <UiKeyValue tiles :items="[{ label: 'Commission', value: '1,4 % + 0,25 € par transaction' }, { label: 'Mise à disposition', value: '7 jours après chaque encaissement' }, { label: 'Réserve', value: 'Aucune' }, { label: 'Versements', value: 'Actifs' }]" />
</template>
