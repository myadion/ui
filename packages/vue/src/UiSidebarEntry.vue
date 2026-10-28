<script setup>
/*
 * UN SERVICE DANS L'ARBRE (Adion UI, 2026-10-28). Une icone, ou une pastille
 * d'etat (`tone` : good, warn, muted), le nom, une couronne pour un site
 * principal ; `child` le range sous son parent.
 */
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  tone: { type: String, default: '' },
  active: { type: Boolean, default: false },
  child: { type: Boolean, default: false },
  crown: { type: Boolean, default: false },
  title: { type: String, default: '' },
})
defineEmits(['click'])
</script>

<template>
  <button type="button" class="ui-sidebar__entry" :class="{ 'is-active': active, 'is-child': child }" :title="title || label" @click="$emit('click')">
    <v-icon v-if="icon" :icon="icon" size="14" class="ui-sidebar__kind" />
    <span v-else-if="tone" class="ui-sidebar__dot" :class="`is-${tone}`" />
    <span class="ui-sidebar__label">{{ label }}</span>
    <v-icon v-if="crown" icon="mdi-crown-outline" size="12" class="ui-sidebar__crown" aria-label="Site principal" />
  </button>
</template>
