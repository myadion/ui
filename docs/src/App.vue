<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

/* La barre de la doc : le logo d'Adion, trois pages, le theme. */
const theme = useTheme()
const dark = ref(true)
function toggle() {
  dark.value = !dark.value
  theme.global.name.value = dark.value ? 'adionDark' : 'adionLight'
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
}
</script>

<template>
  <v-app>
    <header class="docs-bar">
      <router-link to="/" class="docs-logo" aria-label="Adion UI, accueil">
        <img src="/favicon.png" alt="" width="34" height="34" />
        <span class="docs-logo__text">ADION<br />UI</span>
      </router-link>
      <nav class="docs-nav">
        <router-link to="/">Principes</router-link>
        <router-link to="/jetons">Jetons</router-link>
        <router-link to="/composants">Composants</router-link>
      </nav>
      <button type="button" class="docs-theme" :aria-label="dark ? 'Passer au thème clair' : 'Passer au thème sombre'" @click="toggle">
        <v-icon :icon="dark ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="18" />
      </button>
    </header>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
