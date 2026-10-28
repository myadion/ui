<script setup>
import { computed, onMounted, ref, useSlots, watch } from 'vue'
import { useRouter } from 'vue-router'
import { rowActivates } from './rows'
import { cellValue, filterRows, nextSort, paginate, searchRows, sortRows } from './table'
import UiEmpty from './UiEmpty.vue'
import UiLoading from './UiLoading.vue'
import UiNotice from './UiNotice.vue'
import UiToolbar from './UiToolbar.vue'
import UiButton from './UiButton.vue'
import UiCheckbox from './UiCheckbox.vue'
import { arrangeColumns, isDefault, moveColumn, toggleColumn, visibleColumns } from './columns'
import { usePreference } from './preferences'

/*
 * LE TABLEAU (Adion UI). Une seule facon de lister des choses dans l'espace
 * client : la recherche et les filtres au-dessus, les colonnes triables, la
 * ligne qui s'ouvre d'un clic avec son « Ouvrir » a droite, la pagination,
 * l'etat vide qui propose une suite. Sur telephone, chaque ligne devient une
 * fiche (`stack`).
 *
 * Colonnes : { key, label, align: 'num'|'right', sortable, value(row),
 * sortValue(row), main, mono, muted, nowrap, ellipsis, icon, tone, sub }. Une
 * cellule se dessine par le creneau `cell-<key>` ({ row, value }).
 *
 * Comme /maquette (2026-10-28) : `icon(row)` pose une tuile devant la valeur,
 * teintee par `tone(row)` (ok, info, warn, bad, muted) ; `sub(row)` ajoute une
 * seconde ligne grise. `quick(row)` donne des gestes en icones au bout de la
 * ligne ([{ key, icon, label, tone? }]) : `quick` est emis avec { key, row }.
 *
 * Deux modes :
 *   - par defaut, tout se fait ici (recherche, filtres, tri, pages) ;
 *   - `server` : l'API cherche et pagine ; le tableau emet `query`
 *     ({ search, filters, page }) et affiche `pages`.
 */
const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  rowKey: { type: [String, Function], default: 'id' },
  search: { type: [Boolean, String], default: false },
  searchIn: { type: Function, default: null },
  filters: { type: Array, default: () => [] },
  rowTo: { type: Function, default: null },
  goLabel: { type: [String, Function], default: 'Ouvrir' },
  quick: { type: Function, default: null },
  pageSize: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  empty: { type: String, default: 'Rien à afficher pour le moment.' },
  emptySearch: { type: String, default: 'Aucune ligne ne correspond à cette recherche.' },
  dense: { type: Boolean, default: false },
  stack: { type: Boolean, default: true },
  expandable: { type: Boolean, default: false },
  server: { type: Boolean, default: false },
  pages: { type: Number, default: 1 },
  initialSort: { type: Object, default: null },
  /**
   * La cle des colonnes choisies par le client (« sms-services ») : un menu
   * Colonnes apparait, et le choix le suit d'un appareil a l'autre
   * (/me/preference/table.<cle>, stockage local en repli).
   */
  prefKey: { type: String, default: '' },
})
const emit = defineEmits(['query', 'retry', 'row-click', 'search', 'quick'])
const call = (v, row) => (typeof v === 'function' ? v(row) : v)

const router = useRouter()
const needle = ref('')
const active = ref({})
const sort = ref(props.initialSort || { key: '', dir: 'asc' })

const columnPref = usePreference(props.prefKey ? `table.${props.prefKey}` : '')
onMounted(() => { if (props.prefKey) columnPref.load() })
const shown = computed(() => (props.prefKey ? visibleColumns(props.columns, columnPref.value.value) : props.columns))
const arranged = computed(() => arrangeColumns(props.columns, columnPref.value.value))
const columnsDefault = computed(() => isDefault(props.columns, columnPref.value.value))
const toggle = (key) => columnPref.save(toggleColumn(props.columns, columnPref.value.value, key))
const move = (key, step) => columnPref.save(moveColumn(props.columns, columnPref.value.value, key, step))
const page = ref(1)
const opened = ref(null)

const keyOf = (row, index) => (typeof props.rowKey === 'function' ? props.rowKey(row) : row?.[props.rowKey] ?? index)
const searchPlaceholder = computed(() => (typeof props.search === 'string' && props.search ? props.search : 'Rechercher'))
const narrowed = computed(() => Boolean(needle.value.trim()) || Object.values(active.value).some((v) => v !== null && v !== undefined && v !== ''))

const prepared = computed(() => {
  if (props.server) return props.rows
  const found = searchRows(props.rows, needle.value, props.columns, props.searchIn)
  return sortRows(filterRows(found, active.value, props.filters), sort.value, props.columns)
})
const view = computed(() => (props.server
  ? { rows: props.rows, page: page.value, pages: props.pages }
  : paginate(prepared.value, page.value, props.pageSize)))

function emitQuery() {
  if (props.server) emit('query', { search: needle.value.trim(), filters: { ...active.value }, page: page.value })
}
watch(needle, (value) => { page.value = 1; emit('search', value.trim()); if (props.server) emitQuery() })
watch(active, () => { page.value = 1; emitQuery() }, { deep: true })
watch(() => props.rows, () => { if (!props.server && page.value > view.value.pages) page.value = 1 })

function toggleSort(column) {
  if (!column.sortable || props.server) return
  sort.value = nextSort(sort.value, column.key)
}

function onRow(event, row, index) {
  if (!rowActivates(event)) return
  if (props.expandable) {
    const key = keyOf(row, index)
    opened.value = opened.value === key ? null : key
    return
  }
  if (props.rowTo) router.push(props.rowTo(row))
  else emit('row-click', row)
}

const clickable = computed(() => Boolean(props.rowTo) || props.expandable)
const goText = (row) => (typeof props.goLabel === 'function' ? props.goLabel(row) : props.goLabel)
const colCount = computed(() => shown.value.length + (props.rowTo || hasRowActions.value || props.quick ? 1 : 0))
const slots = useSlots()
const hasRowActions = computed(() => Boolean(slots['row-actions']))
const alignClass = (column) => ({ num: 'num', right: 'right' }[column.align] || '')
const cellClass = (column) => [
  alignClass(column),
  column.main ? 'strong is-main' : '',
  column.muted ? 'ui-muted' : '',
  column.mono ? 'ui-mono' : '',
  column.nowrap ? 'ui-nowrap' : '',
  column.ellipsis ? 'ui-table__ellipsis' : '',
]

function setPage(value) {
  page.value = value
  emitQuery()
}

function clear() {
  needle.value = ''
  active.value = {}
}

defineExpose({ clear })
</script>

<template>
  <div class="ui-table" :class="{ 'ui-table--stack': stack }">
    <UiToolbar
      v-if="search || filters.length || $slots.toolbar || prefKey"
      :search="search ? needle : null"
      :placeholder="searchPlaceholder"
      @update:search="(v) => { needle = v }"
    >
      <template #filters>
        <v-select
          v-for="filter in filters"
          :key="filter.key"
          v-model="active[filter.key]"
          :items="filter.items"
          :item-title="filter.itemTitle || 'title'"
          :item-value="filter.itemValue || 'value'"
          :placeholder="filter.label"
          :aria-label="filter.label"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="ui-control ui-toolbar__filter"
        />
      </template>
      <slot name="toolbar" />
      <v-menu v-if="prefKey" location="bottom end" :close-on-content-click="false">
        <template #activator="{ props: on }">
          <UiButton v-bind="on" kind="quiet" icon="mdi-view-column-outline">Colonnes</UiButton>
        </template>
        <div class="ui-colmenu" role="dialog" aria-label="Colonnes du tableau">
          <span class="ui-colmenu__title">Colonnes affichées</span>
          <div v-for="(column, index) in arranged" :key="column.key" class="ui-colmenu__row">
            <UiCheckbox :model-value="column.visible" :label="column.label || column.key" :disabled="Boolean(column.main || column.required)" @update:model-value="toggle(column.key)" />
            <UiButton kind="quiet" icon="mdi-chevron-up" icon-only :title="`Monter « ${column.label} »`" :disabled="index === 0" @click="move(column.key, -1)" />
            <UiButton kind="quiet" icon="mdi-chevron-down" icon-only :title="`Descendre « ${column.label} »`" :disabled="index === arranged.length - 1" @click="move(column.key, 1)" />
          </div>
          <div class="ui-colmenu__foot">
            <UiButton kind="quiet" icon="mdi-restore" :disabled="columnsDefault" @click="columnPref.reset()">Colonnes par défaut</UiButton>
          </div>
        </div>
      </v-menu>
    </UiToolbar>

    <UiLoading v-if="loading" />
    <UiNotice v-if="error" tone="bad" :text="error">
      <template #actions><v-btn variant="text" size="small" class="btn-sentence-case" prepend-icon="mdi-refresh" @click="$emit('retry')">Réessayer</v-btn></template>
    </UiNotice>

    <div v-if="view.rows.length" class="table-wrap">
      <table class="grid-table" :class="{ 'grid-table--dense': dense }">
        <thead>
          <tr>
            <th v-for="column in shown" :key="column.key" :class="alignClass(column)" :aria-sort="sort.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined">
              <button v-if="column.sortable && !server" type="button" class="ui-table__th-sort" :class="{ 'is-sorted': sort.key === column.key }" @click="toggleSort(column)">
                {{ column.label }}
                <v-icon :icon="sort.key !== column.key ? 'mdi-swap-vertical' : sort.dir === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'" size="12" />
              </button>
              <template v-else>{{ column.label }}</template>
            </th>
            <th v-if="rowTo || quick || $slots['row-actions']" class="right" />
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in view.rows" :key="keyOf(row, index)">
            <tr :class="{ 'is-clickable': clickable }" @click="onRow($event, row, index)">
              <td v-for="column in shown" :key="column.key" :class="cellClass(column)" :data-label="column.label || undefined">
                <slot :name="`cell-${column.key}`" :row="row" :value="cellValue(row, column)">
                  <span v-if="column.icon || column.sub" class="ui-table__cell">
                    <span v-if="column.icon" class="ui-table__tile" :class="column.tone && `is-tone-${call(column.tone, row)}`"><v-icon :icon="call(column.icon, row)" size="17" /></span>
                    <span class="ui-table__lines"><span class="ui-table__main">{{ cellValue(row, column) ?? '—' }}</span><small v-if="column.sub && call(column.sub, row)" class="ui-table__sub">{{ call(column.sub, row) }}</small></span>
                  </span>
                  <template v-else>{{ cellValue(row, column) ?? '—' }}</template>
                </slot>
              </td>
              <td v-if="rowTo || quick || $slots['row-actions']" class="right is-go">
                <span v-if="quick" class="ui-table__quick" @click.stop>
                  <button v-for="q in quick(row)" :key="q.key" type="button" class="ui-iconactions__btn" :class="q.tone && `is-${q.tone}`" :title="q.label" :aria-label="q.label" @click="emit('quick', { key: q.key, row })"><v-icon :icon="q.icon" size="16" /></button>
                </span>
                <slot name="row-actions" :row="row">
                  <router-link v-if="rowTo" :to="rowTo(row)" class="row-link">{{ goText(row) }} <v-icon icon="mdi-arrow-right" size="14" /></router-link>
                </slot>
              </td>
            </tr>
            <tr v-if="expandable && opened === keyOf(row, index)" class="ui-table__detail">
              <td :colspan="colCount"><slot name="detail" :row="row" /></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <slot name="after" />

    <template v-if="!view.rows.length && !loading && !error">
      <UiEmpty v-if="narrowed" :text="emptySearch">
        <template #actions><v-btn variant="text" size="small" class="btn-sentence-case" @click="clear">Tout afficher</v-btn></template>
      </UiEmpty>
      <slot v-else name="empty">
        <UiEmpty :text="empty"><template v-if="$slots['empty-actions']" #actions><slot name="empty-actions" /></template></UiEmpty>
      </slot>
    </template>

    <div v-if="view.pages > 1" class="ui-table__foot">
      <span>Page {{ view.page }} sur {{ view.pages }}</span>
      <v-pagination :model-value="view.page" :length="view.pages" density="compact" total-visible="7" @update:model-value="setPage" />
    </div>
  </div>
</template>
