<script setup>
/* Deux ou trois rangements de la barre de gauche, en onglets (Adion UI, 2026-10-28). items = [{ value, label }]. */
defineProps({
  modelValue: { type: String, default: '' },
  items: { type: Array, default: () => [] },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="ui-sidebar__modes" role="tablist">
    <button v-for="item in items" :key="item.value" type="button" role="tab" :aria-selected="modelValue === item.value" :class="{ 'is-on': modelValue === item.value }" @click="$emit('update:modelValue', item.value)">{{ item.label }}</button>
  </div>
</template>
