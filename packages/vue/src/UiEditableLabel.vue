<script setup>
/*
 * UN INTITULE QU'ON RENOMME SUR PLACE (Adion UI, 2026-10-29) : le texte et son
 * crayon, qui s'eclaire au survol. Le clic emet edit ; la fenetre est a l'app
 * (un UiDialog). @click.stop : dans une liste, la ligne s'ouvre au clic, et
 * renommer ne doit pas ouvrir la fiche.
 *
 *   label        l'intitule ; vide : placeholder, grise si muted
 *   placeholder  ce qu'on montre a la place
 *   muted        placeholder en gris (pas encore nomme)
 *   title        l'aide du bouton
 */
defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Sans intitulé' },
  muted: { type: Boolean, default: false },
  title: { type: String, default: 'Renommer' },
})
defineEmits(['edit'])
</script>

<template>
  <span class="ui-editable">
    <button type="button" class="ui-editable__btn" :title="title" :aria-label="title" @click.stop="$emit('edit')">
      <span class="ui-editable__text" :class="{ 'ui-muted': !label && muted }">{{ label || placeholder }}</span>
      <v-icon icon="mdi-pencil-outline" size="13" class="ui-editable__icon" />
    </button>
    <slot />
  </span>
</template>
