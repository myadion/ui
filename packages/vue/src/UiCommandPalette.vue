<script setup>
import { computed, nextTick, ref, watch } from 'vue'

/*
 * LA PALETTE DE RECHERCHE (Adion UI, 2026-10-29) : une carte posee au centre,
 * le champ en haut, les resultats groupes dessous, l'aide du clavier au pied.
 * Les fleches parcourent, Entree ouvre, Echap ferme. L'app fournit les
 * resultats et decide de ce qu'ouvrir veut dire.
 *
 *   v-model        ouverte ou fermee
 *   v-model:query  ce qui est tape
 *   groups         [{ key, label, items: [{ key, icon, label, meta }] }]
 *   @select(item)  un resultat choisi (clic ou Entree)
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  query: { type: String, default: '' },
  groups: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Rechercher…' },
  /** Ce qui s'affiche avant la premiere lettre. */
  hint: { type: String, default: 'Tapez pour chercher.' },
  empty: { type: String, default: 'Aucun résultat.' },
})
const emit = defineEmits(['update:modelValue', 'update:query', 'select'])

const input = ref(null)
const list = ref(null)
const cursor = ref(0)

const ordered = computed(() => props.groups.flatMap((g) => g.items || []))
const typed = computed(() => props.query.trim().length > 0)
watch(() => props.groups, () => { cursor.value = 0 })

function move(step) {
  const n = ordered.value.length
  if (!n) return
  cursor.value = (cursor.value + step + n) % n
  nextTick(() => list.value?.querySelector('.is-on')?.scrollIntoView({ block: 'nearest' }))
}
function choose(item) {
  if (item) emit('select', item)
}

/* A l'ouverture, la derniere recherche est la, selectionnee : la premiere lettre la remplace. */
async function focus() {
  await nextTick()
  input.value?.focus()
  input.value?.select()
}
watch(() => props.modelValue, (open) => { if (open) focus() })
defineExpose({ focus })
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="640" content-class="ui-palette-host" @update:model-value="(v) => emit('update:modelValue', v)">
    <div class="ui-palette" role="dialog" aria-label="Recherche">
      <label class="ui-palette__field">
        <v-icon icon="mdi-magnify" size="20" />
        <input
          ref="input"
          :value="query"
          type="search"
          :placeholder="placeholder"
          autocomplete="off"
          spellcheck="false"
          @input="(e) => emit('update:query', e.target.value)"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="choose(ordered[cursor])"
        />
        <button v-if="query" type="button" class="ui-palette__clear" aria-label="Effacer" title="Effacer" @click="emit('update:query', ''); focus()">
          <v-icon icon="mdi-close-circle" size="18" />
        </button>
      </label>

      <div v-if="typed" ref="list" class="ui-palette__results">
        <p v-if="!ordered.length" class="ui-palette__empty">{{ empty }}</p>
        <section v-for="group in groups" :key="group.key ?? group.label" class="ui-palette__group">
          <h3 class="ui-palette__head"><span>{{ group.label }}</span><small>{{ group.items.length }}</small></h3>
          <button
            v-for="item in group.items"
            :key="item.key ?? item.label"
            type="button"
            class="ui-palette__row"
            :class="{ 'is-on': ordered[cursor] === item }"
            @click="choose(item)"
            @mouseenter="cursor = ordered.indexOf(item)"
          >
            <span class="ui-palette__icon"><v-icon :icon="item.icon || 'mdi-circle-small'" size="16" /></span>
            <span class="ui-palette__body">
              <span class="ui-palette__label">{{ item.label }}</span>
              <span v-if="item.meta" class="ui-palette__meta">{{ item.meta }}</span>
            </span>
            <v-icon v-if="ordered[cursor] === item" icon="mdi-keyboard-return" size="14" class="ui-palette__enter" />
          </button>
        </section>
      </div>
      <p v-else class="ui-palette__hint">{{ hint }}</p>

      <footer class="ui-palette__foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> parcourir</span>
        <span><kbd>Entrée</kbd> ouvrir</span>
        <span><kbd>Échap</kbd> fermer</span>
      </footer>
    </div>
  </v-dialog>
</template>
