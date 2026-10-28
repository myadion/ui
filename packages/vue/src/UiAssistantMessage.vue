<script setup>
import { computed } from 'vue'
import { renderMarkdown, STATE_LABEL } from './assistant'
import UiBadge from './UiBadge.vue'

/*
 * UN MESSAGE DE L'ASSISTANT (Adion UI). Le client a
 * sa bulle a droite, l'assistant la sienne a gauche, en markdown leger. Les
 * lectures faites (« Lecture de vos domaines… ») sont de petites lignes
 * discretes ; les gestes (`actions`) disent leur etat.
 *
 *   message   { role: 'user'|'assistant', text, tools: [{ title, status }], actions: [{ status, title }] }
 *   streaming vrai tant que la reponse arrive : un curseur clignote
 *   navigate  emis avec le chemin d'un lien de myadion (le routeur le prend)
 */
const props = defineProps({
  message: { type: Object, required: true },
  streaming: { type: Boolean, default: false },
})
const emit = defineEmits(['navigate'])
const html = computed(() => (props.message.role === 'assistant' ? renderMarkdown(props.message.text) : ''))
const tone = { executed: 'ok', failed: 'bad', cancelled: 'muted', expired: 'muted' }

function onClick(event) {
  const a = event.target.closest?.('a[data-route]')
  if (!a) return
  event.preventDefault()
  emit('navigate', a.getAttribute('data-route'))
}
</script>

<template>
  <div class="ui-assist-msg" :class="`is-${message.role}`">
    <ul v-if="message.tools?.length" class="ui-assist-msg__tools" aria-label="Lectures faites par l’assistant">
      <li v-for="t in message.tools" :key="t.title">
        <v-icon :icon="t.status === 'running' ? 'mdi-loading' : 'mdi-check'" size="14" :class="{ 'ui-spin': t.status === 'running' }" />
        {{ t.title }}
      </li>
    </ul>
    <div v-if="message.role === 'user'" class="ui-assist-msg__bubble">{{ message.text }}</div>
    <!-- eslint-disable-next-line vue/no-v-html -- le texte est echappe par renderMarkdown -->
    <div v-else-if="message.text" class="ui-assist-msg__bubble ui-assist-msg__md" :class="{ 'is-streaming': streaming }" @click="onClick" v-html="html" />
    <div v-else-if="streaming" class="ui-assist-msg__bubble is-streaming" aria-label="L’assistant écrit">…</div>
    <ul v-if="message.actions?.length" class="ui-assist-msg__actions">
      <li v-for="(a, i) in message.actions" :key="a.id || i">
        <UiBadge :label="STATE_LABEL[a.status] || a.status" :tone="tone[a.status] || 'muted'" />
        <span>{{ a.title }}</span>
      </li>
    </ul>
  </div>
</template>
