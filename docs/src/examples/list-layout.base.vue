<script setup>
import { UiListLayout, UiServiceTable, UiStat } from '@myadion/ui'
import { demoServices, productLinks } from './data.js'
</script>

<template>
  <UiListLayout family="Web" title="Mes hébergements" lead="Vos sites, leur disponibilité et leur environnement d’exécution." list-title="Vos sites" :order="['WEB_HOSTING']" :links="productLinks">
    <template #stats>
      <UiStat label="Hébergements" value="4" icon="mdi-web" hint="rattachés à ce projet" />
      <UiStat label="En ligne" value="2" icon="mdi-check-circle-outline" hint="sur 4" />
      <UiStat label="Visites" value="18 452" icon="mdi-chart-line" :trend="12" higher-is-better hint="ce mois" />
    </template>
    <UiServiceTable :services="demoServices" :to="() => '#'" pref-key="doc-services" />
  </UiListLayout>
</template>
