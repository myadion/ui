<script setup>
/*
 * UNE CARTE (Adion UI) : une surface bordee, pour ce qui se compare cote a
 * cote - des paquets, des offres, des choix. Elle remplace les `.sheet`,
 * `.pack`, `.card` que chaque ecran redessinait. Une page ne s'en sert pas
 * pour encadrer ses sections : c'est le role de UiSection, sans cadre.
 *
 * Plusieurs cartes se rangent dans <div class="ui-cards">. `badge` pose une
 * mention en haut a droite (« Le plus avantageux »), sur le ton `badgeTone`.
 */
import UiBadge from './UiBadge.vue'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  value: { type: String, default: '' },
  unit: { type: String, default: '' },
  text: { type: String, default: '' },
  selected: { type: Boolean, default: false },
  tag: { type: String, default: 'article' },
  badge: { type: String, default: '' },
  badgeTone: { type: String, default: 'accent' },
  /** Un fond en degrade : `brand` ou une famille (web, telecom, payment, marketing, cloud, ai). */
  family: { type: String, default: '' },
})
</script>

<template>
  <component :is="tag" class="ui-card" :class="[{ 'is-selected': selected, 'has-badge': badge }, family && `ui-grad ui-grad--${family}`]">
    <UiBadge v-if="badge" class="ui-card__badge" :label="badge" :tone="badgeTone" />
    <span v-if="eyebrow" class="ui-card__eyebrow">{{ eyebrow }}</span>
    <h3 v-if="title" class="ui-card__title">{{ title }}</h3>
    <strong v-if="value" class="ui-card__value">{{ value }} <small v-if="unit">{{ unit }}</small></strong>
    <p v-if="text" class="ui-card__text">{{ text }}</p>
    <slot />
    <div v-if="$slots.actions" class="ui-card__actions"><slot name="actions" /></div>
  </component>
</template>
