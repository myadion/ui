<script setup>
import UiNotice from './UiNotice.vue'

/*
 * UN FORMULAIRE (Adion UI) : les champs les uns sous les autres (ou en
 * grille avec `grid`, ou sur une ligne avec `inline`), l'erreur generale de
 * Nexus au-dessus, les boutons dessous. Entree envoie : `submit` est emis,
 * jamais la page rechargee.
 */
defineProps({
  error: { type: String, default: '' },
  notice: { type: String, default: '' },
  grid: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
})
defineEmits(['submit'])
</script>

<template>
  <form class="ui-form" novalidate @submit.prevent="$emit('submit')">
    <UiNotice v-if="error" tone="bad" :text="error" />
    <UiNotice v-else-if="notice" tone="ok" :text="notice" />
    <div v-if="grid" class="ui-form__grid"><slot /></div>
    <div v-else-if="inline" class="ui-form__inline"><slot /><div v-if="$slots.actions" class="ui-form__actions"><slot name="actions" /></div></div>
    <slot v-else />
    <div v-if="$slots.actions && !inline" class="ui-form__actions"><slot name="actions" /></div>
  </form>
</template>
