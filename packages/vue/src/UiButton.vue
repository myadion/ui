<script setup>
import { computed } from 'vue'

/*
 * LE BOUTON (Adion UI). Quatre sortes, pas une de plus :
 *
 *   primary    l'action de l'ecran - une par zone : Commander, Enregistrer, Suivant ;
 *   secondary  une action utile mais pas principale : Envoyer, Acheter ;
 *   quiet      un geste d'appoint : Actualiser, Annuler, Voir tout ;
 *   danger     ce qui supprime, revoque ou resilie - et se confirme (UiConfirm).
 *
 * Toujours en minuscules de phrase, a la hauteur d'un champ (32 px), avec
 * l'arrondi des controles. L'accent (le vert) est reserve a l'action primary.
 * `icon-only` pour un bouton sans texte : il garde son titre pour le survol.
 */
const props = defineProps({
  kind: { type: String, default: 'secondary', validator: (v) => ['primary', 'secondary', 'quiet', 'danger'].includes(v) },
  icon: { type: String, default: '' },
  appendIcon: { type: String, default: '' },
  iconOnly: { type: Boolean, default: false },
  title: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  to: { type: [String, Object], default: undefined },
  href: { type: String, default: undefined },
  type: { type: String, default: 'button' },
  block: { type: Boolean, default: false },
})

defineEmits(['click'])

const look = computed(() => ({
  primary: { variant: 'flat', color: undefined },
  secondary: { variant: 'tonal', color: undefined },
  quiet: { variant: 'text', color: undefined },
  danger: { variant: 'tonal', color: 'error' },
}[props.kind]))
</script>

<template>
  <v-btn
    v-if="iconOnly"
    :variant="kind === 'primary' ? 'tonal' : 'text'"
    class="ui-btn"
    :color="kind === 'danger' ? 'error' : undefined"
    size="small"
    :icon="icon"
    :title="title"
    :aria-label="title"
    :loading="loading"
    :disabled="disabled"
    :to="to"
    :href="href"
    :type="type"
    @click="$emit('click', $event)"
  />
  <v-btn
    v-else
    :variant="look.variant"
    :color="look.color"
    size="small"
    class="btn-sentence-case ui-btn"
    :class="{ 'ui-btn--primary': kind === 'primary' }"
    :prepend-icon="icon || undefined"
    :append-icon="appendIcon || undefined"
    :title="title || undefined"
    :loading="loading"
    :disabled="disabled"
    :to="to"
    :href="href"
    :type="type"
    :block="block"
    @click="$emit('click', $event)"
  >
    <slot />
  </v-btn>
</template>
