<script setup>
import { computed } from 'vue'
import { BLOCK_TYPES } from './mailBlocks'

/*
 * LE CHOIX D'UN TYPE DE BLOC (Adion UI, repris de MailBlockMenu d'Orbit).
 *
 * Chaque entree dit a quoi elle sert : « Chapeau » ne veut rien dire tant
 * qu'on n'a pas lu « quelques mots en majuscules au-dessus du titre ».
 * Sans `label`, un « + » rond (les points d'insertion du canevas) ; avec, un
 * bouton « + Ajouter un bloc ». `columns` a faux retire les colonnes : pas de
 * colonnes dans une colonne, aucune messagerie n'y survit sur un telephone.
 */
const props = defineProps({
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  columns: { type: Boolean, default: true },
  /** Le « + » rond, plein, des points d'insertion. */
  dot: { type: Boolean, default: false },
})
defineEmits(['pick'])

const choices = computed(() => BLOCK_TYPES.filter((type) => props.columns || !['columns', 'section'].includes(type.value)))
</script>

<template>
  <v-menu :disabled="disabled" location="bottom">
    <template #activator="{ props: activator }">
      <button
        v-if="dot"
        v-bind="activator"
        type="button"
        class="ui-mail-dot"
        :disabled="disabled"
        aria-label="Ajouter un bloc"
        title="Ajouter un bloc"
        @click.stop
      >
        <v-icon icon="mdi-plus" size="16" />
      </button>
      <v-btn
        v-else
        v-bind="activator"
        :variant="label ? 'tonal' : 'text'"
        size="small"
        class="btn-sentence-case ui-btn"
        :icon="!label"
        :prepend-icon="label ? 'mdi-plus' : undefined"
        :disabled="disabled"
        :aria-label="label || 'Ajouter un bloc'"
        :title="label || 'Ajouter un bloc'"
        @click.stop
      >
        <v-icon v-if="!label" icon="mdi-plus" size="18" />
        <template v-else>{{ label }}</template>
      </v-btn>
    </template>
    <div class="ui-mail-menu" role="menu">
      <button
        v-for="type in choices"
        :key="type.value"
        type="button"
        role="menuitem"
        class="ui-mail-menu__item"
        @click="$emit('pick', type.value)"
      >
        <v-icon :icon="type.icon" size="18" />
        <span class="ui-mail-menu__text">
          <span class="ui-mail-menu__title">{{ type.title }}</span>
          <span class="ui-mail-menu__hint">{{ type.hint }}</span>
        </span>
      </button>
    </div>
  </v-menu>
</template>
