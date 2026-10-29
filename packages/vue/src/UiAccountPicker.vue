<script setup>
/*
 * CHOISIR UN COMPTE (Adion UI, 2026-10-29). Les comptes deja connectes sur
 * l'appareil, comme des sessions ouvertes : l'initiale, le prenom, l'identifiant,
 * et un indice du moyen de la derniere connexion (cle, e-mail, SMS). Un clic
 * choisit le compte ; la croix le retire de l'appareil. Dessous, « Utiliser un
 * autre compte ».
 *
 *   accounts  [{ key, name, detail, method }] : method vaut passkey, email ou sms
 *   other     le libelle du dernier choix (« Utiliser un autre compte »)
 *   busy      la cle du compte en cours de connexion (un loader a sa place)
 *
 * Evenements : choose(key), remove(key), other().
 */
defineProps({
  accounts: { type: Array, default: () => [] },
  other: { type: String, default: 'Utiliser un autre compte' },
  busy: { type: String, default: '' },
})
defineEmits(['choose', 'remove', 'other'])

const HINTS = {
  passkey: { icon: 'mdi-key-variant', label: 'Clé de sécurité' },
  email: { icon: 'mdi-email-outline', label: 'Lien par e-mail' },
  sms: { icon: 'mdi-message-text-outline', label: 'Lien par SMS' },
}
const initial = (account) => String(account.name || account.detail || '?').trim().charAt(0).toUpperCase()
</script>

<template>
  <ul class="ui-accounts" role="list">
    <li v-for="account in accounts" :key="account.key" class="ui-accounts__row">
      <button
        type="button"
        class="ui-accounts__pick"
        :disabled="Boolean(busy)"
        :aria-label="`Continuer avec ${account.name || account.detail}`"
        @click="$emit('choose', account.key)"
      >
        <span class="ui-accounts__avatar" aria-hidden="true">{{ initial(account) }}</span>
        <span class="ui-accounts__text">
          <strong>{{ account.name || account.detail }}</strong>
          <small v-if="account.name && account.detail">{{ account.detail }}</small>
        </span>
        <v-progress-circular v-if="busy === account.key" indeterminate size="18" width="2" color="primary" aria-hidden="true" />
        <span v-else-if="HINTS[account.method]" class="ui-accounts__hint" :title="HINTS[account.method].label">
          <v-icon :icon="HINTS[account.method].icon" size="18" />
          <span class="ui-sr">{{ HINTS[account.method].label }}</span>
        </span>
      </button>
      <button
        type="button"
        class="ui-accounts__remove"
        :disabled="Boolean(busy)"
        :aria-label="`Retirer ${account.name || account.detail} de cet appareil`"
        :title="'Retirer de cet appareil'"
        @click="$emit('remove', account.key)"
      >
        <v-icon icon="mdi-close" size="16" />
      </button>
    </li>
    <li class="ui-accounts__row">
      <button type="button" class="ui-accounts__pick is-other" :disabled="Boolean(busy)" @click="$emit('other')">
        <span class="ui-accounts__avatar" aria-hidden="true"><v-icon icon="mdi-account-plus-outline" size="18" /></span>
        <span class="ui-accounts__text"><strong>{{ other }}</strong></span>
      </button>
    </li>
  </ul>
</template>
