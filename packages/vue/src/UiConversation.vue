<script setup>
/*
 * UNE CONVERSATION PLEIN ECRAN (Adion UI, 2026-10-29) : une question a la
 * fois, un fil qui avance, et chaque question qui entre en douceur (par le
 * bas, par le haut au retour). La question reste a la meme hauteur.
 *
 *   progress  l'avancement, de 0 a 100
 *   step      la cle de la question (change = transition)
 *   back      vrai quand on revient en arriere
 */
defineProps({
  progress: { type: Number, default: 0 },
  step: { type: [String, Number], default: '' },
  back: { type: Boolean, default: false },
})
</script>

<template>
  <div class="ui-conv">
    <div class="ui-conv__bar" aria-hidden="true">
      <div class="ui-conv__fill" :style="{ width: `${progress}%` }" />
    </div>
    <div class="ui-conv__stage">
      <Transition :name="back ? 'ui-conv-back' : 'ui-conv'" mode="out-in">
        <section :key="step" class="ui-conv__screen"><slot /></section>
      </Transition>
    </div>
  </div>
</template>
