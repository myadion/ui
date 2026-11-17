<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UiAppShell, UiIconActions, UiSidebar, UiSidebarProduct, UiSidebarSearch, UiSidebarSection, UiTopBar } from '@myadion/ui'
import { menu } from './data.js'

/*
 * LA COQUE D'ORBIT EN MODE OUTIL (essai, 2026-11-17) : le menu par equipe
 * avec une aide sur chaque entree, la barre du haut, la page dans son creneau.
 */
defineEmits(['search'])
defineProps({ current: { type: String, default: 'Commandes' } })
const router = useRouter()
const sections = ref(menu.map((s) => s.open || false))
const search = ref('')
const actions = [
  { key: 'search', icon: 'mdi-magnify', label: 'Rechercher partout (Ctrl K)' },
  { key: 'bell', icon: 'mdi-bell-outline', label: 'Notifications' },
  { key: 'theme', icon: 'mdi-weather-sunny', label: 'Thème' },
]
</script>

<template>
  <UiAppShell tool>
    <template #sidebar>
      <UiSidebar label="Menu d’Orbit" brand-text="Adion Orbit">
        <template #tools><UiSidebarSearch v-model="search" /></template>
        <UiSidebarSection v-for="(s, i) in menu" :key="s.title" :label="s.title" :open="sections[i]" @toggle="sections[i] = !sections[i]">
          <UiSidebarProduct v-for="item in s.items" :key="item.label" :label="item.label" :icon="item.icon" :hint="item.hint" :count="item.count || ''" :active="item.label === current" @select="item.to && router.push(item.to)" />
        </UiSidebarSection>
      </UiSidebar>
    </template>
    <template #topbar>
      <UiTopBar brand-text="Adion Orbit">
        <template #actions><UiIconActions :items="actions" @action="(a) => (a === 'search' || a?.key === 'search') && $emit('search')" /></template>
        <template #menu>Le menu d’Orbit, dans le panneau du téléphone</template>
      </UiTopBar>
    </template>
    <slot />
  </UiAppShell>
</template>
