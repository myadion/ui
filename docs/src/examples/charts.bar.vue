<script setup>
import { UiBarChart } from '@myadion/ui'
</script>

<template>
  <UiBarChart :items="[{ key: 'email', label: 'E-mail', value: 42.5, hint: '1 280 envois' }, { key: 'sms', label: 'SMS', value: 18, hint: '640 envois' }]" title="Taux d’ouverture par canal" unit="%" :max="100" />
</template>
