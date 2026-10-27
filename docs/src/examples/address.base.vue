<script setup>
import { reactive } from 'vue'
import { UiAddress } from '@adion-cloud/ui-vue'

const address = reactive({ line1: '', line2: '', postal_code: '', city: '', country: 'FR' })
</script>

<template>
  <UiAddress :address="address" />
</template>
