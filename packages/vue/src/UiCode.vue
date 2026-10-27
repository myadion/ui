<script setup>
import { ref } from 'vue'

/*
 * DU CODE A COPIER (Adion UI) : un exemple d'appel, une commande, une cle.
 * Le bouton Copier est toujours la, en haut a droite. `inline` pour une
 * valeur courte qui se selectionne d'un clic ; `wrap` pour un texte a lire
 * en entier, qui revient a la ligne (un prompt, un message).
 */
const props = defineProps({
  code: { type: String, required: true },
  inline: { type: Boolean, default: false },
  copy: { type: Boolean, default: true },
  wrap: { type: Boolean, default: false },
})
const copied = ref(false)
async function doCopy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="ui-code" :class="{ 'is-inline': inline, 'is-wrap': wrap }">
    <pre>{{ code }}</pre>
    <v-btn
      v-if="copy"
      class="ui-code__copy"
      variant="text"
      size="x-small"
      :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
      :title="copied ? 'Copié' : 'Copier'"
      :aria-label="copied ? 'Copié' : 'Copier'"
      @click="doCopy"
    />
  </div>
</template>
