<script setup>
import UiBadge from './UiBadge.vue'
import UiTable from './UiTable.vue'
import { SERVICE_COLUMNS, serviceRow } from './serviceTable'

/*
 * LE TABLEAU DES SERVICES D'UN PRODUIT (Adion UI, coordination#80) : le meme
 * pour tous - nom, etat, offre, projet, echeance - et un clic vers la fiche.
 * `services` : les services de Nexus (ou `rows` deja ranges par `serviceRow`) ;
 * `to` : le lien de la fiche d'une ligne. Les options de UiTable (recherche,
 * filtres, `pref-key`, creneau `after`...) passent telles quelles.
 */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  services: { type: Array, default: () => [] },
  /** Un produit qui nomme ou date autrement range lui-meme la ligne (`serviceRow(service, { name })`). */
  rowOf: { type: Function, default: null },
  to: { type: Function, default: null },
})
const rows = () => props.services.map((s) => (props.rowOf ? props.rowOf(s) : serviceRow(s)))
</script>

<template>
  <UiTable
    v-bind="$attrs"
    :columns="SERVICE_COLUMNS"
    :rows="rows()"
    :row-to="to ? (row) => to(row.raw || row) : null"
    :search-in="(row) => [row.name, row.offer, row.project, row.state.label]"
    search="Rechercher un service"
    empty="Aucun service sur ce projet."
  >
    <template #cell-state="{ row }"><UiBadge :label="row.state.label" :tone="row.state.tone" /></template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </UiTable>
</template>
