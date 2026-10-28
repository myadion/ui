<script setup>
import { computed, ref, watch } from 'vue'
import UiPage from './UiPage.vue'
import UiPageHeader from './UiPageHeader.vue'
import UiTabs from './UiTabs.vue'
import UiServiceActions from './UiServiceActions.vue'
import UiServiceNotice from './UiServiceNotice.vue'
import { crumbTrail, gradientOf, orderTabs } from './layout'

/*
 * LE GABARIT DE LA FICHE D'UN SERVICE (Adion UI). Toutes les fiches ont la
 * meme structure, au meme endroit :
 *
 *   1. l'en-tete : le fil d'Ariane vers la liste (`crumbs`, il s'arrete a la
 *      liste), le nom (`title`, ou le creneau `title` pour le renommer sur
 *      place), son etat et la ligne de faits (`meta`) ; les gestes a droite, puis le menu
 *      d'actions standard, qui se branche seul (`service-id`, UiServiceActions) ;
 *   2. les bandeaux qui comptent maintenant (`notices`) : suspendu, plus de
 *      credit, resiliation programmee ; avec `service-id`, le bandeau d'un
 *      incident sur le serveur du service vient de lui-meme (UiServiceNotice) ;
 *   3. les chiffres cles (`stats`, facultatif) : empiles dans la colonne de
 *      droite, a cote des onglets et de leur contenu ; sur telephone une seule
 *      colonne, les chiffres d'abord ;
 *   4. les onglets - « Vue d'ensemble » toujours en premier, les reglages
 *      puis la resiliation toujours en dernier : le gabarit les range ;
 *   5. le contenu de l'onglet ouvert (creneau par defaut, { tab }), en
 *      sections UiSection ; sur grand ecran, une colonne de resume a droite
 *      (creneau « aside »).
 */
const props = defineProps({
  title: { type: String, default: '' },
  /** Le degrade du cartouche et des chiffres : une famille (web, telecom…) ; par defaut, celui du premier maillon du fil d'Ariane. */
  tint: { type: String, default: '' },
  /** L'icone du produit, en tuile a gauche du nom. */
  icon: { type: String, default: '' },
  crumbs: { type: Array, default: () => [] },
  status: { type: Object, default: null },
  href: { type: String, default: '' },
  tabs: { type: Array, default: () => [] },
  tab: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  denied: { type: [Boolean, String], default: false },
  missing: { type: String, default: '' },
  missingTo: { type: [String, Object], default: '' },
  error: { type: String, default: '' },
  /** Le menu d'actions standard (Migrer, Changer d'offre, Resilier...) : la liste `actions` que l'API envoie sur le service. */
  actions: { type: Array, default: null },
  /** Le menu se branche seul : il lit les actions du service (`serviceId`) et fait les gestes communs (resilier, migrer, reactiver). */
  serviceId: { type: String, default: '' },
  /** L'abonnement de la fiche, avec ses champs de resiliation, quand elle l'a. */
  subscription: { type: Object, default: null },
  /** Les actions rapides du produit que la fiche ecoute (`action`) ; `change_offer` si elle ouvre le changement d'offre (`start`). */
  handles: { type: Array, default: () => [] },
  /** Actualiser, en premiere entree du menu : la fiche ecoute `refresh` et recharge ses donnees (le menu se recharge aussi). */
  refreshable: { type: Boolean, default: false },
})
const emit = defineEmits(['update:tab', 'retry', 'action', 'start', 'changed', 'refresh', 'renamed'])
// Renommer depuis le menu : le nouveau nom s'affiche aussitot, sans attendre que la fiche se recharge.
const renamedTo = ref('')
watch(() => [props.serviceId, props.title], () => { renamedTo.value = '' })
function renamed(text) { renamedTo.value = text; emit('renamed', text) }
const shownTitle = computed(() => renamedTo.value || props.title)
const menu = computed(() => Boolean(props.serviceId || props.actions || props.refreshable))

const grad = computed(() => `ui-grad--${props.tint || gradientOf(props.crumbs?.[0]?.label)}`)
const ordered = computed(() => orderTabs(props.tabs))
const trail = computed(() => crumbTrail(props.crumbs))
</script>

<template>
  <UiPage
    :loading="loading"
    :denied="denied"
    :missing="missing"
    :missing-to="missingTo"
    :error="error"
    @retry="$emit('retry')"
  >
    <UiPageHeader resource :class="grad" :icon="icon" :title="shownTitle" :crumbs="trail" :status="status" :href="href">
      <template v-if="$slots.title" #title><slot name="title" /></template>
      <template v-if="$slots.meta" #meta><slot name="meta" /></template>
      <template v-if="$slots.actions || menu" #actions>
        <slot name="actions" />
        <UiServiceActions v-if="menu" :service-id="serviceId" :service-name="shownTitle" :subscription="subscription" :handles="handles" :actions="actions" :refreshable="refreshable" @refresh="emit('refresh')" @renamed="renamed" @action="(key) => emit('action', key)" @start="(v) => emit('start', v)" @changed="emit('changed')" />
      </template>
    </UiPageHeader>

    <!-- Sous le cartouche, tout s'aligne sur son texte : la gouttiere de la fiche. -->
    <div class="ui-detail__content">
      <UiServiceNotice v-if="serviceId" :service-id="serviceId" />
      <slot name="notices" />

      <!--
        Comme /maquette (2026-10-28) : les chiffres en bande sous l'en-tete, les
        onglets sur toute la largeur, puis le contenu et, s'il y en a, une
        colonne a droite (l'activite, un encart).
      -->
      <div v-if="$slots.stats" class="ui-stats is-band" :class="grad"><slot name="stats" /></div>
      <UiTabs v-if="ordered.length > 1" :tabs="ordered" :model-value="tab" query="onglet" @update:model-value="(v) => emit('update:tab', v)" />
      <div v-if="$slots.aside" class="ui-split ui-split--detail">
        <div class="ui-layout__body"><slot :tab="tab" /></div>
        <aside class="ui-split__aside"><slot name="aside" :tab="tab" /></aside>
      </div>
      <div v-else class="ui-layout__body"><slot :tab="tab" /></div>
    </div>
  </UiPage>
</template>
