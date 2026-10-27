<script setup>
import { computed } from 'vue'

/*
 * UNE MISE EN ROUTE GUIDEE (Adion UI, 2026-10-14) : quelques etapes
 * numerotees, une progression visible, une etape faite qui se coche, une
 * seule action par etape. Contrairement a UiWizard (un formulaire a remplir
 * ecran par ecran), toutes les etapes restent visibles : on voit le chemin.
 *
 * steps : [{ key, title, summary }] ; `done` : les cles faites ; v-model :
 * l'etape ouverte. Le contenu d'une etape se pose dans le creneau
 * `step-<key>`. Un clic sur un titre rouvre son etape.
 */
const props = defineProps({
  steps: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  done: { type: Array, default: () => [] },
  family: { type: String, default: '' },
  progressLabel: { type: String, default: '' },
})
defineEmits(['update:modelValue'])

const count = computed(() => props.steps.filter((s) => props.done.includes(s.key)).length)
const percent = computed(() => (props.steps.length ? Math.round((count.value / props.steps.length) * 100) : 0))
</script>

<template>
  <div :class="family ? `ui-fam-${family}` : ''">
    <div class="ui-setup__progress">
      <div class="ui-setup__bar" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"><div class="ui-setup__fill" :style="{ width: `${percent}%` }" /></div>
      <span>{{ progressLabel || `${count} sur ${steps.length}` }}</span>
    </div>
    <ol class="ui-setup">
      <li
        v-for="(step, index) in steps"
        :key="step.key"
        class="ui-setup__step"
        :class="{ 'is-done': done.includes(step.key), 'is-current': modelValue === step.key }"
        :aria-current="modelValue === step.key ? 'step' : undefined"
      >
        <span class="ui-setup__num"><v-icon v-if="done.includes(step.key)" icon="mdi-check" size="20" /><template v-else>{{ index + 1 }}</template></span>
        <div>
          <div class="ui-setup__head">
            <button type="button" class="ui-setup__title" @click="$emit('update:modelValue', step.key)">{{ step.title }}</button>
            <span v-if="step.summary && modelValue !== step.key" class="ui-setup__summary">{{ step.summary }}</span>
          </div>
          <div v-if="modelValue === step.key" class="ui-setup__body"><slot :name="`step-${step.key}`" :step="step" /></div>
        </div>
      </li>
    </ol>
  </div>
</template>
