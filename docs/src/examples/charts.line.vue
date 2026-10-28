<script setup>
import { UiLineChart } from '@myadion/ui'
import { chartLabels, chartSeries } from './data.js'
</script>

<template>
  <UiLineChart :labels="chartLabels" :series="chartSeries" title="Envois, ouvertures et clics par heure" />
</template>
