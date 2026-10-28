<script setup>
import { ref } from 'vue'
import { UiActionMenu } from '@myadion/ui'
import { sampleActions } from './data.js'

const last = ref('')
</script>

<template>
  <UiActionMenu :actions="sampleActions" @action="(key) => (last = key)" />
  <p class="ui-muted">{{ last ? `Action choisie : ${last}` : 'Choisissez une action : l’écran ouvre le parcours correspondant.' }}</p>
</template>
