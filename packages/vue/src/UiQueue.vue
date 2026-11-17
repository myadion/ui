<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { tone } from './tone'

/*
 * LA FILE DE TRAVAIL (Adion UI, mode outil, 2026-11-17) : les dossiers qui
 * attendent, le plus urgent d'abord. On en ouvre un d'un clic, ou l'on passe
 * au suivant sans quitter le clavier : J descend, K remonte.
 *
 *   v-model  l'identifiant du dossier ouvert
 *   items    [{ id, title, sub, at, tone, icon }]   sub : pourquoi il attend
 *   label    le nom de la file ; le nombre de dossiers suit
 *   keys     false coupe les raccourcis J et K
 *
 * Les raccourcis se taisent quand on ecrit dans un champ.
 */
const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  items: { type: Array, default: () => [] },
  label: { type: String, default: 'À traiter' },
  keys: { type: Boolean, default: true },
  empty: { type: String, default: 'La file est vide.' },
})
const emit = defineEmits(['update:modelValue'])

const place = computed(() => props.items.findIndex((item) => item.id === props.modelValue))
const current = computed(() => props.items[place.value] || null)
function step(by) {
  const next = props.items[(place.value < 0 ? (by > 0 ? -1 : props.items.length) : place.value) + by]
  if (next) emit('update:modelValue', next.id)
}

function onKey(event) {
  if (!props.keys || event.ctrlKey || event.metaKey || event.altKey) return
  const el = event.target
  if (el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName)) return
  if (event.key === 'j' || event.key === 'J') { event.preventDefault(); step(1) }
  if (event.key === 'k' || event.key === 'K') { event.preventDefault(); step(-1) }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <nav class="ui-queue" :aria-label="label">
    <header class="ui-queue__head">
      <span class="ui-queue__label">{{ label }}<span class="ui-queue__count">{{ items.length }}</span></span>
      <span class="ui-queue__steps">
        <button type="button" class="ui-queue__step" title="Dossier précédent (K)" aria-label="Dossier précédent" :disabled="place <= 0" @click="step(-1)"><v-icon icon="mdi-chevron-up" size="18" /></button>
        <span v-if="place >= 0" class="ui-queue__place">{{ place + 1 }} sur {{ items.length }}</span>
        <button type="button" class="ui-queue__step" title="Dossier suivant (J)" aria-label="Dossier suivant" :disabled="place >= items.length - 1" @click="step(1)"><v-icon icon="mdi-chevron-down" size="18" /></button>
      </span>
    </header>
    <p v-if="current" class="ui-queue__now"><strong>{{ current.title }}</strong><span>{{ current.sub }}</span></p>
    <ol v-if="items.length" class="ui-queue__list">
      <li v-for="item in items" :key="item.id">
        <button type="button" class="ui-queue__item" :class="{ 'is-current': item.id === modelValue }" :aria-current="item.id === modelValue ? 'true' : undefined" @click="emit('update:modelValue', item.id)">
          <span class="ui-queue__mark" :class="`is-tone-${tone(item.tone)}`"><v-icon :icon="item.icon || 'mdi-circle-medium'" size="15" /></span>
          <span class="ui-queue__text"><strong>{{ item.title }}</strong><span>{{ item.sub }}</span></span>
          <span v-if="item.at" class="ui-queue__at">{{ item.at }}</span>
        </button>
      </li>
    </ol>
    <p v-else class="ui-queue__empty">{{ empty }}</p>
    <footer v-if="keys" class="ui-queue__keys"><kbd>J</kbd><kbd>K</kbd> pour passer d’un dossier à l’autre</footer>
  </nav>
</template>
