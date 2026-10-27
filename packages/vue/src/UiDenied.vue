<script setup>
import { computed } from 'vue'
import UiNotice from './UiNotice.vue'

/*
 * UN ACCES REFUSE (Adion UI), toujours dit de la meme facon : ce que le role
 * ne permet pas, et qui peut l'ouvrir. `what` complete « consulter … ».
 */
const props = defineProps({
  what: { type: String, default: 'cette page' },
  text: { type: String, default: '' },
})

const message = computed(() => props.text
  || `Votre rôle ne permet pas de consulter ${props.what}. Un administrateur de l’organisation peut vous en donner l’accès.`)
</script>

<template>
  <UiNotice tone="warn" icon="mdi-lock-outline" :text="message" />
</template>
