<script setup>
/* Le pied de la barre de gauche (« Transverse »), repliable (Adion UI, 2026-10-28). Slot : des UiSidebarLink. */
defineProps({
  title: { type: String, required: true },
  open: { type: Boolean, default: true },
  openLabel: { type: String, default: 'Réduire' },
  closedLabel: { type: String, default: 'Afficher' },
})
defineEmits(['toggle'])
</script>

<template>
  <div class="ui-sidebar__foot">
    <button type="button" class="ui-sidebar__foothead" :aria-expanded="open" @click="$emit('toggle')">
      <span>{{ title }}</span>
      <span class="ui-sidebar__foottoggle">{{ open ? openLabel : closedLabel }}<v-icon :icon="open ? 'mdi-chevron-down' : 'mdi-chevron-up'" size="15" /></span>
    </button>
    <template v-if="open"><slot /></template>
  </div>
</template>
