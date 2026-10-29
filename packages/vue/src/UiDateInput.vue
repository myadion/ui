<script setup>
import { computed, ref, useId } from 'vue'
import UiField from './UiField.vue'

/*
 * UNE DATE, AU CLAVIER OU AU CALENDRIER (Adion UI, 2026-10-29). On tape
 * JJ/MM/AAAA (les barres se posent seules), ou l'on clique : un calendrier
 * s'ouvre sous le champ. Le v-model reste le texte « JJ/MM/AAAA ».
 *
 *   birthday   une date de naissance : le calendrier s'ouvre sur les annees, a
 *              l'annee la plus recente permise (max, ou il y a seize ans), et rien
 *              d'apres n'est choisissable (Kevin, 2026-10-29)
 *   max, min   les bornes du calendrier, en ISO (« 2010-10-29 »)
 *   Les jours et les mois sont dits dans la langue de Vuetify : l'app la regle (fr).
 */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  id: { type: String, default: '' },
  birthday: { type: Boolean, default: false },
  max: { type: String, default: '' },
  min: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const auto = useId()
const fieldId = computed(() => props.id || auto)
const open = ref(false)
const view = ref(props.birthday ? 'year' : 'month')

const pad = (n) => String(n).padStart(2, '0')
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/* La borne haute : celle donnee, sinon, pour une naissance, il y a seize ans jour pour jour. */
const upper = computed(() => {
  if (props.max) return props.max
  if (!props.birthday) return ''
  const d = new Date()
  d.setFullYear(d.getFullYear() - 16)
  return iso(d)
})
/* L'annee affichee a l'ouverture : celle de la date choisie, sinon la plus recente permise. */
const shownYear = computed(() => (picked.value ? picked.value.getFullYear() : (upper.value ? Number(upper.value.slice(0, 4)) : undefined)))

/* Le texte tape devient JJ/MM/AAAA au fil de la frappe. */
function onType(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8)
  emit('update:modelValue', [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/'))
}

/* La date du champ, pour le calendrier ; rien tant qu'elle n'est pas complete et reelle. */
const picked = computed(() => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(props.modelValue || '')
  if (!m) return null
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
  return d.getDate() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 ? d : null
})

function onPick(value) {
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return
  emit('update:modelValue', `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`)
  open.value = false
}

function onOpen(value) {
  open.value = value
  if (value) view.value = props.birthday && !picked.value ? 'year' : 'month'
}
</script>

<template>
  <UiField :label="label" :hint="hint" :error="error" :for="fieldId">
    <v-menu :model-value="open" :close-on-content-click="false" location="bottom start" content-class="ui-date-host" @update:model-value="onOpen">
      <template #activator="{ props: on }">
        <v-text-field
          v-bind="{ ...$attrs, ...on }"
          :id="fieldId"
          :model-value="modelValue"
          placeholder="JJ/MM/AAAA"
          inputmode="numeric"
          maxlength="10"
          autocomplete="bday"
          :error="Boolean(error)"
          variant="outlined"
          density="compact"
          hide-details="auto"
          class="ui-control ui-date"
          append-inner-icon="mdi-calendar-blank-outline"
          @update:model-value="onType"
        />
      </template>
      <v-date-picker
        v-model:view-mode="view"
        :model-value="picked"
        :max="upper || undefined"
        :min="min || undefined"
        :year="shownYear"
        hide-header
        show-adjacent-months
        class="ui-date__picker"
        @update:model-value="onPick"
      />
    </v-menu>
  </UiField>
</template>
