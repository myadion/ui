<script setup>
/*
 * UN CHAMP (Adion UI) : le libelle au-dessus, en petites capitales ; l'aide
 * dans une infobulle a cote du libelle (pas une ligne de plus sous chaque
 * champ) ; l'erreur dessous, en rouge, telle que l'API la dit.
 *
 * UiInput, UiSelect et UiCombobox l'emploient eux-memes : on ne s'en sert
 * directement que pour envelopper un controle qui n'est pas du kit.
 */
defineProps({
  label: { type: String, default: '' },
  tip: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  required: { type: Boolean, default: false },
  for: { type: String, default: undefined },
  /** Toute la largeur d'une grille de formulaire (une adresse, une description). */
  wide: { type: Boolean, default: false },
})
</script>

<template>
  <div class="ui-field" :class="{ 'is-wide': wide }">
    <label v-if="label" class="ui-field__label" :for="$props.for">
      {{ label }}<span v-if="required" class="ui-field__required" aria-hidden="true">*</span>
      <v-tooltip v-if="tip" location="top" max-width="320">
        <template #activator="{ props: on }">
          <span v-bind="on" class="ui-field__tip" tabindex="0" :aria-label="tip"><v-icon icon="mdi-help-circle-outline" size="13" /></span>
        </template>
        {{ tip }}
      </v-tooltip>
    </label>
    <slot />
    <p v-if="error && (Array.isArray(error) ? error.length : true)" class="ui-field__error" role="alert">{{ Array.isArray(error) ? error[0] : error }}</p>
    <p v-else-if="hint" class="ui-field__hint">{{ hint }}</p>
  </div>
</template>
