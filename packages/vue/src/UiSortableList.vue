<script setup>
import { ref } from 'vue'

/*
 * UNE LISTE QU'ON REORDONNE (Adion UI) : l'ordre d'une cascade de canaux, des
 * etapes. On glisse une ligne par sa poignee, ou au clavier avec les boutons
 * Monter et Descendre (toujours presents : le glisser n'est qu'un raccourci).
 * `v-model` est le tableau dans l'ordre ; chaque element = { key, label, hint?,
 * icon?, fixed? } (`fixed` : ne bouge pas). Le rang est affiche (1, 2, 3...).
 */
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const dragging = ref(-1)
const over = ref(-1)
const said = ref('')

function move(from, to) {
  if (props.disabled || to < 0 || to >= props.modelValue.length || from === to) return
  if (props.modelValue[from]?.fixed || props.modelValue[to]?.fixed) return
  const next = [...props.modelValue]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  emit('update:modelValue', next)
  said.value = `${item.label} : position ${to + 1} sur ${next.length}`
}
function drop(to) {
  if (dragging.value >= 0) move(dragging.value, to)
  dragging.value = -1
  over.value = -1
}
</script>

<template>
  <div class="ui-sort">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <ol class="ui-sort__list">
      <li
        v-for="(item, i) in modelValue" :key="item.key" class="ui-sort__item"
        :class="{ 'is-dragging': dragging === i, 'is-over': over === i && dragging !== i, 'is-fixed': item.fixed }"
        :draggable="!disabled && !item.fixed" @dragstart="dragging = i" @dragend="dragging = -1; over = -1"
        @dragover.prevent="over = i" @drop.prevent="drop(i)"
      >
        <v-icon v-if="!disabled && !item.fixed" icon="mdi-drag" size="18" class="ui-sort__grip" aria-hidden="true" />
        <span class="ui-sort__rank">{{ i + 1 }}</span>
        <v-icon v-if="item.icon" :icon="item.icon" size="16" aria-hidden="true" />
        <span class="ui-sort__text">{{ item.label }}<small v-if="item.hint">{{ item.hint }}</small></span>
        <span class="ui-sort__moves">
          <button type="button" class="ui-sort__btn" :disabled="disabled || item.fixed || i === 0" :aria-label="`Monter ${item.label}`" @click="move(i, i - 1)"><v-icon icon="mdi-arrow-up" size="16" /></button>
          <button type="button" class="ui-sort__btn" :disabled="disabled || item.fixed || i === modelValue.length - 1" :aria-label="`Descendre ${item.label}`" @click="move(i, i + 1)"><v-icon icon="mdi-arrow-down" size="16" /></button>
        </span>
      </li>
    </ol>
    <small v-if="hint" class="ui-field__hint">{{ hint }}</small>
    <span class="ui-sr" role="status" aria-live="polite">{{ said }}</span>
  </div>
</template>
