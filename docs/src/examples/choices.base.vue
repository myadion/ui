<script setup>
import { ref } from 'vue'
import { UiChoices } from '@myadion/ui'
import { scopes } from './data.js'

const picked = ref(['sms.send'])
</script>

<template>
  <UiChoices v-model="picked" label="Droits de l’application" :items="scopes" columns />
</template>
