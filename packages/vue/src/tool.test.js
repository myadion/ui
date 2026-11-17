import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

/*
 * LES REGLES DU MODE OUTIL QUI SE MESURENT (2026-11-17). Le mode outil est
 * dense, avec un plancher : aucun texte sous 11 px, aucune cible sous 24 px.
 * La liste complete des regles est dans README.md (« Le mode outil »).
 */
const css = readFileSync(new URL('./ui.css', import.meta.url), 'utf8')
const tool = css.slice(css.indexOf('/* Mode outil (UiAppShell tool')).replace(/\/\*[\s\S]*?\*\//g, '')
const rules = [...tool.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim(), body }))
const TOOL = /\.ui-(shell\.is-tool|workbench|queue|record|composer|feed|props|entity)/

test('le mode outil a ses styles a la fin de ui.css', () => {
  assert.ok(tool.length > 2000, 'le bloc « Mode outil » manque dans ui.css')
  assert.ok(rules.some((rule) => rule.selector.includes('.ui-workbench')), 'le poste de travail manque')
})

test('mode outil : aucun texte sous 11 px', () => {
  for (const { selector, body } of rules.filter((rule) => TOOL.test(rule.selector))) {
    for (const [, size] of body.matchAll(/font(?:-size)?:[^;]*?(\d+(?:\.\d+)?)px/g)) {
      assert.ok(Number(size) >= 11, `${selector} : ${size}px, sous le plancher de 11 px`)
    }
  }
})

test('mode outil : aucune cible sous 24 px', () => {
  // Les controles du mode outil : chacun declare sa hauteur, 24 px au moins.
  const targets = ['.ui-queue__step', '.ui-feed__filter', '.ui-feed__more', '.ui-composer__mode', '.ui-props__toggle', '.ui-record__copy, .ui-props__copy', '.ui-record__back', '.ui-props__link', '.ui-entity', '.ui-table__link', ':is(.ui-shell.is-tool, .ui-tool) .ui-table__th-sort', ':is(.ui-shell.is-tool, .ui-tool) .row-link']
  for (const target of targets) {
    const rule = rules.find((entry) => entry.selector === target)
    assert.ok(rule, `${target} : la regle manque`)
    const height = /(?:min-)?height:\s*(\d+)px/.exec(rule.body)
    assert.ok(height && Number(height[1]) >= 24, `${target} : pas de hauteur de 24 px au moins`)
  }
})

test('mode outil : la teinte d’un etat se pose sur la surface pleine', () => {
  const badge = rules.find((rule) => rule.selector === ':is(.ui-shell.is-tool, .ui-tool) :is(.ui-badge, .ui-status)')
  assert.ok(badge && badge.body.includes('--adion-surface-solid'), 'le badge du mode outil doit se poser sur --adion-surface-solid')
})

test('les composants du poste de travail sont exportes', () => {
  const index = readFileSync(new URL('./index.js', import.meta.url), 'utf8')
  for (const name of ['UiWorkbench', 'UiQueue', 'UiRecordHeader', 'UiComposer', 'UiActivityFeed', 'UiPropertyGrid', 'UiEntityLink', 'UiToolPage']) {
    assert.ok(index.includes(`as ${name} }`), `${name} n’est pas exporte`)
  }
})
