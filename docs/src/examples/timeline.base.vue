<script setup>
import { UiTimeline } from '@adion-cloud/ui-vue'
import { timeline } from './data.js'
</script>

<template>
  <UiTimeline :items="timeline" />
</template>
