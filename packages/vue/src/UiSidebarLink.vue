<script setup>
/*
 * UNE ENTREE DU PIED DE LA BARRE (Adion UI, 2026-10-28) : Mes commandes,
 * Facturation, Mon compte... `external` montre la fleche d'un lien sortant ;
 * `expandable` ouvre ses sous-entrees (slot default : des UiSidebarChild).
 */
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  active: { type: Boolean, default: false },
  external: { type: Boolean, default: false },
  expandable: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button type="button" class="ui-sidebar__item is-compact" :class="{ 'is-active': active }" :aria-expanded="expandable ? open : undefined" @click="$emit('click')">
    <v-icon v-if="icon" :icon="icon" size="17" />
    <span class="ui-sidebar__label">{{ label }}</span>
    <v-icon v-if="external" icon="mdi-open-in-new" size="12" class="ui-sidebar__ext" />
    <v-icon v-if="expandable" icon="mdi-chevron-down" size="16" class="ui-sidebar__itemcaret" :class="{ 'is-open': open }" />
  </button>
  <div v-if="expandable && open && $slots.default" class="ui-sidebar__children"><slot /></div>
</template>
