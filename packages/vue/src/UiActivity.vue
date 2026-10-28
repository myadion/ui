<script setup>
/*
 * L'ACTIVITE (Adion UI, 2026-10-28, d'apres /maquette) : ce qui vient de se
 * passer, du plus recent au plus ancien. Chaque evenement a sa tuile d'icone,
 * teintee par son ton (brand, info, ok, warn, bad, accent, muted).
 *
 *   items = [{ id, icon, title, meta?, tone? }]   meta : « Kevin Paly · il y a 2 min »
 */
defineProps({
  items: { type: Array, default: () => [] },
  empty: { type: String, default: 'Rien de nouveau.' },
})
</script>

<template>
  <ol v-if="items.length" class="ui-activity">
    <li v-for="item in items" :key="item.id">
      <span class="ui-activity__icon" :class="`is-tone-${item.tone || 'muted'}`"><v-icon :icon="item.icon || 'mdi-circle-small'" size="15" /></span>
      <span class="ui-activity__text"><strong>{{ item.title }}</strong><small v-if="item.meta">{{ item.meta }}</small></span>
    </li>
  </ol>
  <p v-else class="ui-activity__empty">{{ empty }}</p>
</template>
