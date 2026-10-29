<script setup>
/*
 * LES CLES D'UN COMPTE (Adion UI, 2026-10-29). Les passkeys enregistrees, dans
 * le dessin du choix du compte : une tuile cle, le nom, une ligne de detail
 * (la derniere utilisation), et la croix pour la retirer. Dessous, en pointille
 * comme « Utiliser un autre compte », la ligne pour en ajouter une. Le retrait
 * se confirme dans l'app.
 *
 *   keys   [{ key, name, detail }]
 *   busy   la cle en cours de retrait (un loader a la place de la croix)
 *   empty  le texte quand il n'y a aucune cle
 *   add    le libelle de la ligne d'ajout (vide : pas de ligne)
 *
 * Evenements : remove(key), add().
 */
defineProps({
  keys: { type: Array, default: () => [] },
  busy: { type: String, default: '' },
  empty: { type: String, default: 'Aucune passkey sur ce compte.' },
  add: { type: String, default: 'Ajouter une passkey' },
})
defineEmits(['remove', 'add'])
</script>

<template>
  <ul class="ui-accounts" role="list">
    <li v-if="!keys.length" class="ui-accounts__empty">{{ empty }}</li>
    <li v-for="item in keys" :key="item.key" class="ui-accounts__row">
      <div class="ui-accounts__pick is-static">
        <span class="ui-accounts__avatar" aria-hidden="true"><v-icon icon="mdi-key-variant" size="18" /></span>
        <span class="ui-accounts__text">
          <strong>{{ item.name }}</strong>
          <small v-if="item.detail">{{ item.detail }}</small>
        </span>
        <v-progress-circular v-if="busy === item.key" indeterminate size="18" width="2" color="primary" aria-hidden="true" />
      </div>
      <button
        v-if="busy !== item.key"
        type="button"
        class="ui-accounts__remove"
        :disabled="Boolean(busy)"
        :aria-label="`Retirer ${item.name}`"
        title="Retirer"
        @click="$emit('remove', item.key)"
      >
        <v-icon icon="mdi-close" size="16" />
      </button>
    </li>
    <li v-if="add" class="ui-accounts__row">
      <button type="button" class="ui-accounts__pick is-other" :disabled="Boolean(busy)" @click="$emit('add')">
        <span class="ui-accounts__avatar" aria-hidden="true"><v-icon icon="mdi-plus" size="18" /></span>
        <span class="ui-accounts__text"><strong>{{ add }}</strong></span>
      </button>
    </li>
  </ul>
</template>
