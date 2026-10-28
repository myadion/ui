<script setup>
import { computed, ref } from 'vue'
import UiCheckbox from './UiCheckbox.vue'
import UiField from './UiField.vue'
import UiInput from './UiInput.vue'
import UiMailAlignPicker from './UiMailAlignPicker.vue'
import UiMailBlockMenu from './UiMailBlockMenu.vue'
import UiMailDropZone from './UiMailDropZone.vue'
import UiMailImageLibrary from './UiMailImageLibrary.vue'
import UiMailStyleFields from './UiMailStyleFields.vue'
import UiSegmented from './UiSegmented.vue'
import UiSelect from './UiSelect.vue'
import { BLOCK_ICONS, BLOCK_TITLES, COLUMN_RATIOS, blockName, resizeColumns } from './mailBlocks'

/*
 * LES REGLAGES DU BLOC CHOISI DANS LE COURRIEL (Adion UI,
 * 2026-10-14).
 *
 * Un seul bloc a la fois : c'est la contrepartie de l'edition sur le
 * document. On choisit sur le message, on regle ici, et le message se
 * redessine. Chaque changement emet `update` avec le bloc entier, jamais un
 * morceau : l'ecran le range a son adresse (mailBlocks.replaceBlock).
 *
 * LES IMAGES. Le composant ne parle a personne : `upload(file)` depose une
 * image et rend { id, url, width, height, name } ; `gallery()` rend les images
 * deja deposees ; `remove(image)` en retire une. Les trois sont fournis par
 * l'ecran, qui sait a qui parler. Une image se depose aussi en la glissant
 * sur la zone du bloc, ou sur le courriel lui-meme (UiMailCanvas).
 *
 * LE REGLAGE FIN (2026-10-15) : typographie, boite, bouton, section - dans
 * UiMailStyleFields, avec le vocabulaire que l'API donne (`editor`).
 */
const props = defineProps({
  block: { type: Object, default: null },
  /** Les variables du message ({ nom: aide }) : de quoi poser une condition d'affichage. */
  variables: { type: Object, default: () => ({}) },
  disabled: { type: Boolean, default: false },
  upload: { type: Function, default: null },
  gallery: { type: Function, default: null },
  remove: { type: Function, default: null },
  /** Le vocabulaire de l'editeur riche (polices, graisses…), donne par l'API. */
  editor: { type: Object, default: () => ({}) },
  /** Le bloc est-il pose dans une colonne ? Une section n'y entre pas. */
  nested: { type: Boolean, default: false },
})
const emit = defineEmits(['update', 'remove', 'duplicate', 'close', 'pick-child', 'add-child'])

const uploading = ref(false)
const erreur = ref('')
const library = ref(false)
let picking = null

const LEVELS = Object.freeze([
  { title: 'Grand', value: 1 },
  { title: 'Moyen', value: 2 },
  { title: 'Petit', value: 3 },
])
const COUNTS = Object.freeze([
  { value: 1, label: 'Une' },
  { value: 2, label: 'Deux' },
  { value: 3, label: 'Trois' },
])

/* Ce que chaque type de bloc sait regler (MailBlockStyle de l'API). */
const STYLE_GROUPS = Object.freeze({
  heading: ['text', 'box'],
  text: ['text', 'box'],
  badge: ['text', 'box'],
  code: ['text', 'box'],
  note: ['text', 'box'],
  list: ['text', 'box'],
  link: ['text', 'box'],
  facts: ['box'],
  button: ['button', 'text', 'box'],
  image: ['box'],
  divider: ['divider'],
})
const VALIGNS = Object.freeze([
  { title: 'En haut', value: 'top' },
  { title: 'Au milieu', value: 'middle' },
  { title: 'En bas', value: 'bottom' },
])

/* Ecrit en JavaScript : dans un gabarit Vue, les accolades sont une interpolation. */
const URL_PLACEHOLDER = 'https://… ou {{ url }}'

const repartitions = computed(() => (COLUMN_RATIOS[(props.block?.columns || []).length] || COLUMN_RATIOS[2])
  .map((r) => ({ title: r.title, value: r.value })))

const variableNames = computed(() => Object.keys(props.variables || {}))
const conditions = computed(() => [
  { title: 'Toujours affiché', value: null },
  ...variableNames.value.map((name) => ({ title: `Seulement si « ${name} » est renseigné`, value: name })),
])

function set(field, value) {
  emit('update', { ...props.block, [field]: value })
}

function setItem(line, field, value) {
  const items = (props.block.items || []).map((item, j) => (j === line ? { ...item, [field]: value } : item))
  emit('update', { ...props.block, items })
}

function addItem() {
  emit('update', { ...props.block, items: [...(props.block.items || []), {}] })
}

function removeItem(line) {
  emit('update', { ...props.block, items: (props.block.items || []).filter((_, j) => j !== line) })
}

function changerNombre(count) {
  emit('update', resizeColumns(props.block, Number(count) || 2))
}

/** Le reglage fin du bloc ; vide, il disparait du bloc. */
function setStyle(style) {
  const next = { ...props.block }
  if (style && Object.keys(style).length) next.style = style
  else delete next.style
  emit('update', next)
}

function setColumnStyle(c, style) {
  const columns = (props.block.columns || []).map((column, i) => {
    if (i !== c) return column
    const next = { ...column }
    if (style && Object.keys(style).length) next.style = style
    else delete next.style
    return next
  })
  emit('update', { ...props.block, columns })
}

/**
 * Deposer une image. La largeur du bloc suit celle de l'image, plafonnee a
 * la largeur du courriel : une banniere de 2 400 px deborderait partout.
 */
async function deposer(file) {
  if (!file || !props.upload) return
  uploading.value = true
  erreur.value = ''
  try {
    poserImage(await props.upload(file))
  } catch (e) {
    erreur.value = e?.message || 'L’image n’a pas pu être déposée.'
  } finally {
    uploading.value = false
  }
}

function poserImage(image) {
  emit('update', { ...props.block, url: image.url, width: Math.min(image.width || 0, 600) })
}

/* « Mes images » : pour le bloc image, ou pour choisir un fond (rend l'adresse). */
function ouvrirImages() {
  picking = null
  library.value = true
}

function choisirFond() {
  return new Promise((resolve) => {
    picking = resolve
    library.value = true
  })
}

function onPick(image) {
  if (picking) {
    picking(image.url)
    picking = null
  } else if (props.block?.type === 'image') {
    poserImage(image)
  }
}

function onLibrary(open) {
  library.value = open
  if (!open && picking) {
    picking(null)
    picking = null
  }
}
</script>

<template>
  <div v-if="block" class="ui-mail-settings">
    <header class="ui-mail-settings__head">
      <v-icon :icon="BLOCK_ICONS[block.type] || 'mdi-shape-outline'" size="17" />
      <span class="ui-mail-settings__type">{{ block.type === 'columns' ? blockName(block) : (BLOCK_TITLES[block.type] || block.type) }}</span>
      <span class="ui-mail-settings__spacer" />
      <v-btn icon="mdi-content-duplicate" variant="text" size="small" class="ui-btn" title="Dupliquer" aria-label="Dupliquer" :disabled="disabled" @click="$emit('duplicate')" />
      <v-btn icon="mdi-delete-outline" variant="text" size="small" class="ui-btn" title="Supprimer" aria-label="Supprimer" :disabled="disabled" @click="$emit('remove')" />
      <v-btn icon="mdi-close" variant="text" size="small" class="ui-btn" title="Fermer" aria-label="Fermer" @click="$emit('close')" />
    </header>

    <div class="ui-mail-settings__fields">
      <!-- Titre -->
      <template v-if="block.type === 'heading'">
        <UiInput :model-value="block.text" label="Titre" multiline :rows="2" :disabled="disabled" @update:model-value="set('text', $event)" />
        <div class="ui-mail-settings__row">
          <UiSelect :model-value="block.level || 1" :items="LEVELS" label="Taille" :disabled="disabled" @update:model-value="set('level', $event)" />
          <UiField label="Alignement"><UiMailAlignPicker :model-value="block.align" :disabled="disabled" @update:model-value="set('align', $event)" /></UiField>
        </div>
      </template>

      <!-- Chapeau -->
      <UiInput v-else-if="block.type === 'badge'" :model-value="block.text" label="Chapeau" tip="Quelques mots en majuscules, au-dessus du titre." :disabled="disabled" @update:model-value="set('text', $event)" />

      <!-- Code -->
      <template v-else-if="block.type === 'code'">
        <UiInput :model-value="block.text" label="Code" tip="Écrit en grand et espacé : on le lit sur un écran pour le taper sur un autre." :disabled="disabled" @update:model-value="set('text', $event)" />
        <UiField label="Alignement"><UiMailAlignPicker :model-value="block.align" :disabled="disabled" @update:model-value="set('align', $event)" /></UiField>
      </template>

      <!-- Paragraphe -->
      <template v-else-if="block.type === 'text'">
        <UiInput :model-value="block.text" label="Texte" multiline :rows="5" :disabled="disabled" @update:model-value="set('text', $event)" />
        <div class="ui-mail-settings__row">
          <UiField label="Alignement"><UiMailAlignPicker :model-value="block.align" :disabled="disabled" @update:model-value="set('align', $event)" /></UiField>
          <UiCheckbox :model-value="!!block.muted" switch label="Petit et discret" :disabled="disabled" @update:model-value="set('muted', $event)" />
        </div>
        <p class="ui-mail-settings__note">Double-cliquez le texte dans le courriel pour mettre un mot en gras, en italique, souligné, en couleur ou en lien.</p>
      </template>

      <!-- Bouton -->
      <template v-else-if="block.type === 'button'">
        <UiInput :model-value="block.label" label="Texte du bouton" :disabled="disabled" @update:model-value="set('label', $event)" />
        <UiInput :model-value="block.url" label="Adresse" :placeholder="URL_PLACEHOLDER" tip="Une adresse web, ou une variable. Un bouton qui ne pointe pas vers le web ne part pas." :disabled="disabled" @update:model-value="set('url', $event)" />
        <UiInput :model-value="block.hint" label="Précision sous le bouton" :disabled="disabled" @update:model-value="set('hint', $event)" />
        <UiField label="Alignement"><UiMailAlignPicker :model-value="block.align" :disabled="disabled" @update:model-value="set('align', $event)" /></UiField>
      </template>

      <!-- Lien en clair -->
      <template v-else-if="block.type === 'link'">
        <UiInput :model-value="block.text" label="Phrase d’introduction" :disabled="disabled" @update:model-value="set('text', $event)" />
        <UiInput :model-value="block.url" label="Adresse" tip="Le lien écrit en toutes lettres : c’est ce qui reste quand une messagerie d’entreprise supprime les boutons." :disabled="disabled" @update:model-value="set('url', $event)" />
      </template>

      <!-- Encadre -->
      <template v-else-if="block.type === 'note'">
        <UiInput :model-value="block.title" label="Titre de l’encadré" :disabled="disabled" @update:model-value="set('title', $event)" />
        <UiInput :model-value="block.text" label="Texte" multiline :rows="3" :disabled="disabled" @update:model-value="set('text', $event)" />
      </template>

      <!-- Tableau de faits -->
      <template v-else-if="block.type === 'facts'">
        <UiInput :model-value="block.title" label="Titre du tableau" :disabled="disabled" @update:model-value="set('title', $event)" />
        <div v-for="(item, line) in block.items || []" :key="line" class="ui-mail-settings__line">
          <UiInput :model-value="item.label" label="Intitulé" :disabled="disabled" @update:model-value="setItem(line, 'label', $event)" />
          <UiInput :model-value="item.value" label="Valeur" :disabled="disabled" @update:model-value="setItem(line, 'value', $event)" />
          <v-btn icon="mdi-close" variant="text" size="small" class="ui-btn" title="Retirer" aria-label="Retirer" :disabled="disabled" @click="removeItem(line)" />
        </div>
        <div><v-btn variant="tonal" size="small" class="btn-sentence-case ui-btn" prepend-icon="mdi-plus" :disabled="disabled" @click="addItem">Ajouter une ligne</v-btn></div>
        <p v-if="block.items_from" class="ui-mail-settings__note">Ce tableau reçoit aussi « {{ block.items_from }} », rempli au moment de l’envoi.</p>
      </template>

      <!-- Liste -->
      <template v-else-if="block.type === 'list'">
        <div v-for="(item, line) in block.items || []" :key="line" class="ui-mail-settings__line">
          <UiInput :model-value="item.text" label="Élément" :disabled="disabled" @update:model-value="setItem(line, 'text', $event)" />
          <v-btn icon="mdi-close" variant="text" size="small" class="ui-btn" title="Retirer" aria-label="Retirer" :disabled="disabled" @click="removeItem(line)" />
        </div>
        <div><v-btn variant="tonal" size="small" class="btn-sentence-case ui-btn" prepend-icon="mdi-plus" :disabled="disabled" @click="addItem">Ajouter un élément</v-btn></div>
      </template>

      <!-- Image -->
      <template v-else-if="block.type === 'image'">
        <img v-if="block.url" :src="block.url" :alt="block.alt || ''" class="ui-mail-settings__preview">
        <UiMailDropZone v-if="upload" :busy="uploading" :disabled="disabled" compact :text="block.url ? 'Glissez une autre image ici, ou cliquez' : 'Glissez une image ici, ou cliquez pour la choisir'" @file="deposer" @error="(m) => (erreur = m)" />
        <div><v-btn variant="tonal" size="small" class="btn-sentence-case ui-btn" prepend-icon="mdi-image-multiple-outline" :disabled="disabled || !gallery" @click="ouvrirImages">Mes images</v-btn></div>
        <p v-if="erreur" class="ui-field__error" role="alert">{{ erreur }}</p>

        <UiInput :model-value="block.url" label="Adresse de l’image" placeholder="https://…" :disabled="disabled" @update:model-value="set('url', $event)" />
        <div class="ui-mail-settings__row">
          <UiInput :model-value="block.width" label="Largeur (px)" type="number" :disabled="disabled" @update:model-value="set('width', Number($event) || 0)" />
          <UiField label="Alignement"><UiMailAlignPicker :model-value="block.align" :disabled="disabled" @update:model-value="set('align', $event)" /></UiField>
        </div>
        <UiInput :model-value="block.alt" label="Description" tip="Lue par les messageries qui n’affichent pas les images — c’est-à-dire la plupart, au premier message." :disabled="disabled" @update:model-value="set('alt', $event)" />
        <UiInput :model-value="block.href" label="Lien au clic" :disabled="disabled" @update:model-value="set('href', $event)" />
      </template>

      <!-- Espace -->
      <UiField v-else-if="block.type === 'spacer'" :label="`Hauteur : ${block.size || 24} px`">
        <v-slider
          :model-value="block.size || 24"
          :min="4"
          :max="96"
          :step="4"
          hide-details
          density="compact"
          color="primary"
          :disabled="disabled"
          @update:model-value="set('size', $event)"
        />
      </UiField>

      <p v-else-if="block.type === 'divider'" class="ui-mail-settings__note">Un filet horizontal, sur toute la largeur.</p>

      <!-- Colonnes -->
      <template v-else-if="block.type === 'columns'">
        <UiSegmented :model-value="(block.columns || []).length" :items="COUNTS" label="Colonnes" @update:model-value="changerNombre" />
        <UiSelect v-if="(block.columns || []).length > 1" :model-value="block.ratio" :items="repartitions" label="Répartition" :disabled="disabled" @update:model-value="set('ratio', $event)" />
        <div class="ui-mail-settings__row">
          <UiSelect :model-value="block.valign || 'top'" :items="VALIGNS" label="Alignement" :disabled="disabled" @update:model-value="set('valign', $event)" />
          <UiInput :model-value="block.gap ?? 20" label="Écart (px)" type="number" :disabled="disabled" @update:model-value="set('gap', Math.max(0, Math.min(48, Number($event) || 0)))" />
        </div>
        <UiCheckbox
          :model-value="block.stack !== false"
          switch
          label="Empiler sur téléphone"
          text="Sur un écran étroit, les colonnes passent l’une sous l’autre. Quelques messageries anciennes les gardent côte à côte."
          :disabled="disabled"
          @update:model-value="set('stack', $event !== false)"
        />

        <UiMailStyleFields :model-value="block.style || {}" :groups="nested ? ['box'] : ['section']" :editor="editor" :disabled="disabled" :pick="gallery ? choisirFond : null" @update:model-value="setStyle" />

        <div v-for="(column, c) in block.columns || []" :key="c" class="ui-mail-settings__column">
          <p class="ui-mail-settings__label">{{ (block.columns || []).length > 1 ? `Colonne ${c + 1}` : 'Contenu' }}</p>
          <div class="ui-mail-settings__chips">
            <button
              v-for="(child, k) in column.blocks || []"
              :key="k"
              type="button"
              class="ui-mail-settings__chip"
              @click="$emit('pick-child', { column: c, child: k })"
            >
              {{ blockName(child) }}
            </button>
            <span v-if="!(column.blocks || []).length" class="ui-mail-settings__empty">Vide</span>
            <UiMailBlockMenu :columns="false" :disabled="disabled" @pick="(type) => $emit('add-child', { column: c, type })" />
          </div>
          <UiMailStyleFields v-if="(block.columns || []).length > 1" :model-value="column.style || {}" :groups="['column']" :editor="editor" :disabled="disabled" :pick="gallery ? choisirFond : null" @update:model-value="(style) => setColumnStyle(c, style)" />
        </div>
        <p class="ui-mail-settings__note">Cliquez un bloc du courriel pour le régler : ceux d’une colonne se sélectionnent comme les autres.</p>
      </template>

      <!-- Le reglage fin : typographie, bouton, boite (UiMailStyleFields). -->
      <UiMailStyleFields
        v-if="STYLE_GROUPS[block.type]"
        :model-value="block.style || {}"
        :groups="STYLE_GROUPS[block.type]"
        :editor="editor"
        :disabled="disabled"
        :pick="gallery ? choisirFond : null"
        @update:model-value="setStyle"
      />

      <!--
        La condition d'affichage : elle permet d'ecrire « Bonjour {{ prenom }} »
        sans qu'un contact sans prenom recoive un bloc vide.
      -->
      <UiSelect
        v-if="variableNames.length"
        :model-value="block.visible_if || null"
        :items="conditions"
        label="Affichage"
        :disabled="disabled"
        @update:model-value="set('visible_if', $event)"
      />
    </div>

    <UiMailImageLibrary
      v-if="gallery"
      :model-value="library"
      :gallery="gallery"
      :upload="upload"
      :remove="remove"
      selectable
      @update:model-value="onLibrary"
      @pick="onPick"
    />
  </div>
</template>
