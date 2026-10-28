<script setup>
/*
 * UNE CARTE QUI DONNE ENVIE (Adion UI, 2026-10-28, d'apres /maquette) : un
 * degrade bleu nuit vers vert, deux vagues qui ondulent lentement en bas
 * (coupees si l'on reduit les animations). Une par ecran, pas plus.
 *
 *   tag     une petite ligne au-dessus du titre, avec `tag-icon`
 *   slot actions   ses boutons
 */
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  tag: { type: String, default: '' },
  tagIcon: { type: String, default: 'mdi-shield-check-outline' },
})
</script>

<template>
  <section class="ui-promo">
    <div v-if="tag" class="ui-promo__tag"><v-icon :icon="tagIcon" size="14" />{{ tag }}</div>
    <h3 class="ui-promo__title">{{ title }}</h3>
    <p v-if="text" class="ui-promo__text">{{ text }}</p>
    <div v-if="$slots.actions" class="ui-promo__actions"><slot name="actions" /></div>
    <svg class="ui-promo__waves" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">
      <path class="ui-promo__wave is-a" d="M0 44 C 50 30, 100 58, 150 44 S 250 30, 300 44 S 400 58, 450 44 S 550 30, 600 44 S 700 58, 750 44 S 850 30, 900 44 V 80 H 0 Z" />
      <path class="ui-promo__wave is-b" d="M0 54 C 60 42, 120 66, 180 54 S 300 42, 360 54 S 480 66, 540 54 S 660 42, 720 54 S 840 66, 900 54 V 80 H 0 Z" />
    </svg>
  </section>
</template>
