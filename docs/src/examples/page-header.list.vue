<script setup>
import { UiButton, UiPageHeader } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiPageHeader eyebrow="Télécom" title="SMS" lead="Envoyez des SMS sous le nom de votre entreprise.">
    <template #actions>
      <UiButton kind="quiet" icon="mdi-refresh">Actualiser</UiButton>
      <UiButton kind="primary" icon="mdi-plus">Commander</UiButton>
    </template>
  </UiPageHeader>
</template>
