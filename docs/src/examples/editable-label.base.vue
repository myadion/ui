<script setup>
import { ref } from 'vue'
import { UiEditableLabel } from '@myadion/ui'
const name = ref('Site de l’agence')
</script>

<template>
  <UiEditableLabel :label="name" title="Renommer ce service" @edit="name = name + ' ✓'" />
</template>
