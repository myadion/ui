<script setup>
import { computed } from 'vue'

/*
 * TROIS OU QUATRE BENEFICES (Adion UI, 2026-10-14) : une icone coloree, un
 * titre court, une phrase. items : [{ icon, title, text }]. La couleur vient
 * de la famille (`family`) ou du UiHero qui l'entoure.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  family: { type: String, default: '' },
})
const cols = computed(() => Math.min(Math.max(props.items.length, 1), 4))
</script>

<template>
  <ul class="ui-features" :class="family ? `ui-fam-${family}` : ''" :style="{ '--ui-features-cols': cols }" role="list">
    <li v-for="(item, index) in items" :key="item.title || index" class="ui-feature">
      <span class="ui-feature__icon" aria-hidden="true"><v-icon :icon="item.icon || 'mdi-check'" size="22" /></span>
      <div>
        <p class="ui-feature__title">{{ item.title }}</p>
        <p v-if="item.text" class="ui-feature__text">{{ item.text }}</p>
      </div>
    </li>
  </ul>
</template>
