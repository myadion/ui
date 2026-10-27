<script setup>
/*
 * LE BANDEAU DE LA SANDBOX (Adion UI, 2026-10-17 ; coordination#85). Tant que
 * l'organisation ouverte est une Sandbox, il reste en haut de chaque page : on
 * ne doit jamais croire agir pour de vrai. Le mot et la phrase viennent de
 * Nexus (`banner.label`, `banner.message`) ; aucun texte n'est invente ici.
 */
defineProps({
  label: { type: String, required: true },
  message: { type: String, default: '' },
})
</script>

<template>
  <div class="ui-sandbox-band" role="status">
    <v-icon icon="mdi-flask-outline" size="16" />
    <strong class="ui-sandbox-band__label">{{ label }}</strong>
    <span v-if="message" class="ui-sandbox-band__text">{{ message }}</span>
    <slot />
  </div>
</template>
