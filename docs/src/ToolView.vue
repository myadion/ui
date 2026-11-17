<script setup>
/*
 * LE MODE OUTIL : LES REGLES (2026-11-17). Ce que suit tout ecran d'Orbit et
 * de nos outils internes. La meme liste est dans packages/vue/README.md ; ce
 * qui se mesure est garde par src/tool.test.js.
 */
const groups = [
  {
    title: 'Organiser',
    rules: [
      { icon: 'mdi-format-list-bulleted', title: 'Une liste trouve et trie', text: 'Elle ne sert qu’à ça. Tout objet complexe a sa page et son adresse ; on ne l’ouvre pas dans un panneau.' },
      { icon: 'mdi-view-compact-outline', title: 'Le plan d’une fiche ne change jamais', text: 'En haut : qui c’est, son état, les faits pour agir, ses gestes. Au centre : le fil. À droite : les propriétés, en groupes repliables.' },
      { icon: 'mdi-sort-clock-descending-outline', title: 'Ce qui attend l’équipe d’abord', text: 'Épinglé en tête du fil, expliqué en une phrase, avec ses gestes sur la ligne. L’historique suit.' },
      { icon: 'mdi-text-short', title: 'Peu de texte au centre', text: 'Une ligne par événement passé, le détail au clic, quelques lignes puis « Voir la suite ». Une information n’apparaît qu’une fois.' },
      { icon: 'mdi-eye-outline', title: 'Le fréquent visible, le rare replié', text: 'Un seul geste principal. Le rare va dans le menu Actions ou un groupe replié. Un geste destructeur est en bas, en rouge, et se confirme.' },
    ],
  },
  {
    title: 'Relier',
    rules: [
      { icon: 'mdi-link-variant', title: 'Tout nom mène à sa fiche', text: 'Utilisateur, organisation, projet, service, facture, compte de facturation : chaque nom affiché est un lien. On rebondit de l’un à l’autre sans chercher.' },
      { icon: 'mdi-card-account-details-outline', title: 'Des noms, jamais des identifiants', text: 'Un identifiant utile (SIRET, courriel, téléphone) se copie d’un clic ; il ne remplace jamais le nom.' },
      { icon: 'mdi-web', title: 'L’état est dans l’adresse', text: 'Le dossier ouvert, l’onglet, le filtre : un lien, un retour arrière ou un rechargement retrouvent le même écran.' },
      { icon: 'mdi-keyboard-outline', title: 'Tout se fait au clavier', text: 'J et K passent d’un dossier à l’autre, Ctrl K cherche une fiche ou un geste, le focus est toujours visible.' },
    ],
  },
  {
    title: 'Lire',
    rules: [
      { icon: 'mdi-contrast-circle', title: 'Contraste : 4,5:1 pour un texte', text: '3:1 pour une bordure de champ, une icône, un focus. Dans les deux thèmes, mesurés à part. La teinte d’un état se pose sur une surface pleine.' },
      { icon: 'mdi-shape-outline', title: 'Un état : une couleur, une icône, un mot', text: 'Jamais la couleur seule.' },
      { icon: 'mdi-cursor-default-click-outline', title: 'Dense, avec un plancher', text: 'Aucune cible sous 24 px, aucun texte sous 11 px.' },
      { icon: 'mdi-cellphone', title: 'Deux largeurs vérifiées', text: 'Chaque écran se vérifie à grande largeur et à 375 px, sans défilement horizontal.' },
    ],
  },
  {
    title: 'Respecter l’API',
    rules: [
      { icon: 'mdi-api', title: 'Tout vient de Nexus', text: 'Les données, les libellés, les états, les tons et les gestes permis. L’écran n’en invente aucun : ce qui manque se demande à Nexus.' },
      { icon: 'mdi-puzzle-outline', title: 'Un écran n’a pas de style', text: 'Il assemble des composants du kit. Un motif qui manque s’ajoute au kit.' },
    ],
  },
]
</script>

<template>
  <div class="doc-page doc-page--wide">
    <article class="doc-article">
      <p class="doc-eyebrow">Adion UI</p>
      <h1>Le mode outil : les règles</h1>
      <p class="doc-lead">Pour Orbit et nos outils internes : des écrans denses, où un opérateur traite des dossiers à la chaîne sans chercher. Un seul kit : <code>&lt;UiAppShell tool&gt;</code> et les composants du poste de travail.</p>
      <div class="doc-hero__actions">
        <router-link to="/exemple-orbit-poste" class="doc-btn is-primary">Voir le poste de travail</router-link>
        <router-link to="/exemple-orbit-organisation" class="doc-btn">Une fiche organisation</router-link>
        <router-link to="/exemple-orbit-utilisateur" class="doc-btn">Une fiche utilisateur</router-link>
      </div>
      <template v-for="group in groups" :key="group.title">
        <h2 class="doc-h2">{{ group.title }}</h2>
        <div class="doc-cards">
          <div v-for="rule in group.rules" :key="rule.title" class="doc-card">
            <span class="doc-card__icon"><v-icon :icon="rule.icon" size="18" /></span>
            <h3>{{ rule.title }}</h3>
            <p>{{ rule.text }}</p>
          </div>
        </div>
      </template>
    </article>
  </div>
</template>
