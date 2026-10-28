<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import UiActionMenu from './UiActionMenu.vue'
import UiConfirm from './UiConfirm.vue'
import UiDialog from './UiDialog.vue'
import UiInput from './UiInput.vue'
import UiButton from './UiButton.vue'
import { COMMON_ACTIONS, REFRESH_ACTION, handledActions } from './actions'
import { useAdion } from './adapter.js'

/*
 * LE MENU D'ACTIONS D'UNE FICHE, QUI SE BRANCHE SEUL (Adion UI).
 * Il lit lui-meme `GET /account/project/{projet}/service/{service}/actions`
 * (le projet est celui du selecteur), pose la question de l'API (`confirm`)
 * avant d'agir et recharge la liste apres chaque geste.
 *
 * Les gestes communs se font ici, une seule fois, pour toutes les fiches :
 *   rename              une petite fenetre : le nom actuel, un champ, Enregistrer
 *                       (`PUT /service/{id}`, `customer_description`) ; `renamed` dit le
 *                       nouveau nom, l'en-tete l'affiche aussitot ;
 *   terminate           la fenetre de resiliation (ServiceTermination) ;
 *   cancel_termination  reactiver l'offre ;
 *   transfer            la migration vers un autre projet (ServiceMigration) ;
 *   change_offer        `start` : le changement d'offre vit dans « Mon offre »,
 *                       la fiche l'ouvre (elle l'ecoute, ou il n'est pas affiche).
 * Les actions rapides d'un produit (`send_sms`, `new_campaign`...) remontent par
 * `action` ; une `key` que la fiche ne declare pas dans `handles` n'est pas
 * affichee, pas plus qu'une `key` inconnue.
 *
 * Resilier a besoin de l'abonnement (`subscription`, avec ses champs de
 * resiliation) : celui de la fiche, ou celui que l'API joint a la liste.
 */
const props = defineProps({
  serviceId: { type: String, default: '' },
  serviceName: { type: String, default: '' },
  subscription: { type: Object, default: null },
  /** Les actions rapides que la fiche sait faire. */
  handles: { type: Array, default: () => [] },
  /** Une liste deja chargee (demo, tests) : on ne la lit pas. */
  actions: { type: Array, default: null },
  /** Actualiser en premiere entree : la fiche l'ecoute (`refresh`) et recharge ses donnees. */
  refreshable: { type: Boolean, default: false },
})
const emit = defineEmits(['action', 'start', 'changed', 'refresh', 'renamed'])

const adion = useAdion()
const ServiceTermination = adion.components?.ServiceTermination || null
const ServiceMigration = adion.components?.ServiceMigration || null
const all = ref([])
const sub = ref(null)
const asked = ref(null)
const termination = ref(null)
const migration = ref(null)
const renaming = ref(false)
const newName = ref('')
const renameBusy = ref(false)
const renameError = ref('')
const open = computed({ get: () => Boolean(asked.value), set: (v) => { if (!v) asked.value = null } })
const subscription = computed(() => props.subscription || sub.value)

async function reload() {
  if (props.actions) { all.value = props.actions; return }
  const project = adion.context.projectId
  if (!props.serviceId || !project) { all.value = []; return }
  try {
    const payload = await adion.services.fetchActions(project, props.serviceId)
    all.value = Array.isArray(payload?.data) ? payload.data : []
    sub.value = payload?.subscription || null
  } catch (_error) {
    // Pas de menu plutot qu'un menu faux : la fiche reste utilisable.
    all.value = []
  }
}

const items = computed(() => [...(props.refreshable ? [REFRESH_ACTION] : []), ...listed.value])
const listed = computed(() => props.actions ? all.value : handledActions(all.value, [
  ...props.handles,
  ...(props.serviceId ? ['rename'] : []),
  ...(subscription.value ? ['terminate', 'cancel_termination'] : []),
  'transfer',
  ...(props.handles.includes('change_offer') ? ['change_offer'] : []),
]))

async function run(key) {
  if (key === 'refresh') { emit('refresh'); reload(); return }
  if (key === 'rename') { newName.value = props.serviceName; renameError.value = ''; renaming.value = true }
  else if (key === 'terminate') termination.value?.open()
  else if (key === 'transfer') migration.value?.open()
  else if (key === 'change_offer') emit('start', 'change')
  else if (key === 'cancel_termination') {
    await adion.services.cancelTermination(adion.context.projectId, subscription.value?.id)
    emit('changed')
  } else emit('action', key)
  if (!COMMON_ACTIONS.includes(key) || key === 'cancel_termination') reload()
}
function choose(key) {
  const item = all.value.find((a) => a.key === key)
  if (item?.confirm) asked.value = item
  else run(key)
}
function confirmed() {
  const key = asked.value?.key
  asked.value = null
  if (key) run(key)
}
async function saveName() {
  const next = newName.value.trim()
  renameBusy.value = true
  renameError.value = ''
  try {
    await adion.services.updateDescription(props.serviceId, next === '' ? null : next)
    renaming.value = false
    emit('renamed', next)
  } catch (exception) {
    renameError.value = exception?.message || 'Le nom n’a pas pu être enregistré.'
  } finally {
    renameBusy.value = false
  }
}
function done() { reload(); emit('changed') }

onMounted(reload)
watch(() => adion.context.projectId, reload)
watch(() => props.serviceId, reload)
defineExpose({ reload })
</script>

<template>
  <UiActionMenu :actions="items" @action="choose" />
  <UiConfirm v-model="open" :title="asked?.label || ''" :text="asked?.confirm || ''" :confirm-label="asked?.label || 'Confirmer'" :danger="Boolean(asked?.danger)" @confirm="confirmed" />
  <UiDialog v-model="renaming" title="Renommer le service" icon="mdi-pencil-outline" text="Ce nom vous aide à repérer le service dans votre espace et figure sur vos factures. Laissez vide pour revenir au nom d’origine." :error="renameError" :busy="renameBusy" width="480">
    <UiInput v-model="newName" label="Nom du service" maxlength="255" autofocus @keyup.enter="saveName" />
    <template #actions="{ close }">
      <UiButton kind="quiet" :disabled="renameBusy" @click="close">Annuler</UiButton>
      <UiButton kind="primary" :loading="renameBusy" @click="saveName">Enregistrer</UiButton>
    </template>
  </UiDialog>
  <component :is="ServiceTermination" v-if="ServiceTermination && subscription" ref="termination" trigger="none" :subscription="subscription" :project-id="adion.context.projectId" :service-name="serviceName" @changed="done" />
  <component :is="ServiceMigration" v-if="ServiceMigration && serviceId" ref="migration" trigger="none" :service-id="serviceId" :service-name="serviceName" @changed="done" />
</template>
