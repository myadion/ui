<script setup>
import UiMailThumbnail from './UiMailThumbnail.vue'

/*
 * DES COURRIELS EN VIGNETTES (Adion UI, 2026-10-14) : les modeles d'un compte,
 * chacun avec le haut de son message, son nom et son objet. Une carte se
 * clique pour ouvrir l'editeur (`open`) ; ses gestes (supprimer,
 * dupliquer...) vont dans le creneau `actions`. `first` : une carte d'appel
 * en tete (« Nouveau modele »), dans le creneau du meme nom.
 *
 *   items  [{ id, name, subject, meta?, html?, loading? }]
 */
defineProps({
  items: { type: Array, default: () => [] },
})
defineEmits(['open'])
</script>

<template>
  <div class="ui-mail-gallery">
    <div v-if="$slots.first" class="ui-mail-gallery__first"><slot name="first" /></div>
    <article v-for="item in items" :key="item.id" class="ui-mail-gallery__card">
      <button type="button" class="ui-mail-gallery__open" :aria-label="`Ouvrir ${item.name}`" @click="$emit('open', item)">
        <UiMailThumbnail :html="item.html || ''" :loading="item.loading" :size="260" :title="`Aperçu de ${item.name}`" />
      </button>
      <div class="ui-mail-gallery__body">
        <div class="ui-mail-gallery__text">
          <button type="button" class="ui-mail-gallery__name" @click="$emit('open', item)">{{ item.name }}</button>
          <span class="ui-mail-gallery__subject">{{ item.subject || 'Sans objet' }}</span>
          <span v-if="item.meta" class="ui-mail-gallery__meta">{{ item.meta }}</span>
        </div>
        <div v-if="$slots.actions" class="ui-mail-gallery__actions"><slot name="actions" :item="item" /></div>
      </div>
    </article>
  </div>
</template>
