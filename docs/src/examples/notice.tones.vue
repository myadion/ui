<script setup>
import { UiButton, UiNotice } from '@myadion/ui'
</script>

<template>
  <UiNotice tone="info" text="Une information : rien à faire, mais bon à savoir." />
  <UiNotice tone="ok" text="Rechargement automatique activé." closable />
  <UiNotice tone="warn" title="Plus de crédits." text="Achetez un paquet pour envoyer.">
    <template #actions><UiButton>Acheter</UiButton></template>
  </UiNotice>
  <UiNotice tone="bad" text="L’achat n’a pas pu se faire." />
</template>
