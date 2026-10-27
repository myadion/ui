<script setup>
import { UiButton, UiEmpty } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiEmpty text="Aucun service SMS dans ce projet. À la commande, le service s’ouvre sans abonnement.">
    <template #actions><UiButton>Commander SMS</UiButton></template>
  </UiEmpty>
</template>
