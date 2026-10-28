<script setup>
import { computed } from 'vue'
import { tone as toTone, toneOf } from './tone'

/*
 * L'ETAT D'UNE CHOSE (Adion UI) : un point et un mot, a cote de son nom.
 * C'est la pastille de l'en-tete d'une fiche ; dans un tableau, on prefere
 * UiBadge. Accepte un objet de l'API ({ label, tone }) ou les deux a part.
 */
const props = defineProps({
  status: { type: Object, default: null },
  label: { type: String, default: '' },
  tone: { type: String, default: '' },
  title: { type: String, default: '' },
})

const text = computed(() => props.label || props.status?.label || props.status?.status_label || '')
const toneClass = computed(() => `is-tone-${props.tone ? toTone(props.tone) : toneOf(props.status)}`)
const hint = computed(() => props.title || props.status?.hint || props.status?.status_hint || '')
</script>

<template>
  <span v-if="text" class="ui-status" :class="toneClass" :title="hint || undefined">
    <span class="ui-status__dot" />{{ text }}
  </span>
</template>
