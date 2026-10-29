<script setup>
/*
 * UNE PAGE EN DEUX VOLETS (Adion UI, 2026-10-29) : a gauche une photo sur toute
 * la hauteur, qui reste en place ; a droite le contenu, un formulaire entier,
 * qui defile s'il est long. Au telephone, la photo s'efface. A poser dans
 * UiAppShell `flush` (sans marge ni largeur maximale).
 *
 *   image      l'adresse de la photo (l'app la fournit)
 *   alt        sa description, vide si elle n'est que decor
 *   position   le cadrage (object-position), « 70% center » par exemple
 *   slot default   le contenu de droite ; slot caption   un mot pose sur la photo
 */
defineProps({
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  position: { type: String, default: 'center' },
})
</script>

<template>
  <div class="ui-split">
    <figure class="ui-split__media">
      <img :src="image" :alt="alt" :style="{ objectPosition: position }" />
      <figcaption v-if="$slots.caption" class="ui-split__caption"><slot name="caption" /></figcaption>
    </figure>
    <div class="ui-split__content">
      <div class="ui-split__inner"><slot /></div>
    </div>
  </div>
</template>
