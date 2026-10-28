/*
 * LES JETONS D'ADION, POUR CHAQUE PLATEFORME (2026-10-27).
 *
 * Une seule source (`tokens/src/*.json`), et une sortie par technologie :
 *   dist/tokens.css                  le web (variables --adion-*, deux themes)
 *   dist/tokens.mjs, dist/tokens.json  JavaScript et tout autre outil
 *   dist/android/res/values*         Android (XML : couleurs, dimensions)
 *   dist/android/AdionTokens.kt      Android (Jetpack Compose)
 *
 * Une couleur « mix » est une couleur du theme posee a un pourcentage :
 * color-mix() sur le web, une couleur calculee avec son alpha ailleurs.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (name) => JSON.parse(readFileSync(join(root, 'src', name), 'utf8'))

export function load() {
  return { color: read('color.json'), size: read('size.json'), font: read('font.json') }
}

/* ------------------------------------------------------------------ */
/* Les couleurs : lire, melanger, ecrire                               */
/* ------------------------------------------------------------------ */

/** « #rrggbb » ou « rgba(r, g, b, a) » en { r, g, b, a } (a de 0 a 1). */
export function parseColor(text) {
  const value = String(text).trim()
  let m = value.match(/^#([0-9a-f]{6})$/i)
  if (m) {
    const n = parseInt(m[1], 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 }
  }
  m = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i)
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
  throw new Error(`Couleur illisible : ${value}`)
}

const hex2 = (n) => Math.round(n).toString(16).padStart(2, '0')

/** #AARRGGBB, comme l'attendent Android et Compose. */
export const argb = ({ r, g, b, a }) => `#${hex2(a * 255)}${hex2(r)}${hex2(g)}${hex2(b)}`.toUpperCase()

/** Toutes les couleurs d'un theme, « mix » resolus. */
export function palette(color, theme) {
  const out = {}
  const tokens = Object.assign({}, ...color.groups.map((g) => g.tokens))
  for (const [name, token] of Object.entries(tokens)) {
    if (token.mix) continue
    out[name] = parseColor(token[theme])
  }
  for (const [name, token] of Object.entries(tokens)) {
    if (!token.mix) continue
    const base = out[token.mix]
    if (!base) throw new Error(`${name} mélange ${token.mix}, qui n'existe pas`)
    out[name] = { ...base, a: base.a * (token.percent / 100) }
  }
  return out
}

const allTokens = (groups) => Object.assign({}, ...groups.map((g) => g.tokens))

/* ------------------------------------------------------------------ */
/* Le web                                                              */
/* ------------------------------------------------------------------ */

const DARK = [":root", "html[data-theme='dark']", '.v-theme--adionDark']
const LIGHT = ["html[data-theme='light']", '.v-theme--adionLight']
const ANY = [':root', 'html[data-theme]', '.v-theme--adionDark', '.v-theme--adionLight']

export function css({ color, size, font }) {
  const colors = allTokens(color.groups)
  const plain = Object.entries(colors).filter(([, t]) => !t.mix)
  const mixed = Object.entries(colors).filter(([, t]) => t.mix)
  const themed = (theme) => [
    ...plain.map(([name, t]) => `  --adion-${name}: ${t[theme]};`),
    `  --adion-shadow-card: ${color.shadows['shadow-card'][theme]};`,
  ]
  const sizes = allTokens(size.groups)
  const px = (t) => (t.ref ? `var(--adion-${t.ref})` : `${t.px}px`)
  const brand = Object.entries(color.brand).filter(([k]) => !k.startsWith('$'))
  const gradients = Object.entries(color.gradients).filter(([k]) => !k.startsWith('$'))

  return [
    '/*',
    ' * ADION UI - LES JETONS. Fichier produit par @myadion/tokens',
    ' * (tokens/scripts/build.mjs) : ne pas le modifier a la main, modifier',
    ' * tokens/src/*.json.',
    ' */',
    `${DARK.join(',\n')} {`,
    ...themed('dark'),
    '}',
    '',
    `${LIGHT.join(',\n')} {`,
    ...themed('light'),
    '}',
    '',
    '/* Fonds, filets et teintes derives, poses sur l\'element qui porte le theme. */',
    `${ANY.join(',\n')} {`,
    ...mixed.map(([name, t]) => `  --adion-${name}: color-mix(in srgb, var(--adion-${t.mix}) ${t.percent}%, transparent);`),
    ...gradients.map(([name, value]) => `  --adion-${name}: ${value};`),
    '}',
    '',
    ':root {',
    ...brand.map(([name, value]) => `  --adion-${name}: ${value};`),
    ...Object.entries(sizes).map(([name, t]) => `  --adion-${name}: ${px(t)};`),
    ...Object.entries(font.families).map(([name, f]) => `  --adion-${name}: ${f.value};`),
    '}',
    '',
  ].join('\n')
}

/** Le JavaScript : valeurs resolues, et les deux themes prets pour Vuetify. */
export function js(tokens) {
  const { color, size, font } = tokens
  const theme = (name) => Object.fromEntries(Object.entries(palette(color, name)).map(([k, c]) => [k, c.a === 1 ? `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}` : `rgba(${c.r}, ${c.g}, ${c.b}, ${+c.a.toFixed(4)})`]))
  const sizes = allTokens(size.groups)
  const resolve = (t) => (t.ref ? resolve(sizes[t.ref]) : t.px)
  const data = {
    dark: theme('dark'),
    light: theme('light'),
    size: Object.fromEntries(Object.entries(sizes).map(([k, t]) => [k, resolve(t)])),
    font: Object.fromEntries(Object.entries(font.families).map(([k, f]) => [k, f.value])),
  }
  const vuetify = (name, dark) => ({
    dark,
    colors: {
      background: data[name]['bg-0'],
      surface: data[name]['bg-1'],
      'surface-bright': data[name]['bg-2'],
      primary: data[name].primary,
      'on-primary': data[name]['on-primary'],
      secondary: data[name].secondary,
      info: data[name].info,
      success: data[name].ok,
      warning: data[name].warn,
      error: data[name].bad,
    },
  })
  return {
    json: JSON.stringify(data, null, 2),
    mjs: [
      '// Produit par @myadion/tokens (tokens/scripts/build.mjs) : ne pas modifier a la main.',
      `export const tokens = ${JSON.stringify(data, null, 2)}`,
      '',
      '/** Les deux themes Vuetify d\'Adion : createVuetify({ theme: { defaultTheme: \'adionDark\', themes: vuetifyThemes } }). */',
      `export const vuetifyThemes = ${JSON.stringify({ adionDark: vuetify('dark', true), adionLight: vuetify('light', false) }, null, 2)}`,
      '',
      'export default tokens',
      '',
    ].join('\n'),
  }
}

/* ------------------------------------------------------------------ */
/* Android                                                             */
/* ------------------------------------------------------------------ */

const androidName = (name) => `adion_${name.replace(/-/g, '_')}`
const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())

export function android({ color, size }) {
  const xmlColors = (theme) => [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- Produit par @myadion/tokens : ne pas modifier a la main. -->',
    '<resources>',
    ...Object.entries(palette(color, theme)).map(([k, c]) => `    <color name="${androidName(k)}">${argb(c)}</color>`),
    '</resources>',
    '',
  ].join('\n')
  const sizes = allTokens(size.groups)
  const resolve = (t) => (t.ref ? resolve(sizes[t.ref]) : t)
  const dimens = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- Produit par @myadion/tokens : ne pas modifier a la main. -->',
    '<resources>',
    ...Object.entries(sizes).map(([k, t]) => {
      const r = resolve(t)
      return `    <dimen name="${androidName(k)}">${r.px}${r.text ? 'sp' : 'dp'}</dimen>`
    }),
    '</resources>',
    '',
  ].join('\n')
  const dark = palette(color, 'dark')
  const light = palette(color, 'light')
  const names = Object.keys(dark)
  const kt = [
    '// Produit par @myadion/tokens (tokens/scripts/build.mjs) : ne pas modifier a la main.',
    'package cloud.adion.ui.tokens',
    '',
    'import androidx.compose.ui.graphics.Color',
    'import androidx.compose.ui.unit.dp',
    'import androidx.compose.ui.unit.sp',
    '',
    '/** Les couleurs d\'Adion pour un theme. */',
    'data class AdionPalette(',
    ...names.map((k) => `    val ${camel(k)}: Color,`),
    ')',
    '',
    'object AdionColors {',
    ...[['Dark', dark], ['Light', light]].map(([label, p]) => [
      `    val ${label} = AdionPalette(`,
      ...names.map((k) => `        ${camel(k)} = Color(0x${argb(p[k]).slice(1)}),`),
      '    )',
    ].join('\n')),
    '}',
    '',
    'object AdionDimens {',
    ...Object.entries(sizes).map(([k, t]) => {
      const r = resolve(t)
      return `    val ${camel(k)} = ${r.px}${r.text ? '.sp' : '.dp'}`
    }),
    '}',
    '',
  ].join('\n')
  return { dark: xmlColors('dark'), light: xmlColors('light'), dimens, kt }
}

/* ------------------------------------------------------------------ */

export function build(outDir = join(root, 'dist')) {
  const tokens = load()
  const write = (path, text) => { mkdirSync(dirname(join(outDir, path)), { recursive: true }); writeFileSync(join(outDir, path), text) }
  write('tokens.css', css(tokens))
  const { json, mjs } = js(tokens)
  write('tokens.json', json)
  write('tokens.mjs', mjs)
  const a = android(tokens)
  // Android : le theme clair par defaut (values), le sombre la nuit (values-night).
  write('android/res/values/adion_colors.xml', a.light)
  write('android/res/values-night/adion_colors.xml', a.dark)
  write('android/res/values/adion_dimens.xml', a.dimens)
  write('android/AdionTokens.kt', a.kt)
  return tokens
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  build()
  console.log('Jetons produits dans tokens/dist.')
}
