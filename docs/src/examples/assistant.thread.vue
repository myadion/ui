<script setup>
import { UiAssistantPanel } from '@myadion/ui'
import { assistantThread } from './data.js'
</script>

<template>
  <div class="ui-doc__frame ui-doc__frame--assist">
    <UiAssistantPanel :thread="assistantThread" counter="3 / 50 messages aujourd’hui" :conversations="[{ id: 'c1', title: 'Mes domaines', last_message_at: new Date(Date.now() - 3600e3).toISOString() }]" />
  </div>
</template>
