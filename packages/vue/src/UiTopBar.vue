<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/*
 * LA BARRE DU HAUT D'UNE APPLICATION (Adion UI, 2026-10-28). 48 px, le fond
 * de la navigation, un filet dessous, les gestes a droite (slot `actions`).
 *
 * Sur ordinateur, le logo vit en tete de la barre de gauche : il n'apparait
 * ici que sur un ecran etroit (900 px et moins), ou la barre de gauche est
 * cachee - ou toujours, avec `brand-always`, pour une app sans barre de
 * gauche. Le slot `menu` remplit le panneau du bouton menu (la barre de
 * gauche de l'app, d'ordinaire) ; il recoit `close`.
 *
 *   brand-to     ou mene le logo (defaut : /)
 *   brand-text   le nom sous la marque, sur deux lignes (defaut : Adion Cloud)
 *   mark-src     une image pour la marque ; sinon la pilule d'Adion, dessinee
 */
const props = defineProps({
  brandTo: { type: [String, Object], default: '/' },
  brandText: { type: String, default: 'Adion Cloud' },
  markSrc: { type: String, default: '' },
  brandAlways: { type: Boolean, default: false },
  menuTitle: { type: String, default: 'Menu' },
})

const open = ref(false)
const route = useRoute()

watch(open, (value) => { document.body.style.overflow = value ? 'hidden' : '' })
// Une page choisie ferme le panneau, meme par le bouton retour.
watch(() => route?.fullPath, () => { open.value = false })

const onKey = (event) => { if (event.key === 'Escape' && open.value) open.value = false }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

const [line1, ...rest] = props.brandText.split(' ')
const brandLines = [line1, rest.join(' ')].filter(Boolean)
</script>

<template>
  <header class="ui-topbar">
    <div class="ui-topbar__bar">
      <router-link :to="brandTo" class="ui-topbar__brand" :class="{ 'is-always': brandAlways }" :aria-label="`${brandText}, accueil`">
        <img v-if="markSrc" :src="markSrc" alt="" class="ui-topbar__mark" />
        <span v-else class="ui-topbar__pill" aria-hidden="true" />
        <span class="ui-topbar__name"><template v-for="(l, i) in brandLines" :key="i"><br v-if="i" />{{ l }}</template></span>
      </router-link>
      <div class="ui-topbar__actions">
        <slot name="actions" />
        <button v-if="$slots.menu" type="button" class="ui-topbar__burger" aria-label="Ouvrir le menu" :aria-expanded="open" @click="open = true">
          <v-icon icon="mdi-menu" size="22" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <transition name="ui-topbar-menu">
        <div v-if="open" class="ui-topbar__menu" @click.self="open = false">
          <aside class="ui-topbar__panel" role="dialog" aria-modal="true" :aria-label="menuTitle">
            <header class="ui-topbar__panelhead">
              <span>{{ menuTitle }}</span>
              <button type="button" class="ui-topbar__close" aria-label="Fermer le menu" @click="open = false">
                <v-icon icon="mdi-close" size="22" />
              </button>
            </header>
            <slot name="menu" :close="() => (open = false)" />
          </aside>
        </div>
      </transition>
    </Teleport>
  </header>
</template>
