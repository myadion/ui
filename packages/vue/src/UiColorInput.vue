<script setup>
import { useId } from 'vue'
import UiField from './UiField.vue'

/*
 * UNE COULEUR (Adion UI, 2026-10-14) : le nuancier du navigateur, comme dans
 * l'apparence des courriels d'Orbit, et la valeur en #rrggbb a cote pour
 * coller celle d'une charte. Ce que Nexus refuse s'affiche dessous.
 */
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const id = useId()
const HEX = /^#[0-9a-fA-F]{6}$/
</script>

<template>
  <UiField :label="label" :tip="tip" :error="error" :for="id">
    <div class="ui-color">
      <input
        type="color"
        class="ui-color__swatch"
        :value="HEX.test(modelValue || '') ? modelValue : '#000000'"
        :disabled="disabled"
        :aria-label="`${label} : nuancier`"
        @input="emit('update:modelValue', $event.target.value)"
      >
      <input
        :id="id"
        type="text"
        class="ui-color__hex"
        :value="modelValue"
        maxlength="7"
        spellcheck="false"
        placeholder="#000000"
        :disabled="disabled"
        @change="emit('update:modelValue', $event.target.value.trim())"
      >
    </div>
  </UiField>
</template>
