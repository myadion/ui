<script setup>
import { computed, ref } from 'vue'
import UiBadge from './UiBadge.vue'
import UiLoading from './UiLoading.vue'

/*
 * LE COMPTE OU LE PROJET OUVERT (Adion UI, 2026-10-28) : une ligne de la
 * barre de gauche, et le menu qui s'ouvre a sa droite pour en changer.
 *
 *   items    [{ value, title, hint?, mark?, logo?, org?, icon?, badge?: { label, tone } }]
 *   current  la valeur ouverte (cochee)
 *   actions  [{ key, icon, label }] au pied du menu : `action` est emis
 *   Un filtre apparait au-dela de six choix.
 */
const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  menuTitle: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  current: { type: String, default: '' },
  actions: { type: Array, default: () => [] },
  empty: { type: String, default: '' },
})
defineEmits(['choose', 'action'])

const filter = ref('')
const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const shown = computed(() => {
  const q = fold(filter.value.trim())
  return q ? props.items.filter((i) => fold(`${i.title} ${i.hint || ''}`).includes(q)) : props.items
})
</script>

<template>
  <v-menu location="end top" origin="start top" :offset="0" :close-on-content-click="true">
    <template #activator="{ props: menu }">
      <button v-bind="menu" type="button" class="ui-sidebar__ctx" :disabled="disabled" :title="value || placeholder">
        <span class="ui-sidebar__ctxlabel">{{ label }}</span>
        <span class="ui-sidebar__ctxvalue">
          <UiLoading v-if="loading" variant="inline" label="Chargement…" />
          <span v-else class="ui-sidebar__ctxtext" :class="{ 'is-empty': !value }">{{ value || placeholder }}</span>
          <v-icon icon="mdi-unfold-more-horizontal" size="13" class="ui-sidebar__ctxcaret" />
        </span>
      </button>
    </template>
    <div class="ui-ctxmenu">
      <span v-if="menuTitle" class="ui-ctxmenu__head">{{ menuTitle }}</span>
      <input v-if="items.length > 6" v-model="filter" class="ui-ctxmenu__filter" type="search" placeholder="Filtrer" :aria-label="`Filtrer : ${label}`" @click.stop />
      <button v-for="item in shown" :key="item.value" type="button" class="ui-ctxmenu__row" :class="{ 'is-on': item.value === current }" @click="$emit('choose', item.value)">
        <span class="ui-ctxmenu__mark" :class="{ 'is-org': item.org, 'is-icon': item.icon }">
          <img v-if="item.logo" :src="item.logo" alt="" class="ui-ctxmenu__logo" />
          <v-icon v-else-if="item.icon" :icon="item.icon" size="13" />
          <template v-else>{{ item.mark }}</template>
        </span>
        <span class="ui-ctxmenu__text"><strong>{{ item.title }} <UiBadge v-if="item.badge" :label="item.badge.label" :tone="item.badge.tone" /></strong><small v-if="item.hint">{{ item.hint }}</small></span>
        <v-icon v-if="item.value === current" icon="mdi-check" size="14" class="ui-ctxmenu__check" />
      </button>
      <p v-if="!items.length && empty" class="ui-ctxmenu__empty">{{ empty }}</p>
      <div v-if="actions.length" class="ui-ctxmenu__foot">
        <button v-for="a in actions" :key="a.key" type="button" @click="$emit('action', a.key)"><v-icon :icon="a.icon" size="14" />{{ a.label }}</button>
      </div>
    </div>
  </v-menu>
</template>
