<script setup>
import { UiBadge } from '@adion-cloud/ui-vue'
</script>

<template>
  <div class="ui-doc__row">
    <UiBadge label="Validé" tone="ok" />
    <UiBadge label="En attente" tone="warn" />
    <UiBadge label="Refusé" tone="bad" />
    <UiBadge label="Information" tone="info" />
    <UiBadge label="Essai" tone="accent" icon="mdi-flask-outline" />
    <UiBadge label="Effacé" />
  </div>
</template>
