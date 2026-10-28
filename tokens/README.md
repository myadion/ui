# @myadion/tokens

Les jetons de design d'Adion Cloud : couleurs (thèmes sombre et clair), tailles et polices. Une seule source (`src/*.json`) pour toutes les plateformes.

## Sorties

| Fichier | Pour |
| --- | --- |
| `@myadion/tokens/tokens.css` | Le web : variables `--adion-*`, thème sombre par défaut, clair sous `html[data-theme='light']` |
| `@myadion/tokens` (`tokens.mjs`) | JavaScript : `tokens.dark`, `tokens.light`, `tokens.size`, et `vuetifyThemes` |
| `@myadion/tokens/tokens.json` | Tout autre outil : les valeurs résolues |
| `@myadion/tokens/android/res/values*/adion_*.xml`, `AdionTokens.kt` | Android : couleurs et dimensions XML, `AdionColors` et `AdionDimens` pour Jetpack Compose |

## Installer

```sh
npm install @myadion/tokens
```

```js
import '@myadion/tokens/tokens.css'
import { tokens, vuetifyThemes } from '@myadion/tokens'
```

Chaque couple texte/surface tient 4,5:1 au moins (WCAG AA), vérifié par `npm test`.

Licence BSD-3-Clause.
