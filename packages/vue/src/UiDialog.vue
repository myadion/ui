<script setup>
import { useDisplay } from 'vuetify'
import UiNotice from './UiNotice.vue'

/*
 * UNE FENETRE (Adion UI) : le titre, une phrase, le contenu, les boutons en
 * bas a droite - Annuler a gauche de l'action. Plein ecran sur un telephone.
 * Tant que `busy`, elle ne se ferme ni au clic dehors ni a Echap : une
 * action en cours ne s'abandonne pas par megarde.
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  text: { type: String, default: '' },
  error: { type: String, default: '' },
  width: { type: [Number, String], default: 520 },
  busy: { type: Boolean, default: false },
  /* Une question courte : reste une petite fenetre sur telephone, sans plein ecran. */
  compact: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const { smAndDown } = useDisplay()

function close() {
  if (!props.busy) emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="width"
    :fullscreen="smAndDown && !compact"
    :persistent="busy"
    scrollable
    @update:model-value="(v) => (v ? emit('update:modelValue', true) : close())"
  >
    <section class="ui-dialog" role="dialog" :aria-label="title">
      <header class="ui-dialog__head">
        <h2 class="ui-dialog__title"><v-icon v-if="icon" :icon="icon" size="20" />{{ title }}</h2>
        <button type="button" class="ui-dialog__close" aria-label="Fermer" title="Fermer" :disabled="busy" @click="close">
          <v-icon icon="mdi-close" size="18" />
        </button>
      </header>
      <p v-if="text" class="ui-dialog__text">{{ text }}</p>
      <div v-if="$slots.default" class="ui-dialog__body"><slot /></div>
      <UiNotice v-if="error" tone="bad" :text="error" />
      <footer v-if="$slots.actions" class="ui-dialog__actions"><slot name="actions" :close="close" /></footer>
    </section>
  </v-dialog>
</template>
