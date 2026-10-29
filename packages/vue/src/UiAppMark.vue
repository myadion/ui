<script setup>
import { computed } from 'vue'

/*
 * LE LOGO D'UNE APPLICATION (Adion UI, 2026-10-29) : le dessin blanc sur la
 * couleur de la marque, qui se reconnait sans lire. Sans dessin, l'initiale.
 * Le blanc sur la couleur de la marque ne change pas avec le theme.
 *
 *   path   le trace SVG du logo (viewBox 24 x 24), vide : l'initiale
 *   color  la couleur de la marque
 *   fg     la couleur du dessin (blanc par defaut)
 *   text   un monogramme a la place de l'initiale
 *   icon   une icone mdi a la place du dessin
 *   ring   un filet autour, pour une marque claire ou noire
 *   name   le nom de l'application (infobulle, initiale)
 *   size   le cote en pixels
 */
const props = defineProps({
  path: { type: String, default: '' },
  color: { type: String, default: '#44525d' },
  fg: { type: String, default: '#ffffff' },
  text: { type: String, default: '' },
  icon: { type: String, default: '' },
  ring: { type: Boolean, default: false },
  name: { type: String, default: '' },
  size: { type: Number, default: 38 },
})
const letter = computed(() => props.text || (props.name || '?').charAt(0).toUpperCase())
</script>

<template>
  <span
    class="ui-app-mark"
    :class="{ 'has-ring': ring }"
    :style="{ width: `${size}px`, height: `${size}px`, background: color, color: fg, borderRadius: `${Math.round(size * 0.26)}px` }"
    :title="name || undefined"
    aria-hidden="true"
  >
    <v-icon v-if="icon" :icon="icon" :size="Math.round(size * 0.5)" />
    <svg v-else-if="path" viewBox="0 0 24 24" :width="Math.round(size * 0.56)" :height="Math.round(size * 0.56)">
      <path :d="path" fill="currentColor" />
    </svg>
    <span v-else :style="{ fontSize: `${Math.round(size * 0.47)}px` }">{{ letter }}</span>
  </span>
</template>
