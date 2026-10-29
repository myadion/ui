<script setup>
import { UiProductPitch } from '@myadion/ui'

const pitch = {
  tagline: 'La fibre, c’est l’accès internet de vos locaux.',
  lead: 'Le lien physique entre votre bureau et le réseau : la téléphonie passe dessus, les sauvegardes aussi.',
  price: 'À partir de 49,99 € HT / mois',
  offers: [
    { key: 'a', label: 'Fibre pro', price: { from: true, amount: '49,99 €', suffix: 'HT / mois' }, includes: ['1 Gb/s symétrique', 'IP fixe'], recommended: true },
    { key: 'b', label: 'Fibre dédiée', price: { from: true, amount: '290,00 €', suffix: 'HT / mois' }, includes: ['Débit garanti', 'Rétablissement en 4 h'] },
  ],
  steps: [
    { title: 'Nous testons l’adresse', text: 'L’éligibilité se vérifie sur l’adresse exacte des locaux.' },
    { title: 'Le raccordement est planifié', text: 'Un technicien passe, sur rendez-vous.' },
    { title: 'L’accès est mis en service', text: 'Le routeur est livré configuré.' },
  ],
  body: ['Regardez la montée avant la descente : c’est elle qui compte pour la téléphonie et la visioconférence.'],
  caveat: 'Ne résiliez pas votre accès actuel avant que le nouveau ne fonctionne.',
}
</script>

<template>
  <UiProductPitch :pitch="pitch" order-label="Commander un accès fibre" />
</template>
