<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { contextFromRoute } from './context'
import UiDenied from './UiDenied.vue'
import UiEmpty from './UiEmpty.vue'
import UiError from './UiError.vue'
import UiLoading from './UiLoading.vue'

/*
 * UNE PAGE ET SES ETATS (Adion UI). Chaque ecran gerait a sa maniere le
 * premier chargement, le refus, l'erreur et l'adresse qui ne mene a rien ;
 * certains les oubliaient. Ici, dans cet ordre :
 *
 *   loading  le premier chargement - pas un rechargement, qui garde la page ;
 *   denied   le role ne permet pas (`denied` vaut true, ou ce qu'on ne peut
 *            pas consulter : « les services SMS de ce projet ») ;
 *   missing  la chose n'existe pas, ou pas dans ce projet ;
 *   error    l'API n'a pas repondu : le message et Reessayer.
 *
 * Les gabarits (UiListLayout, UiDetailLayout…) l'emploient : un ecran de
 * produit ne s'en sert pas directement.
 */
defineProps({
  loading: { type: Boolean, default: false },
  denied: { type: [Boolean, String], default: false },
  missing: { type: String, default: '' },
  missingTo: { type: [String, Object], default: '' },
  missingLabel: { type: String, default: 'Retour à la liste' },
  error: { type: String, default: '' },
})
defineEmits(['retry'])

/*
 * LE CONTEXTE VIENT DE L'ADRESSE (2026-10-13). Le routeur applique
 * /account/{compte}/project/{projet}/… au store avant d'ouvrir la page ; la
 * page n'a qu'a le lire.
 */
const route = useRoute()
const context = computed(() => contextFromRoute(route))
defineExpose({ context })
</script>

<template>
  <div class="ui-page">
    <slot name="header" />
    <UiLoading v-if="loading" variant="page" />
    <UiDenied v-else-if="denied" :what="typeof denied === 'string' ? denied : undefined" />
    <UiEmpty v-else-if="missing" :text="missing" icon="mdi-help-circle-outline">
      <template v-if="missingTo" #actions>
        <v-btn variant="tonal" size="small" class="btn-sentence-case" :to="missingTo">{{ missingLabel }}</v-btn>
      </template>
    </UiEmpty>
    <UiError v-else-if="error" :message="error" @retry="$emit('retry')" />
    <slot v-else />
  </div>
</template>
