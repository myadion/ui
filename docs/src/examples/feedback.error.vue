<script setup>
import { UiDenied, UiError } from '@adion-cloud/ui-vue'
</script>

<template>
  <UiError message="Vos services SMS sont momentanément indisponibles." />
  <UiDenied what="les services SMS de ce projet" />
</template>
