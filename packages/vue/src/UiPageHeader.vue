<script setup>
import UiStatus from './UiStatus.vue'

/*
 * L'EN-TETE D'UNE PAGE (Adion UI), compact (2026-10-13) :
 *
 *   ligne 1   la famille (ou le fil d'Ariane), le titre et son etat ; les gestes a droite ;
 *   ligne 2   la phrase d'explication, courte ;
 *   ligne 3   les faits (`meta`), pour une fiche.
 *
 * `resource` pose le tout dans un cartouche, pour la fiche d'un service. Le
 * creneau `title` remplace le texte du titre (un nom qu'on renomme sur place).
 * Les gestes vont dans `actions`, dans cet ordre : Actualiser, les gestes
 * secondaires, puis l'action principale tout a droite.
 */
defineProps({
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  lead: { type: String, default: '' },
  status: { type: Object, default: null },
  href: { type: String, default: '' },
  resource: { type: Boolean, default: false },
  /** @type {Array<{label:string,to?:string|object}>} */
  crumbs: { type: Array, default: () => [] },
})
</script>

<template>
  <header class="ui-header" :class="{ 'ui-header--resource': resource }">
    <ol v-if="crumbs.length" class="ui-crumbs" aria-label="Fil d’Ariane">
      <template v-for="(crumb, index) in crumbs" :key="index">
        <li>
          <router-link v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</router-link>
          <span v-else>{{ crumb.label }}</span>
        </li>
        <li v-if="index < crumbs.length - 1" aria-hidden="true">›</li>
      </template>
    </ol>
    <div class="ui-header__line">
      <span v-if="eyebrow && !crumbs.length" class="ui-header__family">{{ eyebrow }}</span>
      <h1 class="ui-header__title">
        <slot name="title">
          <a v-if="href" :href="href" target="_blank" rel="noopener">{{ title }}</a>
          <template v-else>{{ title }}</template>
        </slot>
        <UiStatus v-if="status" :status="status" />
      </h1>
    </div>
    <div v-if="$slots.actions" class="ui-header__actions"><slot name="actions" /></div>
    <p v-if="lead" class="ui-header__lead">{{ lead }}</p>
    <div v-if="$slots.meta" class="ui-header__meta"><slot name="meta" /></div>
  </header>
</template>
