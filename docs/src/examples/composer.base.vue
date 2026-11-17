<script setup>
import { ref } from 'vue'
import { UiComposer } from '@myadion/ui'

const text = ref('')
const mode = ref('note')
const sent = ref('')
const modes = [
  { key: 'note', label: 'Note interne', icon: 'mdi-note-text-outline', placeholder: 'Écrire une note pour l’équipe…', hint: 'Visible par l’équipe seulement.', submit: 'Ajouter la note' },
  { key: 'reply', label: 'Réponse au client', icon: 'mdi-reply-outline', placeholder: 'Répondre à Claire Dumas…', hint: 'Sera envoyée à claire@atelier-lumiere.fr.', submit: 'Envoyer' },
]
</script>

<template>
  <UiComposer v-model="text" v-model:mode="mode" :modes="modes" @submit="(e) => { sent = `${e.mode} : ${e.text}`; text = '' }" />
  <p v-if="sent" class="ui-muted">Reçu par la page, rien n’est parti : {{ sent }}</p>
</template>
