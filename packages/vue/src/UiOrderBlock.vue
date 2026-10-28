<script setup>
import { computed } from 'vue'
import UiButton from './UiButton.vue'
import UiCard from './UiCard.vue'
import UiEmpty from './UiEmpty.vue'

/*
 * LE BLOC « COMMANDER » (Adion UI, 2026-10-16) : un service manque ou n'a
 * plus de quoi servir, et l'API donne le geste - l'offre, ses paquets, leur
 * prix et leur lien. Une carte par paquet, un bouton qui mene a la boutique
 * avec l'offre et le paquet deja choisis. Rien n'est calcule ici : libelles,
 * prix et liens viennent de l'API.
 *
 * offers : [{ name, description, url, packs: [{ pack, label, price_ht, unit_price_ht, url }] }]
 */
const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  icon: { type: String, default: 'mdi-cart-outline' },
  offers: { type: Array, default: () => [] },
  action: { type: String, default: 'Commander' },
})

const EUROS = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const UNIT = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 3, maximumFractionDigits: 4 })
const euros = (v) => (Number.isFinite(Number(v)) ? EUROS.format(Number(v)) : '')

/** Un lien de la boutique d'Adion reste dans l'application ; tout autre s'ouvre tel quel. */
function target(url) {
  const value = String(url || '')
  const local = value.replace(/^https:\/\/(?:www\.)?myadion\.com(?=\/)/, '')
  return local.startsWith('/') ? { to: local } : { href: value || undefined }
}

const rows = computed(() => props.offers.map((offer) => ({
  ...offer,
  packs: (offer.packs || []).map((p) => ({ ...p, price: euros(p.price_ht), unit: Number.isFinite(Number(p.unit_price_ht)) ? `${UNIT.format(Number(p.unit_price_ht))} HT l’unité` : '' })),
})))
</script>

<template>
  <div class="ui-order">
    <UiEmpty :icon="icon" :title="title" :text="text" />
    <div v-for="offer in rows" :key="offer.offer_id || offer.name" class="ui-order__offer">
      <div class="ui-order__head">
        <strong>{{ offer.name }}</strong>
        <span v-if="offer.description">{{ offer.description }}</span>
      </div>
      <div v-if="offer.packs.length" class="ui-cards">
        <UiCard v-for="p in offer.packs" :key="p.pack" :eyebrow="p.label" :value="p.price" unit="HT" :text="p.unit">
          <template #actions>
            <UiButton kind="secondary" icon="mdi-cart-plus" v-bind="target(p.shop_url || p.url || offer.shop_url || offer.url)">{{ action }}</UiButton>
          </template>
        </UiCard>
      </div>
      <div v-else-if="offer.shop_url || offer.url" class="ui-order__more">
        <UiButton kind="primary" icon="mdi-cart-plus" v-bind="target(offer.shop_url || offer.url)">{{ action }}</UiButton>
      </div>
    </div>
  </div>
</template>
