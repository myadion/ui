<script setup>
/*
 * UN BANDEAU D'ACCROCHE (Adion UI, 2026-10-14). Un titre court, une promesse en une ligne, une icone dans la
 * couleur de la famille du produit, et l'action principale. Pour la page
 * vide d'un produit, une decouverte, une mise en route.
 *
 *   family   web, telecom, payment, marketing, cloud, ai : la couleur d'accent ;
 *   actions  l'action principale (UiButton kind="primary"), une seule ;
 *   foot     dessous : des benefices (UiFeatureGrid), une ligne discrete.
 */
defineProps({
  title: { type: String, required: true },
  promise: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  icon: { type: String, default: '' },
  family: { type: String, default: '' },
})
</script>

<template>
  <section class="ui-hero" :class="family ? `ui-fam-${family}` : ''">
    <div class="ui-hero__text">
      <span v-if="eyebrow" class="ui-hero__eyebrow">{{ eyebrow }}</span>
      <h1 class="ui-hero__title">{{ title }}</h1>
      <p v-if="promise" class="ui-hero__promise">{{ promise }}</p>
      <div v-if="$slots.actions" class="ui-hero__actions"><slot name="actions" /></div>
    </div>
    <div v-if="icon" class="ui-hero__art" aria-hidden="true"><v-icon :icon="icon" size="56" /></div>
    <div v-if="$slots.foot" class="ui-hero__foot"><slot name="foot" /></div>
  </section>
</template>
