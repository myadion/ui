<script setup>
import { computed, ref, useId } from 'vue'
import UiField from './UiField.vue'
import { acceptsFile, fileSize } from './fileSize'

/*
 * UN DEPOT DE FICHIER (Adion UI) : on glisse le fichier sur la zone ou on la
 * clique. Une fois choisi, la zone dit son nom et sa taille, avec « Changer »
 * et « Retirer ». `accept` filtre (« .csv,text/csv ») ; un fichier refuse se
 * dit sous la zone. `v-model` est le File (ou null). Le contenu n'est lu ni
 * envoye ici : c'est l'ecran qui decide.
 */
const props = defineProps({
  modelValue: { type: Object, default: null },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  accept: { type: String, default: '' },
  prompt: { type: String, default: 'Glissez un fichier ici ou cliquez pour le choisir' },
  icon: { type: String, default: 'mdi-file-upload-outline' },
  disabled: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const id = useId()
const input = ref(null)
const over = ref(false)
const refused = ref('')
const shownError = computed(() => refused.value || props.error)

function take(file) {
  if (!file || props.disabled) return
  if (!acceptsFile(file, props.accept)) {
    refused.value = `« ${file.name} » n’est pas d’un type accepté (${props.accept}).`
    return
  }
  refused.value = ''
  emit('update:modelValue', file)
}
function onChange(event) {
  take(event.target.files?.[0])
  event.target.value = ''
}
function onDrop(event) {
  over.value = false
  take(event.dataTransfer?.files?.[0])
}
function clear() {
  refused.value = ''
  emit('update:modelValue', null)
}
const choose = () => { if (!props.disabled) input.value?.click() }
</script>

<template>
  <UiField :label="label" :tip="tip" :hint="hint" :error="shownError" :for="id" :wide="wide">
    <input :id="id" ref="input" class="ui-drop__native" type="file" :accept="accept || undefined" :disabled="disabled" @change="onChange">
    <div v-if="modelValue" class="ui-drop is-filled">
      <v-icon :icon="icon" size="20" aria-hidden="true" />
      <span class="ui-drop__file">
        <span class="ui-drop__name">{{ modelValue.name }}</span>
        <span class="ui-drop__size">{{ fileSize(modelValue.size) }}</span>
      </span>
      <button type="button" class="ui-drop__link" :disabled="disabled" @click="choose">Changer</button>
      <button type="button" class="ui-drop__link" :disabled="disabled" @click="clear">Retirer</button>
    </div>
    <button
      v-else
      type="button"
      class="ui-drop"
      :class="{ 'is-over': over, 'is-error': Boolean(shownError && shownError.length), 'is-disabled': disabled }"
      :disabled="disabled"
      @click="choose"
      @dragenter.prevent="over = true"
      @dragover.prevent="over = true"
      @dragleave.prevent="over = false"
      @drop.prevent="onDrop"
    >
      <v-icon :icon="icon" size="24" aria-hidden="true" />
      <span class="ui-drop__prompt">{{ prompt }}</span>
    </button>
  </UiField>
</template>
