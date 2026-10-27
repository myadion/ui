import { createApp, reactive } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { vuetifyThemes } from '@adion-cloud/tokens'
import { createAdionUi } from '@adion-cloud/ui-vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@adion-cloud/tokens/tokens.css'
import '@adion-cloud/ui-vue/base.css'
import '@adion-cloud/ui-vue/ui.css'
import '@adion-cloud/ui-vue/content.css'
import './docs.css'
import App from './App.vue'

/*
 * LA DOC D'ADION UI (2026-10-27) : publique, sans compte. Le kit y tourne
 * pour de vrai, branche sur un adaptateur de demonstration : aucun appel a
 * Nexus ne part d'ici.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./HomeView.vue') },
    { path: '/installation', component: () => import('./InstallView.vue') },
    { path: '/jetons', component: () => import('./TokensView.vue') },
    { path: '/contrastes', component: () => import('./ContrastView.vue') },
    { path: '/composants', redirect: '/composants/list-layout' },
    { path: '/composants/:id', component: () => import('./ComponentView.vue') },
    { path: '/maquette', component: () => import('./mockup/MockupView.vue'), meta: { bare: true } },
  ],
  scrollBehavior: (to) => (to.hash ? { el: to.hash, top: 72, behavior: 'smooth' } : { top: 0 }),
})

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: { defaultTheme: 'adionDark', themes: vuetifyThemes },
})

const demo = createAdionUi({
  context: reactive({ orgId: 'demo', projectId: 'demo' }),
  // La doc ne parle a aucun serveur : chaque appel rend une liste vide.
  request: async () => ({ data: [], features: [] }),
  // Comme une vraie app : les libelles d'un etat viennent d'elle (myadion : lib/services.js).
  labels: { stateLabel: (v) => ({ active: 'Actif', suspended: 'Suspendu', terminated: 'Résilié', pending: 'En cours' })[String(v || 'active')] || v },
  services: {
    fetchActions: async () => ({ actions: [] }),
    monitoringStatus: async () => null,
  },
})

createApp(App).use(router).use(vuetify).use(demo).mount('#app')
