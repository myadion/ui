<script setup>
import { computed } from 'vue'
import UiButton from './UiButton.vue'
import UiNotice from './UiNotice.vue'
import { wizardProgress } from './layout'

/*
 * UN ASSISTANT PAR ETAPES (Adion UI), dans l'esprit de l'onboarding : un fil
 * qui avance, une question par ecran, et les boutons Precedent / Suivant
 * toujours au meme endroit, en bas. Les etapes deja faites se rouvrent d'un
 * clic ; celles d'apres, non.
 *
 * steps : [{ key, label }] ; v-model : la cle de l'etape ouverte.
 * L'assistant ne valide rien lui-meme : il emet `next` (ou `finish` a la
 * derniere), et le parent avance quand Nexus a dit oui.
 */
const props = defineProps({
  steps: { type: Array, required: true },
  modelValue: { type: String, required: true },
  question: { type: String, default: '' },
  hint: { type: String, default: '' },
  busy: { type: Boolean, default: false },
  canNext: { type: Boolean, default: true },
  nextLabel: { type: String, default: 'Suivant' },
  finishLabel: { type: String, default: 'Terminer' },
  error: { type: String, default: '' },
  hideNav: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'next', 'back', 'finish'])

const index = computed(() => props.steps.findIndex((s) => s.key === props.modelValue))
const isLast = computed(() => index.value === props.steps.length - 1)
const progress = computed(() => wizardProgress(props.steps, props.modelValue))

function back() {
  if (index.value > 0) {
    emit('back')
    emit('update:modelValue', props.steps[index.value - 1].key)
  }
}
function go(step, i) {
  if (i < index.value && !props.busy) emit('update:modelValue', step.key)
}
</script>

<template>
  <div class="ui-wizard">
    <div class="ui-wizard__top">
      <span>Étape {{ index + 1 }} sur {{ steps.length }}</span>
      <slot name="top" />
    </div>
    <div class="ui-wizard__bar" aria-hidden="true"><div class="ui-wizard__fill" :style="{ width: `${progress}%` }" /></div>

    <div class="ui-wizard__grid" :class="{ 'no-aside': !$slots.aside }">
      <ol class="ui-wizard__steps" aria-label="Étapes">
        <li v-for="(step, i) in steps" :key="step.key">
          <button
            type="button"
            class="ui-wizard__step"
            :class="{ 'is-done': i < index, 'is-current': i === index }"
            :aria-current="i === index ? 'step' : undefined"
            :disabled="i >= index || busy"
            @click="go(step, i)"
          >
            <span class="ui-wizard__num"><v-icon v-if="i < index" icon="mdi-check" size="12" /><template v-else>{{ i + 1 }}</template></span>
            <span class="ui-wizard__label">{{ step.label }}</span>
          </button>
        </li>
      </ol>

      <div class="ui-wizard__body">
        <h2 v-if="question" class="ui-wizard__question">{{ question }}</h2>
        <p v-if="hint" class="ui-wizard__hint">{{ hint }}</p>
        <slot />
        <UiNotice v-if="error" tone="bad" :text="error" />
        <div v-if="!hideNav" class="ui-wizard__nav">
          <UiButton v-if="index > 0" kind="quiet" icon="mdi-arrow-left" :disabled="busy" @click="back">Précédent</UiButton>
          <span class="ui-wizard__nav-spacer" />
          <slot name="nav" />
          <UiButton
            kind="primary"
            :append-icon="isLast ? '' : 'mdi-arrow-right'"
            :loading="busy"
            :disabled="!canNext"
            @click="isLast ? emit('finish') : emit('next')"
          >{{ isLast ? finishLabel : nextLabel }}</UiButton>
        </div>
      </div>

      <aside v-if="$slots.aside" class="ui-wizard__aside"><slot name="aside" /></aside>
    </div>
  </div>
</template>
