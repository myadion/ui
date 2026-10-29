<script setup>
import { computed } from 'vue'

/*
 * DES BARRES POUR COMPARER (Adion UI) : une barre horizontale par element
 * (un canal, une campagne), sa valeur en toutes lettres a droite - la barre
 * aide l'oeil, le chiffre fait foi. `items` = [{ key, label, value, hint? }] ;
 * `max` fixe l'echelle (100 pour des pourcentages), sinon la plus grande
 * valeur. Toutes les barres ont la meme couleur : seul le rang compte.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  unit: { type: String, default: '' },
  /** La valeur dite en clair (un montant : (v) => '12,40 €') ; remplace l'unite. */
  format: { type: Function, default: null },
  max: { type: Number, default: 0 },
  empty: { type: String, default: 'Rien à comparer pour le moment.' },
})

const top = computed(() => props.max || Math.max(0, ...props.items.map((i) => Number(i.value) || 0)) || 1)
const pct = (item) => Math.min(100, Math.max(0, ((Number(item.value) || 0) / top.value) * 100))
const fmt = (v) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(Number(v) || 0)
</script>

<template>
  <figure class="ui-bars">
    <figcaption v-if="title" class="ui-chart__title">{{ title }}</figcaption>
    <p v-if="!items.length" class="ui-chart__empty">{{ empty }}</p>
    <ul v-else class="ui-bars__list">
      <li v-for="item in items" :key="item.key ?? item.label" class="ui-bars__row">
        <span class="ui-bars__label">{{ item.label }}<small v-if="item.hint">{{ item.hint }}</small></span>
        <span class="ui-bars__track" role="meter" :aria-label="item.label" :aria-valuenow="Number(item.value) || 0" aria-valuemin="0" :aria-valuemax="top">
          <span class="ui-bars__fill" :style="{ width: `${pct(item)}%` }" />
        </span>
        <strong class="ui-bars__value">{{ format ? format(item.value) : `${fmt(item.value)}${unit ? ` ${unit}` : ''}` }}</strong>
      </li>
    </ul>
  </figure>
</template>
