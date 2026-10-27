<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import UiDialog from './UiDialog.vue'
import UiMailBlockMenu from './UiMailBlockMenu.vue'

/*
 * LE COURRIEL COMME SURFACE DE TRAVAIL (Adion UI, repris de MailCanvas
 * d'Orbit, 2026-10-14).
 *
 * On edite sur le message lui-meme : on clique un bloc dans le courriel, on
 * le regle, on le deplace a la souris, on en insere un entre deux autres ;
 * un double-clic ecrit directement dans le texte.
 *
 * COMMENT CA TIENT. Le document est rendu par Nexus - le meme moteur que
 * l'envoi, donc ce qu'on voit est ce qui partira - et chaque bloc y porte sa
 * zone et son rang (apercu demande avec `editable`). L'iframe ne fait que
 * mesurer ses blocs et le dire ; toute l'interaction est dessinee par-dessus,
 * dans la page. L'iframe reste en bac a sable sans acces a notre origine : un
 * modele ne peut rien faire d'autre que s'afficher.
 *
 * LE CADRE DEFILE, PAS L'IFRAME. L'iframe prend la hauteur entiere du message
 * et c'est le cadre qui defile : le calque et le document bougent ensemble.
 *
 * `scheme` (clair ou sombre) ne change rien ici : la page redemande le rendu
 * a Nexus dans l'autre jeu de couleurs. `width` : bureau (680) ou telephone
 * (390), le meme HTML a sa largeur reelle, reduit a l'affichage.
 *
 * LA MISE EN FORME D'UN MOT (2026-10-15). Un champ que Nexus marque riche
 * (`data-mail-rich` : titre, paragraphe, encadre) s'ouvre au double-clic avec
 * une barre flottante : gras, italique, souligne, couleur, lien. Ce qui est
 * ecrit repart en HTML ; Nexus ne garde que ces balises-la.
 *
 * DEPOSER UNE IMAGE SUR LE COURRIEL. Une image glissee sur un bloc image le
 * remplace ; ailleurs, elle s'ajoute sous le bloc vise (`drop-files`). L'ecran
 * la depose et la pose.
 */
const props = defineProps({
  subject: { type: String, default: '' },
  html: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  width: { type: String, default: 'desktop' },
  /** `light` ou `dark` ; vide : pas de bascule dans la barre. */
  scheme: { type: String, default: '' },
  /** Le bloc en cours d'edition : { zone, index } ou, dans une colonne, { zone, index, column, child }. */
  selected: { type: Object, default: null },
  editable: { type: Boolean, default: true },
  /**
   * Les zones qu'on modifie ici. Un message ne laisse toucher que son corps :
   * l'en-tete et le pied de page appartiennent au theme.
   */
  zones: { type: Array, default: () => ['body'] },
  labels: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['select', 'insert', 'move', 'remove', 'duplicate', 'refresh', 'update:width', 'update:scheme', 'text', 'writing', 'shortcut', 'drop-files'])

const WIDTHS = [
  { value: 'desktop', label: 'Ordinateur', icon: 'mdi-monitor' },
  { value: 'mobile', label: 'Téléphone', icon: 'mdi-cellphone' },
]
const SCHEMES = [
  { value: 'light', label: 'Clair', icon: 'mdi-white-balance-sunny' },
  { value: 'dark', label: 'Sombre', icon: 'mdi-weather-night' },
]

/** L'adresse d'un bloc : { zone, index } ou, dans une colonne, { zone, index, column, child }. */
function address(block) {
  return block.column === null || block.column === undefined
    ? { zone: block.zone, index: block.index }
    : { zone: block.zone, index: block.index, column: block.column, child: block.child }
}

function keyOf(block) {
  return block.column === null || block.column === undefined
    ? `${block.zone}:${block.index}`
    : `${block.zone}:${block.index}:${block.column}:${block.child}`
}

function positionOf(block) {
  return block.column === null || block.column === undefined ? block.index : block.child
}

const BASE = { desktop: 680, mobile: 390 }

const stage = ref(null)
const frame = ref(null)
const stageWidth = ref(0)
const blocks = ref([])
const columnBoxes = ref([])
const contentHeight = ref(600)
const zoomed = ref(false)
const dragged = ref(null)
const dropAt = ref(null)

/** Vrai pendant qu'on ecrit dans le document : l'apercu ne doit pas se recharger. */
const writing = ref(false)

const base = computed(() => BASE[props.width] || BASE.desktop)
const scale = computed(() => {
  if (!stageWidth.value) return 1
  return Math.min(1, Math.max(0.4, stageWidth.value / base.value))
})

/*
 * Le document garde sa largeur reelle et c'est l'affichage qui se reduit :
 * une iframe retrecie relancerait la mise en page a la largeur de la colonne
 * et montrerait un message que personne ne recevra.
 */
const iframeStyle = computed(() => ({
  width: `${base.value}px`,
  height: `${contentHeight.value}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
}))

const layerStyle = iframeStyle

/* La scene reserve la place que la mise a l'echelle laisse vraiment. */
const sceneStyle = computed(() => ({
  width: `${Math.round(base.value * scale.value)}px`,
  height: `${Math.round(contentHeight.value * scale.value)}px`,
}))

/** Les points d'insertion : avant chaque bloc du corps, et apres le dernier. */
const slots = computed(() => {
  if (!props.editable) return []

  const entries = []
  for (const zone of props.zones) {
    const found = blocks.value.filter((b) => b.zone === zone && b.column === null)

    for (const block of found) {
      entries.push({ zone, index: block.index, top: block.top })
    }

    if (found.length) {
      const last = found[found.length - 1]
      entries.push({ zone, index: last.index + 1, top: last.top + last.height })
    } else {
      /*
       * Une zone vide garde un point d'accroche, sinon on ne peut rien y
       * poser. On le place sous ce qui precede, ou tout en haut.
       */
      const before = blocks.value.filter((b) => b.zone === 'header')
      const anchor = zone !== 'header' && before.length ? before[before.length - 1] : null
      entries.push({ zone, index: 0, top: anchor ? anchor.top + anchor.height : 12 })
    }
  }

  return entries
})

/** Le « + » au bas de chaque colonne du bloc en cours, et au milieu d'une colonne encore vide. */
const columnSlots = computed(() => {
  const chosen = props.selected
  if (!props.editable || !chosen || !props.zones.includes(chosen.zone)) return []

  return columnBoxes.value
    .filter((box) => box.zone === chosen.zone && box.index === chosen.index)
    .map((box) => {
      const children = blocks.value.filter(
        (b) => b.zone === box.zone && b.index === box.index && b.column === box.column,
      )
      const last = children[children.length - 1]
      return {
        zone: box.zone,
        index: box.index,
        column: box.column,
        child: children.length,
        top: last ? last.top + last.height + 4 : box.top + Math.max(6, box.height / 2 - 11),
        left: box.left,
        width: box.width,
      }
    })
})

function isSelected(block) {
  return keyOf(props.selected || {}) === keyOf(block)
}

function isLast(block) {
  const siblings = blocks.value.filter(
    (b) => b.zone === block.zone && b.column === block.column && (block.column === null || b.index === block.index),
  )
  return positionOf(block) === siblings.length - 1
}

function canReorder(block) {
  return props.editable && props.zones.includes(block.zone)
}

const ZONES = { header: 'En-tête', body: 'Bloc', footer: 'Pied de page' }

function labelFor(block) {
  return props.labels[keyOf(block)] || ZONES[block.zone] || 'Bloc'
}

function boxStyle(block) {
  return {
    top: `${block.top}px`,
    left: `${block.left}px`,
    width: `${block.width}px`,
    height: `${block.height}px`,
  }
}

function slotStyle(slot) {
  const style = { top: `${slot.top - 11}px` }
  // Un point d'insertion de colonne ne tient que la largeur de sa colonne.
  if (slot.left !== undefined) {
    style.left = `${slot.left}px`
    style.width = `${slot.width}px`
    style.right = 'auto'
  }
  return style
}

// -------------------------------------------------------------------
// Ecrire, glisser, deposer
// -------------------------------------------------------------------

/**
 * Ecrire dans le courriel.
 *
 * On passe le point du double-clic a l'iframe, qui retrouve l'element sous ce
 * point et le rend modifiable. La page ne connait pas la structure du
 * document - c'est Nexus qui a dit quel element porte quel champ.
 */
function write(block, event) {
  if (!canReorder(block)) return

  const box = event.currentTarget.getBoundingClientRect()
  frame.value?.contentWindow?.postMessage({
    source: 'mail-canvas-host',
    type: 'write',
    zone: block.zone,
    index: block.index,
    column: block.column,
    child: block.child,
    x: (event.clientX - box.left) / scale.value + block.left,
    y: (event.clientY - box.top) / scale.value + block.top,
  }, '*')
}

function startDrag(block, event) {
  // Un bloc de colonne se deplace par les fleches, pas au glisser.
  if (!canReorder(block) || block.column !== null) return
  dragged.value = block
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(block.index))
}

function onDragOver(block) {
  if (!dragged.value || block.zone !== dragged.value.zone || block.column !== null) return
  dropAt.value = { zone: block.zone, index: block.index }
}

function onDrop(block) {
  const from = dragged.value
  endDrag()
  if (!from || from.zone !== block.zone || block.column !== null || from.index === block.index) return
  emit('move', { address: address(from), to: block.index })
}

function endDrag() {
  dragged.value = null
  dropAt.value = null
}

// -------------------------------------------------------------------
// Deposer une image sur le courriel
// -------------------------------------------------------------------

const fileTarget = ref(null)
const fileOver = ref(false)

const hasFiles = (event) => [...(event.dataTransfer?.types || [])].includes('Files')

/** Le bloc sous le point, le plus profond d'abord (un bloc de colonne avant sa section). */
function blockAt(event) {
  const scene = frame.value?.parentElement?.getBoundingClientRect()
  if (!scene) return null
  const x = (event.clientX - scene.left) / scale.value
  const y = (event.clientY - scene.top) / scale.value
  const inside = blocks.value.filter((b) => props.zones.includes(b.zone)
    && x >= b.left && x <= b.left + b.width && y >= b.top && y <= b.top + b.height)
  return inside.find((b) => b.column !== null) || inside[0] || null
}

function onFileOver(event) {
  if (!props.editable || !hasFiles(event)) return
  event.preventDefault()
  fileOver.value = true
  fileTarget.value = blockAt(event)
}

function onFileLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return
  fileOver.value = false
  fileTarget.value = null
}

function onFileDrop(event) {
  if (!props.editable || !hasFiles(event)) return
  event.preventDefault()
  const files = [...(event.dataTransfer?.files || [])]
  const target = blockAt(event)
  fileOver.value = false
  fileTarget.value = null
  if (!files.length) return

  if (target && target.type === 'image') {
    emit('drop-files', { files, address: address(target), mode: 'replace' })
  } else if (target) {
    const after = target.column === null || target.column === undefined
      ? { zone: target.zone, index: target.index + 1 }
      : { zone: target.zone, index: target.index, column: target.column, child: target.child + 1 }
    emit('drop-files', { files, address: after, mode: 'insert' })
  } else {
    const count = blocks.value.filter((b) => b.zone === 'body' && b.column === null).length
    emit('drop-files', { files, address: { zone: 'body', index: count }, mode: 'insert' })
  }
}

// -------------------------------------------------------------------
// Ce que l'iframe raconte
// -------------------------------------------------------------------

/**
 * Le petit script glisse dans le document.
 *
 * Il ne fait que mesurer et le dire. Toute l'interaction est dessinee par la
 * page, au-dessus : l'iframe n'a donc besoin ni de notre origine, ni de
 * toucher quoi que ce soit.
 */
const PROBE = `
<script>
(function () {
  function report() {
    var found = document.querySelectorAll('[data-mail-block]');
    var blocks = [];
    for (var i = 0; i < found.length; i++) {
      var el = found[i];
      var box = el.getBoundingClientRect();
      if (!box.height) continue;
      var colonne = el.getAttribute('data-mail-column');
      blocks.push({
        type: el.querySelector('img') && !el.querySelector('[data-mail-field]') ? 'image' : '',
        zone: el.getAttribute('data-mail-zone'),
        index: parseInt(el.getAttribute('data-mail-block'), 10),
        column: colonne === null ? null : parseInt(colonne, 10),
        child: colonne === null ? null : parseInt(el.getAttribute('data-mail-child'), 10),
        top: Math.round(box.top + window.scrollY),
        left: Math.round(box.left + window.scrollX),
        width: Math.round(box.width),
        height: Math.round(box.height)
      });
    }

    // Les colonnes elles-memes : c'est la qu'on pose un bloc dans une colonne vide.
    var cells = document.querySelectorAll('[data-mail-column-box]');
    var columns = [];
    for (var j = 0; j < cells.length; j++) {
      var cell = cells[j];
      var cellBox = cell.getBoundingClientRect();
      columns.push({
        zone: cell.getAttribute('data-mail-zone'),
        index: parseInt(cell.getAttribute('data-mail-columns'), 10),
        column: parseInt(cell.getAttribute('data-mail-column-box'), 10),
        top: Math.round(cellBox.top + window.scrollY),
        left: Math.round(cellBox.left + window.scrollX),
        width: Math.round(cellBox.width),
        height: Math.round(cellBox.height)
      });
    }

    parent.postMessage({
      source: 'mail-canvas',
      blocks: blocks,
      columns: columns,
      height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    }, '*');
  }

  window.addEventListener('load', report);
  window.addEventListener('resize', report);
  document.addEventListener('DOMContentLoaded', report);
  // Les images arrivent apres : sans ce second passage, tout est decale.
  setTimeout(report, 60);
  setTimeout(report, 400);

  /*
   * Ecrire dans le message.
   *
   * La page envoie un point ; on retrouve l'element sous ce point, on le rend
   * modifiable et on rend la main. Ce qui est tape repart a la page, qui le
   * range dans le bloc - le document, lui, ne sait rien de nos blocs.
   */
  var enCours = null;

  /*
   * La barre de mise en forme, pour un champ riche. Elle vit dans le
   * document, au-dessus du champ ; ses boutons ne prennent pas le focus,
   * pour que la selection reste ou elle est.
   */
  var barre = null;
  var champLien = null;
  var plage = null;

  function garder() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount) plage = sel.getRangeAt(0).cloneRange();
  }

  function rendre() {
    if (!enCours) return;
    enCours.el.focus();
    if (plage) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(plage);
    }
  }

  function couleur(c) {
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('foreColor', false, c);
    document.execCommand('styleWithCSS', false, false);
  }

  function construireBarre() {
    barre = document.createElement('div');
    barre.setAttribute('data-mail-toolbar', '1');
    barre.style.cssText = 'position:absolute;z-index:99999;display:none;align-items:center;gap:2px;padding:4px;background:#17171b;border:1px solid #3a3a42;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.35);font:13px/1 system-ui,sans-serif;color:#eafcf6;';

    function bouton(html, titre, geste) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = html;
      b.title = titre;
      b.setAttribute('aria-label', titre);
      b.style.cssText = 'min-width:28px;height:28px;border:0;border-radius:5px;background:transparent;color:inherit;cursor:pointer;font:inherit;padding:0 6px;';
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function (e) { e.preventDefault(); geste(); });
      barre.appendChild(b);
      return b;
    }

    bouton('<b>G</b>', 'Gras (Ctrl+B)', function () { document.execCommand('bold'); });
    bouton('<i>I</i>', 'Italique (Ctrl+I)', function () { document.execCommand('italic'); });
    bouton('<u>S</u>', 'Souligné (Ctrl+U)', function () { document.execCommand('underline'); });
    ['#111827', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed', '#db2777'].forEach(function (c) {
      var b = bouton('', 'Couleur ' + c, function () { couleur(c); });
      b.style.minWidth = '18px';
      b.style.width = '18px';
      b.style.height = '18px';
      b.style.padding = '0';
      b.style.margin = '0 2px';
      b.style.borderRadius = '50%';
      b.style.background = c;
      b.style.border = '1px solid rgba(255,255,255,.4)';
    });
    var nuancier = document.createElement('input');
    nuancier.type = 'color';
    nuancier.title = 'Autre couleur';
    nuancier.style.cssText = 'width:24px;height:24px;border:0;padding:0;background:transparent;cursor:pointer;';
    nuancier.addEventListener('mousedown', garder);
    nuancier.addEventListener('input', function () { rendre(); couleur(nuancier.value); garder(); });
    barre.appendChild(nuancier);

    bouton('Lien', 'Lien sur la sélection', function () {
      garder();
      champLien.style.display = 'inline-block';
      champLien.value = '';
      champLien.focus();
    });
    champLien = document.createElement('input');
    champLien.type = 'text';
    champLien.placeholder = 'https://… puis Entrée';
    champLien.style.cssText = 'display:none;width:190px;height:26px;border:1px solid #3a3a42;border-radius:5px;background:#0f0f12;color:inherit;padding:0 6px;font:inherit;';
    champLien.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var url = champLien.value.trim();
        champLien.style.display = 'none';
        rendre();
        if (!url) { document.execCommand('unlink'); return; }
        if (!/^(https?:|mailto:|tel:|\\{\\{)/i.test(url)) url = 'https://' + url;
        document.execCommand('createLink', false, url);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        champLien.style.display = 'none';
        rendre();
      }
    });
    barre.appendChild(champLien);
    bouton('Effacer', 'Retirer la mise en forme', function () {
      document.execCommand('removeFormat');
      document.execCommand('unlink');
    });
    document.body.appendChild(barre);
  }

  function montrerBarre(el) {
    if (!barre) construireBarre();
    barre.style.display = 'flex';
    var r = el.getBoundingClientRect();
    var top = r.top + window.scrollY - barre.offsetHeight - 8;
    if (top < 4) top = r.bottom + window.scrollY + 8;
    barre.style.top = top + 'px';
    var left = Math.min(r.left + window.scrollX, document.documentElement.clientWidth - barre.offsetWidth - 4);
    barre.style.left = Math.max(4, left) + 'px';
  }

  function cacherBarre() {
    if (barre) barre.style.display = 'none';
    if (champLien) champLien.style.display = 'none';
    plage = null;
  }

  /* Le HTML d'un champ riche, tel qu'il repart : sans les blancs insecables que pose le navigateur. */
  function riche(el) {
    return el.innerHTML.replace(/&nbsp;/g, ' ').replace(/(<br\\s*\\/?>\\s*)+$/i, '').trim();
  }

  function fermer(annule) {
    if (!enCours) return;
    var el = enCours.el;
    el.removeAttribute('contenteditable');
    el.style.outline = '';
    cacherBarre();
    var valeur = enCours.rich ? riche(el) : el.innerText.replace(/ /g, ' ').trim();
    var etat = enCours;
    enCours = null;
    // Sans cela le document garde le curseur, et les raccourcis avec lui.
    if (el.blur) el.blur();
    parent.postMessage({
      source: 'mail-canvas',
      type: 'text',
      zone: etat.zone,
      index: etat.index,
      column: etat.column,
      child: etat.child,
      field: etat.field,
      value: annule ? etat.origine : valeur
    }, '*');
  }

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.source !== 'mail-canvas-host') return;
    // La page a ete cliquee ailleurs : la saisie se termine.
    if (data.type === 'close') { fermer(false); return; }
    if (data.type !== 'write') return;

    fermer(false);

    var cible = document.elementFromPoint(data.x, data.y);
    while (cible && !cible.hasAttribute('data-mail-field')) {
      cible = cible.parentElement;
    }
    if (!cible) {
      // Pas de texte sous le curseur : on prend le premier champ du bloc.
      var selecteur = '[data-mail-zone="' + data.zone + '"][data-mail-block="' + data.index + '"]';
      selecteur += data.column === null || data.column === undefined
        ? ':not([data-mail-column])'
        : '[data-mail-column="' + data.column + '"][data-mail-child="' + data.child + '"]';
      var bloc = document.querySelector(selecteur);
      cible = bloc ? bloc.querySelector('[data-mail-field]') : null;
    }
    if (!cible) return;

    var rich = cible.getAttribute('data-mail-rich') === '1';
    enCours = {
      el: cible,
      rich: rich,
      zone: data.zone,
      index: data.index,
      column: data.column === undefined ? null : data.column,
      child: data.child === undefined ? null : data.child,
      field: cible.getAttribute('data-mail-field'),
      origine: rich ? riche(cible) : cible.innerText.replace(/ /g, ' ').trim()
    };

    cible.setAttribute('contenteditable', rich ? 'true' : 'plaintext-only');
    cible.style.outline = '2px solid #67dcc6';
    cible.focus();
    if (rich) {
      montrerBarre(cible);
    } else {
      document.execCommand && document.execCommand('selectAll', false, null);
    }

    parent.postMessage({ source: 'mail-canvas', type: 'writing', writing: true }, '*');
  });

  /*
   * La saisie se ferme quand le champ perd la main - sauf pour la barre de
   * mise en forme (le nuancier, le champ du lien), qui la lui rend.
   */
  document.addEventListener('focusout', function (e) {
    if (!enCours || e.target !== enCours.el) return;
    // Un clic dans le texte (pour choisir un mot) fait perdre puis reprendre la main : on attend de voir.
    setTimeout(function () {
      if (!enCours) return;
      var actif = document.activeElement;
      if (barre && actif && barre.contains(actif)) return;
      if (actif && (actif === enCours.el || enCours.el.contains(actif))) return;
      // La main est partie hors du document : c'est la page qui dira de fermer (message « close »).
      if (!document.hasFocus()) return;
      fermer(false);
    }, 150);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (enCours) {
      if (e.target === champLien) return;
      if (e.key === 'Escape') { e.preventDefault(); fermer(true); return; }
      // Dans un champ riche, Entree passe a la ligne sans ouvrir de paragraphe.
      if (e.key === 'Enter' && enCours.rich) { e.preventDefault(); document.execCommand('insertLineBreak'); return; }
      // Entree valide, sauf dans un paragraphe ou elle fait un retour a la ligne.
      if (e.key === 'Enter' && enCours.field !== 'text') { e.preventDefault(); fermer(false); return; }
      // « Annuler » pendant qu'on ecrit : on valide d'abord ce qui est tape, puis on annule.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        fermer(false);
        parent.postMessage({ source: 'mail-canvas', type: 'key', action: e.shiftKey ? 'redo' : 'undo' }, '*');
      }
      return;
    }

    // Le clavier ne traverse pas les cadres : le document renvoie les raccourcis a la page.
    var touche = e.key.toLowerCase();
    if (e.key === 'Escape') {
      parent.postMessage({ source: 'mail-canvas', type: 'key', action: 'escape' }, '*');
    } else if ((e.ctrlKey || e.metaKey) && touche === 'z') {
      e.preventDefault();
      parent.postMessage({ source: 'mail-canvas', type: 'key', action: e.shiftKey ? 'redo' : 'undo' }, '*');
    } else if ((e.ctrlKey || e.metaKey) && touche === 'y') {
      e.preventDefault();
      parent.postMessage({ source: 'mail-canvas', type: 'key', action: 'redo' }, '*');
    }
  });
})();
<\/script>`

const instrumented = computed(() => {
  if (!props.html) return ''
  if (!props.editable) return props.html
  return props.html.includes('</body>')
    ? props.html.replace('</body>', `${PROBE}</body>`)
    : props.html + PROBE
})

function onMessage(event) {
  const payload = event.data
  if (!payload || payload.source !== 'mail-canvas') return
  if (frame.value && event.source !== frame.value.contentWindow) return

  if (payload.type === 'key') {
    emit('shortcut', payload.action)
    return
  }

  if (payload.type === 'writing') {
    writing.value = true
    emit('writing', true)
    return
  }

  if (payload.type === 'text') {
    writing.value = false
    emit('writing', false)
    emit('text', {
      address: payload.column === null || payload.column === undefined
        ? { zone: payload.zone, index: payload.index }
        : { zone: payload.zone, index: payload.index, column: payload.column, child: payload.child },
      field: payload.field,
      value: payload.value,
    })
    return
  }

  blocks.value = Array.isArray(payload.blocks) ? payload.blocks : []
  columnBoxes.value = Array.isArray(payload.columns) ? payload.columns : []
  contentHeight.value = Math.max(320, Number(payload.height) || 600)
}

function measure() {
  stageWidth.value = stage.value?.clientWidth || 0
}

let observer = null

/*
 * Un clic dans la page, hors du courriel, termine la saisie. On ne s'en
 * remet pas a la perte de focus du document : un clic dans le texte pour
 * choisir un mot la provoque aussi, et fermait la saisie au mauvais moment.
 */
function closeWriting(event) {
  if (!writing.value || event.target === frame.value) return
  frame.value?.contentWindow?.postMessage({ source: 'mail-canvas-host', type: 'close' }, '*')
}

onMounted(() => {
  measure()
  window.addEventListener('message', onMessage)
  document.addEventListener('mousedown', closeWriting, true)
  if (typeof ResizeObserver !== 'undefined' && stage.value) {
    observer = new ResizeObserver(measure)
    observer.observe(stage.value)
  } else {
    window.addEventListener('resize', measure)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  document.removeEventListener('mousedown', closeWriting, true)
  window.removeEventListener('resize', measure)
  observer?.disconnect()
})

watch(() => props.width, measure)
</script>

<template>
  <div class="ui-mail-canvas">
    <div class="ui-mail-canvas__bar">
      <span class="ui-mail-canvas__subject" :title="subject">{{ subject || '—' }}</span>
      <span class="ui-mail-canvas__spacer" />
      <slot name="extra" />
      <span v-if="scale < 0.99" class="ui-mail-canvas__zoom">{{ Math.round(scale * 100) }} %</span>
      <div v-if="scheme" class="ui-segmented ui-mail-canvas__toggle" role="radiogroup" aria-label="Couleurs">
        <button
          v-for="item in SCHEMES"
          :key="item.value"
          type="button"
          role="radio"
          class="ui-segmented__item"
          :class="{ 'is-active': scheme === item.value }"
          :aria-checked="scheme === item.value"
          :aria-label="item.label"
          :title="item.label"
          @click="$emit('update:scheme', item.value)"
        >
          <v-icon :icon="item.icon" size="16" />
        </button>
      </div>
      <div class="ui-segmented ui-mail-canvas__toggle" role="radiogroup" aria-label="Écran">
        <button
          v-for="item in WIDTHS"
          :key="item.value"
          type="button"
          role="radio"
          class="ui-segmented__item"
          :class="{ 'is-active': width === item.value }"
          :aria-checked="width === item.value"
          :aria-label="item.label"
          :title="item.label"
          @click="$emit('update:width', item.value)"
        >
          <v-icon :icon="item.icon" size="16" />
        </button>
      </div>
      <v-btn icon="mdi-arrow-expand-all" variant="text" size="small" class="ui-btn" title="Voir en grand" aria-label="Voir en grand" @click="zoomed = true" />
      <v-btn icon="mdi-refresh" variant="text" size="small" class="ui-btn" :loading="loading" title="Rafraîchir" aria-label="Rafraîchir" @click="$emit('refresh')" />
    </div>

    <div
      ref="stage"
      class="ui-mail-canvas__frame"
      :class="{ 'is-file-over': fileOver }"
      tabindex="-1"
      @mousedown="stage?.focus({ preventScroll: true })"
      @click.self="$emit('select', null)"
      @dragover="onFileOver"
      @dragleave="onFileLeave"
      @drop="onFileDrop"
    >
      <div class="ui-mail-canvas__scene" :style="sceneStyle">
        <iframe
          v-if="html"
          ref="frame"
          :srcdoc="instrumented"
          sandbox="allow-scripts"
          scrolling="no"
          title="Le courriel"
          class="ui-mail-canvas__iframe"
          :style="iframeStyle"
        />

        <!--
          Le calque : tout ce qui se clique est ici, pas dans le document. Il
          s'efface pendant qu'on ecrit dans le courriel, sinon il
          intercepterait le clic qui place le curseur.
        -->
        <div v-if="editable && html" class="ui-mail-layer" :class="{ 'is-writing': writing }" :style="layerStyle">
          <template v-for="block in blocks" :key="keyOf(block)">
            <div
              class="ui-mail-layer__block"
              :class="{
                'is-selected': isSelected(block),
                'is-locked': !canReorder(block),
                'is-child': block.column !== null,
              }"
              :style="boxStyle(block)"
              :draggable="canReorder(block) && block.column === null"
              @click.stop="$emit('select', address(block))"
              @dblclick.stop="write(block, $event)"
              @dragstart="startDrag(block, $event)"
              @dragover.prevent="onDragOver(block)"
              @drop.prevent="onDrop(block)"
              @dragend="endDrag"
            >
              <span class="ui-mail-layer__tag">
                <v-icon v-if="canReorder(block) && block.column === null" icon="mdi-drag" size="13" />
                {{ labelFor(block) }}
                <span v-if="isSelected(block) && canReorder(block)" class="ui-mail-layer__tip">double-clic pour écrire</span>
              </span>

              <span v-if="isSelected(block) && canReorder(block)" class="ui-mail-layer__tools" @click.stop>
                <button type="button" title="Monter" aria-label="Monter" :disabled="positionOf(block) === 0" @click="$emit('move', { address: address(block), to: positionOf(block) - 1 })">
                  <v-icon icon="mdi-arrow-up" size="15" />
                </button>
                <button type="button" title="Descendre" aria-label="Descendre" :disabled="isLast(block)" @click="$emit('move', { address: address(block), to: positionOf(block) + 1 })">
                  <v-icon icon="mdi-arrow-down" size="15" />
                </button>
                <button type="button" title="Dupliquer" aria-label="Dupliquer" @click="$emit('duplicate', address(block))">
                  <v-icon icon="mdi-content-duplicate" size="15" />
                </button>
                <button type="button" title="Supprimer" aria-label="Supprimer" class="is-danger" @click="$emit('remove', address(block))">
                  <v-icon icon="mdi-delete-outline" size="15" />
                </button>
              </span>
            </div>
          </template>

          <!-- L'image qu'on glisse : le bloc qu'elle remplacera, ou sous lequel elle se posera. -->
          <div v-if="fileOver && fileTarget" class="ui-mail-layer__droptarget" :class="{ 'is-replace': fileTarget.type === 'image' }" :style="boxStyle(fileTarget)">
            <span class="ui-mail-layer__droplabel">{{ fileTarget.type === 'image' ? 'Remplacer l’image' : 'Ajouter l’image dessous' }}</span>
          </div>

          <!-- Les points d'insertion, entre deux blocs. -->
          <div
            v-for="slot in slots"
            :key="`slot-${keyOf(slot)}`"
            class="ui-mail-layer__slot"
            :class="{ 'is-drop': dropAt && dropAt.zone === slot.zone && dropAt.index === slot.index }"
            :style="slotStyle(slot)"
            @click.stop
          >
            <UiMailBlockMenu dot @pick="(type) => $emit('insert', { address: address(slot), type })" />
          </div>

          <!--
            Poser un bloc dans une colonne. Le « + » d'une colonne ne s'affiche
            que lorsqu'on travaille sur ces colonnes : sans cela, trois points
            d'insertion se disputeraient le meme bord haut.
          -->
          <div
            v-for="slot in columnSlots"
            :key="`col-${keyOf(slot)}`"
            class="ui-mail-layer__colslot"
            :style="slotStyle(slot)"
          >
            <UiMailBlockMenu dot :columns="false" @pick="(type) => $emit('insert', { address: address(slot), type })" />
          </div>
        </div>
      </div>

      <div v-if="fileOver && !fileTarget" class="ui-mail-canvas__dropall">Déposez l’image : elle s’ajoute à la fin du courriel</div>

      <div v-if="!html" class="ui-mail-canvas__empty">
        <v-progress-circular v-if="loading" indeterminate size="22" />
        <span v-else>Rien à montrer pour l’instant.</span>
      </div>
    </div>

    <!-- Nexus pose sur chaque bloc de quoi le retrouver ; sans ces reperes, mieux vaut le dire que laisser chercher. -->
    <p v-if="editable && html && !blocks.length && !loading" class="ui-mail-canvas__stale">
      <v-icon icon="mdi-information-outline" size="15" />
      Ce message s’affiche, mais ne renvoie pas encore ses repères d’édition&nbsp;: rafraîchissez l’aperçu.
    </p>

    <!-- En grand : la largeur reelle, sans reduction et sans calque. -->
    <UiDialog v-model="zoomed" :title="subject || 'Aperçu'" icon="mdi-email-outline" width="900">
      <iframe :srcdoc="html" sandbox="" title="Le courriel en grand" class="ui-mail-canvas__full" />
    </UiDialog>
  </div>
</template>
