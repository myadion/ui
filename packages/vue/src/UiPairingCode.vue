<script setup>
import { ref } from 'vue'
import UiButton from './UiButton.vue'

/*
 * UN CODE A PRESENTER (Adion UI, 2026-11-18) : le carre a scanner et, a cote,
 * les signes a recopier ou a dicter, espaces pour se lire. Pour un appairage,
 * un enrolement, une invitation a saisir sur un autre appareil.
 *
 *   image    le carre (une adresse de donnees, dessinee par la page)
 *   code     les signes
 *   label    ce qu'on en fait (« À scanner, ou à recopier »)
 *   caption  sa duree de vie, dessous
 */
const props = defineProps({
  image: { type: String, default: '' },
  code: { type: String, required: true },
  label: { type: String, default: 'À scanner, ou à recopier' },
  caption: { type: String, default: '' },
  alt: { type: String, default: 'Code à scanner' },
})
const copied = ref(false)
async function copy() {
  try { await navigator.clipboard?.writeText(props.code) } catch { /* le presse-papiers est refuse : le code reste lisible */ }
  copied.value = true
  setTimeout(() => { copied.value = false }, 1400)
}
</script>

<template>
  <div class="ui-pairing">
    <img v-if="image" :src="image" :alt="alt" width="200" height="200" class="ui-pairing__image">
    <div class="ui-pairing__text">
      <span class="ui-pairing__label">{{ label }}</span>
      <strong class="ui-pairing__code">{{ code }}</strong>
      <UiButton kind="quiet" :icon="copied ? 'mdi-check' : 'mdi-content-copy'" @click="copy">{{ copied ? 'Copié' : 'Copier le code' }}</UiButton>
      <p v-if="caption" class="ui-pairing__caption">{{ caption }}</p>
    </div>
  </div>
</template>
