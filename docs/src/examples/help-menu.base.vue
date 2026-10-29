<script setup>
import { UiHelpMenu } from '@myadion/ui'

const items = [
  { key: 'link', icon: 'mdi-email-alert-outline', question: 'Le lien n’arrive pas', answer: 'Il part en quelques secondes. Regardez dans les courriers indésirables, puis utilisez « Renvoyer le lien ».' },
  { key: 'expired', icon: 'mdi-timer-sand-complete', question: 'Le lien ne fonctionne plus', answer: 'Un lien ne sert qu’une fois et expire au bout de 15 minutes : demandez-en un nouveau.' },
  { key: 'support', icon: 'mdi-lifebuoy', question: 'Je n’ai plus accès à mon e-mail', answer: 'L’assistance vérifie votre identité, puis met à jour vos coordonnées.', links: [{ label: '01 88 33 13 03', href: 'tel:+33188331303' }] },
]
</script>

<template>
  <UiHelpMenu :items="items" />
</template>
