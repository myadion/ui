<script setup>
/*
 * UNE RANGEE DE GESTES EN ICONES (Adion UI, 2026-10-28) : chercher, revenir a
 * l'accueil, la documentation, le theme, la deconnexion... Le kit dessine,
 * l'app dit quels gestes et ce qu'ils font.
 *
 *   items = [{ key, icon, label, to?, href?, external?, tone? }]
 *     to       un lien du routeur (router-link)
 *     href     une adresse ; `external` l'ouvre dans un nouvel onglet
 *     sinon    un bouton : `action` est emis avec la `key`
 *     tone     'danger' : le survol vire au rouge (Se deconnecter)
 *
 * Dans UiTopBar, les gestes sont ronds (32 px) ; ailleurs, carres (28 px).
 */
defineProps({
  items: { type: Array, default: () => [] },
  label: { type: String, default: 'Gestes' },
})
defineEmits(['action'])
</script>

<template>
  <div class="ui-iconactions" role="group" :aria-label="label">
    <template v-for="item in items" :key="item.key">
      <router-link v-if="item.to" :to="item.to" class="ui-iconactions__btn" :class="item.tone && `is-${item.tone}`" :title="item.label" :aria-label="item.label">
        <v-icon :icon="item.icon" size="17" />
      </router-link>
      <a v-else-if="item.href" :href="item.href" class="ui-iconactions__btn" :class="item.tone && `is-${item.tone}`" :title="item.label" :aria-label="item.label" :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noopener' : undefined">
        <v-icon :icon="item.icon" size="16" />
      </a>
      <button v-else type="button" class="ui-iconactions__btn" :class="item.tone && `is-${item.tone}`" :title="item.label" :aria-label="item.label" @click="$emit('action', item.key)">
        <v-icon :icon="item.icon" size="16" />
      </button>
    </template>
  </div>
</template>
