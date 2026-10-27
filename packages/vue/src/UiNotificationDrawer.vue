<script setup>
import { computed, useSlots } from 'vue'
import { useDisplay } from 'vuetify'
import UiBadge from './UiBadge.vue'
import UiButton from './UiButton.vue'
import UiEmpty from './UiEmpty.vue'
import { sortNotifications, unreadCount, whenLabel } from './notifications'

/*
 * LE VOLET DES NOTIFICATIONS (Adion UI, coordination#80) : il s'ouvre sur la
 * droite. Chaque notification dit sa gravite, son titre, son message, sa date
 * et, quand il y en a une, son action (« Ajouter un moyen de paiement »).
 *
 *   notifications  [{ id, severity, title, message, at, read, action: { label, to|href } }]
 *   action         emis avec la notification dont on a clique l'action
 *   read           emis avec son id quand on la marque lue ; `read-all` pour toutes
 *   dismiss        emis avec son id pour une notification qui se ferme (`dismissible`)
 *
 * Second onglet « Assistant » (point 8) quand le creneau `assistant` est rempli :
 * `tab` ('notifications' | 'assistant', v-model:tab) dit lequel est ouvert.
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  notifications: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  tab: { type: String, default: 'notifications' },
})
const emit = defineEmits(['update:modelValue', 'update:tab', 'action', 'read', 'read-all', 'dismiss'])
const slots = useSlots()
const { smAndDown } = useDisplay()
const hasAssistant = computed(() => Boolean(slots.assistant))
const current = computed(() => (hasAssistant.value ? props.tab : 'notifications'))
const items = computed(() => sortNotifications(props.notifications))
const unread = computed(() => unreadCount(items.value))
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    location="right"
    temporary
    :width="smAndDown ? 360 : 400"
    :class="{ 'ui-notif--full': smAndDown }"
    class="ui-notif"
    aria-label="Notifications"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <header class="ui-notif__head">
      <div v-if="hasAssistant" class="ui-notif__tabs" role="tablist">
        <button type="button" role="tab" class="ui-notif__tab" :class="{ 'is-on': current === 'notifications' }" :aria-selected="current === 'notifications'" @click="emit('update:tab', 'notifications')">
          Notifications <UiBadge v-if="unread" :label="unread" tone="accent" />
        </button>
        <button type="button" role="tab" class="ui-notif__tab" :class="{ 'is-on': current === 'assistant' }" :aria-selected="current === 'assistant'" @click="emit('update:tab', 'assistant')">
          <v-icon icon="mdi-creation-outline" size="16" /> Assistant
        </button>
      </div>
      <h2 v-else class="ui-notif__title">Notifications <UiBadge v-if="unread" :label="unread" tone="accent" /></h2>
      <span v-if="hasAssistant" class="ui-notif__grow" />
      <UiButton v-if="unread && current === 'notifications'" kind="quiet" @click="emit('read-all')">Tout marquer comme lu</UiButton>
      <button type="button" class="ui-dialog__close" aria-label="Fermer" title="Fermer" @click="emit('update:modelValue', false)">
        <v-icon icon="mdi-close" size="18" />
      </button>
    </header>

    <div v-if="current === 'assistant'" class="ui-notif__assistant" role="tabpanel"><slot name="assistant" /></div>
    <template v-else>
    <ul v-if="items.length" class="ui-notif__list">
      <li v-for="n in items" :key="n.id" class="ui-notif__item" :class="[`is-tone-${n.tone}`, { 'is-unread': !n.read }]">
        <div class="ui-notif__meta">
          <UiBadge :label="{ bad: 'Urgent', warn: 'À faire', info: 'Information', ok: 'Terminé', accent: 'Nouveau', muted: 'Note' }[n.tone]" :tone="n.tone" />
          <time v-if="n.at" class="ui-notif__when" :datetime="n.at">{{ whenLabel(n.at) }}</time>
        </div>
        <h3 class="ui-notif__name">{{ n.title }}</h3>
        <p v-if="n.message" class="ui-notif__text">{{ n.message }}</p>
        <div class="ui-notif__actions">
          <UiButton v-if="n.action" kind="secondary" :to="n.action.to" :href="n.action.href" @click="emit('action', n)">{{ n.action.label }}</UiButton>
          <UiButton v-if="!n.read && !n.sticky" kind="quiet" @click="emit('read', n.id)">Marquer comme lu</UiButton>
          <UiButton v-if="n.dismissible" kind="quiet" @click="emit('dismiss', n.id)">Fermer</UiButton>
        </div>
      </li>
    </ul>
    <UiEmpty v-else-if="!loading" icon="mdi-bell-check-outline" text="Tout est à jour. Rien ne demande votre attention." />
    </template>
  </v-navigation-drawer>
</template>
