<script setup>
import { computed } from 'vue'

/*
 * LE COMPTE CONNECTE (Adion UI, 2026-10-29). Une petite pastille d'une ligne,
 * en haut d'une page de compte : l'avatar, « Connecté en tant que » et le nom
 * (l'identifiant en infobulle), puis le geste « Changer de compte ».
 *
 *   name    le prenom et le nom
 *   detail  l'e-mail ou le telephone
 *   label   le debut de la ligne
 *   action  le libelle du geste (vide : pas de geste)
 *
 * Evenement : action().
 */
const props = defineProps({
  name: { type: String, default: '' },
  detail: { type: String, default: '' },
  label: { type: String, default: 'Connecté en tant que' },
  action: { type: String, default: '' },
})
defineEmits(['action'])
const initial = computed(() => String(props.name || props.detail || '?').trim().charAt(0).toUpperCase())
</script>

<template>
  <div class="ui-signed-in" :title="name && detail ? detail : undefined">
    <span class="ui-signed-in__avatar" aria-hidden="true">{{ initial }}</span>
    <span class="ui-signed-in__text"><span class="ui-signed-in__label">{{ label }} </span><strong>{{ name || detail }}</strong></span>
    <button v-if="action" type="button" class="ui-signed-in__action" @click="$emit('action')">{{ action }}</button>
  </div>
</template>
