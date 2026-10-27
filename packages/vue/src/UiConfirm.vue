<script setup>
import { ref, watch } from 'vue'
import UiButton from './UiButton.vue'
import UiCheckbox from './UiCheckbox.vue'
import UiDialog from './UiDialog.vue'

/*
 * DEMANDER AVANT D'AGIR (Adion UI) : ce qui va se passer, en une phrase, et
 * le bouton qui le fait dit ce qu'il fait - « Revoquer la cle », pas « OK ».
 * `danger` le teinte de rouge ; `tick` exige une case cochee avant (ce qui
 * ne se rattrape pas). Le parent fait le geste sur `confirm` et ferme.
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirmer' },
  cancelLabel: { type: String, default: 'Annuler' },
  danger: { type: Boolean, default: false },
  tick: { type: String, default: '' },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const ticked = ref(false)
watch(() => props.modelValue, (open) => { if (open) ticked.value = false })
</script>

<template>
  <UiDialog :model-value="modelValue" :title="title" :text="text" :busy="busy" :error="error" width="460" @update:model-value="(v) => emit('update:modelValue', v)">
    <slot />
    <UiCheckbox v-if="tick" v-model="ticked" :label="tick" :danger="danger" />
    <template #actions="{ close }">
      <UiButton kind="quiet" :disabled="busy" @click="close">{{ cancelLabel }}</UiButton>
      <UiButton :kind="danger ? 'danger' : 'primary'" :loading="busy" :disabled="Boolean(tick) && !ticked" @click="emit('confirm')">{{ confirmLabel }}</UiButton>
    </template>
  </UiDialog>
</template>
