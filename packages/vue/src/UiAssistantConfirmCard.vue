<script setup>
import UiButton from './UiButton.vue'

/*
 * LA CARTE « CONFIRMER / ANNULER » (Adion UI, coordination#80 point 8).
 * L'assistant ne touche a rien sans le clic du client : ecrire, supprimer,
 * resilier, changer des droits. `danger` passe Confirmer en rouge. Le detail
 * (arguments, route) reste replie.
 *
 *   card      { title, question, kind, danger, args, method, path }
 *   busy      un clic est parti, la reponse arrive
 *   disabled  carte grisee (le client a ecrit autre chose)
 */
defineProps({
  card: { type: Object, required: true },
  busy: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
defineEmits(['confirm', 'cancel'])
const pretty = (v) => (typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v))
</script>

<template>
  <section class="ui-assist-card" :class="{ 'is-danger': card.danger, 'is-disabled': disabled }" :aria-label="card.title">
    <h3 class="ui-assist-card__title"><v-icon :icon="card.danger ? 'mdi-alert-outline' : 'mdi-cursor-default-click-outline'" size="18" /> {{ card.title }}</h3>
    <p v-if="card.question" class="ui-assist-card__question">{{ card.question }}</p>
    <details v-if="card.args || card.path" class="ui-assist-card__details">
      <summary>Détails</summary>
      <dl v-if="card.args">
        <template v-for="(value, key) in card.args" :key="key"><dt>{{ key }}</dt><dd>{{ pretty(value) }}</dd></template>
      </dl>
      <p v-if="card.path" class="ui-assist-card__tech">{{ card.method }} {{ card.path }}</p>
    </details>
    <div class="ui-assist-card__actions">
      <UiButton kind="quiet" :disabled="busy || disabled" @click="$emit('cancel')">Annuler</UiButton>
      <UiButton :kind="card.danger ? 'danger' : 'primary'" :loading="busy" :disabled="disabled" @click="$emit('confirm')">Confirmer</UiButton>
    </div>
  </section>
</template>
