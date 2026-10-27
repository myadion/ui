<script setup>
import { useId } from 'vue'
import UiField from './UiField.vue'

/*
 * UN CHAMP DE SAISIE (Adion UI). Toujours la meme forme : filet, petit,
 * presque droit. Les attributs non declares (type, maxlength, suffix,
 * autocomplete, counter, @keyup.enter…) passent au v-text-field ;
 * `multiline` en fait une zone de texte.
 */
defineOptions({ inheritAttrs: false })
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  required: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  multiline: { type: Boolean, default: false },
  rows: { type: [Number, String], default: 3 },
})
defineEmits(['update:modelValue'])
const id = useId()
</script>

<template>
  <UiField :label="label" :tip="tip" :hint="hint" :error="error" :required="required" :for="id" :wide="wide">
    <component
      :is="multiline ? 'v-textarea' : 'v-text-field'"
      v-bind="$attrs"
      :id="id"
      :model-value="modelValue"
      :placeholder="placeholder"
      :rows="multiline ? rows : undefined"
      :auto-grow="multiline || undefined"
      :error="Boolean(error && error.length)"
      variant="outlined"
      density="compact"
      hide-details="auto"
      class="ui-control"
      @update:model-value="(v) => $emit('update:modelValue', v)"
    />
  </UiField>
</template>
