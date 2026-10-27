<script setup>
import UiPage from './UiPage.vue'
import UiPageHeader from './UiPageHeader.vue'
import UiWizard from './UiWizard.vue'

/*
 * LE GABARIT D'UNE COMMANDE OU D'UNE OUVERTURE PAR ETAPES (Adion UI) :
 * l'en-tete (fil d'Ariane, titre), puis l'assistant - les etapes a gauche
 * (en haut sur telephone), la question et ses champs au centre, le
 * recapitulatif a droite (`aside`), Precedent et Suivant en bas, toujours au
 * meme endroit. Les evenements de UiWizard remontent tels quels.
 */
defineProps({
  title: { type: String, required: true },
  crumbs: { type: Array, default: () => [] },
  eyebrow: { type: String, default: '' },
  steps: { type: Array, required: true },
  step: { type: String, required: true },
  question: { type: String, default: '' },
  hint: { type: String, default: '' },
  busy: { type: Boolean, default: false },
  canNext: { type: Boolean, default: true },
  nextLabel: { type: String, default: 'Suivant' },
  finishLabel: { type: String, default: 'Terminer' },
  error: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  loadError: { type: String, default: '' },
  denied: { type: [Boolean, String], default: false },
})
defineEmits(['update:step', 'next', 'back', 'finish', 'retry'])
</script>

<template>
  <UiPage :loading="loading" :denied="denied" :error="loadError" @retry="$emit('retry')">
    <template #header>
      <UiPageHeader :title="title" :eyebrow="eyebrow" :crumbs="crumbs">
        <template v-if="$slots.actions" #actions><slot name="actions" /></template>
      </UiPageHeader>
    </template>
    <div class="ui-section is-first">
      <UiWizard
        :steps="steps"
        :model-value="step"
        :question="question"
        :hint="hint"
        :busy="busy"
        :can-next="canNext"
        :next-label="nextLabel"
        :finish-label="finishLabel"
        :error="error"
        @update:model-value="(v) => $emit('update:step', v)"
        @next="$emit('next')"
        @back="$emit('back')"
        @finish="$emit('finish')"
      >
        <slot />
        <template v-if="$slots.aside" #aside><slot name="aside" /></template>
      </UiWizard>
    </div>
  </UiPage>
</template>
