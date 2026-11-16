<script setup>
import { ref } from 'vue'
import { UiNetworkTopology, UiNotice } from '@myadion/ui'

const picked = ref('')
const networks = [
  { id: 'pub', name: 'Internet', kind_label: 'Public', meta: 'IPv4 · IPv6' },
  { id: 'priv', name: 'prive', kind_label: 'Privé', meta: '10.0.0.0/24' },
  { id: 'fab', name: 'fabric-qivo', kind_label: 'Fabric', meta: 'VNI 10003' },
]
const devices = [
  { id: 'web', name: 'web-1', kind: 'instance', sub: 'En marche', tone: 'ok', ports: [{ network: 'priv', labels: ['10.0.0.11'] }, { network: 'pub', label: '2001:41d0::b' }] },
  { id: 'db', name: 'base-prod', kind: 'instance', sub: 'En marche', tone: 'ok', ports: [{ network: 'priv', label: '10.0.0.12' }, { network: 'fab', label: '192.168.10.4' }] },
  { id: 'r1', name: 'routeur', kind: 'router', sub: 'Actif', tone: 'ok', ports: [{ network: 'pub', label: '54.36.147.12' }, { network: 'priv', label: '10.0.0.1' }] },
  { id: 'old', name: 'ancienne', kind: 'instance', sub: 'Arrêtée', tone: 'muted', ports: [] },
]
</script>

<template>
  <UiNetworkTopology :networks="networks" :devices="devices" @select="(d) => { picked = d.name }" />
  <UiNotice v-if="picked" tone="info" :text="`Choisi : ${picked}`" />
</template>
