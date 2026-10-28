<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { tokens } from '@myadion/tokens'
import color from '@myadion/tokens/src/color.json'
import size from '@myadion/tokens/src/size.json'
import font from '@myadion/tokens/src/font.json'
import { UiCode, UiKeyValue, UiSection } from '@myadion/ui'

/* Les jetons, tels que chaque plateforme les recoit : un nom, une valeur par theme. */
const theme = useTheme()
const current = computed(() => (theme.global.name.value === 'adionLight' ? 'light' : 'dark'))
const groups = color.groups
const sizes = size.groups
</script>

<template>
  <div class="doc-page doc-page--wide">
    <article class="doc-article">
    <header class="doc-head">
      <p class="doc-eyebrow">Démarrer</p>
      <h1>Jetons</h1>
      <p class="doc-lead">La seule source des couleurs, des tailles et des polices d’Adion. Web : la variable --adion-&lt;nom&gt;. Android : la couleur et la dimension adion_&lt;nom&gt;, ou AdionColors.Dark / Light en Compose. JavaScript : tokens.dark[&lt;nom&gt;].</p>
    </header>
    <div class="ui-page">
    <UiCode wrap :code="`npm install @myadion/tokens\n\nimport '@myadion/tokens/tokens.css'\nimport { tokens, vuetifyThemes } from '@myadion/tokens'`" />

    <UiSection v-for="group in groups" :key="group.id" :title="group.title" :lead="group.description">
      <div class="docs-swatches">
        <div v-for="(token, name) in group.tokens" :key="name" class="docs-swatch">
          <div class="docs-swatch__color" :style="{ background: `var(--adion-${name})` }" />
          <div class="docs-swatch__meta">
            <div>{{ name }}</div>
            <code>{{ tokens[current][name] }}</code>
            <div v-if="token.description" class="ui-muted">{{ token.description }}</div>
          </div>
        </div>
      </div>
    </UiSection>

    <UiSection v-for="group in sizes" :key="group.id" :title="group.title" :lead="group.description">
      <UiKeyValue :columns="2" :items="Object.keys(group.tokens).map((name) => ({ label: `--adion-${name}`, value: `${tokens.size[name]} px`, mono: true, tip: group.tokens[name].description }))" />
    </UiSection>

    <UiSection title="Les polices" lead="Libres (OFL). Raleway pour le texte, Lilita One pour le logo seulement.">
      <UiKeyValue :items="Object.entries(font.families).map(([name, f]) => ({ label: `--adion-${name}`, value: f.value, tip: f.description, mono: true }))" />
    </UiSection>
    </div>
    </article>
  </div>
</template>
