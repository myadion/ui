<script setup>
/* Une sous-entree du pied de la barre (Adion UI, 2026-10-28). `danger` pour Se deconnecter. */
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
  external: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button type="button" class="ui-sidebar__child" :class="{ 'is-active': active, 'is-danger': danger }" @click="$emit('click')">
    {{ label }}
    <v-icon v-if="external" icon="mdi-open-in-new" size="11" class="ui-sidebar__ext" />
  </button>
</template>
