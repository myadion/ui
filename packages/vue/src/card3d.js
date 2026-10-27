/*
 * LA CARTE BANCAIRE (Adion UI, coordination#49) : ce qu'on dessine sur ses
 * deux faces, et quand la montrer en 3D.
 *
 * La carte ne montre JAMAIS ce que l'acheteur tape : les numeros restent dans
 * les formulaires du prestataire de paiement. Elle n'affiche que des points,
 * la forme, et met en evidence l'endroit ou se trouve l'information demandee
 * (numero, date, code de securite). Ce module dessine ; UiCard3D l'affiche en
 * 2D, et card3dScene.js en 3D.
 */

export const CARD_RATIO = 1.586
export const FACE_W = 1024
export const FACE_H = Math.round(FACE_W / CARD_RATIO)

/* Les trois champs, et la face que chacun appelle. */
export const FIELDS = ['number', 'expiry', 'cvc']

/** Le code de securite est au dos, sauf American Express : quatre chiffres devant. */
export function faceFor(focus, brand) {
  return focus === 'cvc' && brand !== 'amex' ? 'back' : 'front'
}

/** 3D si l'appareil s'y prete ; sinon la carte plate. */
export function shouldUse3D(win = typeof window !== 'undefined' ? window : null) {
  if (!win) return false
  const nav = win.navigator || {}
  if (typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (nav.deviceMemory && nav.deviceMemory <= 2) return false
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return false
  return true
}

/* Les couleurs viennent des jetons de la page ; l'encre de la carte est la meme dans les deux themes. */
export function cardPalette(el = typeof document !== 'undefined' ? document.documentElement : null) {
  const css = el ? getComputedStyle(el) : null
  const token = (name, fallback) => (css?.getPropertyValue(name) || '').trim() || fallback
  return {
    accent: token('--adion-primary', '#54ba9b'),
    accentText: token('--adion-accent-text', '#67dcc6'),
    ok: token('--adion-ok', '#4ade9b'),
    ink: '#0f1012',
    ink2: '#26272d',
    text: '#eafcf6',
    textDim: 'rgba(234, 252, 246, 0.62)',
  }
}

const GROUPS = { amex: [4, 6, 5], default: [4, 4, 4, 4] }
const dots = (n) => '•'.repeat(n)

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function glow(ctx, x, y, w, h, palette) {
  ctx.save()
  roundRect(ctx, x, y, w, h, 14)
  ctx.fillStyle = 'rgba(103, 220, 198, 0.16)'
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = palette.accentText
  ctx.shadowColor = palette.accentText
  ctx.shadowBlur = 22
  ctx.stroke()
  ctx.restore()
}

function brandMark(ctx, brand, x, y, h, palette) {
  ctx.save()
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'right'
  if (brand === 'visa') {
    ctx.font = `italic 800 ${h}px Raleway, sans-serif`
    ctx.fillStyle = palette.text
    ctx.fillText('VISA', x, y)
  } else if (brand === 'mastercard') {
    const r = h * 0.5
    ctx.globalAlpha = 0.92
    ctx.fillStyle = '#eb001b'
    ctx.beginPath(); ctx.arc(x - r * 1.5, y, r, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#f79e1b'
    ctx.globalCompositeOperation = 'screen'
    ctx.beginPath(); ctx.arc(x - r * 0.5, y, r, 0, Math.PI * 2); ctx.fill()
  } else if (brand === 'amex') {
    ctx.font = `800 ${h * 0.62}px Raleway, sans-serif`
    ctx.fillStyle = palette.text
    ctx.fillText('AMEX', x, y)
  } else {
    ctx.font = `600 ${h * 0.5}px Raleway, sans-serif`
    ctx.fillStyle = palette.textDim
    ctx.fillText('CARTE', x, y)
  }
  ctx.restore()
}

function background(ctx, w, h, palette) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, palette.ink2)
  g.addColorStop(1, palette.ink)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  // Deux reflets de couleur, dans le coin, comme une impression.
  const a = ctx.createRadialGradient(w * 0.95, h * 0.05, 10, w * 0.95, h * 0.05, w * 0.7)
  a.addColorStop(0, 'rgba(84, 186, 155, 0.40)')
  a.addColorStop(1, 'rgba(84, 186, 155, 0)')
  ctx.fillStyle = a
  ctx.fillRect(0, 0, w, h)
  const b = ctx.createRadialGradient(w * 0.05, h * 0.98, 10, w * 0.05, h * 0.98, w * 0.5)
  b.addColorStop(0, 'rgba(6, 182, 212, 0.22)')
  b.addColorStop(1, 'rgba(6, 182, 212, 0)')
  ctx.fillStyle = b
  ctx.fillRect(0, 0, w, h)
}

/**
 * Dessine une face. `state` : { focus: 'number' | 'expiry' | 'cvc' | null,
 * brand, filled: { number, expiry, cvc }, success }. `filled` ne dit que
 * « rempli ou non » : jamais une valeur.
 */
export function drawFace(ctx, side, state = {}, palette = cardPalette(), w = FACE_W, h = FACE_H) {
  const { focus = null, brand = '', filled = {}, success = false } = state
  ctx.save()
  ctx.clearRect(0, 0, w, h)
  roundRect(ctx, 0, 0, w, h, h * 0.075)
  ctx.clip()
  background(ctx, w, h, palette)
  const pad = w * 0.075
  ctx.textBaseline = 'middle'

  if (side === 'back') {
    ctx.fillStyle = '#050506'
    ctx.fillRect(0, h * 0.13, w, h * 0.19)
    // Bande de signature, et le code de securite a sa droite.
    const sy = h * 0.46
    const sh = h * 0.15
    ctx.fillStyle = 'rgba(234, 252, 246, 0.14)'
    roundRect(ctx, pad, sy, w * 0.5, sh, 8); ctx.fill()
    const bw = w * 0.2
    const bx = w - pad - bw
    if (focus === 'cvc') glow(ctx, bx - 14, sy - 14, bw + 28, sh + 28, palette)
    ctx.fillStyle = '#f4f6f8'
    roundRect(ctx, bx, sy, bw, sh, 8); ctx.fill()
    ctx.fillStyle = '#16171a'
    ctx.font = `700 ${sh * 0.62}px ${'ui-monospace, Menlo, monospace'}`
    ctx.textAlign = 'center'
    ctx.fillText(dots(3), bx + bw / 2, sy + sh / 2 + 2)
    ctx.textAlign = 'right'
    ctx.fillStyle = focus === 'cvc' ? palette.accentText : palette.textDim
    ctx.font = `600 ${h * 0.045}px Raleway, sans-serif`
    ctx.fillText('CODE DE SÉCURITÉ', w - pad, sy + sh + h * 0.085)
    ctx.restore()
    return
  }

  // Face avant : puce, numero, date, marque.
  const chipW = w * 0.13
  const chipH = chipW * 0.78
  const cy = h * 0.2
  ctx.fillStyle = 'rgba(234, 214, 160, 0.9)'
  roundRect(ctx, pad, cy, chipW, chipH, 10); ctx.fill()
  ctx.strokeStyle = 'rgba(80, 60, 20, 0.55)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(pad, cy + chipH / 2); ctx.lineTo(pad + chipW, cy + chipH / 2)
  ctx.moveTo(pad + chipW / 2, cy); ctx.lineTo(pad + chipW / 2, cy + chipH)
  ctx.stroke()

  const groups = GROUPS[brand] || GROUPS.default
  const nf = h * 0.115
  ctx.font = `600 ${nf}px ui-monospace, Menlo, monospace`
  const gap = nf * 0.7
  const text = groups.map(dots)
  const widths = text.map((t) => ctx.measureText(t).width)
  const total = widths.reduce((s, x) => s + x, 0) + gap * (groups.length - 1)
  const ny = h * 0.58
  if (focus === 'number') glow(ctx, pad - 16, ny - nf * 0.85, total + 32, nf * 1.7, palette)
  ctx.textAlign = 'left'
  ctx.fillStyle = focus === 'number' || filled.number ? palette.text : palette.textDim
  let x = pad
  text.forEach((t, i) => { ctx.fillText(t, x, ny); x += widths[i] + gap })

  const ey = h * 0.83
  ctx.font = `600 ${h * 0.04}px Raleway, sans-serif`
  ctx.fillStyle = focus === 'expiry' ? palette.accentText : palette.textDim
  ctx.fillText('VALIDE JUSQU’AU', pad, ey - h * 0.075)
  const ef = h * 0.082
  ctx.font = `600 ${ef}px ui-monospace, Menlo, monospace`
  const ew = ctx.measureText('••/••').width
  if (focus === 'expiry') glow(ctx, pad - 16, ey - ef * 0.75, ew + 32, ef * 1.5, palette)
  ctx.fillStyle = focus === 'expiry' || filled.expiry ? palette.text : palette.textDim
  ctx.fillText('••/••', pad, ey)

  // American Express : les quatre chiffres du code sont devant, a droite de la date.
  if (brand === 'amex') {
    const cw = ctx.measureText('••••').width
    const cx = pad + ew + w * 0.1
    if (focus === 'cvc') glow(ctx, cx - 16, ey - ef * 0.75, cw + 32, ef * 1.5, palette)
    ctx.fillStyle = focus === 'cvc' || filled.cvc ? palette.text : palette.textDim
    ctx.fillText('••••', cx, ey)
  }

  brandMark(ctx, brand, w - pad, h * 0.84, h * 0.13, palette)

  if (success) {
    ctx.fillStyle = 'rgba(8, 12, 11, 0.62)'
    ctx.fillRect(0, 0, w, h)
    const r = h * 0.2
    ctx.fillStyle = palette.ok
    ctx.beginPath(); ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#06140f'
    ctx.lineWidth = r * 0.16
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(w / 2 - r * 0.45, h / 2 + r * 0.02)
    ctx.lineTo(w / 2 - r * 0.1, h / 2 + r * 0.38)
    ctx.lineTo(w / 2 + r * 0.5, h / 2 - r * 0.32)
    ctx.stroke()
  }
  ctx.restore()
}
