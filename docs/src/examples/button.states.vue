<script setup>
import { UiButton } from '@adion-cloud/ui-vue'
</script>

<template>
  <div class="ui-doc__row">
    <UiButton kind="primary" loading>Chargement</UiButton>
    <UiButton disabled>Désactivé</UiButton>
    <UiButton kind="quiet" icon="mdi-refresh" icon-only title="Actualiser" />
    <UiButton kind="secondary" append-icon="mdi-open-in-new" href="https://myadion.com">Lien externe</UiButton>
  </div>
</template>
