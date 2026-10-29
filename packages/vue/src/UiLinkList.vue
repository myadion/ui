<script setup>
/*
 * DES RACCOURCIS (Adion UI, 2026-10-29, d'apres /maquette) : une ligne par
 * destination, sa tuile d'icone teintee, son libelle, une aide courte et la
 * fleche. Pour les portes d'entree d'un accueil, d'une page introuvable, ou
 * les elements reseau d'un projet.
 *
 *   items = [{ key, icon, label, hint?, to?, href?, external?, tone? }]
 *     tone : brand (defaut), info, accent, ok, warn, bad, muted
 *   Sans `to` ni `href`, la ligne est un bouton : `select` est emis avec la `key`.
 */
defineProps({
  items: { type: Array, default: () => [] },
})
defineEmits(['select'])
</script>

<template>
  <ul class="ui-links">
    <li v-for="item in items" :key="item.key || item.label">
      <component
        :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
        :to="item.to || undefined"
        :href="item.href || undefined"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener' : undefined"
        :type="item.to || item.href ? undefined : 'button'"
        class="ui-links__row"
        @click="!item.to && !item.href && $emit('select', item.key)"
      >
        <span v-if="item.icon" class="ui-links__icon" :class="`is-tone-${item.tone || 'brand'}`"><v-icon :icon="item.icon" size="16" /></span>
        <span class="ui-links__text"><strong>{{ item.label }}</strong><small v-if="item.hint">{{ item.hint }}</small></span>
        <v-icon :icon="item.external ? 'mdi-open-in-new' : 'mdi-chevron-right'" size="16" class="ui-links__go" />
      </component>
    </li>
  </ul>
</template>
