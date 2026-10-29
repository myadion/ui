<script setup>
import { UiServiceTree } from '@myadion/ui'
const groups = [
  { id: 'site', icon: 'mdi-server-outline', label: 'Site & hébergement', hint: '1/1 actif', items: [{ label: 'exemple.fr', hint: 'Hébergement web', active: true }] },
  { id: 'mail', icon: 'mdi-email-outline', label: 'E-mails', hint: '0/1 actif', items: [{ label: 'Nouvelle messagerie', hint: 'Des adresses @exemple.fr', active: false }] },
]
</script>

<template>
  <UiServiceTree :root="{ label: 'exemple.fr', hint: '1 service' }" :groups="groups" />
</template>
