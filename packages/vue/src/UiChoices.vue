<script setup>
import { computed } from 'vue'
import UiCheckbox from './UiCheckbox.vue'
import UiField from './UiField.vue'

/*
 * UNE LISTE DE CHOIX DECRITS (Adion UI) : des droits (scopes) avec leur
 * description, des projets autorises, des options. Chaque choix porte son
 * libelle et sa phrase ; `multiple` (par defaut) pour en cocher plusieurs,
 * sinon un seul. Les choix viennent de Nexus : { value, label, description }.
 */
const props = defineProps({
  modelValue: { type: [Array, String, Number], default: () => [] },
  items: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  multiple: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  /** Deux colonnes sur grand ecran, pour une longue liste (des droits). */
  columns: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const picked = computed(() => (props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : [props.modelValue]))
const isOn = (value) => picked.value.includes(value)

function set(value, on) {
  if (!props.multiple) return emit('update:modelValue', value)
  const next = picked.value.filter((v) => v !== value)
  if (on) next.push(value)
  emit('update:modelValue', next)
}
</script>

<template>
  <UiField :label="label" :tip="tip" :error="error">
    <div class="ui-checks" :class="{ 'is-columns': columns }">
      <UiCheckbox
        v-for="item in items"
        :key="item.value"
        :model-value="isOn(item.value)"
        :label="item.label || item.title || String(item.value)"
        :text="item.description || ''"
        :disabled="disabled || item.disabled"
        @update:model-value="(on) => set(item.value, on)"
      />
    </div>
  </UiField>
</template>
