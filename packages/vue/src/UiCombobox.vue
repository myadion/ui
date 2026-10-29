<script setup>
import { useId } from 'vue'
import UiField from './UiField.vue'

/*
 * UN CHOIX QUI ACCEPTE AUSSI SA PROPRE VALEUR (Adion UI) : une liste
 * proposee, et la liberte d'ecrire autre chose - un domaine, une adresse,
 * une etiquette. `multiple` pour en saisir plusieurs.
 */
defineOptions({ inheritAttrs: false })
defineProps({
  modelValue: { type: [String, Number, Array, Object], default: null },
  items: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  required: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
const id = useId()
</script>

<template>
  <UiField :label="label" :tip="tip" :hint="hint" :error="error" :required="required" :for="id" :wide="wide">
    <v-combobox
      v-bind="$attrs"
      :id="id"
      :model-value="modelValue"
      :items="items"
      :placeholder="placeholder"
      :multiple="multiple"
      :chips="multiple || undefined"
      :closable-chips="multiple || undefined"
      :error="Boolean(error && error.length)"
      variant="outlined"
      density="compact"
      hide-details="auto"
      class="ui-control"
      @update:model-value="(v) => $emit('update:modelValue', v)"
    >
      <!-- Les creneaux de Vuetify passent tels quels (item, selection, chip...). -->
      <template v-for="(_, name) in $slots" #[name]="scope"><slot :name="name" v-bind="scope || {}" /></template>
    </v-combobox>
  </UiField>
</template>
