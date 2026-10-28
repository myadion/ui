<script setup>
import { UiButton, UiPromoCard } from '@myadion/ui'
</script>

<template>
  <div style="max-width: 340px">
    <UiPromoCard tag="Vos données restent en Europe" title="Pilotez ce projet avec vos outils" text="OpenStack, Terraform ou l’API Adion : vos accès sont prêts.">
      <template #actions>
        <UiButton icon="mdi-content-copy">clouds.yaml</UiButton>
        <UiButton icon="mdi-key-outline">Clés d’API</UiButton>
      </template>
    </UiPromoCard>
  </div>
</template>
