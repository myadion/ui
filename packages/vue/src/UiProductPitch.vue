<script setup>
import { ref } from 'vue'
import UiButton from './UiButton.vue'
import UiMedia from './UiMedia.vue'
import UiNotice from './UiNotice.vue'

/*
 * LA PAGE COMMERCIALE D'UN PRODUIT (Adion UI, 2026-10-29). Ce que montre une
 * liste qui n'a encore aucun service. Trois choses, dans l'ordre ou on les
 * cherche : ce que c'est (une phrase), combien ca coute (les offres, le prix
 * en grand, ce qu'elles comprennent, un bouton chacune), comment ca se passe
 * (trois etapes). Le reste - le detail, la mise en garde - se deplie.
 *
 *   pitch  { tagline, lead, price, image,
 *            offers: [{ key, label, price: { from, amount, suffix }, includes: [texte], recommended }],
 *            steps: [{ title, text }], body: [texte], caveat }
 *          Tout vient du catalogue de l'API ; le kit ne l'ecrit pas.
 *   orderLabel  le libelle du bouton principal (celui de la page)
 *   orderable   faux : pas de bouton
 *
 * Evenement : order(offerKey) - vide pour le bouton principal.
 */
defineProps({
  pitch: { type: Object, required: true },
  orderLabel: { type: String, default: 'Commander' },
  orderable: { type: Boolean, default: true },
})
defineEmits(['order'])

const offersEl = ref(null)
const more = ref(false)
const seeOffers = () => offersEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
</script>

<template>
  <section class="ui-pitch">
    <div class="ui-pitch__hero" :class="{ 'has-media': pitch.image }">
      <div class="ui-pitch__intro">
        <p class="ui-pitch__tagline">{{ pitch.tagline }}</p>
        <p v-if="pitch.price" class="ui-pitch__price">{{ pitch.price }}</p>
        <div v-if="orderable" class="ui-pitch__cta">
          <UiButton kind="primary" icon="mdi-plus" @click="$emit('order', '')">{{ orderLabel }}</UiButton>
          <UiButton v-if="pitch.offers?.length > 1" kind="quiet" append-icon="mdi-arrow-down" @click="seeOffers">Voir les offres</UiButton>
        </div>
      </div>
      <UiMedia v-if="pitch.image" class="ui-pitch__media" kind="image" :src="pitch.image" ratio="16 / 10" bare />
    </div>

    <div v-if="pitch.offers?.length" ref="offersEl" class="ui-pitch__offers">
      <article v-for="offer in pitch.offers" :key="offer.key" class="ui-pitch__offer" :class="{ 'is-recommended': offer.recommended }">
        <span v-if="offer.recommended" class="ui-pitch__badge">Recommandée</span>
        <strong class="ui-pitch__offer-name">{{ offer.label }}</strong>
        <div class="ui-pitch__amount">
          <small v-if="offer.price.from">à partir de</small>
          <span class="ui-pitch__value">{{ offer.price.amount }}</span>
          <small v-if="offer.price.suffix">{{ offer.price.suffix }}</small>
        </div>
        <ul v-if="offer.includes?.length" class="ui-pitch__includes">
          <li v-for="line in offer.includes" :key="line"><v-icon icon="mdi-check" size="15" />{{ line }}</li>
        </ul>
        <UiButton v-if="orderable" class="ui-pitch__choose" :kind="offer.recommended ? 'primary' : 'secondary'" @click="$emit('order', offer.key)">Choisir</UiButton>
      </article>
    </div>

    <ol v-if="pitch.steps?.length" class="ui-pitch__steps">
      <li v-for="(step, index) in pitch.steps" :key="step.title" :title="step.text">
        <span class="ui-pitch__num" aria-hidden="true">{{ index + 1 }}</span>{{ step.title }}
      </li>
    </ol>

    <div v-if="pitch.lead || pitch.body?.length || pitch.caveat" class="ui-pitch__more">
      <button type="button" class="ui-pitch__toggle" :aria-expanded="more" @click="more = !more">
        {{ more ? 'Moins de détails' : 'En savoir plus' }}
        <v-icon :icon="more ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="16" />
      </button>
      <div v-if="more" class="ui-pitch__detail">
        <p v-if="pitch.lead">{{ pitch.lead }}</p>
        <p v-for="(paragraph, index) in pitch.body" :key="index">{{ paragraph }}</p>
        <ol v-if="pitch.steps?.length" class="ui-pitch__steplist">
          <li v-for="step in pitch.steps" :key="step.title"><strong>{{ step.title }}.</strong> {{ step.text }}</li>
        </ol>
        <UiNotice v-if="pitch.caveat" tone="warn" icon="mdi-alert-outline" :text="pitch.caveat" />
      </div>
    </div>
  </section>
</template>
