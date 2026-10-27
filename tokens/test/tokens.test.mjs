import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { android, argb, css, load, palette, parseColor } from '../scripts/build.mjs'
import { themeReport, themeVars } from '../scripts/contrast.js'

/*
 * Les garde-fous des jetons : chaque melange vise une couleur qui existe, les
 * deux themes ont les memes cles, et chaque couple texte/surface tient le
 * niveau WCAG AA (4,5:1 pour un texte, 3:1 pour le focus) dans les deux.
 */
const tokens = load()
const here = dirname(fileURLToPath(import.meta.url))

test('chaque couleur existe dans les deux thèmes', () => {
  for (const group of tokens.color.groups) {
    for (const [name, t] of Object.entries(group.tokens)) {
      if (t.mix) continue
      assert.ok(t.dark && t.light, `${name} : il manque un thème`)
      parseColor(t.dark)
      parseColor(t.light)
    }
  }
})

test('un mélange vise une couleur existante', () => {
  assert.doesNotThrow(() => palette(tokens.color, 'dark'))
  assert.deepEqual(Object.keys(palette(tokens.color, 'dark')).sort(), Object.keys(palette(tokens.color, 'light')).sort())
})

for (const theme of ['dark', 'light']) {
  test(`thème ${theme} : chaque couple texte/surface tient le niveau AA`, () => {
    const failures = themeReport(themeVars(css(tokens), theme))
      .filter((r) => !r.ok)
      .map((r) => `${r.label} (${r.fg} sur ${r.bg}) : ${r.value ?? 'jeton absent'} < ${r.min}`)
    assert.deepEqual(failures, [], `\n${failures.join('\n')}\n`)
  })
}

test('Android reçoit des couleurs #AARRGGBB, translucides comprises', () => {
  assert.equal(argb(parseColor('#54ba9b')), '#FF54BA9B')
  assert.equal(argb({ ...parseColor('#54ba9b'), a: 0.16 }), '#2954BA9B')
  const out = android(tokens)
  assert.match(out.dark, /<color name="adion_primary">#FF54BA9B<\/color>/)
  assert.match(out.kt, /val primary: Color,/)
  assert.match(out.kt, /val textBase = 13\.sp/)
})

test('le CSS produit est celui qui est livré', () => {
  const built = readFileSync(join(here, '..', 'dist', 'tokens.css'), 'utf8')
  assert.equal(built, css(tokens))
})
