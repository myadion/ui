<script setup>
import { reactive, ref } from 'vue'
import { UiAddress, UiFormLayout, UiInput, UiSection, UiSelect } from '@adion-cloud/ui-vue'

const dirty = ref(true)
const form = reactive({ name: 'Kévin Paly', lang: 'Français' })
const address = reactive({ line1: '', line2: '', postal_code: '', city: '', country: 'FR' })
</script>

<template>
  <UiFormLayout title="Réglages du compte" eyebrow="Mon compte" lead="Sections avec leur titre, champs alignés, barre d’enregistrement en bas." :dirty="dirty" @save="dirty = false" @cancel="dirty = false">
    <UiSection first title="Identité">
      <div class="ui-form__grid">
        <UiInput v-model="form.name" label="Nom" @update:model-value="dirty = true" />
        <UiSelect v-model="form.lang" label="Langue" :items="['Français', 'English']" @update:model-value="dirty = true" />
      </div>
    </UiSection>
    <UiSection title="Adresse"><UiAddress :address="address" /></UiSection>
  </UiFormLayout>
</template>
