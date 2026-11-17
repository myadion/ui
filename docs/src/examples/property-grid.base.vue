<script setup>
import { UiPropertyGrid } from '@myadion/ui'
import { customers } from '../orbit/desk.js'
</script>

<template>
  <div style="max-width: 320px"><UiPropertyGrid :groups="customers[0].groups" /></div>
</template>
