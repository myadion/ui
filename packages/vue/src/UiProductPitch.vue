<script setup>
import UiButton from './UiButton.vue'
import UiMedia from './UiMedia.vue'
import UiNotice from './UiNotice.vue'

/*
 * LA PAGE COMMERCIALE D'UN PRODUIT (Adion UI, 2026-10-29). Ce que montre une
 * liste qui n'a encore aucun service : l'accroche et le prix d'appel avec le
 * bouton Commander, l'image, les offres, les etapes, puis le detail et la
 * mise en garde. Des que le premier service existe, la liste reprend sa place.
 *
 *   pitch  { lead, price, image, caption, offers: [{ key, label, price, text, recommended }],
 *            steps: [{ title, text }], body: [texte], caveat }
 *          Tout vient du catalogue de l'API ; le kit ne l'ecrit pas.
 *   orderLabel  le libelle du bouton (celui de la page)
 *   orderable   faux : pas de bouton Commander
 *
 * Evenement : order (l'app ouvre sa commande).
 */
defineProps({
  pitch: { type: Object, required: true },
  orderLabel: { type: String, default: 'Commander' },
  orderable: { type: Boolean, default: true },
})
defineEmits(['order'])
</script>

<template>
  <section class="ui-pitch">
    <div class="ui-pitch__hero" :class="{ 'has-media': pitch.image }">
      <div class="ui-pitch__intro">
        <p class="ui-pitch__lead">{{ pitch.lead }}</p>
        <p v-if="pitch.price" class="ui-pitch__price">{{ pitch.price }}</p>
        <div v-if="orderable" class="ui-pitch__cta">
          <UiButton kind="primary" icon="mdi-plus" @click="$emit('order')">{{ orderLabel }}</UiButton>
        </div>
      </div>
      <figure v-if="pitch.image" class="ui-pitch__media">
        <UiMedia kind="image" :src="pitch.image" ratio="4 / 3" bare />
        <figcaption v-if="pitch.caption">{{ pitch.caption }}</figcaption>
      </figure>
    </div>

    <div v-if="pitch.offers?.length" class="ui-pitch__offers">
      <article v-for="offer in pitch.offers" :key="offer.key" class="ui-pitch__offer" :class="{ 'is-recommended': offer.recommended }">
        <strong class="ui-pitch__offer-name">{{ offer.label }}</strong>
        <span class="ui-pitch__offer-price">{{ offer.price }}</span>
        <p v-if="offer.text" class="ui-pitch__offer-text">{{ offer.text }}</p>
      </article>
    </div>

    <div v-if="pitch.steps?.length" class="ui-pitch__block">
      <h2 class="ui-pitch__title">Comment ça se passe</h2>
      <ol class="ui-pitch__steps">
        <li v-for="(step, index) in pitch.steps" :key="step.title" class="ui-pitch__step">
          <span class="ui-pitch__num" aria-hidden="true">{{ index + 1 }}</span>
          <strong>{{ step.title }}</strong>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </div>

    <div v-if="pitch.body?.length" class="ui-pitch__block">
      <h2 class="ui-pitch__title">En détail</h2>
      <div class="ui-pitch__prose"><p v-for="(paragraph, index) in pitch.body" :key="index">{{ paragraph }}</p></div>
    </div>

    <UiNotice v-if="pitch.caveat" tone="warn" icon="mdi-alert-outline" :text="pitch.caveat" />
  </section>
</template>
