<script setup>
import { UiList, UiSection } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiSection title="Une section repliable" lead="collapsible : le titre ouvre et ferme ; pour des règles qu’on relit au besoin." collapsible>
    <UiList :items="[{ text: 'Un SMS commercial part du lundi au samedi, de 8 h à 20 h.' }, { text: 'Les crédits ne périment pas tant que le service est actif.' }]" />
  </UiSection>
</template>
