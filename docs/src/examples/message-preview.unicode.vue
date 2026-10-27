<script setup>
import { UiMessagePreview, UiUnicodeNotice } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiMessagePreview sender="LUMIERE" text="Bonjour, votre commande est prête 🎉" note="2 parties · 36 caractères" :highlight="['🎉']" />
  <UiUnicodeNotice :unicode="{ message: 'Ce message contient un caractère spécial : il part en Unicode, 70 caractères par SMS au lieu de 160.', characters: ['🎉'], segments_per_recipient: 2, segments_total: 200 }" />
</template>
