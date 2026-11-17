<script setup>
/*
 * UNE VALEUR QUI ARRIVE (Adion UI, Kevin le 2026-11-17 : « je préfère que
 * chaque champ dépendant d'une API soit loading »). Plus de voile ni de
 * squelette de page entière : la page se dessine tout de suite, et chaque
 * valeur que Nexus n'a pas encore rendue tient sa place par un trait qui luit,
 * a sa taille. Rien ne bouge quand la valeur arrive.
 *
 *   size   text (par defaut), title (le nom d'une fiche), stat (un chiffre),
 *          line (une ligne de tableau ou de liste) ;
 *   width  la longueur du trait (« 8em », « 60% ») ; par defaut, celle de la taille ;
 *   lines  plusieurs traits empiles (le corps d'une section, une liste).
 *
 * Les composants qui affichent une valeur (UiKeyValue, UiStat, UiSection,
 * UiPageHeader, UiTable) l'emploient d'eux-memes avec leur `loading` ; un
 * ecran ne s'en sert que dans un creneau qu'il dessine lui-meme.
 */
const props = defineProps({
  size: { type: String, default: 'text' },
  width: { type: String, default: '' },
  lines: { type: Number, default: 1 },
})
const WIDTHS = ['92%', '78%', '64%', '86%', '70%']
const widthOf = (index) => props.width || (props.lines > 1 ? WIDTHS[index % WIDTHS.length] : '')
</script>

<template>
  <span v-if="lines <= 1" class="ui-skel" :class="`is-${size}`" :style="width ? { width } : undefined" aria-busy="true" aria-label="Chargement" />
  <span v-else class="ui-skel__stack" aria-busy="true" aria-label="Chargement">
    <span v-for="index in lines" :key="index" class="ui-skel" :class="`is-${size}`" :style="{ width: widthOf(index - 1) }" />
  </span>
</template>
