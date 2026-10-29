<script setup>
import { computed } from 'vue'
import UiField from './UiField.vue'

/*
 * UN CURSEUR (Adion UI, 2026-10-29, d'apres l'estimateur de /maquette) : un
 * libelle, la valeur dite en clair a droite, la piste remplie du vert d'Adion.
 *
 *   format(value)   la valeur affichee (defaut : le nombre et `unit`)
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  unit: { type: String, default: '' },
  format: { type: Function, default: null },
  disabled: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
const id = `ui-slider-${Math.random().toString(36).slice(2, 9)}`
const pct = computed(() => (props.max > props.min ? ((props.modelValue - props.min) / (props.max - props.min)) * 100 : 0))
const shown = computed(() => (props.format ? props.format(props.modelValue) : `${props.modelValue}${props.unit ? ` ${props.unit}` : ''}`))
</script>

<template>
  <UiField :label="label" :tip="tip" :hint="hint" :error="error" :for="id" :wide="wide">
    <div class="ui-slider">
      <input
        :id="id"
        type="range"
        class="ui-slider__input"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :disabled="disabled"
        :style="{ '--p': `${pct}%` }"
        @input="$emit('update:modelValue', Number($event.target.value))"
      />
      <output :for="id" class="ui-slider__value">{{ shown }}</output>
    </div>
  </UiField>
</template>
