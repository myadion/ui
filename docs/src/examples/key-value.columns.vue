<script setup>
import { UiKeyValue } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiKeyValue :columns="2" :items="[{ label: 'Expéditeur', value: 'LUMIERE' }, { label: 'Parties', value: 2 }, { label: 'Provenance', value: 'API', tip: 'Envoyé par une application.' }, { label: 'Échec', value: '' }, { label: 'Nom', value: 'Kévin Paly' }, { label: 'Courriel', value: 'hello@myadion.com', mono: true }]" />
</template>
