<script setup>
import { UiButton, UiFeatureGrid, UiHero } from '@adion-cloud/ui-vue'

const benefits = [
  { icon: 'mdi-rocket-launch-outline', title: 'En ligne en une minute', text: 'Votre site, son certificat et son domaine, prêts sans réglage.' },
  { icon: 'mdi-shield-check-outline', title: 'Sauvegardé chaque nuit', text: 'Revenez en arrière d’un clic, sans ticket.' },
  { icon: 'mdi-headset', title: 'Des humains au bout du fil', text: 'Une équipe à Toulouse, joignable par téléphone.' },
]
</script>

<template>
  <UiHero family="web" eyebrow="Hébergement web" icon="mdi-web" title="Votre site en ligne, sans y penser" promise="Un hébergement rapide, sauvegardé chaque nuit, avec son nom de domaine et ses adresses e-mail.">
    <template #actions><UiButton kind="primary" icon="mdi-plus">Commander un hébergement</UiButton></template>
    <template #foot><UiFeatureGrid family="web" :items="benefits" /></template>
  </UiHero>
</template>
