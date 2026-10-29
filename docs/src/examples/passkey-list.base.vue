<script setup>
import { ref } from 'vue'
import { UiPasskeyList } from '@myadion/ui'

const keys = ref([
  { key: 'a1', name: 'MacBook de Kévin', detail: 'Utilisée le 29 oct. 2026' },
  { key: 'b2', name: 'iPhone', detail: 'Jamais utilisée' },
])
const remove = (key) => { keys.value = keys.value.filter((k) => k.key !== key) }
</script>

<template>
  <UiPasskeyList :keys="keys" @remove="remove" />
</template>
