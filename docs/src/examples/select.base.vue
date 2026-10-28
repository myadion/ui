<script setup>
import { ref } from 'vue'
import { UiCombobox, UiSelect } from '@myadion/ui'

const plan = ref(null)
const tags = ref([])
</script>

<template>
  <UiSelect v-model="plan" label="Liste de choix" :items="['Starter', 'Pro', 'Business']" hint="Une aide sous le champ, si elle est courte." />
  <UiCombobox v-model="tags" label="Choix ou saisie libre" :items="['paly.li', 'boutique.fr']" multiple />
</template>
