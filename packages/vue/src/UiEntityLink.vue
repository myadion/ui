<script setup>
import { computed } from 'vue'

/*
 * LE LIEN VERS UNE FICHE (Adion UI, mode outil, 2026-11-17). La regle : tout
 * nom affiche - un utilisateur, une organisation, un projet, un service, une
 * facture, un compte de facturation - mene a sa fiche. On rebondit de l'un a
 * l'autre sans jamais chercher.
 *
 *   kind   la nature de la fiche : elle choisit l'icone
 *   label  le NOM, jamais l'identifiant
 *   to     la route de la fiche ; sans `to`, le nom reste un texte
 *   sub    une precision grise apres le nom (un role, une offre)
 */
const ICONS = {
  user: 'mdi-account-outline',
  organization: 'mdi-domain',
  project: 'mdi-briefcase-outline',
  service: 'mdi-server-outline',
  subscription: 'mdi-autorenew',
  offer: 'mdi-tag-outline',
  order: 'mdi-cart-outline',
  invoice: 'mdi-receipt-text-outline',
  billing_account: 'mdi-bank-outline',
  payment: 'mdi-credit-card-outline',
  ticket: 'mdi-lifebuoy',
}
const props = defineProps({
  kind: { type: String, default: '' },
  label: { type: [String, Number], default: '' },
  to: { type: [String, Object], default: null },
  sub: { type: String, default: '' },
  icon: { type: String, default: '' },
})
const glyph = computed(() => props.icon || ICONS[props.kind] || '')
</script>

<template>
  <component :is="to ? 'router-link' : 'span'" :to="to || undefined" class="ui-entity" :class="{ 'is-link': to }" @click.stop>
    <v-icon v-if="glyph" :icon="glyph" size="14" class="ui-entity__icon" />
    <span class="ui-entity__label">{{ label }}</span>
    <span v-if="sub" class="ui-entity__sub">{{ sub }}</span>
  </component>
</template>
