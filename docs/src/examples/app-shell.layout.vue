<script setup>
import { UiAppShell, UiIconActions, UiPageHeader, UiTopBar } from '@myadion/ui'
</script>

<template>
  <div class="ui-doc__frame" style="height: 320px; overflow: auto">
    <UiAppShell>
      <template #sidebar>
        <nav style="width: 220px; min-height: 320px; padding: 16px; background: var(--adion-nav-bg)">La barre de gauche de l’app</nav>
      </template>
      <template #topbar>
        <UiTopBar>
          <template #actions><UiIconActions :items="[{ key: 'search', icon: 'mdi-magnify', label: 'Rechercher' }]" /></template>
          <template #menu>La barre de gauche, dans le panneau du téléphone</template>
        </UiTopBar>
      </template>
      <UiPageHeader eyebrow="Cloud" title="Public Cloud" lead="La page, dans sa colonne." />
    </UiAppShell>
  </div>
</template>
