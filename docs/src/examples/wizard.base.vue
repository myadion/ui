<script setup>
import { computed, ref } from 'vue'
import { UiInput, UiWizard } from '@myadion/ui'
import { steps } from './data.js'

const step = ref('nom')
const answer = ref('')
const index = computed(() => steps.findIndex((s) => s.key === step.value))
const next = () => { if (index.value < steps.length - 1) step.value = steps[index.value + 1].key }
</script>

<template>
  <UiWizard v-model="step" :steps="steps" :question="steps[index].label" @next="next" @finish="step = 'nom'">
    <UiInput v-model="answer" label="Réponse" />
  </UiWizard>
</template>
