<script setup>
import { ref } from 'vue'

/*
 * DES DEMANDES A ESSAYER (Adion UI, 2026-10-14) : chaque exemple se copie
 * d'un clic, pour le coller dans son IA ou son outil.
 */
defineProps({
  items: { type: Array, default: () => [] },
  family: { type: String, default: '' },
})
const copied = ref(-1)

async function copy(text, index) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = index
    setTimeout(() => { if (copied.value === index) copied.value = -1 }, 2000)
  } catch {
    copied.value = -1
  }
}
</script>

<template>
  <div class="ui-prompts" :class="family ? `ui-fam-${family}` : ''">
    <button v-for="(text, index) in items" :key="index" type="button" class="ui-prompt" :title="'Copier'" @click="copy(text, index)">
      <v-icon icon="mdi-message-text-outline" size="18" />
      <span class="ui-prompt__text">{{ text }}</span>
      <span class="ui-prompt__copy">{{ copied === index ? 'Copié' : 'Copier' }}</span>
    </button>
  </div>
</template>
