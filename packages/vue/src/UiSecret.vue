<script setup>
import { computed, ref } from 'vue'
import UiButton from './UiButton.vue'
import UiNotice from './UiNotice.vue'

/*
 * UN SECRET MONTRE UNE SEULE FOIS (Adion UI) : une cle d'API, le secret
 * d'une application. L'API n'en garde que l'empreinte ; l'ecran le montre
 * masque, avec Afficher et Copier, et dit qu'il ne reviendra pas. « C'est
 * note » le referme pour de bon (`done`).
 */
const props = defineProps({
  secret: { type: String, required: true },
  title: { type: String, default: 'À copier maintenant : il ne s’affichera plus.' },
})
const emit = defineEmits(['done'])

const shown = ref(false)
const copied = ref(false)
const masked = computed(() => (shown.value ? props.secret : `${props.secret.slice(0, 6)}${'•'.repeat(Math.max(8, props.secret.length - 6))}`))

async function copy() {
  try {
    await navigator.clipboard.writeText(props.secret)
    copied.value = true
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <UiNotice tone="warn" icon="mdi-key-outline" :title="title">
    <span class="ui-code is-inline"><pre>{{ masked }}</pre></span>
    <template #actions>
      <UiButton kind="quiet" :icon="shown ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click="shown = !shown">{{ shown ? 'Masquer' : 'Afficher' }}</UiButton>
      <UiButton kind="secondary" :icon="copied ? 'mdi-check' : 'mdi-content-copy'" @click="copy">{{ copied ? 'Copié' : 'Copier' }}</UiButton>
      <UiButton kind="quiet" @click="emit('done')">C’est noté</UiButton>
    </template>
  </UiNotice>
</template>
