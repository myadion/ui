<script setup>
import { UiActionMenu, UiRecordHeader } from '@myadion/ui'
import { customers } from '../orbit/desk.js'

const customer = customers[0]
const menu = [
  { key: 'space', label: 'Ouvrir son espace client', icon: 'mdi-account-eye-outline', available: true },
  { key: 'suspend', label: 'Suspendre le client', icon: 'mdi-pause-circle-outline', available: true, danger: true },
]
</script>

<template>
  <UiRecordHeader icon="mdi-domain" :title="customer.name" :status="customer.status" :facts="customer.facts" :back="{ label: 'Organisations', to: '/composants/record-header' }">
    <template #actions><UiActionMenu :actions="menu" /></template>
  </UiRecordHeader>
</template>
