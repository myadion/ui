<script setup>
import { UiButton, UiMailGallery } from '@adion-cloud/ui-vue'
import { mailDocument, renderMail } from './data.js'

const html = renderMail(mailDocument())
</script>

<template>
  <UiMailGallery :items="[{ id: 'a', name: 'Lettre du mois', subject: 'Nos nouvelles du mois', meta: 'Version 3', html }, { id: 'b', name: 'Promotion', subject: '-20 % ce week-end', loading: true }]">
    <template #actions><UiButton kind="quiet" icon="mdi-pencil-outline" icon-only title="Ouvrir" /></template>
  </UiMailGallery>
</template>
