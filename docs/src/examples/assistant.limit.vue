<script setup>
import { UiAssistantPanel } from '@adion-cloud/ui-vue'
import { assistantLimited } from './data.js'
</script>

<template>
  <div class="ui-doc__frame ui-doc__frame--assist">
    <UiAssistantPanel :thread="assistantLimited" counter="50 / 50 messages aujourd’hui" />
  </div>
</template>
