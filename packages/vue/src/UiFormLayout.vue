<script setup>
import UiButton from './UiButton.vue'
import UiNotice from './UiNotice.vue'
import UiPage from './UiPage.vue'
import UiPageHeader from './UiPageHeader.vue'

/*
 * LE GABARIT DES REGLAGES ET DES FORMULAIRES SIMPLES (Adion UI) :
 * l'en-tete, puis des sections (UiSection) avec leurs champs alignes, puis la
 * barre d'enregistrement en bas - Annuler et Enregistrer a droite, l'etat a
 * gauche (« Modifications non enregistrees »). La barre reste visible au
 * defilement. Pour des reglages qui s'enregistrent un par un, `inline`
 * retire la barre.
 */
defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  lead: { type: String, default: '' },
  crumbs: { type: Array, default: () => [] },
  dirty: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  saveLabel: { type: String, default: 'Enregistrer' },
  error: { type: String, default: '' },
  notice: { type: String, default: '' },
  inline: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadError: { type: String, default: '' },
  denied: { type: [Boolean, String], default: false },
})
defineEmits(['save', 'cancel', 'retry'])
</script>

<template>
  <UiPage :loading="loading" :denied="denied" :error="loadError" @retry="$emit('retry')">
    <template #header>
      <UiPageHeader :title="title" :eyebrow="eyebrow" :lead="lead" :crumbs="crumbs">
        <template v-if="$slots.actions" #actions><slot name="actions" /></template>
      </UiPageHeader>
    </template>
    <form class="ui-layout__body ui-formlayout" novalidate @submit.prevent="$emit('save')">
      <slot />
      <div v-if="!inline" class="ui-savebar">
        <span class="ui-savebar__state">{{ dirty ? 'Modifications non enregistrées' : 'Tout est enregistré' }}</span>
        <UiNotice v-if="error" tone="bad" :text="error" />
        <UiNotice v-else-if="notice" tone="ok" :text="notice" />
        <UiButton kind="quiet" :disabled="!dirty || saving" @click="$emit('cancel')">Annuler</UiButton>
        <UiButton kind="primary" type="submit" :loading="saving" :disabled="!dirty">{{ saveLabel }}</UiButton>
      </div>
    </form>
  </UiPage>
</template>
