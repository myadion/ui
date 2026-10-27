<script setup>
import { ref, watch } from 'vue'
import { UiColorInput, UiInput, UiMailStudio, UiMailTemplatePicker } from '@adion-cloud/ui-vue'
import { mailDocument, renderMail } from './data.js'

const doc = ref(mailDocument())
const scheme = ref('light')
const html = ref(renderMail(doc.value))
const refresh = () => { html.value = renderMail(doc.value, scheme.value) }
watch(scheme, refresh)
</script>

<template>
  <UiMailStudio v-model="doc" v-model:scheme="scheme" document-key="doc" :html="html" :subject="doc.subject" @refresh="refresh">
    <template #panel>
      <div class="ui-mail-panel">
        <p class="ui-mail-panel__title">Le message</p>
        <UiInput v-model="doc.subject" label="Objet" />
        <UiMailTemplatePicker :templates="[{ key: 'a', name: 'Lettre du mois', subject: 'Nos nouvelles du mois', version: 3 }, { key: 'b', name: 'Promotion', subject: '-20 % ce week-end' }]" selected-key="a" />
        <UiColorInput model-value="#15803d" label="Couleur des boutons" />
      </div>
    </template>
  </UiMailStudio>
</template>
