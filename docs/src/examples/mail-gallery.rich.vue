<script setup>
import { ref } from 'vue'
import { UiButton, UiMailDropZone, UiMailStyleFields, UiMailTemplateGallery } from '@myadion/ui'
import { mailDocument, mailEditor, renderMail } from './data.js'

const style = ref({ font: 'playfair', size: 32, background: '#fef3c7' })
const gallery = ref(false)
const html = renderMail(mailDocument())
</script>

<template>
  <div class="ui-grid-2">
    <UiMailStyleFields v-model="style" :groups="['text', 'box']" :editor="mailEditor" />
    <div class="ui-section__body">
      <UiMailDropZone />
      <div><UiButton kind="secondary" icon="mdi-view-gallery-outline" @click="gallery = true">Ouvrir la galerie des modèles</UiButton></div>
    </div>
  </div>
  <UiMailTemplateGallery v-model="gallery" :items="[{ key: 'a', name: 'Lettre d’information', description: 'Un bandeau, deux rubriques.', category: 'newsletter', category_label: 'Lettre d’information', html }]" :categories="[{ key: 'newsletter', label: 'Lettre d’information' }]" />
</template>
