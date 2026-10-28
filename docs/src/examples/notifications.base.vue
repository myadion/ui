<script setup>
import { ref } from 'vue'
import { UiAssistantButton, UiNotificationBell, UiNotificationDrawer } from '@myadion/ui'
import { demoNotifications } from './data.js'

const open = ref(false)
</script>

<template>
  <div class="ui-doc__row">
    <UiAssistantButton />
    <UiNotificationBell :count="2" :open="open" @click="open = !open" />
    <UiNotificationBell :count="0" />
  </div>
  <UiNotificationDrawer v-model="open" :notifications="demoNotifications" />
</template>
