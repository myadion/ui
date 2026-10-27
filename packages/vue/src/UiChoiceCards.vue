<script setup>
/*
 * DES CARTES A CHOISIR (Adion UI, 2026-10-14) : une IA, une offre, un mode.
 * Chacune porte une icone ou ses initiales (jamais un logo de marque en
 * image), son nom et une ligne d'aide ; la carte choisie se voit (bord,
 * fond, coche). items : [{ value, label, hint, icon, initials }].
 */
defineProps({
  modelValue: { type: [String, Number], default: null },
  items: { type: Array, default: () => [] },
  family: { type: String, default: '' },
  label: { type: String, default: '' },
})
defineEmits(['update:modelValue'])

const initials = (item) => {
  if (item.initials) return item.initials
  const words = String(item.label || '').split(/\s+/).filter(Boolean)
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || '').slice(0, 2)).toUpperCase()
}
</script>

<template>
  <div class="ui-choices" :class="family ? `ui-fam-${family}` : ''" role="radiogroup" :aria-label="label || undefined">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      role="radio"
      class="ui-choice"
      :class="{ 'is-selected': modelValue === item.value }"
      :aria-checked="modelValue === item.value"
      @click="$emit('update:modelValue', item.value)"
    >
      <span class="ui-choice__mark" aria-hidden="true">
        <v-icon v-if="item.icon" :icon="item.icon" size="20" />
        <template v-else>{{ initials(item) }}</template>
      </span>
      <span class="ui-choice__label">{{ item.label }}</span>
      <span v-if="item.hint" class="ui-choice__hint">{{ item.hint }}</span>
      <v-icon v-if="modelValue === item.value" class="ui-choice__check" icon="mdi-check-circle" size="18" />
    </button>
  </div>
</template>
