<script setup>
import { ref } from 'vue'
import { UiButton, UiChoiceCards, UiCopyCallout, UiPromptList, UiSetup } from '@adion-cloud/ui-vue'

const step = ref('choose')
const done = ref([])
const pick = ref('')
const finish = (key, next) => { done.value = [...new Set([...done.value, key])]; step.value = next }
</script>

<template>
  <UiSetup v-model="step" family="ai" :done="done" :steps="[{ key: 'choose', title: 'Choisissez', summary: pick }, { key: 'copy', title: 'Copiez' }, { key: 'try', title: 'Essayez' }]">
    <template #step-choose>
      <UiChoiceCards v-model="pick" family="ai" :items="[{ value: 'Starter', label: 'Starter', hint: '1 site' }, { value: 'Pro', label: 'Pro', hint: '5 sites' }, { value: 'Business', label: 'Business', hint: 'Sites illimités' }]" @update:model-value="finish('choose', 'copy')" />
    </template>
    <template #step-copy>
      <UiCopyCallout family="ai" lead="Collez ceci dans votre IA, elle s’occupe du reste." text="Lis https://adion-api.eu/ia et suis les instructions pour connecter Adion Cloud." />
      <div class="ui-form__actions"><UiButton icon="mdi-check" @click="finish('copy', 'try')">C’est fait</UiButton></div>
    </template>
    <template #step-try>
      <UiPromptList family="ai" :items="['Quelles factures dois-je payer ?', 'Envoie un SMS de test à mon numéro.']" />
    </template>
  </UiSetup>
</template>
