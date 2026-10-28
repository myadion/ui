<script setup>
import { computed } from 'vue'

/*
 * UNE JAUGE (Adion UI) : « 63 / 160 caracteres », sous un champ. La barre se
 * remplit, passe a l'orange pres de la limite (`warnAt`, 90 % par defaut) puis
 * au rouge au-dela de `max` - et le texte le dit aussi (« 12 en trop »).
 * `hint` est la phrase de l'API dessous (« lien et mention STOP compris · 1
 * SMS par contact »). Le calcul reste chez l'API : ici, on affiche.
 */
const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, required: true },
  unit: { type: String, default: 'caractères' },
  hint: { type: String, default: '' },
  warnAt: { type: Number, default: 0.9 },
})

const over = computed(() => props.value > props.max)
const tone = computed(() => (over.value ? 'bad' : props.value >= props.max * props.warnAt ? 'warn' : 'ok'))
const pct = computed(() => Math.min(100, (props.value / props.max) * 100))
const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n)
</script>

<template>
  <div class="ui-meter" :class="`is-tone-${tone}`">
    <div class="ui-meter__row">
      <span class="ui-meter__text" role="status">
        <strong>{{ fmt(value) }}</strong> / {{ fmt(max) }} {{ unit }}
        <span v-if="over" class="ui-meter__over">· {{ fmt(value - max) }} en trop</span>
      </span>
    </div>
    <span class="ui-meter__track" role="meter" :aria-valuenow="value" aria-valuemin="0" :aria-valuemax="max" :aria-valuetext="`${value} sur ${max} ${unit}`">
      <span class="ui-meter__fill" :style="{ width: `${pct}%` }" />
    </span>
    <small v-if="hint" class="ui-meter__hint">{{ hint }}</small>
  </div>
</template>
