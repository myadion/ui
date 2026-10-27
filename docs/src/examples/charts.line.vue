<script setup>
import { UiLineChart } from '@adion-cloud/ui-vue'
import { chartLabels, chartSeries } from './data.js'
</script>

<template>
  <UiLineChart :labels="chartLabels" :series="chartSeries" title="Envois, ouvertures et clics par heure" />
</template>
