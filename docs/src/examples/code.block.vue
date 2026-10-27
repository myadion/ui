<script setup>
import { UiCode } from '@adion-cloud/ui-vue'

const example = [
  'curl -X POST https://adion-api.eu/api/v1/sms \\',
  '  -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \\',
  `  -d '{"to": "+33612345678", "message": "Votre code : 482913"}'`,
].join('\n')
</script>

<template>
  <UiCode :code="example" />
</template>
