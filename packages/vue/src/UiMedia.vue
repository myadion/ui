<script setup>
/*
 * UN CADRE MEDIA (Adion UI, 2026-10-29) : une image, une video au ralenti ou
 * une scene 3D, toujours au meme ratio et aux memes bords, avec un fondu bas
 * qui rattache l'image au fond de la page. Aucun mot sur l'image. Sans rien a
 * montrer, une plaque : des filets de grille et le nom en filigrane.
 *
 *   kind      image, video, scene ou plate (la plaque)
 *   src       l'image (kind image)
 *   position  son cadrage (object-position)
 *   ratio     le cadre, 41 / 16 par defaut (16 / 9 sur telephone)
 *   bare      sans fondu (une vignette)
 *   label     le filigrane de la plaque
 *   slot      la video ou la scene : posez-y la classe ui-media__layer
 *
 * Evenement : error (l'image n'a pas pu se charger).
 */
defineProps({
  kind: { type: String, default: 'plate' },
  src: { type: String, default: '' },
  position: { type: String, default: 'center' },
  ratio: { type: String, default: '41 / 16' },
  bare: { type: Boolean, default: false },
  label: { type: String, default: '' },
})
defineEmits(['error'])
</script>

<template>
  <figure class="ui-media" :class="`is-${kind}`" :style="{ aspectRatio: ratio }">
    <img v-if="kind === 'image' && src" class="ui-media__layer" :src="src" :style="{ objectPosition: position }" alt="" loading="lazy" @error="$emit('error')" />
    <slot v-else-if="kind === 'video' || kind === 'scene'" />
    <template v-else>
      <span class="ui-media__marks" aria-hidden="true"></span>
      <span class="ui-media__watermark" aria-hidden="true">{{ label }}</span>
    </template>
    <span v-if="!bare" class="ui-media__fade" aria-hidden="true"></span>
  </figure>
</template>
