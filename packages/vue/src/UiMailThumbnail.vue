<script setup>
import { computed } from 'vue'

/*
 * LA VIGNETTE D'UN COURRIEL (Adion UI, 2026-10-14) : le haut du message rendu
 * par l'API, reduit, pour reconnaitre un modele d'un coup d'oeil dans une
 * liste. Le document garde sa largeur reelle (600 px + marges) et c'est
 * l'affichage qui se reduit ; rien ne s'y clique ni ne s'y execute
 * (bac a sable vide). Sans HTML : un chargement, ou l'icone d'un courriel.
 */
const props = defineProps({
  html: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  /** La largeur affichee, en pixels ; la hauteur suit (4:3). */
  size: { type: Number, default: 240 },
  title: { type: String, default: 'Aperçu du courriel' },
})

const BASE = 680
const scale = computed(() => props.size / BASE)
const height = computed(() => Math.round(props.size * 0.75))
const boxStyle = computed(() => ({ width: `${props.size}px`, height: `${height.value}px` }))
const frameStyle = computed(() => ({
  width: `${BASE}px`,
  height: `${Math.round(height.value / scale.value)}px`,
  transform: `scale(${scale.value})`,
}))
</script>

<template>
  <div class="ui-mail-thumb" :style="boxStyle">
    <iframe v-if="html" :srcdoc="html" sandbox="" scrolling="no" tabindex="-1" :title="title" class="ui-mail-thumb__frame" :style="frameStyle" />
    <span v-else class="ui-mail-thumb__empty">
      <v-progress-circular v-if="loading" indeterminate size="18" />
      <v-icon v-else icon="mdi-email-outline" size="28" />
    </span>
  </div>
</template>
