<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import UiMailBlockSettings from './UiMailBlockSettings.vue'
import UiMailCanvas from './UiMailCanvas.vue'
import {
  blockAt,
  clone,
  duplicateBlock as duplicateAt,
  insertBlock as insertAt,
  labelsFor,
  moveBlock as moveAt,
  patchBlock,
  removeBlock as removeAt,
  replaceBlock,
} from './mailBlocks'

/*
 * LE STUDIO D'UN COURRIEL (Adion UI,
 * 2026-10-14).
 *
 * ON TRAVAILLE SUR LE MESSAGE, PAS A COTE. Le courriel occupe la place
 * (UiMailCanvas) ; on clique un bloc dedans, on le regle dans le volet de
 * droite (UiMailBlockSettings), on le deplace a la souris, on en insere un
 * entre deux autres. Rien de choisi : le volet montre ce que l'ecran met
 * dans le creneau `panel` (l'objet, les variables, les versions...).
 *
 * LE MEME POUR UN MODELE ET POUR UNE CAMPAGNE. Le studio ne sait pas ce qu'il
 * edite : `v-model` est le document entier ({ subject, preheader, blocks,
 * ... }), dont seuls les blocs se touchent ici. L'ecran demande le rendu a
 * L'API a chaque `refresh` (apercu `editable`, dans le jeu de couleurs
 * `scheme`) et le rend par `html`.
 *
 * L'HISTORIQUE. Un editeur visuel sans « annuler » se prete mal a l'essai.
 * Le document est petit : on le garde en entier, cinquante pas en arriere.
 * Changer `document-key` (un autre modele) repart d'un historique vide.
 *
 * LES IMAGES (2026-10-15). Une image glissee sur le courriel est deposee
 * (`upload`) puis posee : elle remplace l'image visee, ou s'ajoute sous le
 * bloc vise. « Mes images » se gere depuis le reglage d'une image
 * (`gallery`, `remove`). `editor` : le vocabulaire de l'editeur riche,
 * donne par l'API.
 */
const props = defineProps({
  modelValue: { type: Object, required: true },
  documentKey: { type: String, default: '' },
  html: { type: String, default: '' },
  subject: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  scheme: { type: String, default: 'light' },
  disabled: { type: Boolean, default: false },
  zones: { type: Array, default: () => ['body'] },
  variables: { type: Object, default: () => ({}) },
  upload: { type: Function, default: null },
  gallery: { type: Function, default: null },
  remove: { type: Function, default: null },
  editor: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:modelValue', 'update:scheme', 'refresh'])

const dropping = ref(false)
const dropError = ref('')

const selection = ref(null)
const width = ref('desktop')
const writing = ref(false)

const blocks = computed(() => props.modelValue?.blocks || [])

function setBlocks(next) {
  emit('update:modelValue', { ...props.modelValue, blocks: next })
}

const activeBlock = computed(() => {
  if (!selection.value || !props.zones.includes(selection.value.zone)) return null
  return blockAt(blocks.value, selection.value)
})

/** Le nom que porte chaque bloc dans le courriel, au survol - colonnes comprises. */
const labels = computed(() => labelsFor('body', blocks.value, props.zones.includes('body') ? null : 'Bloc'))

// -------------------------------------------------------------------
// L'historique
// -------------------------------------------------------------------

const history = ref([])
const historyAt = ref(-1)
let paused = false

const canUndo = computed(() => historyAt.value > 0)
const canRedo = computed(() => historyAt.value < history.value.length - 1)

const snapshot = () => JSON.stringify(props.modelValue || {})

function resetHistory() {
  history.value = [snapshot()]
  historyAt.value = 0
  selection.value = null
}

function remember() {
  if (paused) return
  const etat = snapshot()
  if (history.value[historyAt.value] === etat) return
  history.value = history.value.slice(0, historyAt.value + 1)
  history.value.push(etat)
  if (history.value.length > 50) history.value.shift()
  historyAt.value = history.value.length - 1
}

function goTo(index) {
  const etat = history.value[index]
  if (!etat) return
  paused = true
  emit('update:modelValue', JSON.parse(etat))
  historyAt.value = index
  selection.value = null
  // Le temps que les champs se reposent, sans quoi on enregistrerait le pas.
  setTimeout(() => { paused = false }, 60)
}

/* On note le pas en cours avant de reculer : les observateurs passent au tour suivant. */
function undo() {
  remember()
  if (canUndo.value) goTo(historyAt.value - 1)
}

function redo() {
  remember()
  if (canRedo.value) goTo(historyAt.value + 1)
}

// -------------------------------------------------------------------
// Les blocs, modifies sur le courriel
// -------------------------------------------------------------------

function updateBlock(block) {
  setBlocks(replaceBlock(blocks.value, selection.value, block))
}

function insertBlock({ address, type }) {
  if (props.disabled) return
  const result = insertAt(blocks.value, address, type)
  setBlocks(result.blocks)
  selection.value = result.selection
}

function moveBlock({ address, to }) {
  if (props.disabled) return
  const result = moveAt(blocks.value, address, to)
  if (!result) return
  setBlocks(result.blocks)
  selection.value = result.selection
}

function removeBlock(address) {
  if (props.disabled) return
  setBlocks(removeAt(blocks.value, address))
  selection.value = null
}

function duplicateBlock(address) {
  if (props.disabled) return
  const result = duplicateAt(blocks.value, address)
  setBlocks(result.blocks)
  selection.value = result.selection
}

/** Un bloc d'une colonne, choisi depuis le volet plutot que sur le courriel. */
function pickChild({ column, child }) {
  selection.value = { ...selection.value, column, child }
}

function addChild({ column, type }) {
  const parent = selection.value
  const children = blockAt(blocks.value, parent)?.columns?.[column]?.blocks || []
  insertBlock({ address: { zone: parent.zone, index: parent.index, column, child: children.length }, type })
}

/**
 * Une image glissee sur le courriel : deposee, puis posee - a la place de
 * l'image visee, ou dans un nouveau bloc sous le bloc vise.
 */
async function dropFiles({ files, address, mode }) {
  if (props.disabled || !props.upload) return
  const file = (files || []).find((f) => f.type?.startsWith('image/'))
  if (!file) {
    dropError.value = 'Seules les images PNG, JPEG, GIF et WebP s’affichent dans un courriel.'
    return
  }
  dropping.value = true
  dropError.value = ''
  try {
    const image = await props.upload(file)
    const width = Math.min(image.width || 0, 600)
    if (mode === 'replace') {
      const block = blockAt(blocks.value, address)
      if (block) setBlocks(replaceBlock(blocks.value, address, { ...block, url: image.url, width }))
      selection.value = { ...address }
    } else {
      const result = insertAt(blocks.value, address, 'image')
      const placed = { ...clone(blockAt(result.blocks, result.selection)), url: image.url, width, alt: '' }
      setBlocks(replaceBlock(result.blocks, result.selection, placed))
      selection.value = result.selection
    }
  } catch (e) {
    dropError.value = e?.message || 'L’image n’a pas pu être déposée.'
  } finally {
    dropping.value = false
  }
}

/** Ce qu'on vient de taper dans le courriel : le document dit quel bloc et quel champ. */
function applyText({ address, field, value }) {
  if (props.disabled) return
  const next = patchBlock(blocks.value, address, field, value)
  if (next) setBlocks(next)
}

// -------------------------------------------------------------------
// Le clavier
// -------------------------------------------------------------------

function onShortcut(action) {
  if (action === 'escape') selection.value = null
  else if (action === 'undo') undo()
  else if (action === 'redo') redo()
}

/* On ne prend la main que hors des champs : dans un formulaire, « annuler » appartient au navigateur. */
function onKey(event) {
  const cible = event.target
  const dansUnChamp = cible instanceof HTMLElement
    && (cible.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(cible.tagName))

  if (event.key === 'Escape' && !dansUnChamp) {
    selection.value = null
    return
  }
  if (dansUnChamp || !(event.ctrlKey || event.metaKey)) return

  const touche = event.key.toLowerCase()
  if (touche === 'z' && !event.shiftKey) {
    event.preventDefault()
    undo()
  } else if ((touche === 'z' && event.shiftKey) || touche === 'y') {
    event.preventDefault()
    redo()
  }
}

// -------------------------------------------------------------------
// Le rendu : redemande a chaque changement, pas a chaque touche
// -------------------------------------------------------------------

let timer = null
function schedule() {
  // Recharger l'iframe pendant qu'on y ecrit ferait perdre le curseur.
  if (writing.value) return
  clearTimeout(timer)
  timer = setTimeout(() => emit('refresh'), 300)
}

watch(() => snapshot(), () => {
  remember()
  schedule()
})

/* La saisie finie, le document se redessine avec ce qu'on a ecrit. */
watch(writing, (encours) => {
  if (!encours) emit('refresh')
})

watch(() => props.documentKey, resetHistory)

onMounted(() => {
  resetHistory()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('keydown', onKey)
})

defineExpose({ undo, redo, canUndo, canRedo, resetHistory, clearSelection: () => { selection.value = null } })
</script>

<template>
  <div class="ui-mail-studio">
    <UiMailCanvas
      v-model:width="width"
      :scheme="scheme"
      :subject="subject"
      :html="html"
      :loading="loading"
      :selected="selection"
      :editable="!disabled"
      :zones="zones"
      :labels="labels"
      @update:scheme="(v) => emit('update:scheme', v)"
      @select="selection = $event"
      @insert="insertBlock"
      @move="moveBlock"
      @remove="removeBlock"
      @duplicate="duplicateBlock"
      @text="applyText"
      @writing="writing = $event"
      @shortcut="onShortcut"
      @refresh="emit('refresh')"
      @drop-files="dropFiles"
    >
      <template #extra>
        <v-btn icon="mdi-undo" variant="text" size="small" class="ui-btn" title="Annuler (Ctrl+Z)" aria-label="Annuler" :disabled="!canUndo" @click="undo" />
        <v-btn icon="mdi-redo" variant="text" size="small" class="ui-btn" title="Rétablir (Ctrl+Maj+Z)" aria-label="Rétablir" :disabled="!canRedo" @click="redo" />
        <slot name="extra" />
      </template>
    </UiMailCanvas>
    <p v-if="dropping || dropError" class="ui-mail-studio__drop" :class="{ 'is-error': dropError }" role="status">
      <v-progress-circular v-if="dropping" indeterminate size="14" />
      {{ dropping ? 'Envoi et préparation de l’image…' : dropError }}
    </p>

    <aside class="ui-mail-studio__panel">
      <UiMailBlockSettings
        v-if="activeBlock"
        :block="activeBlock"
        :variables="variables"
        :disabled="disabled"
        :upload="upload"
        :gallery="gallery"
        :remove="remove"
        :editor="editor"
        :nested="selection?.column !== undefined && selection?.column !== null"
        @update="updateBlock"
        @remove="removeBlock(selection)"
        @duplicate="duplicateBlock(selection)"
        @pick-child="pickChild"
        @add-child="addChild"
        @close="selection = null"
      />

      <!-- Un bloc choisi qui n'appartient pas a cet ecran : l'en-tete ou le pied de page. -->
      <div v-else-if="selection" class="ui-mail-studio__locked">
        <v-icon icon="mdi-lock-outline" size="20" />
        <slot name="locked" :selection="selection" :close="() => (selection = null)">
          <p>Cet élément appartient à l’apparence et vaut pour tous les messages.</p>
        </slot>
      </div>

      <!-- Rien de choisi : les reglages d'ensemble, que l'ecran fournit. -->
      <slot v-else name="panel" />
    </aside>
  </div>
</template>
