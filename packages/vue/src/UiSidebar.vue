<script setup>
/*
 * LA BARRE DE GAUCHE D'UNE APPLICATION (Adion UI, 2026-10-28), reprise de
 * l'espace client. Le kit la dessine, l'app la remplit :
 *
 *   slot actions   les gestes a cote du logo (UiIconActions)
 *   slot context   le compte et le projet (UiSidebarContext)
 *   slot tools     les rangements et le filtre (UiSidebarModes, UiSidebarSearch)
 *   slot default   l'arbre : UiSidebarSection, UiSidebarProduct, UiSidebarEntry
 *   slot footer    le pied (UiSidebarFooter, UiSidebarLink, UiSidebarChild)
 *
 *   overlay   dans le panneau du telephone : pas de logo, pas de cadre
 */
defineProps({
  overlay: { type: Boolean, default: false },
  label: { type: String, default: 'Navigation' },
  brandTo: { type: [String, Object], default: '/' },
  brandText: { type: String, default: 'Adion Cloud' },
  markSrc: { type: String, default: '' },
})
</script>

<template>
  <aside class="ui-sidebar" :class="{ 'is-overlay': overlay }" :aria-label="label">
    <div v-if="!overlay" class="ui-sidebar__brand">
      <router-link :to="brandTo" class="ui-sidebar__logo" :aria-label="`${brandText}, accueil`">
        <img v-if="markSrc" :src="markSrc" alt="" class="ui-sidebar__mark" />
        <span v-else class="ui-topbar__pill" aria-hidden="true" />
        <span class="ui-sidebar__name">{{ brandText.split(' ')[0] }}<br />{{ brandText.split(' ').slice(1).join(' ') }}</span>
      </router-link>
      <slot name="actions" />
    </div>
    <div v-if="$slots.context" class="ui-sidebar__context"><slot name="context" /></div>
    <slot name="tools" />
    <nav class="ui-sidebar__body"><slot /></nav>
    <div v-if="$slots.footer" class="ui-sidebar__footer"><slot name="footer" /></div>
  </aside>
</template>
