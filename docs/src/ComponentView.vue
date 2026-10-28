<script setup>
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { pageById, pages } from './catalog.js'
import { highlight, readApi } from './source.js'

/*
 * UNE PAGE DE LA DOC : un composant (ou une petite famille), ses exemples en
 * direct avec leur code juste dessous, puis l'API lue dans le code du kit.
 */
const demos = import.meta.glob('./examples/*.vue')
const raws = import.meta.glob('./examples/*.vue', { query: '?raw', import: 'default' })
const sources = import.meta.glob('../../packages/vue/src/Ui*.vue', { query: '?raw', import: 'default' })

const route = useRoute()
const page = computed(() => pageById[route.params.id] || pages[0])
const index = computed(() => pages.findIndex((p) => p.id === page.value.id))
const prev = computed(() => pages[index.value - 1])
const next = computed(() => pages[index.value + 1])

const examples = shallowRef([])
const apis = ref([])
const open = ref({})
const copied = ref('')

watch(page, async (p) => {
  open.value = {}
  const list = await Promise.all(p.examples.map(async (e) => {
    const code = (await raws[`./examples/${e.file}.vue`]()).trim()
    return { ...e, anchor: e.file.split('.')[1], code, html: highlight(code), lines: code.split('\n').length, demo: defineAsyncComponent(demos[`./examples/${e.file}.vue`]) }
  }))
  const api = await Promise.all(p.components.map(async (name) => {
    const load = sources[`../../packages/vue/src/${name}.vue`]
    return { name, ...(load ? readApi(await load()) : { props: [], emits: [], slots: [] }) }
  }))
  // On a pu changer de page pendant le chargement : seule la derniere s'affiche.
  if (p !== page.value) return
  examples.value = list
  apis.value = api
}, { immediate: true })

async function copy(text, key) {
  try { await navigator.clipboard.writeText(text) } catch { /* le navigateur refuse : rien a faire */ }
  copied.value = key
  setTimeout(() => { if (copied.value === key) copied.value = '' }, 1600)
}
const importLine = computed(() => `import { ${page.value.components.join(', ')} } from '@myadion/ui'`)
</script>

<template>
  <div class="doc-page">
    <article class="doc-article">
      <header class="doc-head">
        <p class="doc-eyebrow">{{ page.group }}</p>
        <h1>{{ page.title }}</h1>
        <p class="doc-lead">{{ page.lead }}</p>
        <div class="doc-import">
          <code v-html="highlight(importLine)" />
          <button class="doc-copy" :class="{ 'is-done': copied === 'import' }" @click="copy(importLine, 'import')">{{ copied === 'import' ? 'Copié' : 'Copier' }}</button>
        </div>
      </header>

      <section v-for="e in examples" :id="e.anchor" :key="e.file" class="doc-example">
        <h2><a :href="`#${e.anchor}`">{{ e.title }}</a></h2>
        <p v-if="e.text" class="doc-text">{{ e.text }}</p>
        <div class="doc-ex">
          <div class="doc-ex__preview ui-page"><component :is="e.demo" /></div>
          <div class="doc-ex__code" :class="{ 'is-folded': e.lines > 24 && !open[e.file] }">
            <div class="doc-ex__bar">
              <span>{{ e.file.split('.')[0] }}/{{ e.anchor }}.vue</span>
              <button class="doc-copy" :class="{ 'is-done': copied === e.file }" @click="copy(e.code, e.file)">{{ copied === e.file ? 'Copié' : 'Copier' }}</button>
            </div>
            <pre><code v-html="e.html" /></pre>
            <button v-if="e.lines > 24" class="doc-ex__more" @click="open = { ...open, [e.file]: !open[e.file] }">{{ open[e.file] ? 'Replier le code' : `Afficher tout le code (${e.lines} lignes)` }}</button>
          </div>
        </div>
      </section>

      <section id="api" class="doc-api">
        <h2><a href="#api">API</a></h2>
        <div v-for="a in apis" :key="a.name" class="doc-api__block">
          <h3><code>&lt;{{ a.name }}&gt;</code></h3>
          <div v-if="a.props.length" class="doc-table">
            <table>
              <thead><tr><th>Propriété</th><th>Type</th><th>Par défaut</th></tr></thead>
              <tbody>
                <tr v-for="p in a.props" :key="p.name">
                  <td><code class="is-name">{{ p.name }}</code><div v-if="p.doc" class="doc-values">{{ p.doc }}</div></td>
                  <td><code>{{ p.type }}</code><div v-if="p.values" class="doc-values">{{ p.values }}</div></td>
                  <td><code>{{ p.default }}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="doc-text">Aucune propriété.</p>
          <div class="doc-api__tags">
            <div v-if="a.emits.length"><span>Événements</span><code v-for="ev in a.emits" :key="ev">{{ ev }}</code></div>
            <div v-if="a.slots.length"><span>Créneaux</span><code v-for="s in a.slots" :key="s">{{ s }}</code></div>
          </div>
        </div>
      </section>

      <nav class="doc-pager">
        <router-link v-if="prev" :to="`/composants/${prev.id}`" class="is-prev"><small>Précédent</small>{{ prev.title }}</router-link>
        <span v-else />
        <router-link v-if="next" :to="`/composants/${next.id}`" class="is-next"><small>Suivant</small>{{ next.title }}</router-link>
      </nav>
    </article>

    <aside class="doc-toc">
      <p>Sur cette page</p>
      <a v-for="e in examples" :key="e.file" :href="`#${e.anchor}`">{{ e.title }}</a>
      <a href="#api">API</a>
    </aside>
  </div>
</template>
