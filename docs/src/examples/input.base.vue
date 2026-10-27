<script setup>
import { ref } from 'vue'
import { UiInput } from '@adion-cloud/ui-vue'

const name = ref('')
</script>

<template>
  <UiInput v-model="name" label="Nom de la clé" tip="Pour la reconnaître dans la liste." placeholder="site de réservation" required />
  <UiInput model-value="ab" label="Avec une erreur" error="Lettres et chiffres, 3 à 11." />
  <UiInput model-value="" label="Zone de texte" multiline />
</template>
