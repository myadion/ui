<script setup>
/* Une famille de la barre de gauche (Web, Telecom, Cloud...), repliable (Adion UI, 2026-10-28). */
defineProps({
  label: { type: String, required: true },
  open: { type: Boolean, default: true },
})
defineEmits(['toggle'])
</script>

<template>
  <div class="ui-sidebar__section">
    <button type="button" class="ui-sidebar__sectionhead" :aria-expanded="open" @click="$emit('toggle')">
      {{ label }}
      <v-icon icon="mdi-chevron-down" size="14" class="ui-sidebar__sectioncaret" :class="{ 'is-folded': !open }" />
    </button>
    <template v-if="open"><slot /></template>
  </div>
</template>
