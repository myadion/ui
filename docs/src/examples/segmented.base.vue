<script setup>
import { ref } from 'vue'
import { UiSegmented } from '@adion-cloud/ui-vue'

const kind = ref('company')
</script>

<template>
  <UiSegmented v-model="kind" label="Type de compte" :items="[{ value: 'company', label: 'Société' }, { value: 'individual', label: 'Individuel' }, { value: 'asso', label: 'Association' }]" />
</template>
