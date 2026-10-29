<script setup>
import { UiButton, UiStickyBar, UiToolbar } from '@myadion/ui'
</script>

<template>
  <UiStickyBar>
    <UiToolbar>
      <template #filters><span class="ui-muted">Boutique · Cloud</span></template>
      <UiButton kind="primary">Commander</UiButton>
    </UiToolbar>
  </UiStickyBar>
</template>
