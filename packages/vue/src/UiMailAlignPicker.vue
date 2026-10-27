<script setup>
/*
 * L'ALIGNEMENT D'UN BLOC (Adion UI, repris de MailAlignPicker d'Orbit) :
 * trois boutons, a gauche, au centre, a droite.
 */
defineProps({
  modelValue: { type: String, default: 'left' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])

const CHOICES = Object.freeze([
  { value: 'left', icon: 'mdi-format-align-left', label: 'À gauche' },
  { value: 'center', icon: 'mdi-format-align-center', label: 'Au centre' },
  { value: 'right', icon: 'mdi-format-align-right', label: 'À droite' },
])
</script>

<template>
  <div class="ui-segmented ui-mail-align" role="radiogroup" aria-label="Alignement">
    <button
      v-for="choice in CHOICES"
      :key="choice.value"
      type="button"
      role="radio"
      class="ui-segmented__item"
      :class="{ 'is-active': (modelValue || 'left') === choice.value }"
      :aria-checked="(modelValue || 'left') === choice.value"
      :aria-label="choice.label"
      :title="choice.label"
      :disabled="disabled"
      @click="$emit('update:modelValue', choice.value)"
    >
      <v-icon :icon="choice.icon" size="16" />
    </button>
  </div>
</template>
