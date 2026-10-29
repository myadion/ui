<script setup>
import { ref } from 'vue'
import { UiIdentifierInput } from '@myadion/ui'

const value = ref('')
</script>

<template>
  <UiIdentifierInput v-model="value" label="E-mail ou téléphone mobile" hint="Tapez 07…, +41… ou une adresse e-mail." />
</template>
