<script setup>
/*
 * LE BOUTON DE L'ASSISTANT (Adion UI) : a cote de la cloche,
 * il ouvre le meme volet sur l'onglet Assistant. Raccourci : Ctrl+K (⌘K).
 */
defineProps({ open: { type: Boolean, default: false } })
defineEmits(['click'])
const label = 'Assistant Adion (Ctrl+K)'
</script>

<template>
  <button type="button" class="ui-bell ui-bell--assistant" :aria-label="label" :title="label" aria-haspopup="dialog" :aria-expanded="open" aria-keyshortcuts="Control+K Meta+K" @click="$emit('click')">
    <v-icon icon="mdi-creation-outline" size="20" />
  </button>
</template>
