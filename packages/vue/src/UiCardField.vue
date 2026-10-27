<script setup>
import UiField from './UiField.vue'

/*
 * UN CHAMP DE CARTE (Adion UI, coordination#49) : le cadre d'un champ dont le
 * contenu n'est pas a nous - le numero, la date ou le code, que le prestataire
 * de paiement affiche dans son propre cadre. Meme libelle, meme hauteur et
 * meme anneau de focus qu'UiInput. Le contenu va dans le creneau par defaut.
 */
defineProps({
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  error: { type: String, default: '' },
  focused: { type: Boolean, default: false },
  complete: { type: Boolean, default: false },
})
</script>

<template>
  <UiField :label="label" :tip="tip" :error="error">
    <div class="ui-cardfield" :class="{ 'is-focused': focused, 'is-invalid': error, 'is-complete': complete && !error }">
      <slot />
    </div>
  </UiField>
</template>
