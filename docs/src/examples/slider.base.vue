<script setup>
import { ref } from 'vue'
import { UiSlider } from '@myadion/ui'

const hours = ref(8)
const cap = ref(20)
</script>

<template>
  <UiSlider v-model="hours" label="Allumée chaque jour" :min="1" :max="24" unit="h" />
  <UiSlider v-model="cap" label="Plafond hors forfait" :min="0" :max="100" :step="5" :format="(v) => `${v},00 €`" hint="Au-delà, la ligne est bloquée jusqu’au mois suivant." />
</template>
