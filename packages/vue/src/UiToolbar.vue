<script setup>
/*
 * LA BARRE D'OUTILS D'UNE LISTE (Adion UI) : la recherche a gauche, les
 * filtres a sa suite, les gestes a droite. UiTable la pose d'elle-meme ;
 * on ne s'en sert seul que pour une liste qui n'est pas un tableau.
 */
defineProps({
  search: { type: String, default: null },
  placeholder: { type: String, default: 'Rechercher' },
})
const emit = defineEmits(['update:search', 'submit'])
</script>

<template>
  <div class="ui-toolbar">
    <v-text-field
      v-if="search !== null"
      :model-value="search"
      :placeholder="placeholder"
      :aria-label="placeholder"
      prepend-inner-icon="mdi-magnify"
      density="compact"
      variant="outlined"
      hide-details
      clearable
      class="ui-control ui-toolbar__search"
      @update:model-value="(v) => emit('update:search', v || '')"
      @keyup.enter="emit('submit')"
    />
    <slot name="filters" />
    <span class="ui-toolbar__spacer" />
    <slot />
  </div>
</template>
