/*
 * Ce que la doc lit dans le code : les proprietes, evenements et creneaux d'un
 * composant (tels qu'ecrits dans son defineProps), et la coloration du code
 * des exemples. Rien a tenir a jour a la main.
 */

// Le texte entre une ouverture et sa fermeture, en sautant les chaines.
function balanced(src, start) {
  const open = src[start]
  const close = { '{': '}', '[': ']', '(': ')' }[open]
  let depth = 0
  for (let i = start; i < src.length; i++) {
    const c = src[i]
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; continue }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); continue }
    if (c === "'" || c === '"' || c === '`') {
      i++
      while (i < src.length && src[i] !== c) { if (src[i] === '\\') i++; i++ }
      continue
    }
    if (c === open) depth++
    else if (c === close && --depth === 0) return src.slice(start + 1, i)
  }
  return ''
}

// Les entrees de premier niveau d'un objet ou d'un tableau litteral.
function entries(body) {
  const out = []
  let depth = 0
  let cur = ''
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (c === '/' && (body[i + 1] === '*' || body[i + 1] === '/')) {
      const end = body[i + 1] === '*' ? body.indexOf('*/', i + 2) + 2 : body.indexOf('\n', i)
      cur += body.slice(i, end)
      i = end - 1
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1
      while (j < body.length && body[j] !== c) { if (body[j] === '\\') j++; j++ }
      cur += body.slice(i, j + 1)
      i = j
      continue
    }
    if ('{[('.includes(c)) depth++
    if ('}])'.includes(c)) depth--
    if (c === ',' && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = '' } else cur += c
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

// Le commentaire qui precede une entree devient sa description.
function split(entry) {
  const docs = []
  let rest = entry
  for (;;) {
    rest = rest.trimStart()
    const block = rest.match(/^\/\*([\s\S]*?)\*\//)
    const line = rest.match(/^\/\/([^\n]*)/)
    if (block) { docs.push(block[1]); rest = rest.slice(block[0].length) } else if (line) { docs.push(line[1]); rest = rest.slice(line[0].length) } else break
  }
  const doc = docs.join('\n').split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trim()).filter((l) => l && !l.startsWith('@')).join(' ').replace(/`/g, '')
  return { doc, code: rest.trim() }
}

const field = (obj, key) => {
  const m = entries(obj).map((e) => split(e).code).find((e) => e.startsWith(`${key}:`))
  return m ? m.slice(key.length + 1).trim() : ''
}

export function readApi(src) {
  const api = { props: [], emits: [], slots: [] }
  const p = src.indexOf('defineProps(')
  if (p >= 0) {
    const start = p + 'defineProps('.length
    if (src[start] === '{') {
      for (const raw of entries(balanced(src, start))) {
        const { doc, code } = split(raw)
        const m = code.match(/^['"]?([\w-]+)['"]?\s*:\s*([\s\S]*)$/)
        if (!m) continue
        const [, name, value] = m
        if (value.startsWith('{')) {
          const obj = balanced(value, 0)
          const validator = field(obj, 'validator')
          const allowed = validator.match(/\[([^\]]+)\]\.includes/)
          api.props.push({
            name,
            type: field(obj, 'type').replace(/[[\]]/g, '').replace(/,\s*/g, ' | ') || '—',
            default: field(obj, 'default').replace(/^\(\)\s*=>\s*/, '') || (/required:\s*true/.test(obj) ? 'requis' : '—'),
            values: allowed ? allowed[1].replace(/'/g, '').split(/,\s*/).join(' | ') : '',
            doc,
          })
        } else {
          api.props.push({ name, type: value.replace(/[[\]]/g, '').replace(/,\s*/g, ' | '), default: '—', values: '', doc })
        }
      }
    }
  }
  const e = src.match(/defineEmits\(\s*\[([^\]]*)\]/)
  if (e) api.emits = e[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean)
  const slots = new Set()
  for (const m of src.matchAll(/<slot(?![\w-])([^>]*)>/g)) {
    const n = m[1].match(/\bname="([^"]+)"/) || m[1].match(/:name="`([^`]+)`"/)
    slots.add(n ? n[1].replace(/\$\{[^}]+\}/, '<clé>') : 'default')
  }
  api.slots = [...slots]
  return api
}

// La coloration : commentaires, chaines, balises, attributs, mots-cles.
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const TOKEN = /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(<\/?[A-Za-z][\w-]*|\/?>)|\b(import|from|const|let|export|default|return|if|else|new|true|false|null|watch|ref|reactive|computed)\b|((?:[:@#]|v-)?[a-zA-Z][\w:-]*(?==))/g
export function highlight(code) {
  let out = ''
  let last = 0
  for (const m of code.matchAll(TOKEN)) {
    out += esc(code.slice(last, m.index))
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 't' : m[4] ? 'k' : 'a'
    out += `<span class="tk-${cls}">${esc(m[0])}</span>`
    last = m.index + m[0].length
  }
  return out + esc(code.slice(last))
}
