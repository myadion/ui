<script setup>
import { ref } from 'vue'
import UiButton from './UiButton.vue'

/*
 * LA PHRASE A COPIER, MISE EN AVANT (Adion UI, 2026-10-14) : le moyen le
 * plus simple d'une mise en route - « Collez ceci dans votre IA, elle
 * s'occupe du reste ». Le texte en grand, Copier en action principale.
 */
const props = defineProps({
  lead: { type: String, default: '' },
  text: { type: String, required: true },
  family: { type: String, default: '' },
  icon: { type: String, default: 'mdi-content-paste' },
})
const emit = defineEmits(['copied'])
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    emit('copied')
    setTimeout(() => { copied.value = false }, 2500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="ui-callout-copy" :class="family ? `ui-fam-${family}` : ''">
    <p v-if="lead" class="ui-callout-copy__lead"><v-icon :icon="icon" size="20" />{{ lead }}</p>
    <p class="ui-callout-copy__text">{{ text }}</p>
    <div class="ui-callout-copy__actions">
      <UiButton kind="primary" :icon="copied ? 'mdi-check' : 'mdi-content-copy'" @click="copy">{{ copied ? 'Copié' : 'Copier' }}</UiButton>
      <slot />
    </div>
  </div>
</template>
