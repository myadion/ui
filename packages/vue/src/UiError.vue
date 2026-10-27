<script setup>
import UiButton from './UiButton.vue'
import UiNotice from './UiNotice.vue'

/*
 * UNE ERREUR DE CHARGEMENT (Adion UI) : le message de Nexus, et Reessayer.
 * Pour l'erreur d'un geste (un enregistrement refuse), UiNotice tone="bad".
 */
defineProps({
  message: { type: String, default: '' },
  retry: { type: Boolean, default: true },
})
defineEmits(['retry'])
</script>

<template>
  <UiNotice tone="bad" :text="message || 'Cette page n’a pas pu être chargée.'">
    <template v-if="retry" #actions>
      <UiButton kind="quiet" icon="mdi-refresh" @click="$emit('retry')">Réessayer</UiButton>
    </template>
  </UiNotice>
</template>
