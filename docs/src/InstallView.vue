<script setup>
import { ref } from 'vue'
import { highlight } from './source.js'

/* Brancher le kit dans une application, en trois blocs a copier. */
const blocks = [
  { title: 'Installer les paquets', text: 'Les jetons servent à toutes les technologies ; ui-vue apporte les composants Vue.', code: 'npm install @adion-cloud/tokens @adion-cloud/ui-vue' },
  { title: 'Charger les styles', text: 'Dans main.js, avant le style de l’application. L’ordre compte : jetons, base, composants, contenu.', code: `import '@adion-cloud/tokens/tokens.css'\nimport '@adion-cloud/ui-vue/base.css'\nimport '@adion-cloud/ui-vue/ui.css'\nimport '@adion-cloud/ui-vue/content.css'` },
  { title: 'Brancher le kit sur l’API', text: 'L’adaptateur relie le kit à Nexus : le kit ne connaît ni l’adresse de l’API, ni le compte, ni le projet.', code: `import { vuetifyThemes } from '@adion-cloud/tokens'\nimport { createAdionUi } from '@adion-cloud/ui-vue'\n\nconst vuetify = createVuetify({ theme: { defaultTheme: 'adionDark', themes: vuetifyThemes } })\n\napp.use(vuetify).use(createAdionUi({\n  request,                 // un appel à Nexus : (options) => Promise\n  context,                 // { orgId, projectId }, réactif\n  services, labels, notifications, components,\n}))` },
  { title: 'Assembler un écran', text: 'Un écran n’a pas de style propre : il prend un gabarit et des composants.', code: `<script setup>\nimport { UiListLayout, UiServiceTable } from '@adion-cloud/ui-vue'\n<\/script>\n\n<template>\n  <UiListLayout family="Web" title="Mes hébergements" list-title="Vos sites">\n    <UiServiceTable :services="services" />\n  </UiListLayout>\n</template>` },
]
const copied = ref(-1)
async function copy(text, i) {
  try { await navigator.clipboard.writeText(text) } catch { /* refuse : rien a faire */ }
  copied.value = i
  setTimeout(() => { if (copied.value === i) copied.value = -1 }, 1600)
}
</script>

<template>
  <div class="doc-page doc-page--wide">
    <article class="doc-article">
      <header class="doc-head">
        <p class="doc-eyebrow">Démarrer</p>
        <h1>Installation</h1>
        <p class="doc-lead">Quatre étapes pour qu’une application Vue emploie le kit. Pour Android ou un autre outil, les jetons suffisent.</p>
      </header>
      <section v-for="(b, i) in blocks" :key="b.title" class="doc-example">
        <h2><span class="doc-step">{{ i + 1 }}</span>{{ b.title }}</h2>
        <p class="doc-text">{{ b.text }}</p>
        <div class="doc-ex__code is-alone">
          <div class="doc-ex__bar"><span /><button class="doc-copy" :class="{ 'is-done': copied === i }" @click="copy(b.code, i)">{{ copied === i ? 'Copié' : 'Copier' }}</button></div>
          <pre><code v-html="highlight(b.code)" /></pre>
        </div>
      </section>
    </article>
  </div>
</template>
