<script setup>
import { computed, ref } from 'vue'
import UiField from './UiField.vue'
import { addTags } from './tags'

/*
 * UN CHAMP A PASTILLES (Adion UI) : des numeros, des adresses, des noms. On
 * tape puis Entree, ou on colle une liste : chaque valeur devient une
 * pastille qu'on retire d'un clic. `invalid` ({ valeur: raison }) marque en
 * rouge celles que Nexus a ecartees, la raison en infobulle. Ne coupe pas aux
 * espaces : « 06 12 34 56 78 » est une seule valeur.
 */
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  placeholder: { type: String, default: '' },
  invalid: { type: Object, default: () => ({}) },
  max: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const id = `ui-tags-${Math.random().toString(36).slice(2, 9)}`
const draft = ref('')
const input = ref(null)
const full = computed(() => props.max > 0 && props.modelValue.length >= props.max)

function commit(text = draft.value) {
  const next = addTags(props.modelValue, text, { max: props.max })
  if (next.length !== props.modelValue.length) emit('update:modelValue', next)
  draft.value = ''
}
function remove(index) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
  input.value?.focus()
}
function onKey(event) {
  if (event.key === 'Enter' || event.key === ',' || event.key === ';') {
    event.preventDefault()
    commit()
  } else if (event.key === 'Backspace' && !draft.value && props.modelValue.length) {
    remove(props.modelValue.length - 1)
  }
}
function onPaste(event) {
  const text = event.clipboardData?.getData('text') || ''
  if (!/[\n\r,;\t]/.test(text)) return
  event.preventDefault()
  commit(`${draft.value}\n${text}`)
}
</script>

<template>
  <UiField :label="label" :tip="tip" :hint="hint" :error="error" :for="id" :wide="wide">
    <div class="ui-tags" :class="{ 'is-disabled': disabled, 'is-error': Boolean(error && error.length) }" @click="input?.focus()">
      <span
        v-for="(tag, index) in modelValue"
        :key="tag"
        class="ui-tags__tag"
        :class="{ 'is-bad': invalid[tag] }"
        :title="invalid[tag] || undefined"
      >
        <v-icon v-if="invalid[tag]" icon="mdi-alert-circle-outline" size="13" />
        <span class="ui-tags__text">{{ tag }}</span>
        <button v-if="!disabled" type="button" class="ui-tags__remove" :aria-label="`Retirer ${tag}`" @click.stop="remove(index)">
          <v-icon icon="mdi-close" size="13" />
        </button>
      </span>
      <input
        :id="id"
        ref="input"
        v-model="draft"
        class="ui-tags__input"
        type="text"
        :placeholder="modelValue.length ? '' : placeholder"
        :disabled="disabled || full"
        @keydown="onKey"
        @paste="onPaste"
        @blur="commit()"
      >
    </div>
  </UiField>
</template>
