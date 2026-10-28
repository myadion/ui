<script setup>
import { ref } from 'vue'
import { UiColumnMapper } from '@myadion/ui'

const columns = [
  { index: 0, header: 'Courriel', example: 'anne@exemple.fr', field_target: 'field:courriel', field_label: 'Courriel' },
  { index: 1, header: 'Email pro', example: 'a.martin@societe.fr', field_target: 'field:email_pro', field_label: 'Email pro' },
  { index: 2, header: 'Ville', example: 'Lyon', field_target: 'field:ville', field_label: 'Ville' },
]
const targets = [{ value: 'email', label: 'E-mail', group: 'Canaux' }, { value: 'mobile', label: 'Mobile', group: 'Canaux' }, { value: 'first_name', label: 'Prénom', group: 'Identité' }, { value: 'ignore', label: 'Ne pas importer', group: 'Autre' }]
const map = ref({ 0: 'email', 1: 'email', 2: 'field:ville' })
</script>

<template>
  <UiColumnMapper v-model="map" :columns="columns" :targets="targets" />
</template>
