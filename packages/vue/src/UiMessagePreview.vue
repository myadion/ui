<script setup>
import { computed } from 'vue'

/*
 * L'APERCU D'UN MESSAGE (Adion UI) : ce que le destinataire lira, dans une
 * bulle de telephone. L'expediteur en haut (tel que l'API le dit, jamais
 * deviné par l'ecran), le texte dans la bulle, une ligne de faits dessous
 * (`note` : parties, mention ajoutee). Sans texte, `empty` tient la place.
 */
const props = defineProps({
  sender: { type: String, default: '' },
  text: { type: String, default: '' },
  note: { type: String, default: '' },
  empty: { type: String, default: 'Votre message s’affichera ici.' },
  highlight: { type: Array, default: () => [] },
})
/* Les caractères en cause (Unicode) sont surlignés dans la bulle. */
const parts = computed(() => {
  const marks = new Set(props.highlight)
  return [...props.text].map((c) => ({ c, mark: marks.has(c) }))
    .reduce((out, p) => {
      const last = out[out.length - 1]
      if (last && last.mark === p.mark) last.t += p.c
      else out.push({ t: p.c, mark: p.mark })
      return out
    }, [])
})
const initial = computed(() => (props.sender.match(/[\p{L}\p{N}]/u)?.[0] || '#').toUpperCase())
</script>

<template>
  <figure class="ui-message" aria-label="Aperçu du message">
    <div class="ui-message__head">
      <span class="ui-message__avatar" aria-hidden="true">{{ initial }}</span>
      <span class="ui-message__sender">{{ sender || '—' }}</span>
    </div>
    <div class="ui-message__thread">
      <p class="ui-message__bubble" :class="{ 'is-empty': !text }"><template v-if="text"><template v-for="(p, i) in parts" :key="i"><mark v-if="p.mark" class="ui-message__mark">{{ p.t }}</mark><template v-else>{{ p.t }}</template></template></template><template v-else>{{ empty }}</template></p>
    </div>
    <figcaption v-if="note" class="ui-message__note">{{ note }}</figcaption>
  </figure>
</template>
