<script setup>
import { UiBadge, UiTable } from '@adion-cloud/ui-vue'
import tokensCss from '@adion-cloud/tokens/tokens.css?raw'
import { themeReport, themeVars } from '@adion-cloud/tokens/contrast'

/* Chaque couple texte/surface des jetons, calcule (WCAG), dans les deux themes. */
const columns = [
  { key: 'label', label: 'Couple' },
  { key: 'value', label: 'Rapport', align: 'num', value: (r) => (r.value === null ? '—' : `${String(r.value).replace('.', ',')}:1`) },
  { key: 'min', label: 'Seuil', align: 'num', value: (r) => `${String(r.min).replace('.', ',')}:1` },
  { key: 'state', label: 'AA', value: (r) => (r.ok ? 'AA' : 'Sous AA') },
]
const themes = ['dark', 'light'].map((theme) => ({ theme, rows: themeReport(themeVars(tokensCss, theme)) }))
</script>

<template>
  <div class="doc-page doc-page--wide">
    <article class="doc-article">
      <header class="doc-head">
        <p class="doc-eyebrow">Démarrer</p>
        <h1>Contrastes</h1>
        <p class="doc-lead">Le seuil AA est de 4,5:1 pour un texte, 3:1 pour l’anneau de focus. Le garde-fou (contrast.test.js) échoue sous le seuil.</p>
      </header>
      <section v-for="t in themes" :id="t.theme" :key="t.theme" class="doc-example">
        <h2>Thème {{ t.theme === 'dark' ? 'sombre' : 'clair' }}</h2>
        <div class="ui-page">
          <UiTable :columns="columns" :rows="t.rows" :row-key="(r) => r.fg + r.bg" dense :stack="false">
            <template #cell-state="{ row }"><UiBadge :label="row.ok ? 'AA' : 'Sous AA'" :tone="row.ok ? 'ok' : 'bad'" /></template>
          </UiTable>
        </div>
      </section>
    </article>
  </div>
</template>
