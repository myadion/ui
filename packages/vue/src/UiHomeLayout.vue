<script setup>
import UiPage from './UiPage.vue'
import UiPageHeader from './UiPageHeader.vue'

/*
 * LE GABARIT DE L'ACCUEIL (Adion UI) : souhaiter la bienvenue
 * confortablement a nos clients. Un mot de bienvenue, puis des sections espacees :
 * l'attention du client, ses services en un coup d'oeil, quelques raccourcis.
 * Pas de tableau, rien de technique ; beaucoup d'air (`ui-home`).
 */
defineProps({
  context: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
defineEmits(['retry'])
</script>

<template>
  <UiPage :loading="loading" :error="error" class="ui-home" @retry="$emit('retry')">
    <template #header>
      <UiPageHeader :eyebrow="context" :title="title" :lead="lead" class="ui-home__welcome" />
    </template>
    <div class="ui-home__body"><slot /></div>
  </UiPage>
</template>
