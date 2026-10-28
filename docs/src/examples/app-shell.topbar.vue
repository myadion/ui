<script setup>
import { ref } from 'vue'
import { UiIconActions, UiNotificationBell, UiTopBar } from '@myadion/ui'

const last = ref('')
const actions = [
  { key: 'search', icon: 'mdi-magnify', label: 'Rechercher' },
  { key: 'home', icon: 'mdi-home-outline', label: 'Accueil', to: '/' },
]
</script>

<template>
  <UiTopBar brand-always brand-to="/">
    <template #actions>
      <UiNotificationBell :count="4" />
      <UiIconActions :items="actions" @action="(key) => (last = key)" />
    </template>
  </UiTopBar>
  <p class="ui-muted">{{ last ? `Geste : ${last}` : 'Les gestes sans lien émettent « action » avec leur clé.' }}</p>
</template>
