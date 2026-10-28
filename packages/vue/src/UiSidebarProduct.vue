<script setup>
/*
 * UN PRODUIT DE LA BARRE DE GAUCHE (Adion UI, 2026-10-28) : son icone, son
 * nom, le nombre de services et la fleche qui les deplie (slot default :
 * des UiSidebarEntry). `select` sur le nom, `toggle` sur la fleche.
 */
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  count: { type: [Number, String], default: '' },
  active: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  expandable: { type: Boolean, default: false },
})
defineEmits(['select', 'toggle'])
</script>

<template>
  <div class="ui-sidebar__product">
    <div class="ui-sidebar__item is-product" :class="{ 'is-active': active }">
      <button type="button" class="ui-sidebar__productname" @click="$emit('select')">
        <v-icon v-if="icon" :icon="icon" size="17" />
        <span class="ui-sidebar__label">{{ label }}</span>
      </button>
      <small v-if="count !== '' && count !== null" class="ui-sidebar__count">{{ count }}</small>
      <button v-if="expandable" type="button" class="ui-sidebar__toggle" :aria-label="`${open ? 'Replier' : 'Déplier'} ${label}`" :aria-expanded="open" @click="$emit('toggle')">
        <v-icon icon="mdi-chevron-right" size="15" class="ui-sidebar__caret" :class="{ 'is-open': open }" />
      </button>
    </div>
    <div v-if="open && $slots.default" class="ui-sidebar__items"><slot /></div>
  </div>
</template>
