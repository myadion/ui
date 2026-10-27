<script setup>
import { ref } from 'vue'

/*
 * DEPOSER UNE IMAGE (Adion UI, 2026-10-15) : une zone ou l'on glisse un
 * fichier, ou que l'on clique pour le choisir. Seules les images que les
 * messageries affichent passent (PNG, JPEG, GIF, WebP), 5 Mo au plus ; Nexus
 * le verifie aussi, et prepare l'image pour le courriel.
 *
 * Le composant ne depose rien : il rend le fichier (`file`), l'ecran sait a
 * qui l'envoyer. `busy` pendant l'envoi.
 */
const props = defineProps({
  busy: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  text: { type: String, default: 'Glissez une image ici, ou cliquez pour la choisir' },
})
const emit = defineEmits(['file', 'error'])

const TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
const MAX = 5 * 1024 * 1024
const input = ref(null)
const over = ref(false)

function take(files) {
  const file = [...(files || [])].find((f) => f && f.type?.startsWith('image/'))
  if (!file) return emit('error', 'Seules les images PNG, JPEG, GIF et WebP s’affichent dans un courriel.')
  if (!TYPES.includes(file.type)) return emit('error', 'Seules les images PNG, JPEG, GIF et WebP s’affichent dans un courriel.')
  if (file.size > MAX) return emit('error', 'Une image de courriel ne dépasse pas 5 Mo.')
  emit('file', file)
}

function onDrop(event) {
  over.value = false
  if (props.disabled || props.busy) return
  take(event.dataTransfer?.files)
}

function onPick(event) {
  take(event.target.files)
  event.target.value = ''
}
</script>

<template>
  <div
    class="ui-mail-drop"
    :class="{ 'is-over': over, 'is-compact': compact, 'is-disabled': disabled }"
    role="button"
    tabindex="0"
    :aria-disabled="disabled || busy"
    @click="!disabled && !busy && input?.click()"
    @keydown.enter.prevent="!disabled && !busy && input?.click()"
    @dragover.prevent="over = !disabled"
    @dragleave="over = false"
    @drop.prevent="onDrop"
  >
    <v-progress-circular v-if="busy" indeterminate size="18" />
    <v-icon v-else icon="mdi-tray-arrow-up" size="20" />
    <span>{{ busy ? 'Envoi et préparation de l’image…' : text }}</span>
    <input ref="input" type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden @change="onPick">
  </div>
</template>
