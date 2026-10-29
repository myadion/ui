<script setup>
/*
 * CE QUI FLOTTE EN BAS A DROITE (Adion UI, 2026-10-29) : une pastille
 * (launcher) et l'invitation qui monte au-dessus d'elle (invite), sans rien
 * recouvrir d'important. Avec <Transition name="ui-rise"> pour l'entree.
 *
 *   place  launcher ou invite
 */
defineProps({
  place: { type: String, default: 'launcher' },
})
</script>

<template>
  <aside class="ui-float" :class="`is-${place}`"><slot /></aside>
</template>
