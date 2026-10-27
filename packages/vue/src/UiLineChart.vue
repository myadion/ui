<script setup>
import { computed, ref } from 'vue'

/*
 * UNE COURBE DANS LE TEMPS (Adion UI) : une ligne par serie (envois, ouvertures,
 * clics ; un canal...), sur des reperes communs. `labels` donne l'abscisse
 * (une etiquette par point), `series` = [{ key, label, points: [n...] }].
 * Une serie se distingue par sa couleur ET son trait (plein, tirets, points) ;
 * la legende l'allume ou l'eteint, et le survol ou le clavier (fleches) lit
 * la valeur de chaque serie a un instant. Sans donnee : UiEmpty a la place.
 * Les couleurs sont les jetons --adion-chart-*, jamais ecrites par l'ecran.
 */
const props = defineProps({
  series: { type: Array, default: () => [] },
  labels: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  unit: { type: String, default: '' },
  height: { type: Number, default: 220 },
  empty: { type: String, default: 'Rien à afficher sur cette période.' },
})

const W = 600
const PAD = { top: 12, right: 12, bottom: 24, left: 36 }
const DASH = ['', '6 4', '2 3', '10 3 2 3', '']
const hidden = ref([])
const cursor = ref(-1)

const visible = computed(() => props.series.filter((s) => !hidden.value.includes(s.key)))
const count = computed(() => Math.max(0, ...props.series.map((s) => (s.points || []).length), props.labels.length))
const niceMax = computed(() => {
  const raw = Math.max(0, ...visible.value.flatMap((s) => (s.points || []).map((v) => Number(v) || 0)))
  if (raw <= 4) return 4
  const pow = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s * 4 >= raw) || 10 * pow
  return step * 4
})
const ticks = computed(() => [0, 1, 2, 3, 4].map((i) => (niceMax.value / 4) * i))
const innerW = W - PAD.left - PAD.right
const innerH = computed(() => props.height - PAD.top - PAD.bottom)
const xAt = (i) => PAD.left + (count.value < 2 ? innerW / 2 : (i / (count.value - 1)) * innerW)
const yAt = (v) => PAD.top + innerH.value - ((Number(v) || 0) / niceMax.value) * innerH.value
const index = (key) => props.series.findIndex((s) => s.key === key)
const colorOf = (key) => `var(--adion-chart-${(index(key) % 5) + 1})`
const dashOf = (key) => DASH[index(key) % DASH.length]
const path = (s) => (s.points || []).map((v, i) => `${i ? 'L' : 'M'}${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')
const xTicks = computed(() => {
  const n = count.value
  if (!n) return []
  const every = Math.max(1, Math.ceil(n / 6))
  return Array.from({ length: n }, (_, i) => i).filter((i) => i % every === 0 || i === n - 1).filter((i) => i === n - 1 || n - 1 - i >= every / 2 || i % every === 0)
})
const fmt = (v) => new Intl.NumberFormat('fr-FR').format(Math.round(Number(v) || 0))
const summary = computed(() => props.series.map((s) => `${s.label} : ${fmt((s.points || []).reduce((a, v) => a + (Number(v) || 0), 0))}`).join(', '))

function toggle(key) {
  hidden.value = hidden.value.includes(key) ? hidden.value.filter((k) => k !== key) : [...hidden.value, key]
}
function onMove(event) {
  const box = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - box.left) / box.width) * W
  const i = Math.round(((x - PAD.left) / innerW) * (count.value - 1))
  cursor.value = Math.min(count.value - 1, Math.max(0, i))
}
function onKey(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Escape'].includes(event.key)) return
  event.preventDefault()
  if (event.key === 'Escape') cursor.value = -1
  else cursor.value = Math.min(count.value - 1, Math.max(0, (cursor.value < 0 ? (event.key === 'ArrowRight' ? -1 : count.value) : cursor.value) + (event.key === 'ArrowRight' ? 1 : -1)))
}
</script>

<template>
  <figure class="ui-chart">
    <figcaption v-if="title" class="ui-chart__title">{{ title }}</figcaption>
    <p v-if="!count || !series.length" class="ui-chart__empty">{{ empty }}</p>
    <template v-else>
      <ul class="ui-chart__legend">
        <li v-for="s in series" :key="s.key">
          <button type="button" class="ui-chart__key" :class="{ 'is-off': hidden.includes(s.key) }" :aria-pressed="!hidden.includes(s.key)" @click="toggle(s.key)">
            <svg width="22" height="8" aria-hidden="true"><line x1="1" y1="4" x2="21" y2="4" :stroke="colorOf(s.key)" stroke-width="2.4" stroke-linecap="round" :stroke-dasharray="dashOf(s.key)" /></svg>
            {{ s.label }}
          </button>
        </li>
      </ul>
      <div class="ui-chart__plot">
        <svg
          :viewBox="`0 0 ${W} ${height}`" class="ui-chart__svg" role="img" tabindex="0"
          :aria-label="`${title || 'Courbe'}. ${summary}. Flèches gauche et droite pour lire un instant.`"
          @mousemove="onMove" @mouseleave="cursor = -1" @keydown="onKey" @blur="cursor = -1"
        >
          <g class="ui-chart__grid">
            <g v-for="t in ticks" :key="t">
              <line :x1="PAD.left" :x2="W - PAD.right" :y1="yAt(t)" :y2="yAt(t)" />
              <text :x="PAD.left - 6" :y="yAt(t) + 3.5" text-anchor="end">{{ fmt(t) }}</text>
            </g>
            <text v-for="i in xTicks" :key="i" :x="xAt(i)" :y="height - 6" text-anchor="middle">{{ labels[i] }}</text>
          </g>
          <path v-for="s in visible" :key="s.key" :d="path(s)" fill="none" :stroke="colorOf(s.key)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" :stroke-dasharray="dashOf(s.key)" />
          <g v-if="cursor >= 0">
            <line class="ui-chart__cursor" :x1="xAt(cursor)" :x2="xAt(cursor)" :y1="PAD.top" :y2="PAD.top + innerH" />
            <circle v-for="s in visible" :key="s.key" :cx="xAt(cursor)" :cy="yAt((s.points || [])[cursor])" r="3.5" :fill="colorOf(s.key)" class="ui-chart__dot" />
          </g>
        </svg>
        <div v-if="cursor >= 0" class="ui-chart__tip" :class="{ 'is-right': cursor > count / 2 }" :style="{ left: `${(xAt(cursor) / W) * 100}%` }" role="status">
          <strong>{{ labels[cursor] }}</strong>
          <span v-for="s in visible" :key="s.key">{{ s.label }} : {{ fmt((s.points || [])[cursor]) }}{{ unit ? ` ${unit}` : '' }}</span>
        </div>
      </div>
    </template>
  </figure>
</template>
