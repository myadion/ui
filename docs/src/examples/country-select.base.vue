<script setup>
import { ref } from 'vue'
import { UiCountrySelect } from '@myadion/ui'

const country = ref('FR')
</script>

<template>
  <UiCountrySelect v-model="country" label="Pays du siège" />
</template>
