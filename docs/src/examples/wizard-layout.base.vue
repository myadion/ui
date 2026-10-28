<script setup>
import { computed, reactive, ref } from 'vue'
import { UiCard, UiChoices, UiInput, UiKeyValue, UiSegmented, UiSelect, UiWizardLayout } from '@myadion/ui'
import { scopes, steps } from './data.js'

const step = ref('nom')
const index = computed(() => steps.findIndex((s) => s.key === step.value))
const next = () => { if (index.value < steps.length - 1) step.value = steps[index.value + 1].key }
const form = reactive({ name: '', kind: 'company', scopes: ['sms.send'], projects: [] })
</script>

<template>
  <UiWizardLayout v-model:step="step" title="Nouvelle application" :crumbs="[{ label: 'Mon compte' }, { label: 'Applications', to: '#' }, { label: 'Nouvelle' }]" :steps="steps" :question="steps[index].label" hint="Une question par écran ; Précédent et Suivant restent en bas." @next="next" @finish="step = 'nom'">
    <UiInput v-if="step === 'nom'" v-model="form.name" label="Nom de l’application" tip="Le nom que vous verrez dans le journal." required />
    <UiSegmented v-else-if="step === 'type'" v-model="form.kind" label="Type" :items="[{ value: 'company', label: 'Serveur' }, { value: 'spa', label: 'Navigateur' }]" />
    <UiChoices v-else-if="step === 'droits'" v-model="form.scopes" label="Droits" :items="scopes" />
    <UiSelect v-else v-model="form.projects" label="Projets autorisés" :items="['Kévin Paly', 'Boutique', 'Atelier']" multiple />
    <template #aside>
      <UiCard eyebrow="Récapitulatif" :title="form.name || 'Sans nom'">
        <UiKeyValue layout="list" :items="[{ label: 'Type', value: form.kind }, { label: 'Droits', value: form.scopes.length }]" />
      </UiCard>
    </template>
  </UiWizardLayout>
</template>
