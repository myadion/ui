<script setup>
import { ref } from 'vue'
import UiBadge from './UiBadge.vue'
import { tone } from './tone'

/*
 * L'EN-TETE D'UN DOSSIER (Adion UI, mode outil, 2026-11-17) : deux lignes qui
 * restent en haut du volet. La premiere dit qui c'est, son etat et ses gestes ;
 * la seconde donne les faits dont on a besoin pour agir, sans chercher.
 *
 *   icon, title, status { label, tone }
 *   facts  [{ key, label, value, tone, copy }]
 *          tone : le fait est une alerte (bad, warn) ; copy : un clic le copie
 *   #actions  le geste principal, puis le menu
 */
defineProps({
  icon: { type: String, default: '' },
  title: { type: String, required: true },
  status: { type: Object, default: null },
  facts: { type: Array, default: () => [] },
  /** Le retour a la liste d'ou l'on vient : { label, to }. */
  back: { type: Object, default: null },
})

const copied = ref(null)
async function copy(fact) {
  try { await navigator.clipboard?.writeText(String(fact.value)) } catch { /* le presse-papiers est refuse : la valeur reste lisible */ }
  copied.value = fact.key || fact.label
  setTimeout(() => { copied.value = null }, 1400)
}
</script>

<template>
  <header class="ui-record">
    <router-link v-if="back" :to="back.to" class="ui-record__back"><v-icon icon="mdi-arrow-left" size="14" />{{ back.label }}</router-link>
    <div class="ui-record__top">
      <span v-if="icon" class="ui-record__tile" aria-hidden="true"><v-icon :icon="icon" size="18" /></span>
      <h1 class="ui-record__title">{{ title }}</h1>
      <UiBadge v-if="status" :label="status.label" :tone="status.tone" />
      <div v-if="$slots.actions" class="ui-record__actions"><slot name="actions" /></div>
    </div>
    <dl v-if="facts.length" class="ui-record__facts">
      <div v-for="fact in facts" :key="fact.key || fact.label" class="ui-record__fact" :class="fact.tone && `is-tone-${tone(fact.tone)}`">
        <dt>{{ fact.label }}</dt>
        <dd v-if="fact.copy">
          <button type="button" class="ui-record__copy" :title="`Copier ${fact.label.toLowerCase()}`" @click="copy(fact)">
            {{ fact.value }}<v-icon :icon="copied === (fact.key || fact.label) ? 'mdi-check' : 'mdi-content-copy'" size="13" />
          </button>
        </dd>
        <dd v-else>{{ fact.value }}</dd>
      </div>
    </dl>
  </header>
</template>
