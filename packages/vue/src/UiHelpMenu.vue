<script setup>
import { ref } from 'vue'

/*
 * UNE AIDE A LA DEMANDE (Adion UI, 2026-10-29) : un lien discret (« Besoin
 * d'aide ? ») qui ouvre une fenetre de questions, au centre. Chaque question a son
 * icone ; un clic deplie sa reponse, une seule a la fois. Rien ne passe devant
 * le formulaire tant qu'on ne demande rien.
 *
 *   label   le lien qui ouvre la fenetre
 *   items   [{ key, icon, question, answer, links?: [{ label, href, external? }] }]
 */
defineProps({
  label: { type: String, default: 'Besoin d’aide ?' },
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] },
})

const open = ref(false)
const shown = ref('')
const toggle = (key) => { shown.value = shown.value === key ? '' : key }
</script>

<template>
  <button type="button" class="ui-help__trigger" :aria-expanded="open" @click="open = true">
    <v-icon icon="mdi-help-circle-outline" size="16" />
    {{ label }}
  </button>
  <v-dialog v-model="open" max-width="640" content-class="ui-help-host">
    <div class="ui-help" role="dialog" :aria-label="title || label">
      <header class="ui-help__head">
        <span>{{ title || label }}</span>
        <button type="button" class="ui-help__close" aria-label="Fermer" title="Fermer" @click="open = false">
          <v-icon icon="mdi-close" size="16" />
        </button>
      </header>
      <ul class="ui-help__list">
        <li v-for="item in items" :key="item.key ?? item.question" class="ui-help__item" :class="{ 'is-open': shown === (item.key ?? item.question) }">
          <button type="button" class="ui-help__q" :aria-expanded="shown === (item.key ?? item.question)" @click="toggle(item.key ?? item.question)">
            <span class="ui-help__icon"><v-icon :icon="item.icon || 'mdi-help'" size="18" /></span>
            <span class="ui-help__text">{{ item.question }}</span>
            <v-icon icon="mdi-chevron-down" size="16" class="ui-help__chevron" />
          </button>
          <div v-if="shown === (item.key ?? item.question)" class="ui-help__a">
            <p>{{ item.answer }}</p>
            <p v-if="item.links?.length" class="ui-help__links">
              <a v-for="link in item.links" :key="link.href" :href="link.href" :target="link.external ? '_blank' : undefined" :rel="link.external ? 'noopener noreferrer' : undefined">{{ link.label }}</a>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </v-dialog>
</template>
