<script setup>
import { UiCard } from '@adion-cloud/ui-vue'
</script>

<template>
  <div class="ui-cards">
    <UiCard v-for="f in ['brand', 'web', 'telecom', 'payment', 'marketing', 'cloud', 'ai']" :key="f" :family="f" :eyebrow="f" title="Une carte en dégradé" text="Le texte garde son contraste, vérifié AA." />
  </div>
</template>
