/*
 * Les blocs d'un courriel, et les gestes qu'on leur applique.
 *
 * REPRIS TEL QUEL DE L'EDITEUR D'ORBIT (src/components/Mailing/mailBlocks.js,
 * 2026-10-14) : le client compose avec le meme editeur et le meme format de
 * blocs que l'equipe, rendus par le meme moteur de Nexus (MailBlockRenderer).
 * Un changement ici se reporte la-bas, et inversement.
 *
 * L'écran des gabarits et celui des campagnes faisaient chacun leur version
 * de « insérer », « déplacer », « dupliquer ». Depuis qu'un bloc peut vivre
 * dans une colonne, ces gestes portent une adresse à trois niveaux et n'ont
 * plus leur place, écrits deux fois, au milieu d'un écran.
 *
 * UNE ADRESSE : { zone, index } pour un bloc du message, et
 * { zone, index, column, child } pour un bloc rangé dans une colonne.
 * Rien d'autre. C'est le serveur qui pose ces repères dans l'aperçu.
 *
 * Toutes les fonctions rendent une NOUVELLE liste : l'écran compare l'ancienne
 * et la nouvelle pour savoir s'il reste quelque chose à enregistrer, et
 * l'historique d'annulation garde les précédentes.
 */

/** Ce qu'on obtient en posant un bloc, avant d'y toucher. */
export const BLOCK_DEFAULTS = {
  badge: { text: 'Nouveau' },
  heading: { text: 'Votre titre', level: 1 },
  text: { text: 'Votre texte.' },
  code: { text: '', align: 'center' },
  button: { label: 'Voir', url: 'https://myadion.com', hint: '' },
  facts: { title: '', items: [{ label: 'Intitulé', value: 'Valeur' }] },
  list: { items: [{ text: 'Premier élément' }] },
  note: { title: 'À noter', text: 'Votre remarque.' },
  link: { text: 'Si le bouton ne fonctionne pas :', url: 'https://myadion.com' },
  image: { url: '', alt: '', width: 0 },
  divider: {},
  spacer: { size: 24 },
  /*
   * Une section : une colonne sur un fond, avec ses marges. C'est un bloc
   * « columns » a une seule colonne - le format d'Orbit, que le moteur de
   * Nexus rend en bande de couleur (pleine largeur au besoin).
   */
  section: {
    type: 'columns',
    ratio: '100',
    style: { background: '#f3f4f6', padding: [32, 28, 32, 28] },
    columns: [
      { blocks: [{ type: 'heading', level: 2, text: 'Votre titre' }, { type: 'text', text: 'Votre texte.' }] },
    ],
  },
  columns: {
    ratio: '50-50',
    gap: 20,
    valign: 'top',
    stack: true,
    columns: [
      { blocks: [{ type: 'image', url: '', alt: '', width: 0 }] },
      { blocks: [{ type: 'heading', level: 2, text: 'Votre titre' }, { type: 'text', text: 'Votre texte.' }] },
    ],
  },
}

export const BLOCK_NAMES = {
  badge: 'Chapeau',
  heading: 'Titre',
  text: 'Paragraphe',
  code: 'Code',
  button: 'Bouton',
  facts: 'Tableau',
  list: 'Liste',
  note: 'Encadré',
  link: 'Lien',
  image: 'Image',
  divider: 'Filet',
  spacer: 'Espace',
  columns: 'Colonnes',
  section: 'Section',
}

/** Le nom d'un bloc : des colonnes a une seule colonne sont une section. */
export function blockName(block) {
  if (block?.type === 'columns' && (block.columns || []).length === 1) return BLOCK_NAMES.section
  return BLOCK_NAMES[block?.type] || 'Bloc'
}

/** Les répartitions que le moteur connaît, et leur dessin. */
export const COLUMN_RATIOS = {
  1: [
    { value: '100', title: 'Une colonne', parts: [100] },
  ],
  2: [
    { value: '50-50', title: 'Deux moitiés', parts: [50, 50] },
    { value: '33-67', title: 'Un tiers, deux tiers', parts: [33, 67] },
    { value: '67-33', title: 'Deux tiers, un tiers', parts: [67, 33] },
    { value: '25-75', title: 'Un quart, trois quarts', parts: [25, 75] },
    { value: '75-25', title: 'Trois quarts, un quart', parts: [75, 25] },
  ],
  3: [
    { value: '33-33-33', title: 'Trois tiers', parts: [34, 33, 33] },
    { value: '25-50-25', title: 'Étroite, large, étroite', parts: [25, 50, 25] },
  ],
}

export function newBlock(type) {
  const defaults = clone(BLOCK_DEFAULTS[type] || {})
  // Une section se pose comme des colonnes : `type` vient de ses valeurs.
  return { type, ...defaults }
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value ?? null))
}

export function isChild(address) {
  return !!address && address.column !== undefined && address.column !== null
}

/** La clé d'un bloc, pour les étiquettes et la comparaison de sélection. */
export function keyOf(address) {
  if (!address) return ''
  return isChild(address)
    ? `${address.zone}:${address.index}:${address.column}:${address.child}`
    : `${address.zone}:${address.index}`
}

export function sameAddress(a, b) {
  return !!a && !!b && keyOf(a) === keyOf(b)
}

/** La liste qui contient le bloc visé : le message, ou une colonne. */
function containerOf(blocks, address) {
  if (!isChild(address)) return blocks
  return blocks[address.index]?.columns?.[address.column]?.blocks || null
}

function positionOf(address) {
  return isChild(address) ? address.child : address.index
}

export function blockAt(blocks, address) {
  const container = containerOf(blocks, address)
  return container ? container[positionOf(address)] || null : null
}

/**
 * Remplace la liste qui contient l'adresse, et rend le message entier.
 *
 * C'est le seul endroit qui sait descendre dans une colonne : tout le reste
 * passe par lui.
 */
function withContainer(blocks, address, change) {
  if (!isChild(address)) return change([...blocks])

  return blocks.map((block, i) => {
    if (i !== address.index) return block
    return {
      ...block,
      columns: (block.columns || []).map((column, c) => (
        c !== address.column ? column : { ...column, blocks: change([...(column.blocks || [])]) }
      )),
    }
  })
}

export function replaceBlock(blocks, address, replacement) {
  return withContainer(blocks, address, (list) => {
    list[positionOf(address)] = replacement
    return list
  })
}

export function patchBlock(blocks, address, field, value) {
  const block = blockAt(blocks, address)
  if (!block || block[field] === value) return null
  return replaceBlock(blocks, address, { ...block, [field]: value })
}

export function insertBlock(blocks, address, type) {
  const position = positionOf(address)
  return {
    blocks: withContainer(blocks, address, (list) => {
      list.splice(position, 0, newBlock(type))
      return list
    }),
    selection: { ...address },
  }
}

export function removeBlock(blocks, address) {
  const position = positionOf(address)
  return withContainer(blocks, address, (list) => list.filter((_, i) => i !== position))
}

export function duplicateBlock(blocks, address) {
  const position = positionOf(address)
  return {
    blocks: withContainer(blocks, address, (list) => {
      list.splice(position + 1, 0, clone(list[position]))
      return list
    }),
    selection: isChild(address) ? { ...address, child: address.child + 1 } : { ...address, index: address.index + 1 },
  }
}

/** Déplace un bloc dans sa propre liste : un enfant reste dans sa colonne. */
export function moveBlock(blocks, address, to) {
  const container = containerOf(blocks, address)
  if (!container || to < 0 || to >= container.length) return null

  const from = positionOf(address)
  return {
    blocks: withContainer(blocks, address, (list) => {
      const [moved] = list.splice(from, 1)
      list.splice(to, 0, moved)
      return list
    }),
    selection: isChild(address) ? { ...address, child: to } : { ...address, index: to },
  }
}

/** Combien de blocs dans la liste qui contient cette adresse. */
export function siblingCount(blocks, address) {
  return (containerOf(blocks, address) || []).length
}

/**
 * Les étiquettes que le canevas affiche au survol, enfants compris.
 *
 * @param {string} zone
 * @param {Array} blocks
 * @param {string|null} fixed  Un nom imposé (l'en-tête, le pied de page).
 */
export function labelsFor(zone, blocks, fixed = null) {
  const labels = {}
  ;(blocks || []).forEach((block, index) => {
    labels[`${zone}:${index}`] = fixed || blockName(block)
    if (block.type !== 'columns') return
    ;(block.columns || []).forEach((column, c) => {
      ;(column.blocks || []).forEach((child, k) => {
        labels[`${zone}:${index}:${c}:${k}`] = fixed || blockName(child)
      })
    })
  })

  return labels
}

/**
 * Change le nombre de colonnes sans rien perdre.
 *
 * En réduisant, les blocs de la colonne supprimée rejoignent la dernière qui
 * reste : on ne fait pas disparaître du contenu en cliquant sur « deux
 * colonnes ».
 */
export function resizeColumns(block, count) {
  const columns = clone(block.columns || [])
  while (columns.length < count) columns.push({ blocks: [] })
  // Une section qui passe a plusieurs colonnes en garde le fond ; l'inverse aussi.

  if (columns.length > count) {
    const extra = columns.splice(count)
    const last = columns[count - 1]
    last.blocks = [...(last.blocks || []), ...extra.flatMap((column) => column.blocks || [])]
  }

  const ratios = COLUMN_RATIOS[count] || []
  const ratio = ratios.some((r) => r.value === block.ratio) ? block.ratio : (ratios[0]?.value || '50-50')

  return { ...block, columns, ratio }
}

/*
 * Le menu d'ajout et l'en-tete des reglages (MailBlockMenu et
 * MailBlockSettings d'Orbit) : chaque type dit a quoi il sert.
 */
export const BLOCK_TYPES = Object.freeze([
  { value: 'heading', title: 'Titre', icon: 'mdi-format-header-1', hint: 'Ce que le message annonce' },
  { value: 'text', title: 'Paragraphe', icon: 'mdi-text', hint: 'Le corps du message' },
  { value: 'button', title: 'Bouton', icon: 'mdi-gesture-tap-button', hint: 'L’action attendue' },
  { value: 'badge', title: 'Chapeau', icon: 'mdi-label-outline', hint: 'Quelques mots en majuscules au-dessus du titre' },
  { value: 'code', title: 'Code', icon: 'mdi-numeric', hint: 'Un code à recopier, écrit en grand' },
  { value: 'facts', title: 'Tableau', icon: 'mdi-table', hint: 'Des couples intitulé / valeur' },
  { value: 'list', title: 'Liste', icon: 'mdi-format-list-bulleted', hint: 'Une énumération' },
  { value: 'note', title: 'Encadré', icon: 'mdi-information-outline', hint: 'Une remarque séparée par un filet' },
  { value: 'link', title: 'Lien en clair', icon: 'mdi-link-variant', hint: 'L’adresse écrite en toutes lettres' },
  { value: 'image', title: 'Image', icon: 'mdi-image-outline', hint: 'Une illustration' },
  { value: 'section', title: 'Section', icon: 'mdi-rectangle-outline', hint: 'Une bande de couleur, pleine largeur au besoin, avec ses blocs' },
  { value: 'columns', title: 'Colonnes', icon: 'mdi-view-column-outline', hint: 'Deux ou trois colonnes, chacune avec ses blocs' },
  { value: 'divider', title: 'Filet', icon: 'mdi-minus', hint: 'Une séparation' },
  { value: 'spacer', title: 'Espace', icon: 'mdi-arrow-expand-vertical', hint: 'Du vide' },
])

export const BLOCK_ICONS = Object.fromEntries(BLOCK_TYPES.map((t) => [t.value, t.icon]))
export const BLOCK_TITLES = Object.fromEntries(BLOCK_TYPES.map((t) => [t.value, t.title]))
