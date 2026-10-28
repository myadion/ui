<script setup>
import { ref } from 'vue'
import { UiSubTabs, UiTabs } from '@myadion/ui'

const tab = ref('ensemble')
const subtab = ref('fichiers')
</script>

<template>
  <UiTabs v-model="tab" :tabs="[{ id: 'ensemble', label: 'Vue d’ensemble' }, { id: 'envoyer', label: 'Envoyer' }, { id: 'expediteur', label: 'Expéditeur', count: 1, countHint: '1 nom en attente de validation' }, { id: 'reglages', label: 'Réglages' }]" />
  <UiSubTabs v-model="subtab" :tabs="[{ id: 'fichiers', label: 'Fichiers', icon: 'mdi-folder-outline' }, { id: 'ftp', label: 'Accès FTP', count: 2 }]" />
</template>
