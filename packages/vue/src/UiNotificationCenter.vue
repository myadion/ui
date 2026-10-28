<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import UiAssistantButton from './UiAssistantButton.vue'
import UiNotificationBell from './UiNotificationBell.vue'
import UiNotificationDrawer from './UiNotificationDrawer.vue'
import UiAssistantPanel from './UiAssistantPanel.vue'
import { normalizeNotification } from './notifications'
import { useRouter } from 'vue-router'
import { useAdion } from './adapter.js'

const { useAssistant, useNotifications, onUpdate: onNotificationUpdate } = useAdion().notifications

/*
 * LE CENTRE DE NOTIFICATIONS, branche sur l'API (Adion UI) :
 * la cloche et son volet. L'API calcule les etats, la gravite et les textes ;
 * ici on les affiche. Le temps reel relit le compteur, et la liste si le volet
 * est ouvert. Le second onglet, « Assistant », est celui de l'API (point 8).
 */
const { items, loading, unread, refresh, refreshCount, markRead, markAllRead, dismiss } = useNotifications()
const assistant = useAssistant()
const router = useRouter()
const open = ref(false)
const tab = ref('notifications')
const list = computed(() => items.value.map((n, i) => normalizeNotification(n, i)))

let off = null
function show(which) {
  if (open.value && tab.value === which) { open.value = false; return }
  tab.value = which
  open.value = true
}
// Ctrl+K (⌘K) ouvre l'assistant, sauf dans un editeur de code qui s'en sert.
function onKey(event) {
  if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || String(event.key || '').toLowerCase() !== 'k') return
  if (event.target?.closest?.('.cm-editor, .monaco-editor')) return
  event.preventDefault()
  show('assistant')
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  refresh()
  off = onNotificationUpdate(() => (open.value ? refresh() : refreshCount()))
})
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); if (off) off() })
watch(open, (value) => { if (value) refresh() })
watch([open, tab], ([isOpen, current]) => {
  if (isOpen && current === 'assistant') { assistant.loadStatus(); assistant.loadConversations() }
})
</script>

<template>
  <span class="ui-bell-group">
    <UiAssistantButton :open="open && tab === 'assistant'" @click="show('assistant')" />
    <UiNotificationBell :count="unread" :open="open && tab === 'notifications'" @click="show('notifications')" />
  </span>
  <UiNotificationDrawer
    v-model="open"
    v-model:tab="tab"
    :notifications="list"
    :loading="loading"
    @read="markRead"
    @read-all="markAllRead"
    @dismiss="dismiss"
    @action="open = false"
  >
    <template #assistant>
      <UiAssistantPanel
        :available="assistant.available.value"
        :unavailable="assistant.unavailable.value"
        :thread="assistant.thread"
        :conversations="assistant.conversations.value"
        :current-id="assistant.currentId.value"
        :counter="assistant.counter.value"
        :busy="assistant.busy.value"
        @send="assistant.send"
        @confirm="assistant.confirm"
        @cancel="assistant.cancel"
        @new="assistant.startNew"
        @open="assistant.open"
        @remove="assistant.archive"
        @navigate="(path) => { open = false; router.push(path) }"
      />
    </template>
  </UiNotificationDrawer>
</template>
