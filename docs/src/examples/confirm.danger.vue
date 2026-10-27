<script setup>
import { ref } from 'vue'
import { UiButton, UiConfirm } from '@adion-cloud/ui-vue'

const open = ref(false)
</script>

<template>
  <UiButton kind="danger" @click="open = true">Révoquer la clé</UiButton>
  <UiConfirm v-model="open" danger title="Révoquer la clé ?" text="Les appels qui l’emploient seront refusés aussitôt." tick="Je comprends que ce geste est définitif" confirm-label="Révoquer la clé" @confirm="open = false" />
</template>
