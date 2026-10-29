<script setup>
import { ref } from 'vue'
import { UiButton, UiDrawer, UiKeyValue } from '@myadion/ui'

const open = ref(false)
</script>

<template>
  <div><UiButton @click="open = true">Ouvrir le détail de web-1</UiButton></div>
  <UiDrawer v-model="open" icon="mdi-server-outline" title="web-1" subtitle="Debian 12 · Toulouse">
    <UiKeyValue :items="[{ label: 'IPv6', value: '2001:db8::b', mono: true }, { label: 'Gabarit', value: 'B2 · 2 vCPU · 4 Go · 50 Go' }, { label: 'Coût', value: '0,0246 € par heure' }]" />
    <template #actions="{ close }">
      <UiButton kind="quiet" @click="close">Fermer</UiButton>
      <UiButton kind="primary" icon="mdi-console">Console</UiButton>
    </template>
  </UiDrawer>
</template>
