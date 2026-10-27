<script setup>
import { computed } from 'vue'
import { TONE_ICON, tone as toTone } from './tone'

/*
 * UNE ETIQUETTE (Adion UI) : un mot, un filet, une teinte. Pour une
 * qualite - « Essai », « Par defaut », « 3 en attente » - ou l'etat d'une
 * ligne de tableau. Le ton vient de Nexus quand il le dit (`tone`), et le
 * libelle toujours de Nexus.
 */
const props = defineProps({
  label: { type: [String, Number], default: '' },
  tone: { type: String, default: 'muted' },
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
})

const t = computed(() => toTone(props.tone))
const toneClass = computed(() => `is-tone-${t.value}`)
/* Un etat ne se dit jamais par la seule couleur : une icone par ton (sauf neutre et accent). */
const shownIcon = computed(() => props.icon || (['ok', 'warn', 'bad', 'info'].includes(t.value) ? TONE_ICON[t.value] : ''))
</script>

<template>
  <span class="ui-badge" :class="toneClass" :title="title || undefined">
    <v-icon v-if="shownIcon" :icon="shownIcon" size="12" />
    <slot>{{ label }}</slot>
  </span>
</template>
