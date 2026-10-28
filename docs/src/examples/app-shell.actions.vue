<script setup>
import { UiIconActions } from '@myadion/ui'

const actions = [
  { key: 'docs', icon: 'mdi-book-open-variant', label: 'Documentation', href: 'https://docs.myadion.com', external: true },
  { key: 'theme', icon: 'mdi-weather-sunny', label: 'Passer en clair' },
  { key: 'logout', icon: 'mdi-logout', label: 'Se déconnecter', tone: 'danger' },
]
</script>

<template>
  <UiIconActions :items="actions" />
</template>
