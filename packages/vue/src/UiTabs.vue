<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/*
 * LES ONGLETS D'UNE FICHE (Adion UI), repris d'AdionTabs : petites capitales,
 * un trait sous l'onglet ouvert, des fleches quand ils ne tiennent pas.
 *
 * L'ORDRE EST IMPOSE : « Vue d'ensemble » en premier, les
 * reglages puis la resiliation en dernier. UiDetailLayout le verifie.
 *
 * `query="onglet"` garde l'onglet dans l'adresse : un lien, un retour
 * arriere ou un rechargement rouvrent le meme.
 */
const props = defineProps({
  /**
   * `countHint` dit ce que compte la pastille (« 1 nom en attente ») : en
   * infobulle et pour les lecteurs d'ecran.
   * @type {Array<{id:string,label:string,count?:number|string,countHint?:string,icon?:string}>}
   */
  tabs: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  query: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const router = useRouter()

function select(id) {
  emit('update:modelValue', id)
  if (props.query && route.query[props.query] !== id) {
    router.replace({ query: { ...route.query, [props.query]: id } })
  }
}

function fromRoute() {
  if (!props.query) return
  const asked = String(route.query[props.query] || '')
  if (asked && asked !== props.modelValue && props.tabs.some((t) => t.id === asked)) emit('update:modelValue', asked)
}

const bar = ref(null)
const canLeft = ref(false)
const canRight = ref(false)
function measure() {
  const el = bar.value
  if (!el) return
  canLeft.value = el.scrollLeft > 2
  canRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2
}
function slide(direction) {
  bar.value?.scrollBy({ left: direction * Math.max(160, bar.value.clientWidth * 0.6), behavior: 'smooth' })
}
async function revealActive() {
  await nextTick()
  /* La barre seule defile : scrollIntoView faisait aussi descendre la page jusqu'aux onglets. */
  const el = bar.value
  const item = el?.querySelector('.ui-tabs__item.is-active')
  if (!el || !item) return
  const left = item.offsetLeft - el.offsetLeft
  if (left < el.scrollLeft) el.scrollTo({ left, behavior: 'smooth' })
  else if (left + item.offsetWidth > el.scrollLeft + el.clientWidth) el.scrollTo({ left: left + item.offsetWidth - el.clientWidth, behavior: 'smooth' })
}

let observer = null
onMounted(() => {
  fromRoute()
  measure()
  revealActive()
  if (typeof ResizeObserver !== 'undefined' && bar.value) {
    observer = new ResizeObserver(measure)
    observer.observe(bar.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch(() => props.modelValue, revealActive)
watch(() => props.tabs.map((t) => t.id).join(), () => { fromRoute(); nextTick(measure) })
watch(() => props.query && route.query[props.query], fromRoute)
</script>

<template>
  <div class="ui-tabs">
    <button v-if="canLeft" type="button" class="ui-tabs__arrow ui-tabs__arrow--left" aria-label="Onglets précédents" @click="slide(-1)">
      <v-icon icon="mdi-chevron-left" size="18" />
    </button>
    <div ref="bar" class="ui-tabs__bar" role="tablist" @scroll.passive="measure">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="ui-tabs__item"
        :class="{ 'is-active': modelValue === tab.id }"
        :aria-selected="modelValue === tab.id"
        @click="select(tab.id)"
      >
        <v-icon v-if="tab.icon" :icon="tab.icon" size="17" class="ui-tabs__icon" />
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined && tab.count !== null && tab.count !== ''"
          class="ui-tabs__count"
          :title="tab.countHint || undefined"
          :aria-label="tab.countHint || undefined"
        >{{ tab.count }}</span>
      </button>
    </div>
    <button v-if="canRight" type="button" class="ui-tabs__arrow ui-tabs__arrow--right" aria-label="Onglets suivants" @click="slide(1)">
      <v-icon icon="mdi-chevron-right" size="18" />
    </button>
  </div>
</template>
