<script setup>
import { computed } from 'vue'
import UiNotice from './UiNotice.vue'
import { unicodeChars, unicodeFacts } from './unicode'

/*
 * L'AVERTISSEMENT UNICODE (Adion UI) : sous la zone de texte d'un SMS, quand
 * un caractère hors de l'alphabet GSM le fait passer en Unicode et coûter
 * plus cher. On prévient, on ne bloque pas : un encadré d'alerte, la phrase
 * de Nexus, les caractères en cause en pastilles, les SMS facturés.
 * Le bouton d'envoi reste actif.
 */
const props = defineProps({
  unicode: { type: Object, default: null },
})
const chars = computed(() => unicodeChars(props.unicode))
const facts = computed(() => unicodeFacts(props.unicode))
const visible = computed(() => Boolean(props.unicode && (props.unicode.message || chars.value.length)))
</script>

<template>
  <UiNotice v-if="visible" class="ui-unicode" tone="warn" icon="mdi-alphabetical-variant" :text="unicode.message || ''">
    <span v-if="chars.length" class="ui-unicode__chars">
      <span class="ui-unicode__label">Caractères en cause :</span>
      <kbd v-for="c in chars" :key="c" class="ui-unicode__char">{{ c }}</kbd>
    </span>
    <span v-if="facts" class="ui-unicode__facts">{{ facts }}</span>
  </UiNotice>
</template>
