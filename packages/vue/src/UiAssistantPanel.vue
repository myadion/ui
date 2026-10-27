<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import UiAssistantConfirmCard from './UiAssistantConfirmCard.vue'
import UiAssistantLimit from './UiAssistantLimit.vue'
import UiAssistantMessage from './UiAssistantMessage.vue'
import UiButton from './UiButton.vue'
import UiEmpty from './UiEmpty.vue'
import UiNotice from './UiNotice.vue'
import { whenLabel } from './notifications'

/*
 * L'ONGLET « ASSISTANT » DU VOLET (Adion UI, coordination#80 point 8). Le
 * client pilote son espace en discutant ; rien ne s'execute sans son clic sur
 * une carte. Le composant n'appelle rien : `useAssistant` le nourrit.
 *
 *   available       faux : `unavailable` dit pourquoi (message de Nexus), plus de saisie
 *   thread          { messages, pending, limit, error, status, streaming }
 *   conversations   [{ id, title, last_message_at }]
 *   counter         « 3 / 50 messages aujourd'hui »
 *   busy            id de la carte dont le clic est parti
 *   send / confirm / cancel / new / open / remove / navigate   les gestes, emis
 */
const props = defineProps({
  available: { type: Boolean, default: true },
  unavailable: { type: String, default: '' },
  thread: { type: Object, required: true },
  conversations: { type: Array, default: () => [] },
  currentId: { type: String, default: '' },
  counter: { type: String, default: '' },
  busy: { type: String, default: '' },
  examples: { type: Array, default: () => ['Quels sont mes domaines ?', 'Où en est ma dernière facture ?', 'Ajoute un enregistrement DNS à mon domaine'] },
})
const emit = defineEmits(['send', 'confirm', 'cancel', 'new', 'open', 'remove', 'navigate'])
const draft = ref('')
const history = ref(false)
const scroller = ref(null)
const MAX = 4000

const blocked = computed(() => !props.available || Boolean(props.thread.limit))
const canSend = computed(() => draft.value.trim() && !props.thread.streaming && !blocked.value)
const statusNote = computed(() => ({
  truncated: 'La réponse a été coupée. Demandez à l’assistant de continuer.',
  refused: 'L’assistant ne peut pas répondre à cette demande.',
  error: 'Un problème est survenu. Réessayez dans un instant.',
}[props.thread.status] || ''))

function send() {
  if (!canSend.value) return
  emit('send', draft.value.trim())
  draft.value = ''
}
function onKey(event) {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send() }
}
function open(id) { history.value = false; emit('open', id) }

watch(() => [props.thread.messages.length, props.thread.messages.at(-1)?.text, props.thread.pending.length], async () => {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
})
</script>

<template>
  <div class="ui-assist">
    <div class="ui-assist__bar">
      <UiButton kind="quiet" icon="mdi-plus" :disabled="!available || thread.streaming" @click="$emit('new')">Nouvelle conversation</UiButton>
      <UiButton kind="quiet" icon="mdi-history" :disabled="!conversations.length" :aria-pressed="history" @click="history = !history">Historique</UiButton>
    </div>

    <UiNotice v-if="!available" tone="info" :text="unavailable || 'L’assistant n’est pas encore disponible.'" />

    <ul v-if="history" class="ui-assist__history" aria-label="Conversations">
      <li v-for="c in conversations" :key="c.id" :class="{ 'is-current': c.id === currentId }">
        <button type="button" class="ui-assist__history-open" @click="open(c.id)">
          <span class="ui-assist__history-title">{{ c.title || 'Sans titre' }}</span>
          <span class="ui-assist__history-when">{{ whenLabel(c.last_message_at) }}</span>
        </button>
        <button type="button" class="ui-dialog__close" aria-label="Archiver la conversation" title="Archiver" @click="$emit('remove', c.id)"><v-icon icon="mdi-archive-outline" size="16" /></button>
      </li>
    </ul>

    <div v-else ref="scroller" class="ui-assist__thread" role="log" aria-live="polite">
      <UiEmpty v-if="!thread.messages.length && available" icon="mdi-message-text-outline" title="Pilotez votre espace en discutant" text="Posez une question ou demandez un geste. Rien ne se fait sans votre confirmation.">
        <div class="ui-assist__examples">
          <button v-for="e in examples" :key="e" type="button" class="ui-assist__example" @click="$emit('send', e)">{{ e }}</button>
        </div>
      </UiEmpty>
      <UiAssistantMessage v-for="(m, i) in thread.messages" :key="m.id" :message="m" :streaming="thread.streaming && i === thread.messages.length - 1" @navigate="$emit('navigate', $event)" />
      <UiAssistantConfirmCard
        v-for="card in thread.pending"
        :key="card.id"
        :card="card"
        :busy="busy === card.id"
        :disabled="Boolean(busy) && busy !== card.id"
        @confirm="$emit('confirm', card.id)"
        @cancel="$emit('cancel', card.id)"
      />
      <UiNotice v-if="thread.error" tone="bad" :text="thread.error" />
      <p v-else-if="statusNote" class="ui-assist__note">{{ statusNote }}</p>
    </div>

    <footer class="ui-assist__foot">
      <UiAssistantLimit v-if="thread.limit" :limit="thread.limit" @new-conversation="$emit('new')" />
      <form v-else-if="available" class="ui-assist__form" @submit.prevent="send">
        <label class="ui-assist__label" for="ui-assist-input">Votre message</label>
        <textarea id="ui-assist-input" v-model="draft" class="ui-assist__input" rows="2" :maxlength="MAX" placeholder="Écrivez à l’assistant…" :disabled="thread.streaming" @keydown="onKey" />
        <UiButton type="submit" kind="primary" icon="mdi-send" icon-only title="Envoyer" :disabled="!canSend" :loading="thread.streaming" />
      </form>
      <p v-if="counter" class="ui-assist__counter">{{ counter }}</p>
    </footer>
  </div>
</template>
