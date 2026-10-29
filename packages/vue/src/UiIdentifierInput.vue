<script setup>
import { computed, ref, useId } from 'vue'
import { AsYouType, getCountries, getCountryCallingCode } from 'libphonenumber-js'
import UiField from './UiField.vue'
import { identifierKindOf } from './identifier.js'

/*
 * UN CHAMP « E-MAIL OU TELEPHONE » (Adion UI, 2026-10-29). Une lettre ou un @ :
 * c'est un e-mail. Que des chiffres : c'est un telephone, mis en forme pendant
 * la frappe, au format international, avec le drapeau de son pays a gauche.
 * « 07… » devient « +33 7… » selon le pays du navigateur (ou `country`), « 00 »
 * devient « + ». Les drapeaux sont ceux de flag-icons (`fi fi-xx`) : l'app
 * charge leur feuille de style.
 *
 *   v-model   le texte affiche (« +33 7 12 34 56 78 » ou « nom@exemple.fr »)
 *   country   le pays par defaut, en ISO (FR, CH, CA...) ; sinon celui du navigateur
 *   @kind     'email' | 'phone' | '' a chaque changement de nature
 */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  country: { type: String, default: '' },
  id: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'kind'])

const auto = useId()
const fieldId = computed(() => props.id || auto)
const control = ref(null)
defineExpose({ focus: () => control.value?.focus() })

const COUNTRIES = getCountries()
function localCountry() {
  const wanted = String(props.country || '').toUpperCase()
  if (COUNTRIES.includes(wanted)) return wanted
  const tags = typeof navigator === 'undefined' ? [] : [...(navigator.languages || []), navigator.language]
  for (const tag of tags) {
    const region = String(tag || '').split('-')[1]?.toUpperCase()
    if (region && COUNTRIES.includes(region)) return region
  }
  return 'FR'
}

/* Un indicatif partage (+1) : le pays du navigateur s'il en est, sinon le premier pays de l'indicatif. */
function countryOfCode(code) {
  if (!code) return ''
  const home = localCountry()
  if (getCountryCallingCode(home) === code) return home
  return COUNTRIES.find((c) => getCountryCallingCode(c) === code) || ''
}

const kind = computed(() => identifierKindOf(props.modelValue))

const phone = computed(() => {
  if (kind.value !== 'phone') return null
  const typer = new AsYouType()
  typer.input(props.modelValue)
  const code = typer.getCallingCode?.() || ''
  return { country: typer.getCountry() || countryOfCode(code) }
})

let lastKind = ''
function onInput(raw) {
  let text = String(raw ?? '')
  const next = identifierKindOf(text)
  if (next === 'phone') {
    let digits = text.replace(/[^\d+]/g, '')
    if (digits.startsWith('00')) digits = `+${digits.slice(2)}`
    else if (digits.startsWith('0')) digits = `+${getCountryCallingCode(localCountry())}${digits.slice(1)}`
    else if (digits && !digits.startsWith('+')) digits = `+${digits}`
    text = new AsYouType().input(digits)
  }
  if (next !== lastKind) {
    lastKind = next
    emit('kind', next)
  }
  emit('update:modelValue', text)
}
</script>

<template>
  <UiField :label="label" :hint="hint" :error="error" :for="fieldId">
    <v-text-field
      v-bind="$attrs"
      ref="control"
      :id="fieldId"
      :model-value="modelValue"
      :type="kind === 'email' ? 'email' : 'text'"
      :inputmode="kind === 'phone' ? 'tel' : 'email'"
      :error="Boolean(error)"
      variant="outlined"
      density="compact"
      hide-details="auto"
      class="ui-control ui-identifier"
      @update:model-value="onInput"
    >
      <template #prepend-inner>
        <span v-if="phone && phone.country" class="ui-identifier__flag fi" :class="`fi-${phone.country.toLowerCase()}`" :title="phone.country" aria-hidden="true" />
        <v-icon v-else-if="phone" icon="mdi-phone-outline" size="16" class="ui-identifier__icon" />
        <v-icon v-else-if="kind === 'email'" icon="mdi-email-outline" size="16" class="ui-identifier__icon" />
        <v-icon v-else icon="mdi-account-outline" size="16" class="ui-identifier__icon" />
      </template>
    </v-text-field>
  </UiField>
</template>
