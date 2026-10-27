<script setup>
import { tone } from './tone'

/*
 * UNE FRISE (Adion UI) : ce qui s'est passe, du plus recent au plus ancien -
 * un journal d'activite, l'avancement d'une commande, l'historique d'une
 * ligne. items : [{ id, at, title, text, tone }] ; `at` deja mis en forme.
 */
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <ol class="ui-timeline">
    <li v-for="(item, index) in items" :key="item.id || index" class="ui-timeline__item" :class="`is-tone-${tone(item.tone || 'accent')}`">
      <span class="ui-timeline__dot" aria-hidden="true" />
      <div class="ui-timeline__body">
        <span class="ui-timeline__title"><slot name="title" :item="item">{{ item.title }}</slot></span>
        <p v-if="item.text" class="ui-timeline__text">{{ item.text }}</p>
        <span v-if="item.at" class="ui-timeline__at">{{ item.at }}</span>
      </div>
    </li>
  </ol>
</template>
