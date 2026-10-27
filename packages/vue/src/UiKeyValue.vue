<script setup>
import { computed } from 'vue'

/*
 * DES FAITS (Adion UI). Une seule forme depuis la relecture de Kevin
 * (2026-10-13) : l'intitule dans une colonne fixe, la valeur a cote, une
 * ligne par fait, les colonnes alignees d'une fiche a l'autre.
 *
 *   columns  1 (par defaut) ou 2 : deux listes cote a cote sur grand ecran ;
 *   dense    des lignes serrees, pour le detail d'une ligne de tableau ;
 *   tiles    une grille de petites tuiles (intitule au-dessus, valeur dessous),
 *            pour une fiche d'informations : la valeur reste sous son intitule.
 *
 * items : [{ label, value, tip, mono, key }] ; une valeur se dessine aussi par
 * le creneau `value-<key>`. Une valeur vide s'affiche « — ». L'ancien
 * `layout` (grid, list, inline) reste compris : grid vaut deux colonnes,
 * inline vaut dense.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Number, default: 1 },
  dense: { type: Boolean, default: false },
  tiles: { type: Boolean, default: false },
  layout: { type: String, default: '' },
})

const twoColumns = computed(() => props.columns === 2 || props.layout === 'grid')
const isDense = computed(() => props.dense || props.layout === 'inline')
</script>

<template>
  <dl class="ui-kv" :class="{ 'is-2': twoColumns, 'is-dense': isDense, 'is-tiles': tiles }">
    <div v-for="(item, index) in items" :key="item.key || item.label || index" class="ui-kv__row">
      <dt>
        {{ item.label }}
        <v-tooltip v-if="item.tip" location="top" max-width="320">
          <template #activator="{ props: on }"><span v-bind="on" class="ui-field__tip" tabindex="0" :aria-label="item.tip"><v-icon icon="mdi-help-circle-outline" /></span></template>
          {{ item.tip }}
        </v-tooltip>
      </dt>
      <dd :class="{ 'ui-mono': item.mono }">
        <slot :name="`value-${item.key}`" :item="item">{{ item.value === null || item.value === undefined || item.value === '' ? '—' : item.value }}</slot>
      </dd>
    </div>
  </dl>
</template>
