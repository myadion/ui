<script setup>
import { computed, ref, watch } from 'vue'
import UiButton from './UiButton.vue'
import UiDialog from './UiDialog.vue'
import UiInput from './UiInput.vue'
import UiMailThumbnail from './UiMailThumbnail.vue'

/*
 * LA GALERIE DES MODELES (Adion UI, 2026-10-15) :
 * proposer des modeles prets a l'emploi.
 *
 * Une fenetre large : a gauche les modeles en vignettes, filtres par
 * categorie ; a droite l'apercu du modele choisi, a sa vraie taille et
 * qui defile, sur ordinateur ou sur telephone. On choisit, on nomme, on
 * cree. Les modeles viennent de l'API (catalogue versionne, rendu dans le
 * theme du compte) ; l'ecran peut y ajouter les siens (`group`) et une page
 * blanche (`blank`).
 *
 *   items  [{ key, name, description?, category?, category_label?, html, group? }]
 *   emit   choose({ item, name }) - item vaut null pour la page blanche
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Choisir un modèle' },
  items: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
  /** Le libelle de la page blanche ; vide, pas de page blanche. */
  blank: { type: String, default: 'Page blanche' },
  nameLabel: { type: String, default: 'Nom' },
  namePlaceholder: { type: String, default: 'Laissez vide pour reprendre celui du modèle' },
  confirmLabel: { type: String, default: 'Utiliser ce modèle' },
})
const emit = defineEmits(['update:modelValue', 'choose'])

const BLANK = '__blank__'
const category = ref('')
const selected = ref('')
const name = ref('')
const device = ref('desktop')
/* Tant qu'on n'a rien choisi, le premier modele arrive selectionne - meme s'il arrive apres l'ouverture. */
const touched = ref(false)

const filters = computed(() => {
  const groups = [...new Set(props.items.filter((i) => i.group).map((i) => i.group))]
  return [
    { key: '', label: 'Tous' },
    ...groups.map((g) => ({ key: `group:${g}`, label: g })),
    ...props.categories,
  ]
})

const visible = computed(() => props.items.filter((item) => {
  if (!category.value) return true
  if (category.value.startsWith('group:')) return item.group === category.value.slice(6)
  return item.category === category.value && !item.group
}))

const current = computed(() => props.items.find((i) => i.key === selected.value) || null)

watch(() => props.modelValue, (open) => {
  if (!open) return
  category.value = ''
  name.value = ''
  device.value = 'desktop'
  touched.value = false
  selected.value = props.items[0]?.key || (props.blank ? BLANK : '')
})
watch(() => props.items, (items) => {
  if (props.modelValue && !touched.value && items[0]) selected.value = items[0].key
})

function pick(key) {
  touched.value = true
  selected.value = key
}

function choose() {
  emit('choose', { item: selected.value === BLANK ? null : current.value, name: name.value.trim() })
}
</script>

<template>
  <UiDialog :model-value="modelValue" :title="title" icon="mdi-view-gallery-outline" width="1180" :error="error" :busy="busy" @update:model-value="(v) => emit('update:modelValue', v)">
    <div class="ui-mail-tgallery">
      <div class="ui-mail-tgallery__list">
        <div class="ui-mail-tgallery__filters" role="tablist" aria-label="Catégories">
          <button
            v-for="f in filters"
            :key="f.key"
            type="button"
            role="tab"
            class="ui-mail-settings__chip"
            :class="{ 'is-active': category === f.key }"
            :aria-selected="category === f.key"
            @click="category = f.key"
          >{{ f.label }}</button>
        </div>

        <div v-if="loading && !items.length" class="ui-mail-library__empty"><v-progress-circular indeterminate size="22" /></div>
        <div v-else class="ui-mail-tgallery__grid">
          <button v-if="blank && !category" type="button" class="ui-mail-tgallery__card is-blank" :class="{ 'is-selected': selected === BLANK }" @click="pick(BLANK)">
            <span class="ui-mail-tgallery__blank"><v-icon icon="mdi-file-outline" size="28" /></span>
            <span class="ui-mail-tgallery__name">{{ blank }}</span>
            <span class="ui-mail-tgallery__hint">Un courriel vide, à composer bloc par bloc.</span>
          </button>
          <button
            v-for="item in visible"
            :key="item.key"
            type="button"
            class="ui-mail-tgallery__card"
            :class="{ 'is-selected': selected === item.key }"
            :aria-pressed="selected === item.key"
            @click="pick(item.key)"
            @dblclick="pick(item.key); choose()"
          >
            <UiMailThumbnail :html="item.html || ''" :loading="!item.html" :size="190" :title="`Aperçu de ${item.name}`" />
            <span class="ui-mail-tgallery__name">{{ item.name }}</span>
            <span class="ui-mail-tgallery__hint">{{ item.group || item.category_label || '' }}</span>
          </button>
        </div>
      </div>

      <aside class="ui-mail-tgallery__preview">
        <template v-if="current">
          <div class="ui-mail-tgallery__head">
            <div class="ui-mail-tgallery__text">
              <p class="ui-mail-tgallery__title">{{ current.name }}</p>
              <p v-if="current.description" class="ui-mail-tgallery__hint">{{ current.description }}</p>
            </div>
            <div class="ui-segmented" role="radiogroup" aria-label="Écran">
              <button type="button" role="radio" class="ui-segmented__item" :class="{ 'is-active': device === 'desktop' }" :aria-checked="device === 'desktop'" title="Ordinateur" aria-label="Ordinateur" @click="device = 'desktop'"><v-icon icon="mdi-monitor" size="16" /></button>
              <button type="button" role="radio" class="ui-segmented__item" :class="{ 'is-active': device === 'mobile' }" :aria-checked="device === 'mobile'" title="Téléphone" aria-label="Téléphone" @click="device = 'mobile'"><v-icon icon="mdi-cellphone" size="16" /></button>
            </div>
          </div>
          <div class="ui-mail-tgallery__frame" :class="{ 'is-mobile': device === 'mobile' }">
            <iframe v-if="current.html" :srcdoc="current.html" sandbox="" :title="`Le modèle ${current.name}`" class="ui-mail-tgallery__iframe" />
            <div v-else class="ui-mail-library__empty"><v-progress-circular indeterminate size="22" /></div>
          </div>
        </template>
        <div v-else-if="selected === BLANK" class="ui-mail-library__empty">
          <v-icon icon="mdi-file-outline" size="32" />
          <span>Vous partez d’un courriel vide.</span>
        </div>
      </aside>
    </div>

    <template #actions="{ close }">
      <div class="ui-mail-tgallery__name-field"><UiInput v-model="name" :label="nameLabel" :placeholder="namePlaceholder" wide /></div>
      <UiButton kind="quiet" :disabled="busy" @click="close">Annuler</UiButton>
      <UiButton kind="primary" icon="mdi-arrow-right" :loading="busy" :disabled="!selected" @click="choose">{{ confirmLabel }}</UiButton>
    </template>
  </UiDialog>
</template>
