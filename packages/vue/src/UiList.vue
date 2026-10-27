<script setup>
/*
 * UNE LISTE A PUCES (Adion UI) : des regles, des conseils, ce que comprend
 * une offre. items : [{ text, icon }] ou des chaines.
 */
defineProps({
  items: { type: Array, default: () => [] },
  icon: { type: String, default: 'mdi-information-outline' },
})
</script>

<template>
  <ul class="ui-list">
    <li v-for="(item, index) in items" :key="index" class="ui-list__item">
      <v-icon :icon="(typeof item === 'object' && item.icon) || icon" size="16" />
      <span>{{ typeof item === 'object' ? item.text : item }}</span>
    </li>
    <slot />
  </ul>
</template>
