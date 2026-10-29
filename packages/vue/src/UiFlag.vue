<script setup>
import { computed } from 'vue'

/*
 * LE DRAPEAU D'UN PAYS (Adion UI, 2026-10-29). Un dessin vectoriel (flag-icons,
 * que l'app charge) : les drapeaux emoji ne s'affichent pas sous Windows. Pays
 * inconnu : un globe, qui garde la place.
 *
 *   code   le code ISO a deux lettres (FR, BE…)
 *   size   la largeur en pixels (la hauteur en vaut les trois quarts)
 *   title  le nom du pays, lu au survol et par les lecteurs d'ecran
 */
const props = defineProps({
  code: { type: String, default: '' },
  size: { type: Number, default: 16 },
  title: { type: String, default: '' },
})
const iso = computed(() => String(props.code || '').trim().toLowerCase())
const known = computed(() => /^[a-z]{2}$/.test(iso.value))
const label = computed(() => props.title || (known.value ? iso.value.toUpperCase() : 'Pays inconnu'))
</script>

<template>
  <span
    class="ui-flag"
    :class="known ? ['fi', `fi-${iso}`] : 'is-unknown'"
    :style="{ width: `${size}px`, height: `${Math.round(size * 0.75)}px` }"
    :title="label"
    role="img"
    :aria-label="label"
  >
    <v-icon v-if="!known" icon="mdi-earth" :size="size - 3" />
  </span>
</template>
