<script setup>
import { UiStatus } from '@adion-cloud/ui-vue'
</script>

<template>
  <div class="ui-doc__row">
    <UiStatus :status="{ label: 'Actif', tone: 'success' }" />
    <UiStatus :status="{ label: 'En attente', tone: 'warning' }" />
    <UiStatus :status="{ label: 'Suspendu', tone: 'danger' }" />
    <UiStatus :status="{ label: 'Résilié', tone: 'neutral' }" />
  </div>
</template>
