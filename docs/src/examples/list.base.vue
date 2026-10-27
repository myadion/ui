<script setup>
import { UiList } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiList :items="['Un crédit envoie une partie de SMS.', { text: '3 numéros ont répondu STOP.', icon: 'mdi-cancel' }]" />
</template>
