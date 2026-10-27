<script setup>
import { ref } from 'vue'
import { UiCheckbox } from '@adion-cloud/ui-vue'

const agree = ref(false)
const auto = ref(true)
</script>

<template>
  <UiCheckbox v-model="agree" label="Une case et son libellé" text="Une explication facultative dessous." />
  <UiCheckbox v-model="agree" danger label="Je comprends que tout sera supprimé" />
  <UiCheckbox v-model="auto" switch label="Interrupteur : agit tout de suite" />
</template>
