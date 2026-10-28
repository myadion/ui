<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useAdion } from './adapter.js'
import UiActionMenu from './UiActionMenu.vue'
import UiButton from './UiButton.vue'
import UiEmpty from './UiEmpty.vue'
import UiLoading from './UiLoading.vue'
import UiPage from './UiPage.vue'
import UiPageHeader from './UiPageHeader.vue'
import UiSection from './UiSection.vue'
import { gradientOf } from './layout'

/* Le bouton Commander est celui de l'app (createAdionUi({ components: { OrderButton } })). */
const OrderButton = useAdion().components?.OrderButton || null

/*
 * LE GABARIT D'UNE PAGE PRODUIT (Adion UI) : pour que le client ne se
 * perde pas, toutes les listes de services ont la meme structure, au
 * meme endroit :
 *
 *   1. l'en-tete compact : la famille et le titre sur une ligne, Actualiser
 *      puis Commander a droite (Commander porte l'accent : c'est l'action de
 *      la page), la phrase d'explication dessous ;
 *      Un menu « Ressources » (`links`) suit Actualiser : Documentation,
 *      Offres, Conditions du produit (liens de l'API) ;
 *   2. les chiffres (creneau `stats`) : en colonne a droite de la liste (par
 *      defaut, comme sur les fiches), au-dessus d'elle sur telephone ; ou en
 *      bande sous l'en-tete (`stats-layout="band"`) ;
 *   3. la liste : son titre, puis UiTable (recherche, filtres, colonnes) ;
 *   4. sans aucun service (`empty`), un etat vide qui explique le produit et
 *      propose de le commander.
 *
 * Une page de decouverte (une IA, un produit a faire connaitre) remplace
 * l'en-tete par une accroche : creneau « hero » (UiHero).
 *
 * Les pages transverses (Mes commandes, Facturation…) le suivent aussi :
 * sans `order`, il n'y a simplement pas de bouton Commander.
 */
const props = defineProps({
  /** Le degrade des chiffres : une famille (web, telecom…) ; par defaut, celui de `family`. */
  tint: { type: String, default: '' },
  family: { type: String, required: true },
  title: { type: String, required: true },
  lead: { type: String, required: true },
  listTitle: { type: String, default: '' },
  /** Les codes produit a commander (OrderButton) ; vide : pas de Commander. */
  order: { type: Array, default: () => [] },
  orderLabel: { type: String, default: 'Commander un service' },
  /** Documentation, Offres, Conditions du produit : [{ key, label, href }] (l'API les donne par produit). */
  links: { type: Array, default: () => [] },
  orderable: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  denied: { type: [Boolean, String], default: false },
  error: { type: String, default: '' },
  empty: { type: Boolean, default: false },
  emptyText: { type: String, default: '' },
  refreshable: { type: Boolean, default: true },
  statsLayout: { type: String, default: 'aside', validator: (v) => ['band', 'aside'].includes(v) },
})
defineEmits(['refresh'])

const orderer = ref(null)
const ICONS = { documentation: 'mdi-book-open-variant', offers: 'mdi-tag-outline', terms: 'mdi-file-document-outline' }
const menu = computed(() => (props.links || []).filter((l) => l?.href && l?.label).map((l) => ({ key: l.key || l.label, label: l.label, href: l.href, icon: l.icon || ICONS[l.key], available: true })))
</script>

<template>
  <UiPage :denied="denied" :error="error" @retry="$emit('refresh')">
    <template #header>
      <slot name="hero">
      <UiPageHeader :eyebrow="family" :title="title" :lead="lead">
        <template #actions>
          <UiButton v-if="refreshable" kind="quiet" icon="mdi-refresh" :loading="loading" @click="$emit('refresh')">Actualiser</UiButton>
          <slot name="actions" />
          <UiActionMenu v-if="menu.length" :actions="menu" label="Ressources" />
          <template v-if="OrderButton && order.length && orderable">
            <UiButton kind="primary" icon="mdi-plus" @click="orderer?.start()">{{ orderLabel }}</UiButton>
            <OrderButton ref="orderer" bare :products="order" :label="orderLabel" />
          </template>
        </template>
      </UiPageHeader>
      </slot>
    </template>

    <div v-if="$slots.stats && !empty && statsLayout === 'band'" class="ui-stats is-band" :class="`ui-grad--${tint || gradientOf(family)}`"><slot name="stats" /></div>

    <slot name="before" />

    <div class="ui-listgrid" :class="{ 'has-aside': $slots.stats && !empty && statsLayout === 'aside' }">
      <UiSection :title="listTitle" first>
        <template v-if="$slots['list-actions']" #actions><slot name="list-actions" /></template>
        <UiLoading v-if="loading && empty" />
        <UiEmpty v-else-if="empty" :text="emptyText" icon="mdi-package-variant-closed">
          <template v-if="(OrderButton && order.length && orderable) || $slots['empty-actions']" #actions>
            <slot name="empty-actions">
              <UiButton kind="secondary" icon="mdi-plus" @click="orderer?.start()">{{ orderLabel }}</UiButton>
            </slot>
          </template>
        </UiEmpty>
        <slot v-else />
      </UiSection>
      <div v-if="$slots.stats && !empty && statsLayout === 'aside'" class="ui-stats is-aside" :class="`ui-grad--${tint || gradientOf(family)}`"><slot name="stats" /></div>
    </div>

    <slot name="after" />
  </UiPage>
</template>
