<script setup>
import { computed } from 'vue'
import UiSelect from './UiSelect.vue'
import { clashMessage, groupedTargets } from './columnMap'

/*
 * LA CORRESPONDANCE DES COLONNES (Adion UI) : pour chaque colonne d'un
 * fichier, son nom et un exemple a gauche, « Va dans » a droite. Les cibles
 * viennent de l'API, groupees (Canaux, Identite...), avec la colonne libre de
 * la colonne et « Ne pas importer ». Une cible deja prise par une autre
 * colonne se dit sous le choix. `v-model` est la cible de chaque colonne, par son rang (tableau ou { rang: cible }).
 * Sur telephone, l'exemple passe sous le nom et le choix prend la largeur.
 */
const props = defineProps({
  modelValue: { type: [Object, Array], default: () => ({}) },
  columns: { type: Array, default: () => [] },
  targets: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const rows = computed(() => props.columns.map((column) => ({
  column,
  items: groupedTargets(props.targets, column),
  error: clashMessage(column.index, props.modelValue, props.columns, props.targets),
})))

function pick(index, value) {
  const next = Array.isArray(props.modelValue) ? [...props.modelValue] : { ...props.modelValue }
  next[index] = value
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="ui-colmap" role="list">
    <div class="ui-colmap__head" aria-hidden="true"><span>Colonne du fichier</span><span>Va dans</span></div>
    <div v-for="row in rows" :key="row.column.index" class="ui-colmap__row" role="listitem">
      <div class="ui-colmap__source">
        <span class="ui-colmap__name">{{ row.column.header || `Colonne ${row.column.index + 1}` }}</span>
        <span v-if="row.column.example" class="ui-colmap__example">{{ row.column.example }}</span>
      </div>
      <v-icon class="ui-colmap__arrow" icon="mdi-arrow-right" size="16" aria-hidden="true" />
      <UiSelect
        class="ui-colmap__target"
        :model-value="modelValue[row.column.index]"
        :items="row.items"
        :error="row.error"
        :aria-label="`Destination de la colonne ${row.column.header || row.column.index + 1}`"
        @update:model-value="(v) => pick(row.column.index, v)"
      />
    </div>
  </div>
</template>
