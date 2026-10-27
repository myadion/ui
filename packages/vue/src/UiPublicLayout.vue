<script setup>
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import UiButton from './UiButton.vue'
import UiError from './UiError.vue'
import UiLoading from './UiLoading.vue'
import { otherTheme, readTheme, rememberTheme } from './theme.js'

/*
 * LE GABARIT D'UNE PAGE PUBLIQUE (Adion UI, coordination#49) : une page vue
 * par quelqu'un qui n'a pas de compte - la page de paiement d'un lien Pay,
 * demain une signature, une confirmation. Ni menu ni projet.
 *
 *   en haut   le logo Adion Pay a gauche (noir en clair, blanc en sombre, a la place
 *             d'un en-tete) et le bouton clair / sombre a droite ;
 *   titre     `eyebrow` (facultatif), `title` (qui vend : le nom de l'entreprise), `lead` ;
 *             avec un `aside`, ils s'empilent au-dessus de lui, dans la colonne de gauche ;
 *   corps     sur grand ecran deux colonnes - le creneau `aside` (une carte 3D,
 *             un recapitulatif) a gauche, le creneau par defaut (le formulaire)
 *             a droite ; sur telephone l'un sous l'autre, `aside` d'abord ;
 *   sans aside   une colonne centree (un merci, un lien expire) ;
 *   foot      une ligne discrete en bas ;
 *   embed     le meme formulaire dans l'iframe d'un marchand : seulement le corps.
 */
const props = defineProps({
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  lead: { type: String, default: '' },
  logoLight: { type: String, default: '/brand/adion-pay-noir.png' },
  logoDark: { type: String, default: '/brand/adion-pay-blanc.png' },
  logoAlt: { type: String, default: 'Adion Pay' },
  /** Dans l'iframe d'un marchand : ni barre, ni titre, ni carte, un fond transparent et le theme que le marchand a choisi. */
  embed: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
defineEmits(['retry'])

const theme = useTheme()
const isLight = computed(() => theme.global.name.value === 'adionLight')

function apply(name) {
  theme.global.name.value = name
  document.documentElement.dataset.theme = name === 'adionLight' ? 'light' : 'dark'
}
function toggle() {
  const next = otherTheme(theme.global.name.value)
  rememberTheme(next)
  apply(next)
}
if (!props.embed) apply(readTheme())
onMounted(() => {
  if (props.embed) return
  // Le systeme change de theme (le soir) tant que la personne n'a pas choisi.
  const query = window.matchMedia?.('(prefers-color-scheme: dark)')
  query?.addEventListener?.('change', () => { if (!window.localStorage?.getItem('adion-theme')) apply(readTheme()) })
})
</script>

<template>
  <div class="ui-public" :class="{ 'is-embed': embed }">
    <header v-if="!embed" class="ui-public__bar">
      <img class="ui-public__logo" :src="isLight ? logoLight : logoDark" :alt="logoAlt">
      <UiButton kind="quiet" icon-only :icon="isLight ? 'mdi-weather-night' : 'mdi-white-balance-sunny'" :title="isLight ? 'Passer en mode sombre' : 'Passer en mode clair'" @click="toggle" />
    </header>
    <main class="ui-public__main">
      <UiLoading v-if="loading" />
      <UiError v-else-if="error" :message="error" @retry="$emit('retry')" />
      <template v-else>
        <div v-if="!embed && !$slots.aside" class="ui-public__head">
          <span v-if="eyebrow" class="ui-public__eyebrow">{{ eyebrow }}</span>
          <h1 v-if="title" class="ui-public__title">{{ title }}</h1>
          <p v-if="lead" class="ui-public__lead">{{ lead }}</p>
        </div>
        <div class="ui-public__body" :class="{ 'has-aside': $slots.aside && !embed }">
          <div v-if="$slots.aside && !embed" class="ui-public__aside">
            <div class="ui-public__head">
              <span v-if="eyebrow" class="ui-public__eyebrow">{{ eyebrow }}</span>
              <h1 v-if="title" class="ui-public__title">{{ title }}</h1>
              <p v-if="lead" class="ui-public__lead">{{ lead }}</p>
            </div>
            <slot name="aside" />
          </div>
          <div class="ui-public__content"><slot /></div>
        </div>
      </template>
    </main>
    <footer v-if="$slots.foot" class="ui-public__foot">
      <span><slot name="foot" /></span>
    </footer>
  </div>
</template>
