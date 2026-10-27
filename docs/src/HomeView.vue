<script setup>
import { groups } from './catalog.js'

/* L'accueil de la doc : la promesse du kit, ses principes, ses plateformes. */
const rules = [
  { icon: 'mdi-puzzle-outline', title: 'Le kit seul crée des composants', text: 'Le kit fournit les composants, les gabarits de page et les jetons. Un motif qui manque s’ajoute au kit, et toutes les applications en profitent à la mise à jour.' },
  { icon: 'mdi-palette-outline', title: 'Un écran n’a pas de style', text: 'Il assemble les composants, qui emploient les jetons. Aucune couleur écrite à la main.' },
  { icon: 'mdi-api', title: 'Les mots viennent de l’API', text: 'Libellés, états, tons et gestes permis viennent de Nexus ; le kit les affiche, il ne les invente pas.' },
  { icon: 'mdi-eye-check-outline', title: 'Lisible partout', text: 'Chaque texte tient 4,5:1 sur chaque surface, dans les deux thèmes ; tout se vérifie à 375 px.' },
]
const platforms = [
  { icon: 'mdi-language-css3', title: 'Web', text: '@adion-cloud/tokens : les variables CSS --adion-*, deux thèmes.' },
  { icon: 'mdi-vuejs', title: 'Vue 3 + Vuetify', text: '@adion-cloud/ui-vue : composants, gabarits, adaptateur vers l’API.' },
  { icon: 'mdi-android', title: 'Android', text: 'Couleurs et dimensions en XML, AdionColors et AdionDimens pour Compose.' },
  { icon: 'mdi-code-json', title: 'Tout le reste', text: 'tokens.json : les valeurs résolues, pour n’importe quel outil.' },
]
const pageCount = groups.reduce((n, g) => n + g.pages.length, 0)
const contour = (k) => {
  const base = 60 + k * 44
  const amp = 14 + k * 5
  const pts = []
  for (let x = 0; x <= 2400; x += 30) pts.push(`${x},${(base + amp * Math.sin((x / 600) * Math.PI * 2 + k * 0.9)).toFixed(1)}`)
  return `M${pts.join(' L')}`
}
</script>

<template>
  <div class="doc-page doc-page--wide">
    <article class="doc-article">
      <section class="doc-hero">
        <svg class="doc-hero__bg" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
          <g class="doc-drift doc-drift--a"><path v-for="k in [0, 2, 4]" :key="k" :d="contour(k)" /></g>
          <g class="doc-drift doc-drift--b"><path v-for="k in [1, 3, 5]" :key="k" :d="contour(k)" /></g>
        </svg>
        <p class="doc-eyebrow">Adion UI</p>
        <h1>Le kit d’interface d’Adion Cloud</h1>
        <p class="doc-lead">Une seule source pour toutes nos applications : l’espace client, Orbit, nos sites et Android. Des composants prêts, leur code, et les règles qui les tiennent ensemble.</p>
        <div class="doc-hero__actions">
          <router-link to="/installation" class="doc-btn is-primary">Commencer</router-link>
          <router-link to="/composants/list-layout" class="doc-btn">Parcourir les composants</router-link>
        </div>
        <dl class="doc-hero__facts">
          <div><dt>Pages de composants</dt><dd>{{ pageCount }}</dd></div>
          <div><dt>Thèmes</dt><dd>2</dd></div>
          <div><dt>Plateformes</dt><dd>4</dd></div>
          <div><dt>Contraste minimal</dt><dd>4,5:1</dd></div>
        </dl>
      </section>

      <h2 class="doc-h2">Les principes</h2>
      <div class="doc-cards">
        <div v-for="r in rules" :key="r.title" class="doc-card">
          <span class="doc-card__icon"><v-icon :icon="r.icon" size="18" /></span>
          <h3>{{ r.title }}</h3>
          <p>{{ r.text }}</p>
        </div>
      </div>

      <h2 class="doc-h2">Pour chaque plateforme</h2>
      <div class="doc-cards">
        <div v-for="p in platforms" :key="p.title" class="doc-card">
          <span class="doc-card__icon is-blue"><v-icon :icon="p.icon" size="18" /></span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </div>
      </div>

      <h2 class="doc-h2">Les familles de composants</h2>
      <div class="doc-cards doc-cards--links">
        <router-link v-for="g in groups" :key="g.title" :to="`/composants/${g.pages[0].id}`" class="doc-card">
          <h3>{{ g.title }}</h3>
          <p>{{ g.pages.map((p) => p.title).join(' · ') }}</p>
        </router-link>
      </div>
    </article>
  </div>
</template>
