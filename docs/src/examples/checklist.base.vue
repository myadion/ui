<script setup>
import { UiChecklist } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiChecklist title="Avant l’envoi" :items="[
    { key: 'list', label: 'Une liste de contacts', ready: true },
    { key: 'sender', label: 'Un expéditeur validé', ready: true },
    { key: 'consent', label: 'Des contacts avec accord', ready: false, reason: 'Aucun des 12 contacts n’a donné son accord pour le SMS.' },
  ]" />
</template>
