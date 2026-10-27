<script setup>
import { ref } from 'vue'

/*
 * UN IDENTIFIANT A COPIER (Adion UI) : l'id d'un objet que le developpeur
 * du site demande (`pay_whk_…`), en chasse fixe sur une ligne, avec son
 * bouton Copier. Plus discret que UiCode, fait pour une ligne de tableau
 * ou un en-tete de fiche.
 */
const props = defineProps({
  value: { type: String, required: true },
  label: { type: String, default: 'Identifiant' },
})
const copied = ref(false)
async function doCopy() {
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <span class="ui-copyid" @click.stop>
    <code class="ui-copyid__value" :title="label">{{ value }}</code>
    <v-btn
      class="ui-copyid__copy"
      variant="text"
      size="x-small"
      :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
      :title="copied ? 'Copié' : `Copier l’identifiant`"
      :aria-label="copied ? 'Copié' : `Copier l’identifiant`"
      @click.stop="doCopy"
    />
  </span>
</template>
