<script setup>
import { onBeforeUnmount, watch } from 'vue'

/*
 * UN TIROIR (Adion UI, 2026-10-29, d'apres /maquette) : le detail d'une ligne
 * ou un formulaire qui glisse de la droite sans quitter la page. 420 px sur
 * ordinateur, tout l'ecran sur telephone. Echap ou le voile le ferment.
 *
 *   v-model   ouvert ou ferme
 *   title, subtitle, icon   l'en-tete (tuile d'icone comme une fiche)
 *   slot default   le contenu ; slot actions   le pied (Annuler a gauche, l'action a droite)
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  width: { type: [Number, String], default: 420 },
})
const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)
const onKey = (event) => { if (event.key === 'Escape' && props.modelValue) close() }
watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
</script>

<template>
  <Teleport to="body">
    <transition name="ui-drawer">
      <div v-if="modelValue" class="ui-drawer" @click.self="close">
        <aside class="ui-drawer__panel" role="dialog" aria-modal="true" :aria-label="title" :style="{ '--ui-drawer-w': typeof width === 'number' ? `${width}px` : width }">
          <header class="ui-drawer__head">
            <span v-if="icon" class="ui-drawer__icon"><v-icon :icon="icon" size="18" /></span>
            <div class="ui-drawer__titles"><h2>{{ title }}</h2><small v-if="subtitle">{{ subtitle }}</small></div>
            <button type="button" class="ui-drawer__close" aria-label="Fermer" @click="close"><v-icon icon="mdi-close" size="18" /></button>
          </header>
          <div class="ui-drawer__body ui-page"><slot /></div>
          <footer v-if="$slots.actions" class="ui-drawer__foot"><slot name="actions" :close="close" /></footer>
        </aside>
      </div>
    </transition>
  </Teleport>
</template>
