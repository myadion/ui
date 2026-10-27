<script setup>
import { UiMessagePreview } from '@adion-cloud/ui-vue'
</script>

<template>
  <div class="ui-doc__demo">
    <UiMessagePreview sender="LUMIERE" text="Bonjour, votre commande est prête : passez la chercher dès demain." note="1 partie · 64 caractères" />
    <UiMessagePreview sender="N° court" />
  </div>
</template>
