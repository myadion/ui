<script setup>
import { UiProductPitch } from '@myadion/ui'

const pitch = {
  lead: 'La fibre, c’est l’accès internet de vos locaux : le lien physique entre votre bureau et le réseau.',
  price: 'À partir de 49,99 € HT / mois',
  offers: [
    { key: 'a', label: 'Fibre pro', price: 'À partir de 49,99 € HT / mois', text: 'Débit garanti, adresse IP fixe.', recommended: true },
    { key: 'b', label: 'Fibre dédiée', price: 'À partir de 290,00 € HT / mois', text: 'Un débit qui n’est qu’à vous.' },
  ],
  steps: [
    { title: 'Nous testons l’adresse', text: 'L’éligibilité se vérifie sur l’adresse exacte des locaux.' },
    { title: 'Le raccordement est planifié', text: 'Un technicien passe, sur rendez-vous.' },
  ],
  caveat: 'Ne résiliez pas votre accès actuel avant que le nouveau ne fonctionne.',
}
</script>

<template>
  <UiProductPitch :pitch="pitch" order-label="Commander un accès fibre" />
</template>
