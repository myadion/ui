<script setup>
import { computed, provide, ref, useSlots, watch } from 'vue'
import { useAdion } from './adapter.js'
import UiActionMenu from './UiActionMenu.vue'
import UiButton from './UiButton.vue'
import UiEmpty from './UiEmpty.vue'
import UiLoading from './UiLoading.vue'
import UiPage from './UiPage.vue'
import UiPageHeader from './UiPageHeader.vue'
import UiProductHero from './UiProductHero.vue'
import UiProductPitch from './UiProductPitch.vue'
import UiSection from './UiSection.vue'

/* Le bouton Commander est celui de l'app (createAdionUi({ components: { OrderButton } })). */
const OrderButton = useAdion().components?.OrderButton || null

/*
 * LE GABARIT D'UNE PAGE PRODUIT (Adion UI) : pour que le client ne se
 * perde pas, toutes les listes de services ont la meme structure, au
 * meme endroit :
 *
 *   1. l'en-tete compact : la famille et le titre, Actualiser puis Commander
 *      a droite (Commander porte l'accent : c'est l'action de la page). Plus de
 *      phrase d'explication (Kevin, 2026-10-29) : on sait ou l'on est ;
 *      Un menu « Ressources » (`links`) suit Actualiser : Documentation,
 *      Offres, Conditions du produit (liens de l'API) ;
 *   2. plus de chiffres cles au-dessus du tableau (Kevin, 2026-10-29) : ils
 *      redisaient ce que la liste montre ; le creneau `stats` n'est plus rendu ;
 *   3. la liste : UiTable, sans titre au-dessus (« Vos acces » ne disait rien
 *      de plus que le titre de la page). Les filtres de la liste (creneau
 *      list-actions) passent dans la barre du tableau, avec la recherche ;
 *   4. sans aucun service (`empty`), la page commerciale du produit
 *      (UiProductPitch) : sa presentation et ses offres, lues au catalogue par
 *      l'app (services.productPitch). Sans presentation, un etat vide qui
 *      propose de commander.
 *
 * Une page de decouverte (une IA, un produit a faire connaitre) remplace
 * l'en-tete par une accroche : creneau « hero » (UiHero).
 *
 * Les pages transverses (Mes commandes, Facturation…) le suivent aussi :
 * sans `order`, il n'y a simplement pas de bouton Commander.
 */
const props = defineProps({
  /** Plus employes depuis le retrait des chiffres (2026-10-29) ; gardes pour les pages qui les passent. */
  tint: { type: String, default: '' },
  family: { type: String, required: true },
  title: { type: String, required: true },
  /** Plus affiches (2026-10-29) ; gardes pour ne pas casser les pages qui les passent encore. */
  lead: { type: String, default: '' },
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

/* La page commerciale d'une liste vide : l'app la lit au catalogue (createAdionUi, services.productPitch). */
const pitch = ref(null)
watch(() => [props.empty, props.order.join()], async ([empty]) => {
  const read = useAdion().services?.productPitch
  if (!empty || !props.order.length || !read) { pitch.value = null; return }
  try { pitch.value = await read(props.order) } catch { pitch.value = null }
}, { immediate: true })
const slots = useSlots()

/*
 * Les filtres de la liste vont dans la barre du premier UiTable de la page
 * (celui de la liste, monte le premier) : un seul rang, recherche et filtres.
 */
provide('uiListFilters', { render: () => slots['list-actions']?.(), present: () => Boolean(slots['list-actions']), owner: null })
const ICONS = { documentation: 'mdi-book-open-variant', offers: 'mdi-tag-outline', terms: 'mdi-file-document-outline' }
const menu = computed(() => (props.links || []).filter((l) => l?.href && l?.label).map((l) => ({ key: l.key || l.label, label: l.label, href: l.href, icon: l.icon || ICONS[l.key], available: true })))
</script>

<template>
  <UiPage :denied="denied" :error="error" @retry="$emit('refresh')">
    <template #header>
      <slot name="hero">
      <UiPageHeader :eyebrow="family" :title="title">
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

    <slot name="before" />

    <!-- L'ecran commercial (Kevin, 2026-10-29) : un fond, un titre, trois etapes, Commander. -->
    <UiProductHero
      v-if="empty && pitch?.hero && !loading"
      :hero="pitch.hero"
      :price="pitch.price"
      :order-label="orderLabel"
      :orderable="Boolean(OrderButton && order.length && orderable)"
      @order="orderer?.start()"
    />

    <UiProductPitch
      v-else-if="empty && pitch && !loading"
      :pitch="pitch"
      :order-label="orderLabel"
      :orderable="Boolean(OrderButton && order.length && orderable)"
      @order="(key) => (key && orderer?.choose ? orderer.choose(key) : orderer?.start())"
    />

    <div v-else class="ui-listgrid">
      <UiSection first>
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
    </div>

    <slot name="after" />
  </UiPage>
</template>
