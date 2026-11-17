<script setup>
/*
 * UNE PAGE EN MODE OUTIL, SANS LA COQUE DU KIT (Adion UI, 2026-11-17). Pour
 * une application qui garde sa propre coque (Orbit : ses onglets de pages, son
 * bureau a fenetres) : la page prend les memes reglages que sous
 * <UiAppShell tool>. `flush` retire la marge, pour un poste de travail.
 *
 * `--ui-tool-top` (sur la page ou plus haut) dit a quelle hauteur colle ce qui
 * reste en haut d'un poste de travail ; 0 quand la page defile dans son cadre.
 */
defineProps({
  flush: { type: Boolean, default: false },
})
</script>

<template>
  <div class="ui-tool ui-page" :class="{ 'is-flush': flush }"><slot /></div>
</template>
