<script setup>
import { computed, reactive, ref } from 'vue'
import UiBadge from './UiBadge.vue'
import UiButton from './UiButton.vue'
import { tone } from './tone'

/*
 * LE FIL D'UN DOSSIER (Adion UI, mode outil, 2026-11-17) : tout ce qui est
 * arrive a un client, sur une seule ligne de temps - commandes, factures,
 * tickets, notes. Ce qui attend l'equipe est epingle en tete ; l'historique suit,
 * la date a droite de chaque ligne (`day` puis `at`). Chaque evenement porte ses gestes : on agit sur la ligne.
 *
 *   v-model  la nature affichee ('' : tout)
 *   kinds    [{ key, label, icon }]   les filtres, avec le nombre d'evenements
 *   items    [{ id, kind, day, at, who, icon, tone, title, text, state { label, tone },
 *               pinned, actions [{ key, label, icon, kind, to }] }]
 *   limit    le nombre d'evenements passes montres d'abord ; « Voir la suite » ouvre le reste
 *   @action({ key, item })   un geste choisi sur un evenement
 *
 * PEU DE TEXTE : un evenement passe tient sur une ligne, son detail s'ouvre
 * d'un clic. Seul ce qui attend l'equipe montre son explication.
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  kinds: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  pinnedLabel: { type: String, default: 'À traiter' },
  pastLabel: { type: String, default: 'Historique' },
  allLabel: { type: String, default: 'Tout' },
  empty: { type: String, default: 'Rien pour ce filtre.' },
  limit: { type: Number, default: 6 },
})
const emit = defineEmits(['update:modelValue', 'action'])

const filters = computed(() => [
  { key: '', label: props.allLabel, count: props.items.length },
  ...props.kinds.map((kind) => ({ ...kind, count: props.items.filter((item) => item.kind === kind.key).length })),
])
const shown = computed(() => (props.modelValue ? props.items.filter((item) => item.kind === props.modelValue) : props.items))
const all = ref(false)
const opened = reactive({})
const past = computed(() => shown.value.filter((entry) => !entry.pinned))
const hidden = computed(() => (all.value || !props.limit ? 0 : Math.max(0, past.value.length - props.limit)))
const groups = computed(() => {
  const pinned = shown.value.filter((item) => item.pinned)
  const rest = hidden.value ? past.value.slice(0, props.limit) : past.value
  return [
    ...(pinned.length ? [{ key: 'pinned', label: props.pinnedLabel, pinned: true, items: pinned }] : []),
    ...(rest.length ? [{ key: 'past', label: props.pastLabel, items: rest }] : []),
  ]
})
</script>

<template>
  <div class="ui-feed">
    <div v-if="kinds.length" class="ui-feed__filters" role="group" aria-label="Filtrer le fil">
      <button v-for="filter in filters" :key="filter.key" type="button" class="ui-feed__filter" :class="{ 'is-active': filter.key === modelValue }" :aria-pressed="filter.key === modelValue" @click="emit('update:modelValue', filter.key)">
        {{ filter.label }}<span class="ui-feed__n">{{ filter.count }}</span>
      </button>
    </div>
    <section v-for="group in groups" :key="group.key" class="ui-feed__group" :class="{ 'is-pinned': group.pinned }">
      <h2 class="ui-feed__day">{{ group.label }}<span v-if="group.pinned" class="ui-feed__n">{{ group.items.length }}</span></h2>
      <ol class="ui-feed__list">
        <li v-for="item in group.items" :key="item.id" class="ui-feed__item">
          <span class="ui-feed__mark" :class="`is-tone-${tone(item.tone)}`" aria-hidden="true"><v-icon :icon="item.icon || 'mdi-circle-medium'" size="15" /></span>
          <div class="ui-feed__body">
            <component :is="!group.pinned && item.text ? 'button' : 'p'" class="ui-feed__line" :type="!group.pinned && item.text ? 'button' : undefined" :aria-expanded="!group.pinned && item.text ? Boolean(opened[item.id]) : undefined" @click="!group.pinned && item.text && (opened[item.id] = !opened[item.id])">
              <strong class="ui-feed__title">{{ item.title }}</strong>
              <UiBadge v-if="item.state" :label="item.state.label" :tone="item.state.tone" />
              <span v-if="item.who" class="ui-feed__meta">{{ item.who }}</span>
              <span v-if="item.at || item.day" class="ui-feed__at">{{ [item.day, item.at].filter(Boolean).join(' ') }}</span>
            </component>
            <p v-if="item.text && (group.pinned || opened[item.id])" class="ui-feed__text">{{ item.text }}</p>
          </div>
          <div v-if="item.actions?.length" class="ui-feed__actions">
            <UiButton v-for="action in item.actions" :key="action.key" :kind="action.kind || 'quiet'" :icon="action.icon" :to="action.to" @click="emit('action', { key: action.key, item })">{{ action.label }}</UiButton>
          </div>
        </li>
      </ol>
    </section>
    <button v-if="hidden" type="button" class="ui-feed__more" @click="all = true">Voir la suite<span class="ui-feed__n">{{ hidden }}</span></button>
    <p v-if="!groups.length" class="ui-feed__empty">{{ empty }}</p>
  </div>
</template>
