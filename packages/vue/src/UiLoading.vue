<script setup>
import UiSkeleton from './UiSkeleton.vue'

/*
 * LE CHARGEMENT (Adion UI). Trois formes, chacune sa place :
 *
 *   bar       un bloc (une liste, une section) qui attend sa premiere
 *             reponse : des lignes en traits, a la place du contenu - plus le
 *             trait qui glissait (Kevin, le 2026-11-17 : chaque champ en
 *             chargement, pas un loader) ;
 *   page      une page qui arrive : le squelette d'un titre et d'un texte ;
 *   inline    un petit rond et un mot, dans une ligne.
 */
defineProps({
  variant: { type: String, default: 'bar', validator: (v) => ['bar', 'page', 'inline'].includes(v) },
  label: { type: String, default: '' },
  /** Le nombre de lignes en traits de la forme `bar`. */
  lines: { type: Number, default: 3 },
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
    <UiSkeleton :lines="lines" size="line" />
    <span v-if="label" class="ui-loading__label">{{ label }}</span>
  </div>
</template>
