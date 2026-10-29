<script setup>
import { computed, ref, useId } from 'vue'
import { getCountries } from 'libphonenumber-js'
import UiField from './UiField.vue'

/*
 * UN PAYS, AVEC SON DRAPEAU (Adion UI, 2026-10-29). Une liste ou l'on tape pour
 * chercher ; chaque pays a son drapeau et son nom dans la langue de la page.
 * Les drapeaux sont ceux de flag-icons (`fi fi-xx`) : l'app charge leur feuille.
 *
 *   v-model    le code ISO du pays (« FR »)
 *   first      les pays places en tete de liste (par defaut : la France)
 *   countries  la liste a proposer, si l'on ne veut pas tous les pays
 *   locale     la langue des noms (fr par defaut)
 */
defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: String, default: 'FR' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  id: { type: String, default: '' },
  first: { type: Array, default: () => ['FR'] },
  countries: { type: Array, default: () => [] },
  locale: { type: String, default: 'fr' },
})
defineEmits(['update:modelValue'])

/*
 * La recherche part de ce qu'on tape. Vuetify remet le nom du pays choisi dans
 * le champ quand il prend le focus, et la frappe s'y ajoutait (« FranceAllem ») :
 * on retire ce nom pour ne garder que ce qui suit.
 */
const search = ref('')
const chosenTitle = () => items.value.find((i) => i.value === props.modelValue)?.title || ''
const onSearch = (value) => {
  const text = String(value || '')
  const title = chosenTitle()
  search.value = title && text.length > title.length && text.startsWith(title) ? text.slice(title.length) : text
}
const auto = useId()
const fieldId = computed(() => props.id || auto)

const names = computed(() => {
  try {
    return new Intl.DisplayNames([props.locale], { type: 'region' })
  } catch {
    return null
  }
})

const items = computed(() => {
  const codes = (props.countries.length ? props.countries : getCountries()).map((c) => String(c).toUpperCase())
  const named = codes.map((code) => ({ value: code, title: names.value?.of(code) || code }))
  const head = props.first.map((c) => named.find((n) => n.value === String(c).toUpperCase())).filter(Boolean)
  const rest = named.filter((n) => !head.includes(n)).sort((a, b) => a.title.localeCompare(b.title, props.locale))
  return [...head, ...rest]
})
</script>

<template>
  <UiField :label="label" :hint="hint" :error="error" :for="fieldId">
    <v-autocomplete
      v-bind="$attrs"
      :id="fieldId"
      :model-value="modelValue"
      :items="items"
      item-title="title"
      item-value="value"
      :error="Boolean(error)"
      variant="outlined"
      density="compact"
      hide-details="auto"
      auto-select-first
      :search="search"
      @update:search="onSearch"
      :menu-props="{ maxHeight: 320 }"
      class="ui-control ui-country"
      @update:model-value="(v) => { if (v) { search = ''; $emit('update:modelValue', v) } }"
    >
      <template #prepend-inner>
        <span v-if="modelValue" class="ui-country__flag fi" :class="`fi-${modelValue.toLowerCase()}`" aria-hidden="true" />
      </template>
      <template #item="{ props: itemProps, item }">
        <v-list-item v-bind="itemProps" :title="item.title">
          <template #prepend>
            <span class="ui-country__flag fi" :class="`fi-${String(item.value).toLowerCase()}`" aria-hidden="true" />
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
  </UiField>
</template>
