<script setup>
import { UiStat } from '@adion-cloud/ui-vue'
</script>

<template>
  <div class="ui-stats">
    <UiStat label="Crédits restants" value="1 240" icon="mdi-wallet-outline" hint="60 consommés ce mois" />
    <UiStat label="Envoyés" value="312" :trend="-8" hint="ce mois" />
    <UiStat label="Dépense" value="6,67 €" :trend="24" :spark="[2, 3, 3, 5, 4, 6, 8]" hint="face au mois dernier" />
  </div>
</template>
