<script setup>
/*
 * LE POSTE DE TRAVAIL (Adion UI, mode outil, 2026-11-17) : l'ecran d'un
 * operateur qui traite des dossiers a la chaine. Trois volets qui defilent
 * chacun pour soi, sous la barre du haut :
 *
 *   queue     a gauche, la file des dossiers (UiQueue) ;
 *   (defaut)  au centre, le dossier ouvert : son en-tete, puis son fil ;
 *   aside     a droite, ses proprietes (UiPropertyGrid).
 *
 * Sur ecran moyen, les proprietes passent sous le dossier ; sur telephone, la
 * file se reduit a sa barre « precedent / suivant ». A poser dans
 * <UiAppShell tool> : le poste prend toute la place, sans marge.
 */
defineProps({
  /** Le nom du volet central, lu par les lecteurs d'ecran. */
  label: { type: String, default: 'Dossier ouvert' },
})
</script>

<template>
  <div class="ui-workbench" :class="{ 'has-queue': $slots.queue, 'has-aside': $slots.aside }">
    <div v-if="$slots.queue" class="ui-workbench__queue"><slot name="queue" /></div>
    <section class="ui-workbench__main" :aria-label="label"><slot /></section>
    <aside v-if="$slots.aside" class="ui-workbench__aside"><slot name="aside" /></aside>
  </div>
</template>
