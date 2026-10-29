<script setup>
import { computed, ref } from 'vue'
import { UiButton, UiCommandPalette } from '@myadion/ui'

const open = ref(false)
const query = ref('')
const picked = ref('')
const all = [
  { key: 'web-1', type: 'Services', icon: 'mdi-server-outline', label: 'web-1', meta: 'Instance · Toulouse' },
  { key: 'altarys', type: 'Services', icon: 'mdi-earth', label: 'altarys.eu', meta: 'Nom de domaine' },
  { key: 'f-12', type: 'Facturation', icon: 'mdi-wallet-bifold-outline', label: 'Facture F-2026-0012', meta: '149,98 € · réglée' },
  { key: 'billing', type: 'Pages', icon: 'mdi-file-outline', label: 'Mes comptes de facturation' },
]
const groups = computed(() => {
  const needle = query.value.trim().toLowerCase()
  const found = all.filter((i) => `${i.label} ${i.meta || ''}`.toLowerCase().includes(needle))
  return ['Pages', 'Services', 'Facturation'].map((label) => ({ key: label, label, items: found.filter((i) => i.type === label) })).filter((g) => g.items.length)
})
function select(item) { picked.value = item.label; open.value = false }
</script>

<template>
  <div><UiButton icon="mdi-magnify" @click="open = true">Rechercher</UiButton> <span v-if="picked">Ouvert : {{ picked }}</span></div>
  <UiCommandPalette v-model="open" v-model:query="query" :groups="groups" placeholder="Rechercher un service, une facture, une page…" @select="select" />
</template>
