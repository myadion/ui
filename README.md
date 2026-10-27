# Adion UI

Le kit d'interface d'Adion Cloud : **une seule source pour toutes nos applications**, sur le web comme sur Android. Tenu par Inès Moreau (design).

## Les règles (Kevin, 2026-10-13 et 2026-10-27)

1. **Aucune application ne crée de composant.** Le kit fournit les composants, les gabarits de page et les jetons. Un motif qui manque s'ajoute ici, et toutes les applications en profitent à la mise à jour.
2. **Un écran n'écrit aucune couleur et n'a pas de style propre** : il assemble les composants, qui emploient les jetons.
3. **La référence visuelle est adioncloud.com.** L'espace client garde sa barre du haut et sa barre de gauche ; Orbit (l'outil de l'équipe) reprend cette barre de gauche et vise d'abord le pratique.
4. **Les libellés, les états et leurs tons viennent de l'API (Nexus)** : le kit les affiche, il ne les invente pas.
5. **Contraste et téléphone** : chaque texte tient 4,5:1 sur chaque surface, dans les deux thèmes (test automatique) ; tout se vérifie à 375 px.
6. Le dépôt sert **toutes les technologies** ; il est public.

## Le dépôt

| Dossier | Paquet | Pour qui |
| --- | --- | --- |
| `tokens/` | `@adion-cloud/tokens` | Tout le monde : la source unique (`tokens/src/*.json`) et ses sorties : `tokens.css` (variables `--adion-*`, thèmes sombre et clair), `tokens.mjs` (valeurs et thèmes Vuetify), `tokens.json`, Android (`res/values*/adion_*.xml`, `AdionTokens.kt` pour Compose) |
| `packages/vue/` | `@adion-cloud/ui-vue` | Les applications Vue 3 + Vuetify 3 : composants `Ui*`, gabarits (`UiListLayout`, `UiDetailLayout`, `UiWizardLayout`, `UiFormLayout`), `base.css` (l'habillage de Vuetify), `ui.css` |
| `docs/` | — | La doc publique : principes, jetons, tous les composants en direct |

## Brancher une application Vue

```js
import '@adion-cloud/tokens/tokens.css'
import '@adion-cloud/ui-vue/base.css'
import '@adion-cloud/ui-vue/ui.css'
import { vuetifyThemes } from '@adion-cloud/tokens'
import { createAdionUi } from '@adion-cloud/ui-vue'

app.use(createAdionUi({
  request,        // (options) => Promise : un appel à Nexus { method, path, data, params, projectId }
  context,        // objet réactif { orgId, projectId }
  services,       // fetchActions, cancelTermination, updateDescription, monitoringStatus
  labels,         // serviceLabel, offerLabel, stateLabel
  notifications,  // useNotifications, useAssistant, onUpdate
  components,     // OrderButton, ServiceTermination, ServiceMigration (en attendant qu'ils rejoignent le kit)
}))
```

Le kit ne lit jamais le store d'une application : l'**adaptateur** lui donne ce dont il a besoin. Un morceau absent rend le composant plus discret (pas de bouton Commander sans `OrderButton`), jamais en panne.

## Android

Copier `tokens/dist/android/res` dans le module (couleurs `adion_*`, thème clair dans `values`, sombre dans `values-night`), ou `AdionTokens.kt` pour Compose (`AdionColors.Dark`, `AdionColors.Light`, `AdionDimens`).

## Travailler sur le kit

```bash
npm install
npm test          # jetons (dont les contrastes) et logique des composants
npm run dev       # la doc sur http://localhost:5180
npm run build     # jetons et doc
```

Changer une couleur : `tokens/src/color.json`, puis `npm test` (qui reconstruit). Ajouter un composant : `packages/vue/src/Ui*.vue`, ses classes `ui-*` dans `ui.css`, son export dans `index.js`, une démonstration dans `docs/src/ShowcaseView.vue`.

## Licence

BSD 3-Clause. Les polices (Raleway, Lilita One, Inter) sont sous licence OFL et chargées depuis Google Fonts.
