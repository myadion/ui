<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/*
 * L'ARBRE D'UN SERVICE (Adion UI, 2026-10-29) : la racine (un domaine), ce
 * qu'on en fait (des groupes), et pour chacun ses services - ou, en pointille,
 * ce qu'on peut ajouter. Des traits courbes relient les colonnes ; sur
 * telephone, l'arbre passe en liste.
 *
 *   root    { label, hint, icon }
 *   groups  [{ id, icon, label, hint, items: [{ label, hint, active }] }]
 *   heads   les trois intitules de colonne
 *
 * Evenement : open(item).
 */
const props = defineProps({
  root: { type: Object, required: true },
  groups: { type: Array, default: () => [] },
  heads: { type: Array, default: () => ['Domaine', 'Catégories', 'Services'] },
})
defineEmits(['open'])

const total = computed(() => props.groups.reduce((n, g) => n + (g.items?.length || 0), 0))

const box = ref(null)
const paths = ref([])
let observer = null

async function draw() {
  await nextTick()
  const frame = box.value?.getBoundingClientRect()
  if (!frame) return
  const at = (el, side) => {
    const r = el.getBoundingClientRect()
    return { x: (side === 'right' ? r.right : r.left) - frame.left, y: r.top + r.height / 2 - frame.top }
  }
  const curve = (a, b) => {
    const mid = (a.x + b.x) / 2
    return `M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`
  }
  const rootEl = box.value.querySelector('[data-node="root"]')
  const out = []
  box.value.querySelectorAll('[data-node="group"]').forEach((group) => {
    if (rootEl) out.push(curve(at(rootEl, 'right'), at(group, 'left')))
    box.value.querySelectorAll(`[data-parent="${group.dataset.id}"]`).forEach((item) => out.push(curve(at(group, 'right'), at(item, 'left'))))
  })
  paths.value = out
}

onMounted(() => {
  draw()
  if (window.ResizeObserver && box.value) {
    observer = new ResizeObserver(() => draw())
    observer.observe(box.value)
  }
})
watch(() => props.groups, () => draw(), { deep: true })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="ui-tree">
    <div class="ui-tree__heads">
      <span>{{ heads[0] }}</span>
      <span>{{ heads[1] }} <span class="ui-tree__count">{{ groups.length }}</span></span>
      <span>{{ heads[2] }} <span class="ui-tree__count">{{ total }}</span></span>
    </div>

    <div ref="box" class="ui-tree__grid">
      <svg class="ui-tree__lines" aria-hidden="true"><path v-for="(d, i) in paths" :key="i" :d="d" /></svg>

      <div class="ui-tree__col">
        <div class="ui-tree__node is-root" data-node="root">
          <v-icon :icon="root.icon || 'mdi-earth'" size="20" />
          <div class="ui-tree__text"><strong>{{ root.label }}</strong><small v-if="root.hint">{{ root.hint }}</small></div>
        </div>
      </div>

      <div class="ui-tree__col">
        <div v-for="group in groups" :key="group.id" class="ui-tree__node" data-node="group" :data-id="group.id">
          <span class="ui-tree__icon"><v-icon :icon="group.icon" size="18" /></span>
          <div class="ui-tree__text"><strong>{{ group.label }}</strong><small v-if="group.hint">{{ group.hint }}</small></div>
        </div>
      </div>

      <div class="ui-tree__col is-items">
        <template v-for="group in groups" :key="group.id">
          <button
            v-for="(item, i) in group.items"
            :key="`${group.id}-${i}`"
            type="button"
            class="ui-tree__node is-item"
            :class="{ 'is-suggestion': !item.active }"
            :data-parent="group.id"
            @click="$emit('open', item)"
          >
            <span class="ui-tree__state" :class="item.active ? 'is-on' : 'is-add'"><v-icon v-if="!item.active" icon="mdi-plus" size="11" /></span>
            <div class="ui-tree__text"><strong>{{ item.label }}</strong><small v-if="item.hint">{{ item.hint }}</small></div>
            <v-icon icon="mdi-chevron-right" size="16" class="ui-tree__go" />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
