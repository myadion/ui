<script setup>
import { computed } from 'vue'
import UiButton from './UiButton.vue'

/*
 * L'ECRAN COMMERCIAL D'UN PRODUIT (Adion UI, 2026-10-29, Kevin : « un fond
 * stylé, un gros titre accrocheur, une petite description, une fresque de la
 * phase 1 a la phase 3 - un mot, une icone - et le bouton Commander, a partir
 * de tant ; chaque produit different »). Ce que montre une liste vide.
 *
 *   hero   { theme, headline, text, steps: [{ icon, word }] } - le catalogue de l'API
 *          theme : bubbles, beams, waves, grid, rings, orbs, cards ; chacun a
 *          son decor et sa mise en page.
 *   price  « À partir de 4,99 € HT / mois » (ou vide)
 *   orderLabel, orderable
 *
 * Evenement : order.
 */
const props = defineProps({
  hero: { type: Object, required: true },
  price: { type: String, default: '' },
  orderLabel: { type: String, default: 'Commander' },
  orderable: { type: Boolean, default: true },
})
defineEmits(['order'])

const THEMES = ['bubbles', 'beams', 'waves', 'grid', 'rings', 'orbs', 'cards']
const theme = computed(() => (THEMES.includes(props.hero.theme) ? props.hero.theme : 'orbs'))
/* Le nombre d'elements du decor : des bulles, des faisceaux, des ondes… */
const ART = { bubbles: 7, beams: 9, waves: 5, grid: 0, rings: 4, orbs: 3, cards: 3 }
</script>

<template>
  <section class="ui-phero" :class="`is-${theme}`">
    <div class="ui-phero__art" aria-hidden="true">
      <span v-for="n in ART[theme]" :key="n" class="ui-phero__bit" :style="{ '--i': n }" />
    </div>

    <div class="ui-phero__body">
      <h2 class="ui-phero__headline">{{ hero.headline }}</h2>
      <p v-if="hero.text" class="ui-phero__text">{{ hero.text }}</p>

      <ol v-if="hero.steps?.length" class="ui-phero__steps">
        <li v-for="(step, index) in hero.steps" :key="step.word" class="ui-phero__step">
          <span class="ui-phero__icon"><v-icon :icon="step.icon" size="22" /></span>
          <span class="ui-phero__word"><small>{{ index + 1 }}</small>{{ step.word }}</span>
        </li>
      </ol>

      <div v-if="orderable" class="ui-phero__cta">
        <UiButton kind="primary" icon="mdi-cart-outline" class="ui-phero__order" @click="$emit('order')">{{ orderLabel }}</UiButton>
        <span v-if="price" class="ui-phero__price">{{ price }}</span>
      </div>
    </div>
  </section>
</template>
