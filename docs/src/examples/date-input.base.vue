<script setup>
import { ref } from 'vue'
import { UiDateInput } from '@myadion/ui'

const birth = ref('')
</script>

<template>
  <UiDateInput v-model="birth" label="Date de naissance" birthday />
</template>
