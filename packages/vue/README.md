# @myadion/ui

Les composants et gabarits de page d'Adion Cloud pour **Vue 3 + Vuetify 3** : listes, fiches, formulaires, tableaux, graphiques, fenêtres, notifications, dans un thème sombre et un thème clair.

Documentation, exemples en direct et code : le dossier `docs/` du dépôt [myadion/ui](https://github.com/myadion/ui).

## Installer

```sh
npm install @myadion/tokens @myadion/ui
```

## Brancher

```js
import '@myadion/tokens/tokens.css'
import '@myadion/ui/base.css'
import '@myadion/ui/ui.css'
import '@myadion/ui/content.css'
import { vuetifyThemes } from '@myadion/tokens'
import { createAdionUi } from '@myadion/ui'

const vuetify = createVuetify({ theme: { defaultTheme: 'adionDark', themes: vuetifyThemes } })

app.use(vuetify).use(createAdionUi({
  request,   // (options) => Promise : un appel à l'API
  context,   // objet réactif { orgId, projectId }
  services, labels, notifications, components,
}))
```

## Employer

```vue
<script setup>
import { UiListLayout, UiServiceTable } from '@myadion/ui'
</script>

<template>
  <UiListLayout family="Web" title="Mes hébergements" list-title="Vos sites">
    <UiServiceTable :services="services" />
  </UiListLayout>
</template>
```

Licence BSD-3-Clause.

## Le mode outil

Pour Orbit et nos outils internes : des écrans denses, où un opérateur traite des dossiers à la chaîne. C'est le même kit ; `<UiAppShell tool>` resserre les composants, et le poste de travail a les siens.

```vue
<UiAppShell tool>
  <UiWorkbench>
    <template #queue><UiQueue v-model="id" :items="queue" /></template>
    <UiRecordHeader :title="name" :status="status" :facts="facts" />
    <UiComposer v-model="text" v-model:mode="mode" :modes="modes" />
    <UiActivityFeed v-model="filter" :kinds="kinds" :items="events" />
    <template #aside><UiPropertyGrid :groups="groups" /></template>
  </UiWorkbench>
</UiAppShell>
```

Les règles (la doc : `/mode-outil`) :

**Organiser**
1. Une liste trouve et trie. Tout objet complexe a sa page et son adresse.
2. Le plan d'une fiche ne change jamais : en haut qui c'est, son état, les faits pour agir et ses gestes (`UiRecordHeader`) ; au centre le fil (`UiActivityFeed`) ; à droite les propriétés (`UiPropertyGrid`).
3. Ce qui attend l'équipe est épinglé en tête du fil, expliqué en une phrase, avec ses gestes sur la ligne.
4. Peu de texte au centre : une ligne par événement passé, le détail au clic, quelques lignes puis « Voir la suite ». Une information n'apparaît qu'une fois.
5. Le fréquent est visible, le rare replié ou dans le menu Actions. Un seul geste principal. Un geste destructeur est en bas, en rouge, et se confirme.

**Relier**
6. Tout nom affiché mène à sa fiche (`UiEntityLink`, `to` d'une colonne de `UiTable`, `to` d'une propriété) : utilisateur, organisation, projet, service, facture, compte de facturation.
7. Des noms, jamais des identifiants. Un identifiant utile se copie d'un clic.
8. L'état est dans l'adresse : le dossier ouvert, l'onglet, le filtre.
9. Tout se fait au clavier : J et K dans une file, Ctrl K pour la palette, un focus toujours visible.

**Lire**
10. Contraste de 4,5:1 pour un texte, 3:1 pour une bordure de champ, une icône ou un focus, dans les deux thèmes. La teinte d'un état se pose sur une surface pleine.
11. Un état : une couleur, une icône et un mot.
12. Aucune cible sous 24 px, aucun texte sous 11 px.
13. Chaque écran se vérifie à grande largeur et à 375 px.

**Respecter l'API**
14. Les données, les libellés, les états et les gestes permis viennent de Nexus. Ce qui manque se demande à Nexus.
15. Un écran n'a pas de style : il assemble des composants du kit.

Les règles 10 (teinte) et 12 sont gardées par `src/tool.test.js`.
