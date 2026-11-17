<script setup>
import { computed, getCurrentInstance, inject, onMounted, ref, useSlots, watch } from 'vue'
import { useRouter } from 'vue-router'
import { rowActivates } from './rows'
import { allState, cellValue, filterRows, keepSelectable, nextSort, paginate, searchRows, sortRows, toggleAll, toggleKey } from './table'
import { tone as toTone } from './tone'
import UiEmpty from './UiEmpty.vue'
import UiSkeleton from './UiSkeleton.vue'
import UiNotice from './UiNotice.vue'
import UiToolbar from './UiToolbar.vue'
import UiButton from './UiButton.vue'
import { arrangeColumns, isDefault, moveColumn, placeColumn, toggleColumn, visibleColumns } from './columns'
import { useTableDensity } from './density'
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
 * Toute colonne titree se trie (Kevin, 2026-10-29), sauf `sortable: false`.
 *
 * Comme /maquette (2026-10-28) : `icon(row)` pose une tuile devant la valeur,
 * teintee par `tone(row)` (ok, info, warn, bad, muted) ; `sub(row)` ajoute une
 * seconde ligne grise. `quick(row)` donne des gestes en icones au bout de la
 * ligne ([{ key, icon, label, tone? }]) : `quick` est emis avec { key, row }.
 * `valueTone(row)` teinte la valeur elle-meme (un credit en vert, un impaye en rouge).
 *
 * Cocher des lignes (Kevin, 2026-11-12 : supprimer plusieurs volumes) :
 * `selectable` (true, ou `(row) => bool` pour ne laisser cocher que les lignes
 * qui permettent le geste) et `v-model:selected` (les cles cochees). Une case
 * en tete coche toutes les lignes cochables visibles. Des qu'une ligne est
 * cochee, une barre dit combien et porte le creneau `selection`
 * ({ rows, keys, clear }) : le geste groupe, que la page fait.
 *
 * Deux modes :
 *   - par defaut, tout se fait ici (recherche, filtres, tri, pages) ;
 *   - `server` : l'API cherche et pagine ; le tableau emet `query`
 *     ({ search, filters, page }) et affiche `pages`.
 */
/* Les filtres de la page liste (UiListLayout, creneau list-actions) : le premier tableau les prend. */
const listFiltersHost = inject('uiListFilters', null)
const tableUid = getCurrentInstance()?.uid
if (listFiltersHost && listFiltersHost.owner === null) listFiltersHost.owner = tableUid
const ListFilters = () => listFiltersHost?.render()
const hasListFilters = computed(() => Boolean(listFiltersHost && listFiltersHost.owner === tableUid && listFiltersHost.present()))

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
  selectable: { type: [Boolean, Function], default: false },
  selected: { type: Array, default: () => [] },
  /** La barre de selection, accordee : ['volume coché', 'volumes cochés'] donne « 2 volumes cochés ». */
  selectNoun: { type: Array, default: () => ['ligne cochée', 'lignes cochées'] },
})
const emit = defineEmits(['query', 'retry', 'row-click', 'search', 'quick', 'update:selected'])
const call = (v, row) => (typeof v === 'function' ? v(row) : v)
// Une valeur vide se dit « — », jamais par une case blanche.
const shown_ = (v) => (v === null || v === undefined || v === '' ? '—' : v)

const router = useRouter()
const needle = ref('')
const active = ref({})
const sort = ref(props.initialSort || { key: '', dir: 'asc' })

const columnPref = usePreference(props.prefKey ? `table.${props.prefKey}` : '')
onMounted(() => { if (props.prefKey) columnPref.load() })
const shown = computed(() => (props.prefKey ? visibleColumns(props.columns, columnPref.value.value) : props.columns))
/* Les lignes en traits du premier chargement : quatre colonnes au plus, comme a l'arrivee. */
const skeletonColumns = computed(() => (shown.value.length ? shown.value : [{ key: "a" }, { key: "b" }, { key: "c" }]).slice(0, 4))
const arranged = computed(() => arrangeColumns(props.columns, columnPref.value.value))
const columnsDefault = computed(() => isDefault(props.columns, columnPref.value.value))
const toggle = (key) => columnPref.save(toggleColumn(props.columns, columnPref.value.value, key))
const move = (key, step) => columnPref.save(moveColumn(props.columns, columnPref.value.value, key, step))

/* Glisser une colonne dans le menu : la ligne survolee indique ou elle tombera. */
const dragKey = ref('')
const dropAt = ref(-1)
const onDragStart = (event, key) => { dragKey.value = key; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', key) }
const onDragOver = (event, index) => { if (!dragKey.value) return; event.preventDefault(); dropAt.value = index }
const onDrop = () => {
  if (dragKey.value && dropAt.value >= 0) columnPref.save(placeColumn(props.columns, columnPref.value.value, dragKey.value, dropAt.value))
  dragKey.value = ''
  dropAt.value = -1
}
/* Au clavier : Alt + fleche monte ou descend la colonne qui a le focus. */
const onRowKey = (event, key) => {
  if (!event.altKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) return
  event.preventDefault()
  move(key, event.key === 'ArrowUp' ? -1 : 1)
}

const { density, set: setDensity } = useTableDensity()
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

/* Une colonne se trie des qu'elle a un titre, sauf si la page dit sortable: false. */
const sortable = (column) => column.sortable !== false && Boolean(column.label)

function toggleSort(column) {
  if (!sortable(column) || props.server) return
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
const colCount = computed(() => shown.value.length + (props.rowTo || hasRowActions.value || props.quick ? 1 : 0) + (props.selectable ? 1 : 0))
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

/* Les lignes cochees : seulement celles que la page laisse cocher. */
const canSelect = (row) => (typeof props.selectable === 'function' ? Boolean(props.selectable(row)) : Boolean(props.selectable))
const selecting = computed(() => Boolean(props.selectable))
const selectableKeys = computed(() => (selecting.value ? props.rows.filter(canSelect).map((row, i) => keyOf(row, i)) : []))
const visibleKeys = computed(() => (selecting.value ? prepared.value.filter(canSelect).map((row, i) => keyOf(row, i)) : []))
const checked = computed(() => keepSelectable(props.selected, selectableKeys.value))
const head = computed(() => allState(checked.value, visibleKeys.value))
const checkedRows = computed(() => props.rows.filter((row, i) => checked.value.includes(keyOf(row, i))))
const isChecked = (row, index) => checked.value.includes(keyOf(row, index))
const setSelected = (keys) => emit('update:selected', keys)
const clearSelection = () => setSelected([])
watch(selectableKeys, () => { if (checked.value.length !== props.selected.length) setSelected(checked.value) })
const selectionText = computed(() => `${checked.value.length} ${props.selectNoun[checked.value.length > 1 ? 1 : 0]}`)

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
  <div class="ui-table" :class="{ 'ui-table--stack': stack, 'is-compact': density === 'compact' }">
    <UiToolbar
      v-if="search || filters.length || $slots.toolbar || prefKey || hasListFilters"
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
        <ListFilters v-if="hasListFilters" />
      </template>
      <slot name="toolbar" />
      <!-- La densite : normale ou compacte, pour tous les tableaux (density.js). -->
      <div class="ui-density" role="group" aria-label="Densité du tableau">
        <button type="button" class="ui-density__btn" :class="{ 'is-on': density === 'normal' }" title="Lignes normales" aria-label="Lignes normales" :aria-pressed="density === 'normal'" @click="setDensity('normal')"><v-icon icon="mdi-view-agenda-outline" size="16" /></button>
        <button type="button" class="ui-density__btn" :class="{ 'is-on': density === 'compact' }" title="Lignes compactes" aria-label="Lignes compactes" :aria-pressed="density === 'compact'" @click="setDensity('compact')"><v-icon icon="mdi-view-headline" size="16" /></button>
      </div>
      <v-menu v-if="prefKey" location="bottom end" :close-on-content-click="false">
        <template #activator="{ props: on }">
          <UiButton v-bind="on" kind="quiet" icon="mdi-view-column-outline">Colonnes</UiButton>
        </template>
        <!-- Les colonnes : on coche ce qu'on voit, on glisse pour ranger (Alt + fleches au clavier). -->
        <div class="ui-colmenu" role="dialog" aria-label="Colonnes du tableau">
          <div class="ui-colmenu__head">
            <span class="ui-colmenu__title">Colonnes</span>
            <button type="button" class="ui-colmenu__reset" :disabled="columnsDefault" @click="columnPref.reset()">Par défaut</button>
          </div>
          <ul class="ui-colmenu__list" @dragleave.self="dropAt = -1">
            <li
              v-for="(column, index) in arranged"
              :key="column.key"
              class="ui-colmenu__row"
              :class="{ 'is-dragging': dragKey === column.key, 'is-drop': dropAt === index && dragKey && dragKey !== column.key, 'is-off': !column.visible }"
              draggable="true"
              tabindex="0"
              :aria-label="`${column.label || column.key}, ${column.visible ? 'affichée' : 'masquée'}. Alt et flèches pour déplacer.`"
              @dragstart="onDragStart($event, column.key)"
              @dragover="onDragOver($event, index)"
              @drop.prevent="onDrop"
              @dragend="dragKey = ''; dropAt = -1"
              @keydown="onRowKey($event, column.key)"
            >
              <v-icon icon="mdi-drag-vertical" size="16" class="ui-colmenu__grip" aria-hidden="true" />
              <span class="ui-colmenu__label">{{ column.label || column.key }}</span>
              <v-icon v-if="column.main || column.required" icon="mdi-lock-outline" size="14" class="ui-colmenu__lock" title="Toujours affichée" />
              <button
                v-else
                type="button"
                class="ui-colmenu__eye"
                :title="column.visible ? 'Masquer' : 'Afficher'"
                :aria-label="`${column.visible ? 'Masquer' : 'Afficher'} « ${column.label || column.key} »`"
                @click="toggle(column.key)"
              >
                <v-icon :icon="column.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" size="16" />
              </button>
            </li>
          </ul>
        </div>
      </v-menu>
    </UiToolbar>

    <!-- Un tableau deja rempli qui se relit garde ses lignes, sans signal. Vide : des lignes en traits, a la place des vraies. -->
    <div v-if="loading && !view.rows.length && !error" class="table-wrap">
      <table class="grid-table" :class="{ 'grid-table--dense': dense }">
        <tbody>
          <tr v-for="line in 4" :key="line" class="ui-table__skeleton">
            <td v-for="(column, index) in skeletonColumns" :key="column.key || index"><UiSkeleton :width="index === 0 ? '70%' : '55%'" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <UiNotice v-if="error" tone="bad" :text="error">
      <template #actions><v-btn variant="text" size="small" class="btn-sentence-case" prepend-icon="mdi-refresh" @click="$emit('retry')">Réessayer</v-btn></template>
    </UiNotice>

    <div v-if="selecting && checked.length" class="ui-table__selection" role="region" aria-label="Lignes cochées">
      <span class="ui-table__selection-count">{{ selectionText }}</span>
      <button type="button" class="ui-table__selection-clear" @click="clearSelection">Tout décocher</button>
      <span class="ui-table__selection-actions"><slot name="selection" :rows="checkedRows" :keys="checked" :clear="clearSelection" /></span>
    </div>

    <div v-if="view.rows.length" class="table-wrap">
      <table class="grid-table" :class="{ 'grid-table--dense': dense }">
        <thead>
          <tr>
            <th v-if="selecting" class="ui-table__check-cell">
              <input
                type="checkbox"
                class="ui-table__check"
                :checked="head.all"
                :indeterminate.prop="head.some"
                :disabled="!visibleKeys.length"
                aria-label="Cocher toutes les lignes"
                @change="setSelected(toggleAll(checked, visibleKeys))"
              >
            </th>
            <th v-for="column in shown" :key="column.key" :class="alignClass(column)" :aria-sort="sort.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined">
              <button v-if="sortable(column) && !server" type="button" class="ui-table__th-sort" :class="{ 'is-sorted': sort.key === column.key }" @click="toggleSort(column)">
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
            <tr :class="{ 'is-clickable': clickable, 'is-checked': selecting && isChecked(row, index) }" @click="onRow($event, row, index)">
              <td v-if="selecting" class="ui-table__check-cell" @click.stop>
                <input
                  v-if="canSelect(row)"
                  type="checkbox"
                  class="ui-table__check"
                  :checked="isChecked(row, index)"
                  :aria-label="`Cocher ${cellValue(row, shown.find((c) => c.main) || shown[0]) || 'la ligne'}`"
                  @change="setSelected(toggleKey(checked, keyOf(row, index)))"
                >
              </td>
              <td v-for="column in shown" :key="column.key" :class="cellClass(column)" :data-label="column.label || undefined">
                <slot :name="`cell-${column.key}`" :row="row" :value="cellValue(row, column)">
                  <span v-if="column.icon || column.sub" class="ui-table__cell">
                    <span v-if="column.icon" class="ui-table__tile" :class="column.tone && `is-tone-${toTone(call(column.tone, row))}`"><v-icon :icon="call(column.icon, row)" size="17" /></span>
                    <span class="ui-table__lines"><span class="ui-table__main">{{ shown_(cellValue(row, column)) }}</span><small v-if="column.sub && call(column.sub, row)" class="ui-table__sub">{{ call(column.sub, row) }}</small></span>
                  </span>
                  <span v-else-if="column.valueTone" class="ui-table__value" :class="`is-tone-${toTone(call(column.valueTone, row))}`">{{ shown_(cellValue(row, column)) }}</span>
                  <template v-else>{{ shown_(cellValue(row, column)) }}</template>
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
