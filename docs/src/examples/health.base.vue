<script setup>
import { UiBadge, UiHealthGroup, healthOf } from '@myadion/ui'
</script>

<template>
  <div class="ui-doc__row">
    <UiBadge v-for="code in ['operational', 'degraded', 'outage', 'maintenance', 'unknown']" :key="code" :label="healthOf({ status: code }).label" :tone="healthOf({ status: code }).tone" />
  </div>
  <UiHealthGroup title="Web" status="degraded" open :services="[
    { name: 'Static Website', status: 'degraded', uptime_24h: 99.65, uptime_90d: null, measured_days: 4, history: [{ date: '2026-10-15', uptime: 99.65 }, { date: '2026-10-16', uptime: 100 }] },
    { name: 'Hébergement PHP', status: 'operational', uptime_24h: 100, uptime_90d: 99.98, measured_days: 90 },
  ]" />
</template>
