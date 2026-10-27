<script setup>
/*
 * UN ETAT VIDE (Adion UI) : il explique et propose une suite. « Aucun
 * element » ne suffit jamais : dites ce que serait la chose, et comment
 * l'obtenir (Commander, Creer, Voir tout).
 */
defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <div class="ui-empty">
    <v-icon v-if="icon" :icon="icon" size="22" />
    <div class="ui-empty__text">
      <p v-if="title" class="ui-empty__title">{{ title }}</p>
      <p v-if="text">{{ text }}</p>
      <slot />
    </div>
    <div v-if="$slots.actions" class="ui-empty__actions"><slot name="actions" /></div>
  </div>
</template>
