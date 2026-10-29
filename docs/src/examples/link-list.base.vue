<script setup>
import { UiLinkList } from '@myadion/ui'

const items = [
  { key: 'ftth', icon: 'mdi-router-wireless', label: 'Mes accès fibre', hint: '2 accès', to: '#', tone: 'accent' },
  { key: 'billing', icon: 'mdi-wallet-bifold-outline', label: 'Mes factures', hint: '1 compte', to: '#', tone: 'info' },
  { key: 'docs', icon: 'mdi-book-open-variant', label: 'La documentation', hint: 'docs.myadion.com', href: 'https://docs.myadion.com', external: true },
]
</script>

<template>
  <UiLinkList :items="items" />
</template>
