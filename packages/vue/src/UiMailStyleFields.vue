<script setup>
import { computed } from 'vue'
import UiCheckbox from './UiCheckbox.vue'
import UiColorInput from './UiColorInput.vue'
import UiField from './UiField.vue'
import UiInput from './UiInput.vue'
import UiSegmented from './UiSegmented.vue'
import UiSelect from './UiSelect.vue'

/*
 * LE REGLAGE FIN D'UN BLOC DE COURRIEL (Adion UI, 2026-10-15) :
 * un vrai editeur, avec des polices et des tailles.
 *
 * Trois groupes repliables, selon ce que le bloc sait faire :
 *
 *   Texte   police (liste fermee de l'API, polices web signalees), taille,
 *           graisse, interlignage, espacement des lettres, couleur,
 *           majuscules ;
 *   Bouton  forme, taille, couleurs, filet et couleurs au survol ;
 *   Boite   marges interieures, ecart dessous, fond (couleur, couleur en
 *           sombre, image), bordure, arrondi, largeur ; pour une section,
 *           la pleine largeur.
 *
 * Le composant ne connait aucune liste : polices, graisses, formes… viennent
 * de l'API (`editor`, GET …/template/starter). Il emet le `style` entier ;
 * une valeur videe disparait du style, et le bloc reprend celle du theme.
 *
 *   groups   ['text', 'button', 'box', 'section', 'column', 'divider']
 *   pick     fonction facultative : ouvre « Mes images » et rend l'adresse
 *            de l'image choisie, pour un fond
 */
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  groups: { type: Array, default: () => ['text', 'box'] },
  editor: { type: Object, default: () => ({}) },
  disabled: { type: Boolean, default: false },
  pick: { type: Function, default: null },
})
const emit = defineEmits(['update:modelValue'])

const style = computed(() => props.modelValue || {})
const has = (group) => props.groups.includes(group)

const fonts = computed(() => [
  { title: 'Celle du thème', value: null },
  ...(props.editor.fonts || []).map((f) => ({ title: f.web ? `${f.label} · web` : f.label, value: f.key })),
])
const weights = computed(() => [{ title: 'Celle du bloc', value: null }, ...(props.editor.weights || []).map((w) => ({ title: w.label, value: w.value }))])
const transforms = computed(() => (props.editor.transforms || []).map((t) => ({ value: t.value, label: t.label })))
const shapes = computed(() => (props.editor.shapes || []).map((t) => ({ value: t.value, label: t.label })))
const sizes = computed(() => (props.editor.button_sizes || []).map((t) => ({ value: t.value, label: t.label })))
const borders = computed(() => (props.editor.border_styles || []).map((t) => ({ title: t.label, value: t.value })))
const webFont = computed(() => (props.editor.fonts || []).find((f) => f.key === style.value.font)?.web)

const SIDES = Object.freeze([['Haut', 0], ['Droite', 1], ['Bas', 2], ['Gauche', 3]])

/** Poser une valeur ; vide, la retirer : le bloc reprend celle du theme. */
function set(key, value) {
  const next = { ...style.value }
  if (value === null || value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))) delete next[key]
  else next[key] = value
  emit('update:modelValue', next)
}

const num = (value) => (value === '' || value === null || value === undefined ? null : Number(value))

function setPadding(side, value) {
  const padding = [...(style.value.padding || [0, 0, 0, 0])]
  padding[side] = Math.max(0, Math.min(120, Number(value) || 0))
  set('padding', padding.every((v) => v === 0) && !style.value.padding ? null : padding)
}

async function chooseImage() {
  if (!props.pick) return
  const url = await props.pick()
  if (url) set('background_image', url)
}
</script>

<template>
  <div class="ui-mail-style">
    <details v-if="has('text')" class="ui-mail-style__group">
      <summary class="ui-mail-style__summary"><v-icon icon="mdi-format-font" size="16" />Texte</summary>
      <div class="ui-mail-style__body">
        <UiSelect :model-value="style.font || null" :items="fonts" label="Police" :disabled="disabled" @update:model-value="set('font', $event)" />
        <p v-if="webFont" class="ui-mail-settings__note">{{ editor.font_web_hint }}</p>
        <div class="ui-mail-settings__row">
          <UiInput :model-value="style.size ?? ''" label="Taille (px)" type="number" placeholder="Auto" :disabled="disabled" @update:model-value="set('size', num($event))" />
          <UiSelect :model-value="style.weight || null" :items="weights" label="Graisse" :disabled="disabled" @update:model-value="set('weight', $event)" />
        </div>
        <div class="ui-mail-settings__row">
          <UiInput :model-value="style.line_height ?? ''" label="Interlignage" type="number" step="0.05" placeholder="Auto" :disabled="disabled" @update:model-value="set('line_height', num($event))" />
          <UiInput :model-value="style.letter_spacing ?? ''" label="Espacement (px)" type="number" step="0.5" placeholder="0" :disabled="disabled" @update:model-value="set('letter_spacing', num($event))" />
        </div>
        <div class="ui-mail-style__color">
          <UiColorInput :model-value="style.color || ''" label="Couleur du texte" :disabled="disabled" @update:model-value="set('color', $event)" />
          <button v-if="style.color" type="button" class="ui-mail-style__reset" title="Reprendre la couleur du thème" @click="set('color', null)"><v-icon icon="mdi-close" size="14" /></button>
        </div>
        <UiSegmented v-if="transforms.length" :model-value="style.transform || 'none'" :items="transforms" label="Casse" @update:model-value="set('transform', $event === 'none' ? null : $event)" />
      </div>
    </details>

    <details v-if="has('button')" class="ui-mail-style__group" open>
      <summary class="ui-mail-style__summary"><v-icon icon="mdi-gesture-tap-button" size="16" />Bouton</summary>
      <div class="ui-mail-style__body">
        <UiSegmented v-if="shapes.length" :model-value="style.shape || null" :items="shapes" label="Forme" @update:model-value="set('shape', $event)" />
        <UiSegmented v-if="sizes.length" :model-value="style.button_size || 'md'" :items="sizes" label="Taille" @update:model-value="set('button_size', $event === 'md' ? null : $event)" />
        <div class="ui-mail-panel__colors">
          <UiColorInput :model-value="style.button_background || ''" label="Fond" :disabled="disabled" @update:model-value="set('button_background', $event)" />
          <UiColorInput :model-value="style.button_color || ''" label="Texte" :disabled="disabled" @update:model-value="set('button_color', $event)" />
          <UiColorInput :model-value="style.hover_background || ''" label="Fond au survol" :disabled="disabled" @update:model-value="set('hover_background', $event)" />
          <UiColorInput :model-value="style.hover_color || ''" label="Texte au survol" :disabled="disabled" @update:model-value="set('hover_color', $event)" />
          <UiColorInput :model-value="style.button_border_color || ''" label="Filet" :disabled="disabled" @update:model-value="set('button_border_color', $event)" />
        </div>
        <UiCheckbox :model-value="style.width === 100" switch label="Toute la largeur" :disabled="disabled" @update:model-value="set('width', $event ? 100 : null)" />
        <p class="ui-mail-settings__note">Le survol s’affiche dans Apple Mail, iOS et les messageries web qui gardent les styles ; les autres montrent le bouton tel quel.</p>
      </div>
    </details>

    <details v-if="has('divider')" class="ui-mail-style__group" open>
      <summary class="ui-mail-style__summary"><v-icon icon="mdi-minus" size="16" />Filet</summary>
      <div class="ui-mail-style__body">
        <UiColorInput :model-value="style.color || ''" label="Couleur" :disabled="disabled" @update:model-value="set('color', $event)" />
        <div class="ui-mail-settings__row">
          <UiInput :model-value="style.border_width ?? ''" label="Épaisseur (px)" type="number" placeholder="1" :disabled="disabled" @update:model-value="set('border_width', num($event))" />
          <UiInput :model-value="style.width ?? ''" label="Largeur (%)" type="number" placeholder="100" :disabled="disabled" @update:model-value="set('width', num($event))" />
        </div>
        <UiInput :model-value="style.margin_bottom ?? ''" label="Espace dessous (px)" type="number" placeholder="0" :disabled="disabled" @update:model-value="set('margin_bottom', num($event))" />
      </div>
    </details>

    <details v-if="has('box') || has('section') || has('column')" class="ui-mail-style__group" :open="has('section') || has('column')">
      <summary class="ui-mail-style__summary"><v-icon icon="mdi-border-all-variant" size="16" />{{ has('section') ? 'Section' : has('column') ? 'Colonne' : 'Boîte' }}</summary>
      <div class="ui-mail-style__body">
        <UiCheckbox
          v-if="has('section')"
          :model-value="!!style.full_width"
          switch
          label="Fond sur toute la largeur"
          text="La bande de couleur va d’un bord à l’autre du message ; le contenu reste au milieu."
          :disabled="disabled"
          @update:model-value="set('full_width', $event ? true : null)"
        />
        <div class="ui-mail-panel__colors">
          <UiColorInput :model-value="style.background || ''" label="Fond" :disabled="disabled" @update:model-value="set('background', $event)" />
          <UiColorInput :model-value="style.dark_background || ''" label="Fond en mode sombre" tip="Ce que montrent Apple Mail, iOS et Outlook quand le lecteur est en sombre. Vide : le fond clair reste, et ses textes aussi." :disabled="disabled" @update:model-value="set('dark_background', $event)" />
        </div>
        <div class="ui-mail-style__image">
          <UiInput :model-value="style.background_image || ''" label="Image de fond" placeholder="https://…" tip="Outlook pour Windows ne l’affiche pas : il garde la couleur de fond." :disabled="disabled" @update:model-value="set('background_image', $event)" />
          <v-btn v-if="pick" variant="tonal" size="small" class="btn-sentence-case ui-btn" prepend-icon="mdi-image-multiple-outline" :disabled="disabled" @click="chooseImage">Mes images</v-btn>
        </div>
        <UiField label="Marges intérieures (px)">
          <div class="ui-mail-style__sides">
            <label v-for="[name, side] in SIDES" :key="side" class="ui-mail-style__side">
              <span>{{ name }}</span>
              <input type="number" min="0" max="120" class="ui-mail-style__number" :value="(style.padding || [])[side] ?? ''" placeholder="auto" :disabled="disabled" @change="setPadding(side, $event.target.value)">
            </label>
          </div>
        </UiField>
        <div class="ui-mail-settings__row">
          <UiInput :model-value="style.radius ?? ''" label="Arrondi (px)" type="number" placeholder="0" :disabled="disabled" @update:model-value="set('radius', num($event))" />
          <UiInput v-if="!has('column')" :model-value="style.margin_bottom ?? ''" label="Espace dessous (px)" type="number" placeholder="auto" :disabled="disabled" @update:model-value="set('margin_bottom', num($event))" />
        </div>
        <div class="ui-mail-settings__row">
          <UiInput :model-value="style.border_width ?? ''" label="Bordure (px)" type="number" placeholder="0" :disabled="disabled" @update:model-value="set('border_width', num($event))" />
          <UiSelect v-if="style.border_width" :model-value="style.border_style || 'solid'" :items="borders" label="Trait" :disabled="disabled" @update:model-value="set('border_style', $event === 'solid' ? null : $event)" />
        </div>
        <UiColorInput v-if="style.border_width" :model-value="style.border_color || ''" label="Couleur de la bordure" :disabled="disabled" @update:model-value="set('border_color', $event)" />
        <UiInput v-if="has('box')" :model-value="style.width ?? ''" label="Largeur (%)" type="number" placeholder="100" :disabled="disabled" @update:model-value="set('width', num($event))" />
      </div>
    </details>
  </div>
</template>
