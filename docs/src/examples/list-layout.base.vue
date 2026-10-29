<script setup>
import { UiListLayout, UiServiceTable } from '@myadion/ui'
import { demoServices, productLinks } from './data.js'
</script>

<template>
  <UiListLayout family="Web" title="Mes hébergements" lead="Vos sites, leur disponibilité et leur environnement d’exécution." list-title="Vos sites" :order="['WEB_HOSTING']" :links="productLinks">
    <UiServiceTable :services="demoServices" :to="() => '#'" pref-key="doc-services" />
  </UiListLayout>
</template>
