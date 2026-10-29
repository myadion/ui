<script setup>
import { computed } from 'vue'

/*
 * LE LOGO D'UNE APPLICATION (Adion UI, 2026-10-29) : le dessin blanc sur la
 * couleur de la marque, qui se reconnait sans lire. Sans dessin, l'initiale.
 * Le blanc sur la couleur de la marque ne change pas avec le theme.
 *
 *   path   le trace SVG du logo (viewBox 24 x 24), vide : l'initiale
 *   color  la couleur de la marque
 *   name   le nom de l'application (infobulle, initiale)
 *   size   le cote en pixels
 */
const props = defineProps({
  path: { type: String, default: '' },
  color: { type: String, default: '#44525d' },
  name: { type: String, default: '' },
  size: { type: Number, default: 38 },
})
const letter = computed(() => (props.name || '?').charAt(0).toUpperCase())
</script>

<template>
  <span
    class="ui-app-mark"
    :style="{ width: `${size}px`, height: `${size}px`, background: color, borderRadius: `${Math.round(size * 0.26)}px` }"
    :title="name || undefined"
    aria-hidden="true"
  >
    <svg v-if="path" viewBox="0 0 24 24" :width="Math.round(size * 0.56)" :height="Math.round(size * 0.56)">
      <path :d="path" fill="currentColor" />
    </svg>
    <span v-else :style="{ fontSize: `${Math.round(size * 0.47)}px` }">{{ letter }}</span>
  </span>
</template>
