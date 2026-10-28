<script setup>
/* Le filtre de la barre de gauche, avec sa croix (Adion UI, 2026-10-28). */
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Filtrer' },
  label: { type: String, default: 'Filtrer' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="ui-sidebar__search">
    <v-icon icon="mdi-magnify" size="14" />
    <input :value="modelValue" type="search" :placeholder="placeholder" :aria-label="label" @input="$emit('update:modelValue', $event.target.value)" />
    <button v-if="modelValue" type="button" class="ui-sidebar__clear" aria-label="Effacer" @click="$emit('update:modelValue', '')"><v-icon icon="mdi-close" size="12" /></button>
  </label>
</template>
