<script setup>
/*
 * LA CARTE SIM DESSINEE (Adion UI, 2026-10-29) : la puce, l'encoche, le mot
 * SIM ou eSIM et les barres de signal, sur un halo vert (ambre si bloquee).
 *
 *   blocked  la ligne est suspendue
 *   esim     une eSIM
 *   compact  plus petite, pour une liste
 */
defineProps({
  blocked: { type: Boolean, default: false },
  esim: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <div class="ui-sim" :class="{ 'is-blocked': blocked, 'is-compact': compact }" aria-hidden="true">
    <div class="ui-sim__glow"></div>
    <div class="ui-sim__card">
      <div class="ui-sim__corner"></div>
      <div class="ui-sim__chip"><span></span><span></span><span></span><span></span></div>
      <div class="ui-sim__label">{{ esim ? 'eSIM' : 'SIM' }}</div>
    </div>
    <div class="ui-sim__signal"><span></span><span></span><span></span><span></span></div>
  </div>
</template>
