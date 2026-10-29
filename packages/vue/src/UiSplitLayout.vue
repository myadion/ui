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
 *   column     le contenu dans une colonne centree de 520 px, qui commence vers
 *              le quart de la hauteur : un formulaire court (une connexion)
 *   slot default   le contenu de droite ; slot caption   un mot pose sur la photo
 *   slot footer    les boutons, en bas du volet sur toute sa largeur : le premier
 *                  a gauche, le dernier a droite (Creer un compte, Continuer)
 */
defineProps({
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  position: { type: String, default: 'center' },
  column: { type: Boolean, default: false },
})
</script>

<template>
  <div class="ui-panes" :class="{ 'is-column': column }">
    <figure class="ui-panes__media">
      <img :src="image" :alt="alt" :style="{ objectPosition: position }" />
      <figcaption v-if="$slots.caption" class="ui-panes__caption"><slot name="caption" /></figcaption>
    </figure>
    <div class="ui-panes__content">
      <div v-if="$slots.top" class="ui-panes__top"><slot name="top" /></div>
      <div class="ui-panes__inner"><slot /></div>
      <div v-if="$slots.footer" class="ui-panes__footer"><slot name="footer" /></div>
    </div>
  </div>
</template>
