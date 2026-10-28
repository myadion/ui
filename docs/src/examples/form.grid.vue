<script setup>
import { reactive } from 'vue'
import { UiButton, UiCombobox, UiForm, UiInput, UiSegmented, UiSelect } from '@myadion/ui'

const form = reactive({ name: '', plan: null, tags: [], kind: 'company' })
</script>

<template>
  <UiForm grid>
    <UiInput v-model="form.name" label="Nom de la clé" tip="Pour la reconnaître dans la liste." placeholder="site de réservation" />
    <UiInput model-value="ab" label="Avec une erreur" error="Lettres et chiffres, 3 à 11." />
    <UiSelect v-model="form.plan" label="Liste de choix" :items="['Starter', 'Pro', 'Business']" hint="Une aide sous le champ, si elle est courte." />
    <UiCombobox v-model="form.tags" label="Choix ou saisie libre" :items="['paly.li', 'boutique.fr']" multiple />
    <UiSegmented v-model="form.kind" label="Segment" :items="[{ value: 'company', label: 'Société' }, { value: 'individual', label: 'Individuel' }]" />
    <div class="ui-field"><span class="ui-field__label">Bouton</span><div class="ui-form__actions"><UiButton kind="primary">Enregistrer</UiButton><UiButton>Secondaire</UiButton></div></div>
    <UiInput model-value="" label="Zone de texte" multiline wide />
  </UiForm>
</template>
