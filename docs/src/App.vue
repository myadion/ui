<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { groups, guides } from './catalog.js'

/*
 * LA COQUE DE LA DOC (2026-10-27, Kevin : « comme la doc Bootstrap ») : une
 * barre du haut, une barre de gauche avec un lien par composant, le contenu.
 */
const theme = useTheme()
const dark = ref(true)
function toggle() {
  dark.value = !dark.value
  theme.global.name.value = dark.value ? 'adionDark' : 'adionLight'
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
}

const route = useRoute()
const navOpen = ref(false)
const filter = ref('')
watch(() => route.fullPath, () => { navOpen.value = false })
const match = (text) => text.toLowerCase().includes(filter.value.trim().toLowerCase())
const shown = computed(() => groups
  .map((g) => ({ ...g, pages: g.pages.filter((p) => match(p.title) || p.components.some(match)) }))
  .filter((g) => g.pages.length))
const count = groups.reduce((n, g) => n + g.pages.length, 0)
</script>

<template>
  <v-app>
    <router-view v-if="$route.meta.bare" />
    <div v-else class="doc" :class="{ 'is-nav-open': navOpen }">
      <header class="doc-bar">
        <button class="doc-bar__burger" aria-label="Menu" @click="navOpen = !navOpen"><v-icon icon="mdi-menu" size="20" /></button>
        <router-link to="/" class="doc-logo" aria-label="Adion UI, accueil">
          <span class="doc-logo__pill" />
          <span class="doc-logo__text">ADION<br />UI</span>
        </router-link>
        <span class="doc-version">v0.1</span>
        <span class="doc-bar__spacer" />
        <router-link to="/installation" class="doc-bar__link">Installation</router-link>
        <router-link to="/composants/list-layout" class="doc-bar__link">Composants</router-link>
        <a href="https://github.com/myadion/ui" class="doc-bar__icon" aria-label="Le dépôt sur GitHub" target="_blank" rel="noopener"><v-icon icon="mdi-github" size="20" /></a>
        <button type="button" class="doc-bar__icon" :aria-label="dark ? 'Passer au thème clair' : 'Passer au thème sombre'" @click="toggle">
          <v-icon :icon="dark ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="18" />
        </button>
      </header>

      <aside class="doc-side" aria-label="Sommaire">
        <label class="doc-side__search">
          <v-icon icon="mdi-magnify" size="16" />
          <input v-model="filter" type="search" :placeholder="`Chercher parmi ${count} pages`" />
        </label>
        <nav class="doc-side__nav">
          <div v-if="!filter" class="doc-side__group">
            <p>Démarrer</p>
            <template v-for="g in guides" :key="g.id">
              <a v-if="g.external" :href="g.path" target="_blank" class="doc-side__item">{{ g.title }}<v-icon icon="mdi-open-in-new" size="13" /></a>
              <router-link v-else :to="g.path" class="doc-side__item" exact-active-class="is-on">{{ g.title }}</router-link>
            </template>
          </div>
          <div v-for="g in shown" :key="g.title" class="doc-side__group">
            <p>{{ g.title }}</p>
            <router-link v-for="p in g.pages" :key="p.id" :to="`/composants/${p.id}`" class="doc-side__item" active-class="is-on">{{ p.title }}</router-link>
          </div>
          <p v-if="!shown.length" class="doc-side__none">Rien ne correspond à « {{ filter }} ».</p>
        </nav>
      </aside>
      <div class="doc-scrim" @click="navOpen = false" />

      <main class="doc-main">
        <router-view />
      </main>
    </div>
  </v-app>
</template>
