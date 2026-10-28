# Adion UI

Le kit d'interface d'Adion Cloud : des jetons de design pour toutes les plateformes, des composants Vue 3, et leur documentation avec des exemples en direct.

## Paquets

| Dossier | Paquet | Contenu |
| --- | --- | --- |
| `tokens/` | [`@myadion/tokens`](https://www.npmjs.com/package/@myadion/tokens) | Couleurs (thèmes sombre et clair), tailles et polices, depuis une seule source (`tokens/src/*.json`) : variables CSS `--adion-*`, module JavaScript, JSON, ressources Android et Jetpack Compose |
| `packages/vue/` | [`@myadion/ui`](https://www.npmjs.com/package/@myadion/ui) | Composants `Ui*` et gabarits de page pour Vue 3 + Vuetify 3 |
| `docs/` | — | La documentation : chaque composant, ses exemples, son code et son API |

## Installer

```sh
npm install @myadion/tokens @myadion/ui
```

```js
import '@myadion/tokens/tokens.css'
import '@myadion/ui/base.css'
import '@myadion/ui/ui.css'
import '@myadion/ui/content.css'
import { vuetifyThemes } from '@myadion/tokens'
import { createAdionUi } from '@myadion/ui'

const vuetify = createVuetify({ theme: { defaultTheme: 'adionDark', themes: vuetifyThemes } })

app.use(vuetify).use(createAdionUi({
  request,   // (options) => Promise : un appel à votre API
  context,   // objet réactif { orgId, projectId }
  services, labels, notifications, components,
}))
```

Les composants ne lisent jamais l'état d'une application : l'adaptateur `createAdionUi` leur donne ce dont ils ont besoin. Un élément absent rend le composant plus discret, jamais en panne.

## Android

Copier `tokens/dist/android/res` dans le module (couleurs `adion_*`, thème clair dans `values`, sombre dans `values-night`), ou `AdionTokens.kt` pour Compose (`AdionColors.Dark`, `AdionColors.Light`, `AdionDimens`).

## Développer

```sh
npm install
npm test          # jetons (dont les contrastes) et logique des composants
npm run dev       # la documentation sur http://localhost:5180
npm run build     # jetons et documentation
```

- Changer une couleur : `tokens/src/color.json`, puis `npm test`, qui reconstruit les sorties et vérifie que chaque texte garde un contraste de 4,5:1 au moins.
- Ajouter un composant : `packages/vue/src/Ui*.vue`, ses classes `ui-*` dans `ui.css`, son export dans `index.js`, puis sa page dans `docs/src/catalog.js` avec un exemple dans `docs/src/examples/`.

## Licence

BSD 3-Clause. Les polices (Inter, Raleway, Lilita One) sont sous licence OFL et chargées depuis Google Fonts.
