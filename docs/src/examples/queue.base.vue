<script setup>
import { ref } from 'vue'
import { UiQueue } from '@myadion/ui'
import { customers } from '../orbit/desk.js'

const current = ref(customers[0].id)
const items = customers.map((c) => ({ id: c.id, title: c.name, ...c.queue }))
</script>

<template>
  <div style="max-width: 280px"><UiQueue v-model="current" :items="items" label="Clients à traiter" /></div>
</template>
