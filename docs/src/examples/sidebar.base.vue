<script setup>
import { ref } from 'vue'
import {
  UiIconActions, UiSidebar, UiSidebarChild, UiSidebarContext, UiSidebarEntry, UiSidebarFooter,
  UiSidebarLink, UiSidebarModes, UiSidebarProduct, UiSidebarSearch, UiSidebarSection,
} from '@myadion/ui'

const mode = ref('products')
const search = ref('')
const open = ref({ cloud: true, pc: true })
const footer = ref(true)
const account = ref('org1')
const project = ref('p1')
const accounts = [
  { value: 'me', title: 'Kévin Paly', hint: 'Compte personnel', mark: 'KP' },
  { value: 'org1', title: 'Atelier Lumière', hint: 'Organisation · Propriétaire', mark: 'AL', org: true },
]
const projects = [{ value: 'p1', title: 'Production', icon: 'mdi-folder-outline' }, { value: 'p2', title: 'Recette', icon: 'mdi-folder-outline' }]
const actions = [
  { key: 'docs', icon: 'mdi-book-open-variant', label: 'Documentation' },
  { key: 'theme', icon: 'mdi-weather-sunny', label: 'Passer en clair' },
  { key: 'logout', icon: 'mdi-logout', label: 'Se déconnecter', tone: 'danger' },
]
</script>

<template>
  <div class="ui-doc__frame" style="height: 640px; display: flex">
    <UiSidebar label="Produits et services" style="position: static; height: 100%">
      <template #actions><UiIconActions :items="actions" /></template>
      <template #context>
        <UiSidebarContext label="Compte" :value="accounts.find((a) => a.value === account).title" menu-title="Travailler dans" :items="accounts" :current="account" :actions="[{ key: 'orgs', icon: 'mdi-domain', label: 'Mes organisations' }]" @choose="(v) => (account = v)" />
        <UiSidebarContext label="Projet" :value="projects.find((p) => p.value === project).title" menu-title="Projets" :items="projects" :current="project" @choose="(v) => (project = v)" />
      </template>
      <template #tools>
        <UiSidebarModes v-model="mode" :items="[{ value: 'products', label: 'Produits' }, { value: 'domains', label: 'Par domaine' }]" />
        <UiSidebarSearch v-model="search" />
      </template>
      <UiSidebarSection label="Web" :open="false" />
      <UiSidebarSection label="Cloud" :open="open.cloud" @toggle="open.cloud = !open.cloud">
        <UiSidebarProduct label="Public Cloud" icon="mdi-cloud-outline" :count="2" active expandable :open="open.pc" @toggle="open.pc = !open.pc">
          <UiSidebarEntry label="Production" tone="good" active />
          <UiSidebarEntry label="Recette" tone="warn" />
        </UiSidebarProduct>
        <UiSidebarProduct label="VPS" icon="mdi-server-outline" />
        <UiSidebarProduct label="IP publiques" icon="mdi-ip-network-outline" />
      </UiSidebarSection>
      <template #footer>
        <UiSidebarFooter title="Transverse" :open="footer" @toggle="footer = !footer">
          <UiSidebarLink label="Mes commandes" icon="mdi-receipt-text-outline" />
          <UiSidebarLink label="Mon compte" icon="mdi-account-circle-outline" expandable open>
            <UiSidebarChild label="Profil" active />
            <UiSidebarChild label="Se déconnecter" danger />
          </UiSidebarLink>
        </UiSidebarFooter>
      </template>
    </UiSidebar>
  </div>
</template>
