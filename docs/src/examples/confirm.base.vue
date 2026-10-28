<script setup>
import { ref } from 'vue'
import { UiButton, UiConfirm } from '@myadion/ui'

const open = ref(false)
</script>

<template>
  <UiButton @click="open = true">Confirmer un geste</UiButton>
  <UiConfirm v-model="open" title="Utiliser ce nom ?" text="Vos prochains SMS partiront sous LUMIERE." confirm-label="Utiliser LUMIERE" @confirm="open = false" />
</template>
