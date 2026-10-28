<script setup>
import { UiChannelChip } from '@myadion/ui'
</script>

<template>
  <div class="ui-doc__row">
    <UiChannelChip value="anne@exemple.fr" label="Accord" tone="ok" icon="mdi-email-outline" />
    <UiChannelChip value="06 12 34 56 78" label="Retiré" tone="warn" icon="mdi-message-text-outline" mono />
  </div>
</template>
