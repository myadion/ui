<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { adionRequest as apiRequest } from './adapter.js'
import { addressOption, addressRows, searchable } from './addressSearch'
import UiField from './UiField.vue'
import UiInput from './UiInput.vue'

/*
 * UNE ADRESSE, AVEC LA BASE ADRESSE NATIONALE (Adion UI), reprise
 * d'AddressField : on tape le debut, on choisit, la voie, le code postal et
 * la ville se remplissent. Chaque ligne reste saisissable a la main - la BAN
 * ne connait que la France.
 *
 * `address` est modifiee en place ({ line1, line2, postal_code, city,
 * country }) ; `prefix` est le nom du champ dans les erreurs de Nexus.
 */
const props = defineProps({
  address: { type: Object, required: true },
  prefix: { type: String, default: 'address' },
  errors: { type: Object, default: () => ({}) },
  readonly: { type: Boolean, default: false },
  optional: { type: Boolean, default: false },
  label: { type: String, default: 'Rechercher l’adresse' },
})

const query = ref('')
const options = ref([])
const searching = ref(false)
const round = ref(0)
let timer = null
let asked = 0
onBeforeUnmount(() => clearTimeout(timer))

const err = (field) => (props.errors && props.errors[`${props.prefix}.${field}`]) || ''

function search(value) {
  clearTimeout(timer)
  query.value = value ?? ''
  const q = searchable(value)
  if (!q) {
    options.value = []
    searching.value = false
    return
  }
  searching.value = true
  const mine = ++asked
  timer = setTimeout(async () => {
    try {
      const payload = await apiRequest({ method: 'GET', path: `/address/search?q=${encodeURIComponent(q)}&limit=6` })
      const found = addressRows(payload).map(addressOption).filter((o) => o.label)
      if (mine === asked) options.value = found
    } catch {
      if (mine === asked) options.value = []
    } finally {
      if (mine === asked) searching.value = false
    }
  }, 300)
}

function apply(choice) {
  if (!choice || typeof choice !== 'object') return
  props.address.line1 = choice.line1 || props.address.line1
  props.address.postal_code = choice.postal_code || props.address.postal_code
  props.address.city = choice.city || props.address.city
  props.address.country = 'FR'
  query.value = ''
  options.value = []
  round.value += 1
}
</script>

<template>
  <div class="ui-form__grid">
    <UiField v-if="!readonly" wide :label="label" tip="Tapez le début de l’adresse puis choisissez-la : les champs se remplissent. Vous pouvez toujours les corriger.">
      <v-autocomplete
        :key="round"
        :search="query"
        :items="options"
        :loading="searching"
        item-title="label"
        item-value="id"
        return-object
        no-filter
        hide-no-data
        clearable
        autocomplete="off"
        placeholder="12 rue des Lilas, Toulouse"
        prepend-inner-icon="mdi-map-search-outline"
        variant="outlined"
        density="compact"
        hide-details
        class="ui-control"
        :model-value="null"
        @update:search="search"
        @update:model-value="apply"
      />
    </UiField>
    <UiInput v-model="address.line1" wide label="Numéro et voie" :required="!optional" :readonly="readonly" :error="err('line1')" maxlength="200" />
    <UiInput v-model="address.line2" wide label="Complément" placeholder="Bâtiment, étage…" :readonly="readonly" :error="err('line2')" maxlength="200" />
    <UiInput v-model="address.postal_code" label="Code postal" :required="!optional" :readonly="readonly" :error="err('postal_code')" maxlength="10" inputmode="numeric" />
    <UiInput v-model="address.city" label="Ville" :required="!optional" :readonly="readonly" :error="err('city')" maxlength="100" />
    <UiInput
      :model-value="address.country"
      label="Pays"
      tip="Code du pays sur deux lettres : FR, BE, CH…"
      :required="!optional"
      placeholder="FR"
      :readonly="readonly"
      :error="err('country')"
      maxlength="2"
      @update:model-value="(v) => { address.country = String(v || '').toUpperCase() }"
    />
  </div>
</template>
