<script setup>
import { ref } from 'vue'
import { UiSortableList } from '@adion-cloud/ui-vue'

const cascade = ref([
  { key: 'email', label: 'E-mail', hint: 'Premier essai', icon: 'mdi-email-outline' },
  { key: 'sms', label: 'SMS', hint: 'Si pas ouvert sous 24 h', icon: 'mdi-message-text-outline' },
  { key: 'post', label: 'Courrier', hint: 'Bientôt', icon: 'mdi-mailbox-outline', fixed: true },
])
</script>

<template>
  <UiSortableList v-model="cascade" label="Ordre de la cascade" hint="Glisser une ligne, ou Monter et Descendre." />
</template>
