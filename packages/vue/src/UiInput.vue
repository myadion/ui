<script setup>
import { computed, ref, useId } from 'vue'
import UiField from './UiField.vue'

/*
 * UN CHAMP DE SAISIE (Adion UI). Toujours la meme forme : filet, petit,
 * presque droit. Les attributs non declares (type, maxlength, suffix,
 * autocomplete, counter, @keyup.enter…) passent au v-text-field ;
 * `multiline` en fait une zone de texte.
 */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  required: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  multiline: { type: Boolean, default: false },
  /** Chasse fixe : un IBAN, une cle, un identifiant. */
  mono: { type: Boolean, default: false },
  rows: { type: [Number, String], default: 3 },
  /** L'identifiant du champ, quand l'ecran le fixe ; sinon le kit en donne un. */
  id: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
const auto = useId()
const fieldId = computed(() => props.id || auto)

// Pour ramener le curseur sur le champ (une erreur de saisie, par exemple).
const control = ref(null)
defineExpose({ focus: () => control.value?.focus() })
</script>

<template>
  <UiField :label="label" :tip="tip" :hint="hint" :error="error" :required="required" :for="fieldId" :wide="wide">
    <component
      :is="multiline ? 'v-textarea' : 'v-text-field'"
      v-bind="$attrs"
      ref="control"
      :id="fieldId"
      :model-value="modelValue"
      :placeholder="placeholder"
      :rows="multiline ? rows : undefined"
      :auto-grow="multiline || undefined"
      :error="Boolean(error && error.length)"
      variant="outlined"
      density="compact"
      hide-details="auto"
      class="ui-control"
      :class="{ 'is-mono': mono }"
      @update:model-value="(v) => $emit('update:modelValue', v)"
    >
      <!-- Les creneaux de Vuetify passent tels quels (item, selection, prepend-inner, append-inner...). -->
      <template v-for="(_, name) in $slots" #[name]="scope"><slot :name="name" v-bind="scope || {}" /></template>
    </component>
  </UiField>
</template>
