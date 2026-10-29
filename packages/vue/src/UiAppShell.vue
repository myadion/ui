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
 *   narrow    avec centered : une colonne de 600 px au milieu, a 10 % du haut (une porte, un formulaire seul)
 *   plain     sans le fond de /maquette (le degrade du haut et ses lignes de
 *             niveau qui derivent lentement, coupees si l'on reduit les animations)
 */
defineProps({
  bare: { type: Boolean, default: false },
  centered: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  narrow: { type: Boolean, default: false },
})

// Une ligne de niveau : une sinusoide de 2400 unites, pour deriver sans couture sur 1200.
const contour = (k) => {
  const base = 70 + k * 46
  const amp = 16 + k * 5
  const pts = []
  for (let x = 0; x <= 2400; x += 30) pts.push(`${x},${(base + amp * Math.sin((x / 600) * Math.PI * 2 + k * 0.9)).toFixed(1)}`)
  return `M${pts.join(' L')}`
}
</script>

<template>
  <slot name="banner" />
  <div class="ui-shell" :class="{ 'is-bare': bare }">
    <div v-if="$slots.sidebar && !bare" class="ui-shell__sidebar"><slot name="sidebar" /></div>
    <div class="ui-shell__main" :class="{ 'is-decor': !plain }">
      <svg v-if="!plain" class="ui-shell__decor" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true">
        <g class="ui-shell__drift is-a"><path v-for="k in [0, 2, 4]" :key="k" :d="contour(k)" /></g>
        <g class="ui-shell__drift is-b"><path v-for="k in [1, 3, 5]" :key="k" :d="contour(k)" /></g>
      </svg>
      <slot name="topbar" />
      <slot name="before" />
      <div class="ui-shell__content" :class="{ 'is-centered': centered, 'is-narrow': narrow }"><slot /></div>
    </div>
  </div>
</template>
