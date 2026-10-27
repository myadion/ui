<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

/* La barre de la doc : le logo d'Adion, trois pages, le theme. */
const theme = useTheme()
const dark = ref(true)
/* La refonte proposee (refresh.css) : avant, apres, pour comparer. */
const look = ref(document.documentElement.dataset.look || 'v2')
function setLook(value) {
  look.value = value
  document.documentElement.dataset.look = value
}
function toggle() {
  dark.value = !dark.value
  theme.global.name.value = dark.value ? 'adionDark' : 'adionLight'
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
}
</script>

<template>
  <v-app>
    <router-view v-if="$route.meta.bare" />
    <template v-else>
    <header class="docs-bar">
      <router-link to="/" class="docs-logo" aria-label="Adion UI, accueil">
        <img src="/favicon.png" alt="" width="34" height="34" />
        <span class="docs-logo__text">ADION<br />UI</span>
      </router-link>
      <nav class="docs-nav">
        <router-link to="/">Principes</router-link>
        <router-link to="/jetons">Jetons</router-link>
        <router-link to="/composants">Composants</router-link>
        <router-link to="/maquette">Maquette</router-link>
      </nav>
      <div class="docs-look" role="group" aria-label="Style">
        <button type="button" :class="{ 'is-on': look === 'v1' }" @click="setLook('v1')">Avant</button>
        <button type="button" :class="{ 'is-on': look === 'v2' }" @click="setLook('v2')">Après</button>
      </div>
      <button type="button" class="docs-theme" :aria-label="dark ? 'Passer au thème clair' : 'Passer au thème sombre'" @click="toggle">
        <v-icon :icon="dark ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="18" />
      </button>
    </header>
    <v-main>
      <div class="ui-frame" :class="{ 'ui-frame--read': $route.path !== '/composants' }">
        <router-view />
      </div>
    </v-main>
    </template>
  </v-app>
</template>
