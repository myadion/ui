<script setup>
import { ref } from 'vue'
import { UiButton, UiDialog, UiInput } from '@adion-cloud/ui-vue'

const open = ref(false)
const name = ref('')
</script>

<template>
  <UiButton @click="open = true">Ouvrir une fenêtre</UiButton>
  <UiDialog v-model="open" title="Déclarer un expéditeur" icon="mdi-card-account-details-outline" text="Le nom affiché sur le téléphone de vos destinataires.">
    <UiInput v-model="name" label="Nouveau nom" />
    <template #actions="{ close }">
      <UiButton kind="quiet" @click="close">Annuler</UiButton>
      <UiButton kind="primary" @click="close">Déclarer</UiButton>
    </template>
  </UiDialog>
</template>
