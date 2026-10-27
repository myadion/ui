<script setup>
import { UiButton, UiCard } from '@adion-cloud/ui-vue'
</script>

<template>
  <div class="ui-cards">
    <UiCard eyebrow="Paquet" value="25,00 €" unit="HT" text="0,050 € HT le SMS"><template #actions><UiButton>Acheter</UiButton></template></UiCard>
    <UiCard eyebrow="Paquet" value="90,00 €" unit="HT" text="0,045 € HT le SMS" selected><template #actions><UiButton kind="primary">Payer 90,00 € HT</UiButton></template></UiCard>
    <UiCard eyebrow="10 000 SMS" value="850,00 €" unit="HT" text="0,085 € HT le SMS" badge="Le plus avantageux"><template #actions><UiButton>Acheter</UiButton></template></UiCard>
  </div>
</template>
