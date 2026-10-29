<script setup>
import { ref } from 'vue'
import { UiAccountPicker } from '@myadion/ui'

const accounts = ref([
  { key: 'kevin@example.fr', name: 'Kévin', detail: 'kevin@example.fr', method: 'passkey' },
  { key: '+33612345678', name: 'Marie', detail: '+33 6 12 34 56 78', method: 'sms' },
  { key: 'lucie@example.fr', name: '', detail: 'lucie@example.fr', method: 'email' },
])
const remove = (key) => { accounts.value = accounts.value.filter((a) => a.key !== key) }
</script>

<template>
  <UiAccountPicker :accounts="accounts" @remove="remove" />
</template>
