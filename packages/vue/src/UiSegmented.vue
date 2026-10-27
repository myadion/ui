<script setup>
import UiField from './UiField.vue'

/*
 * UN CHOIX EXCLUSIF ENTRE QUELQUES ETATS (Adion UI) : un segment, plutot
 * qu'une liste a ouvrir. Quatre choix au plus ; au-dela, UiSelect.
 */
defineProps({
  modelValue: { type: [String, Number, Boolean], default: null },
  /** @type {Array<{value:any,label:string,icon?:string,disabled?:boolean}>} */
  items: { type: Array, required: true },
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <UiField :label="label" :tip="tip" :wide="wide">
    <div class="ui-segmented" role="radiogroup" :aria-label="label || undefined">
      <button
        v-for="item in items"
        :key="String(item.value)"
        type="button"
        role="radio"
        class="ui-segmented__item"
        :class="{ 'is-active': modelValue === item.value }"
        :aria-checked="modelValue === item.value"
        :disabled="item.disabled"
        @click="$emit('update:modelValue', item.value)"
      >
        <v-icon v-if="item.icon" :icon="item.icon" size="15" />{{ item.label }}
      </button>
    </div>
  </UiField>
</template>
