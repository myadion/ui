<script setup>
import { computed } from 'vue'
import UiButton from './UiButton.vue'

/*
 * ECRIRE DANS LE FIL (Adion UI, mode outil, 2026-11-17) : une note pour
 * l'equipe ou une reponse au client, sans quitter le dossier. Le mode choisi
 * dit toujours a qui le texte ira : on ne confond pas note et reponse.
 *
 *   v-model       le texte
 *   v-model:mode  la cle du mode
 *   modes         [{ key, label, icon, placeholder, hint, submit }]
 *                 hint : a qui ira le texte ; submit : le mot du bouton
 *   @submit({ mode, text })   Ctrl + Entree, ou le bouton. Rien ne part seul.
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  mode: { type: String, default: '' },
  modes: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'update:mode', 'submit'])

const current = computed(() => props.modes.find((entry) => entry.key === props.mode) || props.modes[0] || {})
const ready = computed(() => props.modelValue.trim().length > 0)
function submit() {
  if (ready.value) emit('submit', { mode: current.value.key, text: props.modelValue.trim() })
}
</script>

<template>
  <form class="ui-composer" :class="[current.key && `is-${current.key}`, { 'has-text': ready }]" @submit.prevent="submit">
    <div v-if="modes.length > 1" class="ui-composer__modes" role="group" aria-label="Nature du texte">
      <button v-for="entry in modes" :key="entry.key" type="button" class="ui-composer__mode" :class="{ 'is-active': entry.key === current.key }" :aria-pressed="entry.key === current.key" @click="emit('update:mode', entry.key)">
        <v-icon v-if="entry.icon" :icon="entry.icon" size="14" />{{ entry.label }}
      </button>
    </div>
    <textarea
      class="ui-composer__input"
      rows="1"
      :value="modelValue"
      :placeholder="current.placeholder || 'Écrire…'"
      :aria-label="current.label || 'Écrire'"
      @input="emit('update:modelValue', $event.target.value)"
      @keydown.ctrl.enter.prevent="submit"
      @keydown.meta.enter.prevent="submit"
    />
    <div class="ui-composer__foot">
      <span class="ui-composer__hint">{{ current.hint }}</span>
      <UiButton kind="primary" type="submit" :disabled="!ready" title="Ctrl + Entrée">{{ current.submit || 'Enregistrer' }}</UiButton>
    </div>
  </form>
</template>
