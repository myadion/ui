<script setup>
import { computed } from 'vue'
import { TONE_ICON, tone as toTone } from './tone'

/*
 * UN ENCADRE (Adion UI) : information, succes, alerte, erreur. Il remplace
 * `v-alert`, `.callout`, `.banner`, `.flash` et les `<p class="warn">` que
 * chaque ecran redessinait. Les actions vont a droite, le texte a gauche.
 */
const props = defineProps({
  tone: { type: String, default: 'info' },
  title: { type: String, default: '' },
  text: { type: String, default: '' },
  icon: { type: String, default: '' },
  closable: { type: Boolean, default: false },
})

defineEmits(['close'])

const t = computed(() => toTone(props.tone))
const role = computed(() => (t.value === 'bad' || t.value === 'warn' ? 'alert' : 'status'))
</script>

<template>
  <div class="ui-notice" :class="`is-tone-${t}`" :role="role">
    <v-icon :icon="icon || TONE_ICON[t]" size="18" />
    <div class="ui-notice__text">
      <strong v-if="title" class="ui-notice__title">{{ title }}</strong>
      <span v-if="text">{{ text }}</span>
      <slot />
    </div>
    <div v-if="$slots.actions" class="ui-notice__actions"><slot name="actions" /></div>
    <button v-if="closable" type="button" class="ui-notice__close" aria-label="Fermer" title="Fermer" @click="$emit('close')">
      <v-icon icon="mdi-close" size="16" />
    </button>
  </div>
</template>
