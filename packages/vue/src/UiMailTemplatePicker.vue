<script setup>
import { computed, ref } from 'vue'

/*
 * LE CHOIX DU MESSAGE, DANS LA BARRE (Adion UI,
 * 2026-10-14).
 *
 * Une liste qui s'ouvre d'un clic, avec son filtre, plutot qu'une colonne
 * permanente : la place revient a l'editeur et a l'apercu. En tete,
 * « Apparence » (le theme : logo, couleurs, pied de page) ; dessous, les
 * modeles, regroupes par `group` quand l'API en donne un.
 *
 *   templates   [{ key, name, subject, version?, group? }]
 *   mode        `template` ou `theme`
 *   theme       le libelle de l'entree du theme ; vide pour la retirer
 */
const props = defineProps({
  templates: { type: Array, default: () => [] },
  selectedKey: { type: String, default: '' },
  mode: { type: String, default: 'template' },
  theme: { type: String, default: 'Apparence' },
  themeHint: { type: String, default: 'Logo, couleurs et pied de page' },
})
const emit = defineEmits(['select', 'theme'])

const open = ref(false)
const search = ref('')

const grouped = computed(() => {
  const needle = (search.value || '').trim().toLowerCase()
  const buckets = new Map()
  for (const template of props.templates) {
    const haystack = `${template.name} ${template.subject || ''} ${template.description || ''}`.toLowerCase()
    if (needle && !haystack.includes(needle)) continue
    const label = template.group || 'Modèles'
    if (!buckets.has(label)) buckets.set(label, [])
    buckets.get(label).push(template)
  }
  return [...buckets.entries()].map(([label, items]) => ({ label, items }))
})

const currentLabel = computed(() => {
  if (props.mode === 'theme') return props.theme
  return props.templates.find((t) => t.key === props.selectedKey)?.name || 'Choisir un modèle'
})

function pick(key) {
  open.value = false
  emit('select', key)
}

function pickTheme() {
  open.value = false
  emit('theme')
}
</script>

<template>
  <v-menu v-model="open" :close-on-content-click="false" location="bottom start">
    <template #activator="{ props: activator }">
      <v-btn v-bind="activator" variant="tonal" size="small" class="btn-sentence-case ui-btn ui-mail-picker" append-icon="mdi-chevron-down">
        <v-icon :icon="mode === 'theme' ? 'mdi-palette-outline' : 'mdi-email-outline'" size="16" class="ui-mail-picker__icon" />
        <span class="ui-mail-picker__label">{{ currentLabel }}</span>
      </v-btn>
    </template>

    <div class="ui-mail-menu ui-mail-menu--wide">
      <div class="ui-mail-menu__search">
        <v-text-field
          v-model="search"
          placeholder="Filtrer"
          density="compact"
          variant="outlined"
          hide-details
          autofocus
          clearable
          prepend-inner-icon="mdi-magnify"
          class="ui-control"
        />
      </div>
      <button v-if="theme" type="button" class="ui-mail-menu__item" :class="{ 'is-active': mode === 'theme' }" @click="pickTheme">
        <v-icon icon="mdi-palette-outline" size="18" />
        <span class="ui-mail-menu__text">
          <span class="ui-mail-menu__title">{{ theme }}</span>
          <span class="ui-mail-menu__hint">{{ themeHint }}</span>
        </span>
      </button>
      <template v-for="group in grouped" :key="group.label">
        <p class="ui-mail-menu__group">{{ group.label }}</p>
        <button
          v-for="template in group.items"
          :key="template.key"
          type="button"
          class="ui-mail-menu__item"
          :class="{ 'is-active': mode === 'template' && template.key === selectedKey }"
          @click="pick(template.key)"
        >
          <v-icon icon="mdi-email-outline" size="17" />
          <span class="ui-mail-menu__text">
            <span class="ui-mail-menu__title">{{ template.name }}</span>
            <span class="ui-mail-menu__hint">{{ template.subject || 'Sans objet' }}</span>
          </span>
          <span v-if="template.version" class="ui-mail-menu__badge">v{{ template.version }}</span>
        </button>
      </template>
      <p v-if="!grouped.length" class="ui-mail-menu__empty">Aucun modèle ne correspond.</p>
    </div>
  </v-menu>
</template>
