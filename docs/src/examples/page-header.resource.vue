<script setup>
import { UiButton, UiPageHeader } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiPageHeader resource title="Boutique Lumière" :crumbs="[{ label: 'Télécom' }, { label: 'SMS', to: '#' }]" :status="{ label: 'Actif', tone: 'ok' }">
    <template #meta><span>Expéditeur LUMIERE</span><span class="ui-header__sep">·</span><span>Rechargement automatique sous 100</span></template>
    <template #actions><UiButton kind="secondary" icon="mdi-send-outline">Envoyer</UiButton></template>
  </UiPageHeader>
</template>
