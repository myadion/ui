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
