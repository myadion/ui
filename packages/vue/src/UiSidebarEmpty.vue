<script setup>
/* Ce que dit l'arbre quand il est vide, ou qu'il charge (Adion UI, 2026-10-28). */
defineProps({
  text: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <div class="ui-sidebar__empty">
    <v-progress-circular v-if="loading" indeterminate size="16" width="2" />
    <template v-else>{{ text }}</template>
  </div>
</template>
