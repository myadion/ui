<script setup>
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import { cardPalette, drawFace, FACE_H, FACE_W, faceFor, shouldUse3D } from './card3d.js'

/*
 * UNE CARTE BANCAIRE QUI MONTRE OU TROUVER L'INFORMATION (Adion UI).
 * Elle suit le champ en cours de saisie :
 *
 *   focus    'number' (chiffres mis en avant), 'expiry' (la date), 'cvc' (la
 *            carte se retourne : les 3 chiffres du dos), ou vide (au repos,
 *            elle se balance et un reflet la traverse) ;
 *   brand    visa, mastercard, amex : la marque detectee ;
 *   filled   { number, expiry, cvc } : ce qui est complet (jamais une valeur) ;
 *   success  le paiement est confirme : un tour sur elle-meme, une coche.
 *
 * Elle ne montre jamais ce qui est saisi : seulement des points. En 3D
 * (Three.js, charge a la demande) ; sur un appareil faible, WebGL absent ou
 * `prefers-reduced-motion`, une carte plate dessinee de la meme facon.
 */
const props = defineProps({
  focus: { type: String, default: '' },
  brand: { type: String, default: '' },
  filled: { type: Object, default: () => ({}) },
  success: { type: Boolean, default: false },
  /** 'auto' choisit selon l'appareil ; '2d' force la carte plate. */
  mode: { type: String, default: 'auto' },
})

const host = ref(null)
const flat = ref(null)
const flat2d = ref(props.mode === '2d')
let scene = null
let disposed = false
let themeWatch = null

const state = computed(() => ({ focus: props.focus || null, brand: props.brand, filled: props.filled, success: props.success }))
const label = computed(() => {
  if (props.success) return 'Carte bancaire : paiement confirmé'
  return ({ number: 'Carte bancaire : le numéro est sur la face avant', expiry: 'Carte bancaire : la date d’expiration est sur la face avant', cvc: 'Carte bancaire : le code de sécurité est au dos' })[props.focus] || 'Carte bancaire'
})

function paintFlat() {
  const canvas = flat.value
  if (!canvas) return
  drawFace(canvas.getContext('2d'), faceFor(props.focus, props.brand), state.value, cardPalette())
}

onMounted(async () => {
  if (props.mode === '2d' || !shouldUse3D()) { flat2d.value = true; return }
  try {
    const { mountScene } = await import('./card3dScene.js')
    if (disposed) return
    scene = await mountScene(host.value)
    if (disposed) { scene.dispose(); return }
    scene.update(state.value)
  } catch (_e) {
    flat2d.value = true
  }
})

watch(flat2d, async (on) => {
  if (!on) return
  await Promise.resolve()
  paintFlat()
  themeWatch = new MutationObserver(paintFlat)
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}, { flush: 'post', immediate: true })
watch(state, (s) => { scene?.update(s); if (flat2d.value) paintFlat() }, { deep: true })

onBeforeUnmount(() => { disposed = true; scene?.dispose(); themeWatch?.disconnect() })
</script>

<template>
  <div ref="host" class="ui-card3d" role="img" :aria-label="label">
    <canvas v-if="flat2d" ref="flat" class="ui-card3d__flat" :class="{ 'is-back': faceFor(focus, brand) === 'back' }" :width="FACE_W" :height="FACE_H" />
  </div>
</template>
