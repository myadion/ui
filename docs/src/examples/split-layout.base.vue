<script setup>
import { UiPageHeader, UiSection, UiSplitLayout } from '@myadion/ui'
</script>

<template>
  <div style="height: 420px; overflow: auto; --ui-panes-top: 0px">
    <UiSplitLayout image="/images/split.jpg" position="72% center">
      <div class="ui-page">
        <UiPageHeader eyebrow="Adion Cloud" title="Créer votre compte" />
        <UiSection title="Qui êtes-vous ?">Le formulaire entier, à droite.</UiSection>
      </div>
    </UiSplitLayout>
  </div>
</template>
