<script setup>
/*
 * LA COQUE D'UNE APPLICATION (Adion UI, 2026-10-28) : la barre de gauche de
 * haut en bas, et a sa droite la barre du haut puis la page.
 *
 *   slot sidebar   la barre de gauche (cachee a 900 px et moins : la barre
 *                  du haut l'ouvre alors dans son panneau)
 *   slot topbar    la barre du haut (UiTopBar)
 *   slot before    ce qui precede la page : bandeau critique, trait de chargement
 *   slot default   la page, dans une colonne de 1480 px au plus
 *   slot banner    au-dessus de tout, sur toute la largeur (le bandeau Sandbox)
 *
 *   bare      sans barre de gauche (un parcours d'accueil, l'onboarding)
 *   centered  la page centree a l'ecran, 1200 px au plus (un choix de depart)
 */
defineProps({
  bare: { type: Boolean, default: false },
  centered: { type: Boolean, default: false },
})
</script>

<template>
  <slot name="banner" />
  <div class="ui-shell" :class="{ 'is-bare': bare }">
    <div v-if="$slots.sidebar && !bare" class="ui-shell__sidebar"><slot name="sidebar" /></div>
    <div class="ui-shell__main">
      <slot name="topbar" />
      <slot name="before" />
      <div class="ui-shell__content" :class="{ 'is-centered': centered }"><slot /></div>
    </div>
  </div>
</template>
