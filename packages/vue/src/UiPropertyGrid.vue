<script setup>
import { reactive, ref } from 'vue'
import { tone } from './tone'

/*
 * LA GRILLE DE PROPRIETES (Adion UI, mode outil, 2026-11-17) : toutes les
 * donnees d'un dossier, en lignes serrees, rangees par groupe repliable.
 * L'intitule a gauche, la valeur a droite ; une valeur trop longue se coupe
 * et se lit en entier au survol. Un clic sur une valeur copiable la copie.
 *
 *   groups  [{ key, title, count, open, items: [{ label, value, mono, copy, to, tone, icon }] }]
 *           to : la valeur mene a une autre fiche ;
 *           open : false replie le groupe au depart (le rare) ;
 *           tone : la pastille d'etat devant la valeur ; icon : son icone.
 *   #group-<key>  un reglage sous les lignes du groupe (un niveau de support a choisir)
 */
const props = defineProps({
  groups: { type: Array, default: () => [] },
})

const closed = reactive(Object.fromEntries(props.groups.map((group) => [group.key, group.open === false])))
const copied = ref('')
async function copy(id, value) {
  try { await navigator.clipboard?.writeText(String(value)) } catch { /* le presse-papiers est refuse : la valeur reste lisible */ }
  copied.value = id
  setTimeout(() => { copied.value = '' }, 1400)
}
</script>

<template>
  <div class="ui-props">
    <section v-for="group in groups" :key="group.key" class="ui-props__group" :class="{ 'is-closed': closed[group.key] }">
      <h2 class="ui-props__head">
        <button type="button" class="ui-props__toggle" :aria-expanded="!closed[group.key]" @click="closed[group.key] = !closed[group.key]">
          <v-icon icon="mdi-chevron-down" size="16" class="ui-props__chevron" />{{ group.title }}<span v-if="group.count !== undefined" class="ui-props__count">{{ group.count }}</span>
        </button>
      </h2>
      <dl v-show="!closed[group.key]" class="ui-props__rows">
        <div v-for="(item, index) in group.items" :key="item.label + index" class="ui-props__row">
          <dt :title="item.label">{{ item.label }}</dt>
          <dd :class="{ 'ui-mono': item.mono }" :title="String(item.value)">
            <span v-if="item.tone" class="ui-props__state" :class="`is-tone-${tone(item.tone)}`" aria-hidden="true"><v-icon :icon="item.icon || 'mdi-circle'" :size="item.icon ? 13 : 8" /></span>
            <button v-if="item.copy" type="button" class="ui-props__copy" :title="`Copier : ${item.value}`" @click="copy(group.key + index, item.value)">
              <span class="ui-props__value">{{ item.value }}</span><v-icon :icon="copied === group.key + index ? 'mdi-check' : 'mdi-content-copy'" size="12" />
            </button>
            <router-link v-else-if="item.to" :to="item.to" class="ui-props__link"><span class="ui-props__value">{{ item.value }}</span></router-link>
            <span v-else class="ui-props__value">{{ item.value }}</span>
          </dd>
        </div>
      </dl>
      <div v-if="$slots[`group-${group.key}`]" v-show="!closed[group.key]" class="ui-props__custom"><slot :name="`group-${group.key}`" :group="group" /></div>
    </section>
  </div>
</template>
