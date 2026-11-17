<script setup>
import { ref } from 'vue'
import { UiActivityFeed } from '@myadion/ui'
import { KINDS, customers } from '../orbit/desk.js'

const filter = ref('')
</script>

<template>
  <UiActivityFeed v-model="filter" :kinds="KINDS" :items="customers[0].events" :limit="4" />
</template>
