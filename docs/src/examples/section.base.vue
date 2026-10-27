<script setup>
import { UiButton, UiList, UiSection } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiSection title="Règles d’envoi" lead="Une section porte le rythme d’une page : un titre, une phrase, puis son contenu.">
    <template #actions><UiButton kind="quiet" icon="mdi-plus">Ajouter une règle</UiButton></template>
    <UiList :items="[{ text: 'Un SMS commercial part du lundi au samedi, de 8 h à 20 h.' }, { text: 'Les crédits ne périment pas tant que le service est actif.' }]" />
  </UiSection>
</template>
