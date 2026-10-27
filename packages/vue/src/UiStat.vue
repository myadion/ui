<script setup>
import { computed } from 'vue'

/*
 * UN CHIFFRE QUI COMPTE (Adion UI), repris de StatCard : l'intitule en
 * petites capitales, la valeur legere et grande, ce qu'il faut pour la juger
 * dessous. La variation et la petite courbe sont facultatives.
 *
 * Plusieurs chiffres se rangent dans <div class="ui-stats"> - ou dans le
 * creneau `stats` de UiListLayout et UiDetailLayout, qui le fait pour vous.
 */
const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  icon: { type: String, default: '' },
  trend: { type: Number, default: null },
  higherIsBetter: { type: Boolean, default: false },
  spark: { type: Array, default: () => [] },
})

const hasTrend = computed(() => props.trend !== null && Number.isFinite(props.trend))
const trendLabel = computed(() => {
  if (!hasTrend.value) return ''
  const rounded = Math.round(props.trend)
  return rounded === 0 ? 'stable' : `${rounded > 0 ? '+' : ''}${rounded} %`
})
const trendTone = computed(() => {
  if (!hasTrend.value || Math.round(props.trend) === 0) return 'muted'
  return (props.trend > 0) === props.higherIsBetter ? 'accent' : 'bad'
})
const sparkPath = computed(() => {
  const values = props.spark.map((v) => Number(v) || 0)
  if (values.length < 2) return ''
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100
    const y = 28 - ((value - min) / span) * 26 - 1
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
})
</script>

<template>
  <article class="ui-stat">
    <span class="ui-stat__label"><v-icon v-if="icon" :icon="icon" size="14" />{{ label }}</span>
    <div class="ui-stat__row">
      <strong class="ui-stat__value">{{ value }}</strong>
      <span v-if="hasTrend" class="ui-stat__trend" :class="`is-tone-${trendTone}`">{{ trendLabel }}</span>
    </div>
    <svg v-if="sparkPath" class="ui-stat__spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <path :d="sparkPath" fill="none" stroke="currentColor" stroke-width="1.4" vector-effect="non-scaling-stroke" />
    </svg>
    <small v-if="hint || $slots.hint" class="ui-stat__hint"><slot name="hint">{{ hint }}</slot></small>
  </article>
</template>
