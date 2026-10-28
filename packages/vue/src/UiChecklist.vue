<script setup>
import { computed } from 'vue'

/*
 * UNE LISTE DE CONTROLE (Adion UI) : chaque condition avant d'agir (un envoi),
 * prete ou a faire, avec la raison que l'API donne. `items` = [{ key, label,
 * ready, reason?, tone? }]. Une condition a faire dit pourquoi et reste
 * lisible sans la couleur (icone et mot « A faire »). `blocking` : tout ce qui
 * n'est pas pret bloque (rouge) ; sinon c'est une alerte (orange).
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  blocking: { type: Boolean, default: true },
  title: { type: String, default: '' },
})

const done = computed(() => props.items.filter((i) => i.ready).length)
const complete = computed(() => props.items.length > 0 && done.value === props.items.length)
const toneOf = (item) => (item.ready ? 'ok' : item.tone || (props.blocking ? 'bad' : 'warn'))
const iconOf = (item) => (item.ready ? 'mdi-check-circle' : props.blocking ? 'mdi-close-circle-outline' : 'mdi-alert-outline')
</script>

<template>
  <section class="ui-check" :aria-label="title || 'Conditions'">
    <header class="ui-check__head">
      <strong v-if="title">{{ title }}</strong>
      <span class="ui-check__count" :class="complete ? 'is-tone-ok' : 'is-tone-muted'">{{ done }} sur {{ items.length }} prêtes</span>
    </header>
    <ul class="ui-check__list">
      <li v-for="item in items" :key="item.key ?? item.label" class="ui-check__item" :class="`is-tone-${toneOf(item)}`">
        <v-icon :icon="iconOf(item)" size="18" class="ui-check__icon" aria-hidden="true" />
        <span class="ui-check__text">
          {{ item.label }}
          <small v-if="item.reason">{{ item.reason }}</small>
        </span>
        <span class="ui-check__state">{{ item.ready ? 'Prête' : 'À faire' }}</span>
      </li>
    </ul>
  </section>
</template>
