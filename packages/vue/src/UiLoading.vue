<script setup>
/*
 * LE CHARGEMENT (Adion UI). Trois formes, chacune sa place :
 *
 *   bar       une liste qui se recharge : un trait sous le titre ;
 *   page      une page qui arrive : le squelette d'un titre et d'un texte ;
 *   inline    un petit rond et un mot, dans une ligne.
 */
defineProps({
  variant: { type: String, default: 'bar', validator: (v) => ['bar', 'page', 'inline'].includes(v) },
  label: { type: String, default: '' },
})
</script>

<template>
  <div v-if="variant === 'page'" class="ui-loading" aria-busy="true">
    <v-skeleton-loader type="heading, paragraph, table-heading, table-row-divider, table-row" />
  </div>
  <span v-else-if="variant === 'inline'" class="ui-loading is-inline" aria-busy="true">
    <v-progress-circular indeterminate size="14" width="2" />
    <span v-if="label" class="ui-loading__label">{{ label }}</span>
  </span>
  <div v-else class="ui-loading" aria-busy="true">
    <div class="ui-loading__line"><span /></div>
    <span v-if="label" class="ui-loading__label">{{ label }}</span>
  </div>
</template>
