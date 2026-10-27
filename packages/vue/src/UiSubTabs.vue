<script setup>
/*
 * LES ONGLETS D'UN ONGLET (Adion UI), repris d'AdionSubTabs : de petits
 * boutons droits, en minuscules, pour qu'on lise tout de suite qu'ils vivent
 * a l'interieur des onglets du haut.
 */
defineProps({
  /** @type {Array<{id:string,label:string,count?:number|string,icon?:string}>} */
  tabs: { type: Array, required: true },
  modelValue: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="ui-subtabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="ui-subtabs__item"
      :class="{ 'is-active': modelValue === tab.id }"
      :aria-selected="modelValue === tab.id"
      @click="$emit('update:modelValue', tab.id)"
    >
      <v-icon v-if="tab.icon" :icon="tab.icon" size="15" />
      {{ tab.label }}
      <span v-if="tab.count !== undefined && tab.count !== null && tab.count !== ''" class="ui-tabs__count">{{ tab.count }}</span>
    </button>
  </div>
</template>
