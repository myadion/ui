<script setup>
import { computed } from 'vue'
import UiButton from './UiButton.vue'
import UiNotice from './UiNotice.vue'
import { limitOffersNewConversation } from './assistant'

/*
 * UN PLAFOND ATTEINT (Adion UI). Il prend la place du
 * champ de saisie : le message de l'API, la date de reprise, et pour une
 * conversation trop longue un bouton « Nouvelle conversation ».
 *
 *   limit  { kind, message, resetsAt }
 */
const props = defineProps({ limit: { type: Object, required: true } })
defineEmits(['new-conversation'])
const resets = computed(() => {
  const time = Date.parse(props.limit.resetsAt || '')
  if (!Number.isFinite(time)) return ''
  return `Reprise ${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(time))}.`
})
</script>

<template>
  <UiNotice tone="warn" :text="[limit.message, resets].filter(Boolean).join(' ')">
    <template v-if="limitOffersNewConversation(limit)" #actions>
      <UiButton @click="$emit('new-conversation')">Nouvelle conversation</UiButton>
    </template>
  </UiNotice>
</template>
