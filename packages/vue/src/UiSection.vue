<script setup>
/*
 * UNE SECTION DE PAGE (Adion UI) : un titre, une phrase, le contenu - au meme
 * pas vertical partout (16 px entre les blocs, 32 px entre les sections).
 * `first` pour la premiere sous un en-tete ou des onglets, `ruled` pour un
 * filet quand elle doit se detacher. Dans UiFormLayout, le titre et la
 * phrase passent a gauche et les champs a droite.
 *
 * `collapsible` la replie sous son titre (des regles, un detail qu'on relit
 * rarement) ; `open` l'ouvre d'emblee. Le titre reste lisible, le contenu
 * attend un clic (coordination#43).
 */
defineProps({
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  first: { type: Boolean, default: false },
  ruled: { type: Boolean, default: false },
  collapsible: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
})
</script>

<template>
  <details v-if="collapsible" class="ui-section is-collapsible" :class="{ 'is-first': first, 'is-ruled': ruled }" :open="open || undefined">
    <summary class="ui-section__head">
      <h2 class="ui-section__title"><slot name="title">{{ title }}</slot></h2>
      <v-icon icon="mdi-chevron-down" size="18" class="ui-section__chevron" aria-hidden="true" />
    </summary>
    <p v-if="lead || $slots.lead" class="ui-section__lead"><slot name="lead">{{ lead }}</slot></p>
    <div v-if="$slots.default" class="ui-section__body"><slot /></div>
  </details>
  <section v-else class="ui-section" :class="{ 'is-first': first, 'is-ruled': ruled }">
    <div v-if="title || $slots.actions || $slots.title" class="ui-section__head">
      <h2 class="ui-section__title"><slot name="title">{{ title }}</slot></h2>
      <div v-if="$slots.actions" class="ui-section__actions"><slot name="actions" /></div>
    </div>
    <p v-if="lead || $slots.lead" class="ui-section__lead"><slot name="lead">{{ lead }}</slot></p>
    <div v-if="$slots.default" class="ui-section__body"><slot /></div>
  </section>
</template>
