<script setup>
/*
 * UNE CASE (Adion UI). Trois formes :
 *
 *   - par defaut, une case et son libelle, avec une explication facultative
 *     dessous (`text`) : un droit, une option ;
 *   - `danger` : la case qui engage - « je comprends que tout sera
 *     supprime » - sur fond rouge pale ;
 *   - `switch` : un interrupteur qui agit tout de suite (activer, couper).
 *     Fin, a la hauteur d'un controle.
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  text: { type: String, default: '' },
  danger: { type: Boolean, default: false },
  switch: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const toggle = () => { if (!props.disabled) emit('update:modelValue', !props.modelValue) }
</script>

<template>
  <button
    v-if="$props.switch"
    type="button"
    role="switch"
    class="ui-switch"
    :class="{ 'is-on': modelValue }"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="ui-switch__track"><span class="ui-switch__thumb" /></span>
    <span>{{ label }}</span>
  </button>
  <button
    v-else
    type="button"
    role="checkbox"
    class="ui-check"
    :class="{ 'is-on': modelValue, 'ui-check--danger': danger }"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <v-icon :icon="modelValue ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" size="18" />
    <span class="ui-check__text">
      <span>{{ label }}</span>
      <small v-if="text">{{ text }}</small>
    </span>
  </button>
</template>
