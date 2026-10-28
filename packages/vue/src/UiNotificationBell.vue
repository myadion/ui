<script setup>
import { computed } from 'vue'

/*
 * LA CLOCHE (Adion UI) : en haut a droite, hors de la barre
 * de navigation, avec le nombre de notifications non lues. Un clic ouvre le
 * volet (UiNotificationDrawer).
 */
const props = defineProps({
  count: { type: Number, default: 0 },
  open: { type: Boolean, default: false },
})
defineEmits(['click'])
const label = computed(() => (props.count ? `Notifications, ${props.count} non lue${props.count > 1 ? 's' : ''}` : 'Notifications'))
</script>

<template>
  <button type="button" class="ui-bell" :class="{ 'has-unread': count > 0 }" :aria-label="label" :title="label" aria-haspopup="dialog" :aria-expanded="open" @click="$emit('click')">
    <v-icon :icon="count ? 'mdi-bell-ring-outline' : 'mdi-bell-outline'" size="20" />
    <span v-if="count" class="ui-bell__count" aria-hidden="true">{{ count > 9 ? '9+' : count }}</span>
  </button>
</template>
