<script setup>
import UiBadge from './UiBadge.vue'

/*
 * UN CANAL ET SON ETAT (Adion UI) : la valeur du canal (adresse, numero) puis
 * la pastille de consentement que l'API nomme et colore. Sur telephone la
 * pastille passe sous la valeur plutot que de la couper. `icon` ajoute le
 * pictogramme du canal devant la valeur.
 */
defineProps({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
  tone: { type: String, default: 'muted' },
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  mono: { type: Boolean, default: false },
})
</script>

<template>
  <span class="ui-chan">
    <span class="ui-chan__value" :class="{ 'is-mono': mono }" :title="value">
      <v-icon v-if="icon" :icon="icon" size="14" aria-hidden="true" />
      {{ value }}
    </span>
    <UiBadge v-if="label" :label="label" :tone="tone" :title="title" />
  </span>
</template>
