<script setup>
import { onBeforeUnmount, watch } from 'vue'

/*
 * LE BANDEAU DE L'EQUIPE (Adion UI, 2026-10-29) : fixe en haut de page, il
 * decale la page de sa hauteur (classe ui-staff-banner-on sur <html>) ; ce qui
 * colle en haut colle sous lui. L'ambre en consultation, le rouge quand on agit
 * a la place du client. Cousin de UiSandboxBanner, qui n'est pas fixe.
 *
 *   tone   warn ou bad
 *   icon   l'icone a gauche
 *   text   ce qui se passe
 *   time   le temps restant (masque sur telephone)
 *   slot actions : les gestes (UiButton)
 */
const props = defineProps({
  tone: { type: String, default: 'warn' },
  icon: { type: String, default: 'mdi-eye-outline' },
  text: { type: String, default: '' },
  time: { type: String, default: '' },
})

const root = typeof document !== 'undefined' ? document.documentElement : null
watch(() => props.text, () => root?.classList.add('ui-staff-banner-on'), { immediate: true })
onBeforeUnmount(() => root?.classList.remove('ui-staff-banner-on'))
</script>

<template>
  <div class="ui-staff-banner" :class="`is-tone-${tone}`" role="status" aria-live="polite">
    <v-icon :icon="icon" size="18" />
    <strong class="ui-staff-banner__text">{{ text }}</strong>
    <span v-if="time" class="ui-staff-banner__time">· {{ time }}</span>
    <span class="ui-staff-banner__actions"><slot name="actions" /></span>
  </div>
</template>
