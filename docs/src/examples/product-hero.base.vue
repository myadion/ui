<script setup>
import { ref } from 'vue'
import { UiProductHero, UiSegmented } from '@myadion/ui'

const heroes = [
  {
    "theme": "bubbles",
    "headline": "Un SMS se lit. Toujours. Écrivez à vos clients.",
    "text": "Rappels de rendez-vous, codes, promotions : envoyés sous le nom de votre entreprise, en quelques secondes.",
    "steps": [
      {
        "icon": "mdi-cart-outline",
        "word": "Commandez"
      },
      {
        "icon": "mdi-badge-account-outline",
        "word": "Signez"
      },
      {
        "icon": "mdi-send-outline",
        "word": "Envoyez"
      }
    ]
  },
  {
    "theme": "beams",
    "headline": "La fibre, et vos locaux passent à la vitesse de la lumière.",
    "text": "Un débit qui monte autant qu'il descend, pour téléphoner, sauvegarder et visioconférer sans attendre.",
    "steps": [
      {
        "icon": "mdi-map-marker-check-outline",
        "word": "Testez"
      },
      {
        "icon": "mdi-calendar-check-outline",
        "word": "Raccordez"
      },
      {
        "icon": "mdi-lightning-bolt-outline",
        "word": "Surfez"
      }
    ]
  },
  {
    "theme": "waves",
    "headline": "Gardez vos numéros. Oubliez le cuivre.",
    "text": "Votre standard passe par internet : des appels moins chers, autant de lignes que vous voulez.",
    "steps": [
      {
        "icon": "mdi-phone-voip",
        "word": "Branchez"
      },
      {
        "icon": "mdi-swap-horizontal",
        "word": "Portez"
      },
      {
        "icon": "mdi-phone-in-talk-outline",
        "word": "Appelez"
      }
    ]
  },
  {
    "theme": "grid",
    "headline": "Votre site mérite mieux qu'un hébergement au rabais.",
    "text": "Rapide et sauvegardé chaque jour, avec un certificat et des adresses e-mail compris.",
    "steps": [
      {
        "icon": "mdi-server-outline",
        "word": "Choisissez"
      },
      {
        "icon": "mdi-upload-outline",
        "word": "Déposez"
      },
      {
        "icon": "mdi-earth",
        "word": "Publiez"
      }
    ]
  },
  {
    "theme": "rings",
    "headline": "Votre nom sur internet, avant qu'un autre le prenne.",
    "text": "Cherchez, réservez, et votre domaine est à vous.",
    "steps": [
      {
        "icon": "mdi-magnify",
        "word": "Cherchez"
      },
      {
        "icon": "mdi-bookmark-check-outline",
        "word": "Réservez"
      },
      {
        "icon": "mdi-web",
        "word": "Rayonnez"
      }
    ]
  },
  {
    "theme": "orbs",
    "headline": "Des serveurs en une minute. Payés à l’heure.",
    "text": "Lancez, agrandissez, arrêtez : vous ne payez que ce qui tourne.",
    "steps": [
      {
        "icon": "mdi-map-marker-radius-outline",
        "word": "Placez"
      },
      {
        "icon": "mdi-server-plus-outline",
        "word": "Lancez"
      },
      {
        "icon": "mdi-arrow-expand-all",
        "word": "Grandissez"
      }
    ]
  },
  {
    "theme": "cards",
    "headline": "Encaissez partout. Recevez vite.",
    "text": "Paiement en ligne, lien de paiement ou terminal : l'argent arrive sur votre compte.",
    "steps": [
      {
        "icon": "mdi-store-outline",
        "word": "Ouvrez"
      },
      {
        "icon": "mdi-credit-card-outline",
        "word": "Encaissez"
      },
      {
        "icon": "mdi-bank-transfer-in",
        "word": "Recevez"
      }
    ]
  }
]
const theme = ref('bubbles')
</script>

<template>
  <div style="display: grid; gap: 16px">
    <UiSegmented v-model="theme" :items="heroes.map((h) => ({ value: h.theme, label: h.theme }))" />
    <UiProductHero :hero="heroes.find((h) => h.theme === theme)" price="À partir de 4,99 € HT / mois" order-label="Commander" />
  </div>
</template>
