<script setup>
import { UiTimeline } from '@myadion/ui'
import { timeline } from './data.js'
</script>

<template>
  <UiTimeline :items="timeline" />
</template>
