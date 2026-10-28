<script setup>
import { ref } from 'vue'
import { UiFileInput } from '@myadion/ui'

const file = ref(null)
</script>

<template>
  <UiFileInput v-model="file" label="Votre fichier de contacts" accept=".csv,text/csv" tip="Glisser-déposer ou clic ; le nom et la taille s’affichent." />
</template>
