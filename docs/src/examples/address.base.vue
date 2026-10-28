<script setup>
import { reactive } from 'vue'
import { UiAddress } from '@myadion/ui'

const address = reactive({ line1: '', line2: '', postal_code: '', city: '', country: 'FR' })
</script>

<template>
  <UiAddress :address="address" />
</template>
