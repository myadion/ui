<script setup>
import { computed } from 'vue'
import { tone as toTone } from './tone'
import { sortDevices, topologyRows } from './topology'
import UiEmpty from './UiEmpty.vue'

/*
 * LA TOPOLOGIE RESEAU (Adion UI), comme celle d'OpenStack : chaque reseau est
 * un rail vertical de couleur, chaque routeur et chaque instance une ligne ;
 * un trait part de l'appareil et un point marque chaque port, avec ses
 * adresses. Sur telephone, la grille defile de cote, les appareils restent
 * a gauche.
 *
 * networks : [{ id, name, meta?, kind_label? }] - meta : le CIDR, le Fabric.
 * devices : [{ id, name, kind: 'router'|'instance', sub?, tone?, to?,
 *   ports: [{ network, label?, labels? }] }]. `to` en fait un lien ; sinon
 * un clic emet `select` avec l'appareil.
 */
const props = defineProps({
  networks: { type: Array, default: () => [] },
  devices: { type: Array, default: () => [] },
  empty: { type: String, default: 'Aucun réseau dans ce projet.' },
  label: { type: String, default: 'Topologie réseau' },
})
const emit = defineEmits(['select'])

const rows = computed(() => topologyRows(props.networks, sortDevices(props.devices)))
const columns = computed(() => ({ '--topo-networks': props.networks.length }))
const rail = (index) => `is-rail-${(index % 5) + 1}`
const ICONS = { router: 'mdi-router-network', instance: 'mdi-server-outline' }
const networkName = (id) => props.networks.find((n) => n.id === id)?.name || ''
const portText = (device, cell) => `${device.name} sur ${networkName(cell.network)}${cell.labels.length ? ` : ${cell.labels.join(', ')}` : ''}`
</script>

<template>
  <UiEmpty v-if="!networks.length" icon="mdi-lan" :text="empty" />
  <div v-else class="ui-topo" role="region" :aria-label="label">
    <div class="ui-topo__grid" :style="columns">
      <div class="ui-topo__corner" />
      <div v-for="(network, index) in networks" :key="network.id" class="ui-topo__net" :class="rail(index)">
        <strong class="ui-topo__net-name">{{ network.name }}</strong>
        <small v-if="network.kind_label" class="ui-topo__net-kind">{{ network.kind_label }}</small>
        <small v-if="network.meta" class="ui-topo__net-meta">{{ network.meta }}</small>
      </div>

      <template v-for="row in rows" :key="row.device.id">
        <component
          :is="row.device.to ? 'router-link' : 'button'"
          :to="row.device.to || undefined"
          :type="row.device.to ? undefined : 'button'"
          class="ui-topo__device"
          :class="{ 'is-unplugged': row.unplugged }"
          @click="!row.device.to && emit('select', row.device)"
        >
          <span class="ui-table__tile" :class="`is-tone-${toTone(row.device.tone || 'muted')}`"><v-icon :icon="ICONS[row.device.kind] || 'mdi-devices'" size="17" /></span>
          <span class="ui-topo__lines">
            <span class="ui-topo__name">{{ row.device.name }}</span>
            <small v-if="row.device.sub || row.unplugged" class="ui-topo__sub">{{ row.unplugged ? 'Branché à aucun réseau' : row.device.sub }}</small>
          </span>
        </component>
        <div
          v-for="(cell, index) in row.cells"
          :key="cell.network"
          class="ui-topo__cell"
          :class="[rail(index), `is-line-${cell.line}`, { 'has-port': cell.port }]"
          :aria-label="cell.port ? portText(row.device, cell) : undefined"
          :role="cell.port ? 'note' : undefined"
        >
          <span v-if="cell.port" class="ui-topo__port" aria-hidden="true" />
          <span v-if="cell.labels.length" class="ui-topo__ips"><span v-for="ip in cell.labels" :key="ip">{{ ip }}</span></span>
        </div>
      </template>
    </div>
  </div>
</template>
