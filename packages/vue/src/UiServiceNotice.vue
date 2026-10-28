<script setup>
import { ref, watch } from 'vue'
import UiNotice from './UiNotice.vue'
import { healthOf } from './health'
import { useAdion } from './adapter.js'

/*
 * LE BANDEAU D'UN SERVICE TOUCHE (Adion UI). Sur la fiche
 * d'un service, l'API dit si le serveur qui l'heberge a un incident
 * (`affected_services`) et rédige le message : on l'affiche tel quel, sous
 * l'en-tete. UiDetailLayout le met tout seul des qu'il a un `service-id`.
 * Sans incident, ou si la lecture echoue, rien : la fiche reste la meme.
 */
const props = defineProps({ serviceId: { type: String, required: true } })
const adion = useAdion()
const affected = ref([])

async function reload() {
  if (!props.serviceId) { affected.value = []; return }
  try {
    const payload = await adion.services.monitoringStatus?.(props.serviceId)
    affected.value = (payload?.affected_services || []).filter((s) => !s.service_id || s.service_id === props.serviceId)
  } catch (_error) {
    affected.value = []
  }
}
watch(() => [props.serviceId, adion.context.orgId], reload, { immediate: true })
</script>

<template>
  <UiNotice v-for="item in affected" :key="item.service_id" :tone="healthOf(item).tone" :title="healthOf(item).label" :text="item.message" />
</template>
