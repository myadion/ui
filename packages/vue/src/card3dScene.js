/*
 * LA CARTE EN 3D (Adion UI, coordination#49). Charge Three.js a la demande :
 * ce module n'est importe que par UiCard3D, quand l'appareil s'y prete.
 *
 * Au repos la carte se balance doucement et un reflet la traverse ; le champ
 * actif la tourne vers l'acheteur (le code de securite la retourne) ; le
 * succes la fait tourner d'un tour. Le dessin des faces est celui de card3d.js.
 */
import { CARD_RATIO, FACE_H, FACE_W, cardPalette, drawFace, faceFor } from './card3d.js'

const WIDTH = 3.4
const HEIGHT = WIDTH / CARD_RATIO
const DEPTH = 0.04

function roundedShape(THREE, w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
  return s
}

function faceTexture(THREE, renderer) {
  const canvas = document.createElement('canvas')
  canvas.width = FACE_W
  canvas.height = FACE_H
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  return { canvas, texture, ctx: canvas.getContext('2d') }
}

function sheenTexture(THREE) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(40, 0, 216, 90)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.55)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.repeat.set(0.45, 1)
  return texture
}

const ease = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Monte la carte dans `host`. Retourne { update(state), dispose() } ; lance
 * une erreur si WebGL manque (l'appelant retombe sur la carte plate).
 */
export async function mountScene(host) {
  const THREE = await import('three')
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  host.appendChild(renderer.domElement)
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0, 0, 7.2)

  const group = new THREE.Group()
  scene.add(group)

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedShape(THREE, WIDTH, HEIGHT, 0.17), { depth: DEPTH, bevelEnabled: false, curveSegments: 14 }),
    new THREE.MeshBasicMaterial({ color: 0x0b0c0e }),
  )
  body.position.z = -DEPTH / 2
  group.add(body)

  const faces = {}
  for (const side of ['front', 'back']) {
    const f = faceTexture(THREE, renderer)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(WIDTH, HEIGHT),
      new THREE.MeshBasicMaterial({ map: f.texture, transparent: true, alphaTest: 0.02 }),
    )
    mesh.position.z = DEPTH / 2 + 0.002
    if (side === 'back') { mesh.rotation.y = Math.PI; mesh.position.z = -DEPTH / 2 - 0.002 }
    group.add(mesh)
    const sheen = new THREE.Mesh(
      new THREE.PlaneGeometry(WIDTH, HEIGHT),
      new THREE.MeshBasicMaterial({ map: sheenTexture(THREE), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.4 }),
    )
    sheen.renderOrder = 2
    sheen.position.z = mesh.position.z + (side === 'back' ? -0.002 : 0.002)
    if (side === 'back') sheen.rotation.y = Math.PI
    group.add(sheen)
    faces[side] = { ...f, mesh, sheen }
  }

  let state = {}
  let drawn = ''
  let palette = cardPalette()
  const redraw = () => {
    const key = JSON.stringify([state.focus, state.brand, state.filled, state.success])
    if (key === drawn) return
    drawn = key
    for (const side of ['front', 'back']) {
      drawFace(faces[side].ctx, side, state, palette)
      faces[side].texture.needsUpdate = true
    }
  }

  let rotY = 0
  let rotX = 0
  let scale = 1
  let spinStart = 0
  let wasSuccess = false
  let visible = true
  let raf = 0
  const clock = new THREE.Clock()

  const resize = () => {
    const w = host.clientWidth || 320
    const h = host.clientHeight || 220
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Sur un cadre etroit (telephone), on recule pour que la carte tienne.
    const fit = (WIDTH * 1.18) / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect)
    camera.position.z = Math.max(7.2, fit)
    camera.updateProjectionMatrix()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  resize()

  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) loop() })
  io.observe(host)
  const onVisibility = () => { if (!document.hidden) loop() }
  document.addEventListener('visibilitychange', onVisibility)
  const themeWatch = new MutationObserver(() => { palette = cardPalette(); drawn = ''; redraw() })
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  function frame() {
    raf = 0
    if (!visible || document.hidden) return
    const t = clock.getElapsedTime()
    const back = faceFor(state.focus, state.brand) === 'back'
    let targetY = back ? Math.PI : Math.sin(t * 0.7) * 0.28
    let targetX = Math.sin(t * 0.5) * 0.07
    let targetS = state.focus && !back ? 1.05 : 1
    if (state.focus === 'number') targetX += 0.05
    if (state.focus === 'expiry') { targetY += 0.12; targetX -= 0.04 }
    if (state.success) {
      if (!wasSuccess) { wasSuccess = true; spinStart = t }
      const p = Math.min(1, (t - spinStart) / 1.2)
      targetY = Math.PI * 2 * ease(p)
      targetS = 1 + 0.08 * Math.sin(Math.min(1, p) * Math.PI)
      rotY = targetY
    } else {
      wasSuccess = false
      rotY += (targetY - rotY) * 0.1
    }
    rotX += (targetX - rotX) * 0.1
    scale += (targetS - scale) * 0.1
    group.rotation.set(rotX, rotY, 0)
    group.scale.setScalar(scale)
    // Le reflet traverse la carte, lentement, avec une pause.
    const sweep = ((t * 0.16) % 1.7) - 0.5
    for (const side of ['front', 'back']) {
      const map = faces[side].sheen.material.map
      map.offset.x = side === 'back' ? 1 - sweep - 0.45 : sweep
    }
    renderer.render(scene, camera)
    raf = requestAnimationFrame(frame)
  }
  function loop() { if (!raf) raf = requestAnimationFrame(frame) }

  state = {}
  redraw()
  loop()

  return {
    update(next) { state = next; redraw(); loop() },
    dispose() {
      cancelAnimationFrame(raf)
      raf = 0
      visible = false
      observer.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      scene.traverse((o) => {
        o.geometry?.dispose()
        const m = o.material
        if (m) { m.map?.dispose(); m.dispose() }
      })
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
