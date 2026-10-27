<script setup>
import { UiOrderBlock } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiOrderBlock title="Pas de service SMS dans ce projet" text="Commandez le service SMS avec un paquet pour ajouter le SMS à vos campagnes." :offers="[{ offer_id: 'o1', name: 'Adion SMS', description: 'Vos crédits, votre expéditeur, votre liste STOP.', packs: [{ pack: '1000', label: '1 000 SMS', price_ht: 95, unit_price_ht: 0.095, shop_url: '#' }, { pack: '5000', label: '5 000 SMS', price_ht: 425, unit_price_ht: 0.085, shop_url: '#' }] }]" />
</template>
