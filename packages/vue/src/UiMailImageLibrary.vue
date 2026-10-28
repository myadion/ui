<script setup>
import { ref, watch } from 'vue'
import UiButton from './UiButton.vue'
import UiDialog from './UiDialog.vue'
import UiMailDropZone from './UiMailDropZone.vue'
import UiNotice from './UiNotice.vue'

/*
 * « MES IMAGES » (Adion UI, 2026-10-15) : les images deposees par le compte,
 * a reprendre d'un courriel a l'autre. On en depose (glisser-deposer ou
 * bouton), on en choisit une (`pick`, quand la fenetre s'ouvre pour un bloc
 * ou un fond), on en retire.
 *
 * RETIRER N'EFFACE PAS FORCEMENT. Une image encore employee - par un modele,
 * une version, une campagne deja partie - quitte seulement la galerie : un
 * courriel envoye la charge peut-etre encore. L'API le decide et le dit
 * (`hidden`) ; la fenetre le rapporte.
 *
 *   gallery()      les images : [{ id, url, name, width, height, size_bytes }]
 *   upload(file)   depose, rend l'image
 *   remove(image)  retire, rend { removed, hidden }
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  gallery: { type: Function, required: true },
  upload: { type: Function, default: null },
  remove: { type: Function, default: null },
  selectable: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'pick'])

const images = ref([])
const loading = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const confirming = ref(null)

async function load() {
  loading.value = true
  error.value = ''
  try {
    images.value = (await props.gallery()) || []
  } catch (e) {
    error.value = e?.message || 'Vos images n’ont pas pu être chargées.'
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (open) => {
  if (open) {
    notice.value = ''
    confirming.value = null
    load()
  }
})

async function add(file) {
  if (!props.upload) return
  busy.value = true
  error.value = ''
  try {
    const image = await props.upload(file)
    images.value = [image, ...images.value.filter((i) => i.id !== image.id)]
    notice.value = image.original_bytes
      ? `« ${image.name} » est prête : ${weight(image.original_bytes)} ramenés à ${weight(image.size_bytes)}, ${image.width} px de large.`
      : `« ${image.name} » est prête.`
  } catch (e) {
    error.value = e?.message || 'L’image n’a pas pu être déposée.'
  } finally {
    busy.value = false
  }
}

async function confirmRemove() {
  const image = confirming.value
  if (!image || !props.remove) return
  busy.value = true
  error.value = ''
  try {
    const result = await props.remove(image)
    images.value = images.value.filter((i) => i.id !== image.id)
    notice.value = result?.hidden
      ? `« ${image.name} » est retirée de vos images. Elle reste en ligne : un modèle ou une campagne l’emploie encore.`
      : `« ${image.name} » est supprimée.`
    confirming.value = null
  } catch (e) {
    error.value = e?.message || 'Cette image n’a pas pu être retirée.'
  } finally {
    busy.value = false
  }
}

function choose(image) {
  if (!props.selectable) return
  emit('pick', image)
  emit('update:modelValue', false)
}

function weight(bytes) {
  const n = Number(bytes) || 0
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`
}
</script>

<template>
  <UiDialog :model-value="modelValue" title="Mes images" icon="mdi-image-multiple-outline" width="860" :error="error" @update:model-value="(v) => emit('update:modelValue', v)">
    <div class="ui-mail-library">
      <UiMailDropZone v-if="upload" :busy="busy" text="Glissez une image ici, ou cliquez pour la choisir — elle est réduite et compressée pour le courriel" @file="add" @error="(m) => (error = m)" />
      <UiNotice v-if="notice" tone="ok" :text="notice" closable @close="notice = ''" />
      <p v-if="selectable" class="ui-mail-settings__note">Cliquez une image pour la poser.</p>

      <div v-if="loading" class="ui-mail-library__empty"><v-progress-circular indeterminate size="22" /></div>
      <p v-else-if="!images.length" class="ui-mail-library__empty">Aucune image pour l’instant.</p>
      <div v-else class="ui-mail-library__grid">
        <figure v-for="image in images" :key="image.id" class="ui-mail-library__item" :class="{ 'is-selectable': selectable }">
          <button type="button" class="ui-mail-library__thumb" :disabled="!selectable" :title="selectable ? `Poser ${image.name}` : image.name" @click="choose(image)">
            <img :src="image.url" :alt="image.name" loading="lazy">
          </button>
          <figcaption class="ui-mail-library__caption">
            <span class="ui-mail-library__name" :title="image.name">{{ image.name }}</span>
            <span class="ui-mail-library__meta">{{ image.width }} × {{ image.height }} · {{ weight(image.size_bytes) }}</span>
          </figcaption>
          <div v-if="remove" class="ui-mail-library__actions">
            <template v-if="confirming?.id === image.id">
              <UiButton kind="quiet" @click="confirming = null">Garder</UiButton>
              <UiButton kind="danger" :loading="busy" @click="confirmRemove">Retirer</UiButton>
            </template>
            <UiButton v-else kind="quiet" icon="mdi-delete-outline" icon-only :title="`Retirer ${image.name}`" @click="confirming = image" />
          </div>
        </figure>
      </div>
    </div>
    <template #actions="{ close }">
      <UiButton kind="quiet" @click="close">Fermer</UiButton>
    </template>
  </UiDialog>
</template>
