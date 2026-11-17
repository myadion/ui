<script setup>
import { UiEntityLink } from '@myadion/ui'

const here = '/composants/entity-link'
</script>

<template>
  <p><UiEntityLink kind="user" label="Claire Dumas" sub="Propriétaire" :to="here" /></p>
  <p><UiEntityLink kind="organization" label="Atelier Lumière" :to="here" /></p>
  <p><UiEntityLink kind="service" label="Ligne mobile 100 Go" sub="Forfait 4G" :to="here" /></p>
  <p><UiEntityLink kind="invoice" label="F-2026-10-0412" :to="here" /></p>
  <p><UiEntityLink kind="billing_account" label="Atelier Lumière SARL" :to="here" /></p>
  <p><UiEntityLink kind="project" label="Production" /></p>
</template>
