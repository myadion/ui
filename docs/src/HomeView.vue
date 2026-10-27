<script setup>
import { UiCode, UiFeatureGrid, UiHero, UiList, UiSection } from '@adion-cloud/ui-vue'

/* Les principes du kit, decides par Kevin (2026-10-13 puis 2026-10-27). */
const rules = [
  { icon: 'mdi-puzzle-outline', text: 'Aucune application ne crée de composant. Le kit fournit les composants, les gabarits de page et les jetons ; un motif qui manque s’ajoute au kit, et toutes les applications en profitent à la mise à jour.' },
  { icon: 'mdi-palette-outline', text: 'Un écran n’écrit aucune couleur et n’a pas de style propre : il assemble les composants, qui emploient les jetons.' },
  { icon: 'mdi-earth', text: 'La référence visuelle est adioncloud.com. L’espace client garde sa barre du haut et sa barre de gauche ; Orbit, l’outil de l’équipe, reprend cette barre de gauche, et vise d’abord le pratique.' },
  { icon: 'mdi-message-text-outline', text: 'Les libellés, les états et leurs tons viennent de l’API (Nexus) ; le kit les affiche, il ne les invente pas.' },
  { icon: 'mdi-eye-check-outline', text: 'Chaque texte tient 4,5:1 sur chaque surface, dans les deux thèmes ; un état ne se dit jamais par la seule couleur. Tout se vérifie à 375 px.' },
]
const platforms = [
  { icon: 'mdi-language-css3', title: 'Web (toute technologie)', text: '@adion-cloud/tokens : les variables CSS --adion-*, deux thèmes.' },
  { icon: 'mdi-vuejs', title: 'Vue 3 + Vuetify', text: '@adion-cloud/ui-vue : composants, gabarits, adaptateur vers l’API.' },
  { icon: 'mdi-android', title: 'Android', text: 'Couleurs et dimensions en XML, et AdionColors / AdionDimens pour Jetpack Compose.' },
  { icon: 'mdi-code-json', title: 'Tout le reste', text: 'tokens.json : les valeurs résolues, pour n’importe quel outil.' },
]
</script>

<template>
  <div class="docs-page">
    <UiHero family="brand" icon="mdi-shape-outline" title="Adion UI" promise="Le kit d’interface d’Adion Cloud : une seule source pour toutes nos applications, sur le web comme sur Android." />
    <UiSection title="Les principes">
      <UiList :items="rules" />
    </UiSection>
    <UiSection title="Pour chaque plateforme">
      <UiFeatureGrid :items="platforms" family="brand" />
    </UiSection>
    <UiSection title="Brancher une application Vue">
      <UiCode wrap :code="`npm install @adion-cloud/tokens @adion-cloud/ui-vue

// main.js
import '@adion-cloud/tokens/tokens.css'
import '@adion-cloud/ui-vue/ui.css'
import { vuetifyThemes } from '@adion-cloud/tokens'
import { createAdionUi } from '@adion-cloud/ui-vue'

app.use(createAdionUi({
  request,                 // un appel à Nexus : (options) => Promise
  context,                 // { orgId, projectId }, réactif
  services, labels, notifications, components,
}))`" />
    </UiSection>
  </div>
</template>
