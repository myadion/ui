<script setup>
import { computed } from 'vue'
import UiButton from './UiButton.vue'
import { menuItems } from './actions'

/*
 * LE MENU D'ACTIONS D'UNE FICHE (Adion UI) : un bouton
 * « Actions » a droite de l'en-tete, tout a droite apres les gestes du
 * produit. L'API envoie la liste sur chaque service ; le composant l'affiche
 * telle quelle :
 *
 *   actions  [{ key, label, icon?, available, reason?, danger?, to? }]
 *            - une action indisponible est grisee, sa raison dite dessous ;
 *            - `danger` (Resilier) va en bas, en rouge, apres un separateur ;
 *   action   emis avec la `key` choisie : l'ecran ouvre le parcours (migrer,
 *            changer d'offre, ServiceTermination...). Une action avec `to`
 *            navigue d'elle-meme.
 *
 * Aucune liste en dur dans la page : chaque produit decide ce qu'il garde.
 */
const props = defineProps({
  actions: { type: Array, default: () => [] },
  label: { type: String, default: 'Actions' },
  /** Le bouton du menu : `secondary` avec son libelle, ou `quiet` en icone seule (`icon`). */
  icon: { type: String, default: '' },
})
const emit = defineEmits(['action'])
const items = computed(() => menuItems(props.actions))
const empty = computed(() => !items.value.length)
</script>

<template>
  <v-menu v-if="!empty" location="bottom end">
    <template #activator="{ props: on }">
      <UiButton v-bind="on" kind="secondary" :icon="icon || undefined" append-icon="mdi-chevron-down">{{ label }}</UiButton>
    </template>
    <div class="ui-actionmenu" role="menu" :aria-label="label">
      <template v-for="item in items" :key="item.key">
        <div v-if="item.sep" class="ui-actionmenu__sep" role="separator" />
        <component
          :is="item.href && item.available ? 'a' : item.to && item.available ? 'router-link' : 'button'"
          :href="item.href && item.available ? item.href : undefined"
          :target="item.href && item.available ? '_blank' : undefined"
          :rel="item.href && item.available ? 'noopener' : undefined"
          :to="item.to && item.available && !item.href ? item.to : undefined"
          :type="(item.to || item.href) && item.available ? undefined : 'button'"
          role="menuitem"
          class="ui-actionmenu__item"
          :class="{ 'is-danger': item.danger, 'is-disabled': !item.available }"
          :aria-disabled="!item.available || undefined"
          :title="!item.available ? item.reason || '' : ''"
          @click="item.available && !item.to && !item.href && emit('action', item.key)"
        >
          <v-icon :icon="item.icon" size="18" />
          <span class="ui-actionmenu__text">
            {{ item.label }}
            <small v-if="!item.available && item.reason">{{ item.reason }}</small>
          </span>
        </component>
      </template>
    </div>
  </v-menu>
</template>
