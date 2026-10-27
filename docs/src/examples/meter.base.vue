<script setup>
import { ref } from 'vue'
import { UiInput, UiMeter } from '@adion-cloud/ui-vue'

const text = ref('Bonjour Anne, votre commande est prête. STOP au 36180')
</script>

<template>
  <UiInput v-model="text" label="Message" multiline />
  <UiMeter :value="text.length" :max="160" hint="lien et mention STOP compris · 1 SMS par contact" />
</template>
