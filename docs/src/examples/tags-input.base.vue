<script setup>
import { ref } from 'vue'
import { UiTagsInput } from '@myadion/ui'

const numbers = ref(['06 12 34 56 78', '0700000000', '12'])
</script>

<template>
  <UiTagsInput v-model="numbers" label="Numéros" tip="Entrée ou virgule pour ajouter ; coller une liste la découpe." placeholder="06 12 34 56 78" :invalid="{ 12: 'Numéro de mobile français invalide' }" hint="3 numéros, dont 1 écarté" />
</template>
