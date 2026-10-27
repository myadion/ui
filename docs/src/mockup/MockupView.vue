<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

/*
 * LA MAQUETTE DE LA REFONTE (2026-10-27, a valider par Kevin) : un vrai ecran
 * de l'espace client, la fiche d'un projet Public Cloud, dans la direction
 * proposee. La barre du haut et la barre de gauche gardent leur structure
 * (Kevin) ; leur habillage change. Donnees de demonstration, aucun appel.
 */
const tab = ref('instances')
const navOpen = ref(false)
const tabs = [
  { id: 'overview', label: 'Vue d’ensemble' },
  { id: 'instances', label: 'Instances', count: 3 },
  { id: 'volumes', label: 'Volumes', count: 2 },
  { id: 'network', label: 'Réseau' },
  { id: 'firewall', label: 'Pare-feu' },
  { id: 'usage', label: 'Consommation' },
]
const nav = [
  { title: '', items: [{ icon: 'home', label: 'Accueil' }, { icon: 'layers', label: 'Tous mes services' }] },
  { title: 'Web', items: [{ icon: 'globe', label: 'Domaines' }, { icon: 'server', label: 'Hébergement' }, { icon: 'mail', label: 'Messagerie' }] },
  { title: 'Télécom', items: [{ icon: 'phone', label: 'Lilou' }, { icon: 'mail', label: 'SMS' }] },
  { title: 'Paiement', items: [{ icon: 'card', label: 'Adion Pay' }] },
  { title: 'Cloud', items: [{ icon: 'cloud', label: 'Public Cloud', active: true }, { icon: 'cpu', label: 'VPS' }, { icon: 'disk', label: 'Serveurs dédiés' }, { icon: 'network', label: 'IP publiques' }, { icon: 'layers', label: 'Fabric' }] },
]
const kpis = [
  { label: 'Consommé ce mois', value: '18,42 €', unit: 'HT', delta: '+12 %', spark: [2, 3, 3, 4, 6, 5, 7, 8, 9, 11, 12, 14] },
  { label: 'Estimation fin de mois', value: '41,90 €', unit: 'HT', hint: 'à ressources constantes', spark: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  { label: 'Instances', value: '3', unit: '/ 4', hint: '2 en marche · 1 arrêtée' },
  { label: 'Plafond du mois', value: '18,42 €', unit: '/ 50 €', gauge: 37 },
]
const instances = [
  { name: 'web-1', id: '812dc7b3', state: 'En marche', tone: 'ok', region: 'Toulouse', flavor: 'B2', size: '2 vCPU · 4 Go', ip: '51.75.12.40', cost: '0,0246 €/h', billing: 'À l’heure' },
  { name: 'db-1', id: '4a19e0c2', state: 'Arrêtée', tone: 'muted', region: 'Toulouse', flavor: 'B4', size: '4 vCPU · 8 Go', ip: '10.0.0.12', cost: '17,99 €/mois', billing: 'Au mois' },
  { name: 'worker-2', id: 'c07b55e1', state: 'En création', tone: 'info', region: 'Toulouse', flavor: 'B2', size: '2 vCPU · 4 Go', ip: '—', cost: '0,0246 €/h', billing: 'À l’heure' },
]
const activity = [
  { icon: 'plus', text: 'worker-2 créée', who: 'Kévin Paly', when: 'il y a 2 min' },
  { icon: 'power', text: 'db-1 arrêtée', who: 'Kévin Paly', when: 'il y a 1 h' },
  { icon: 'wallet', text: 'db-1 passée au mois', who: 'Kévin Paly', when: 'hier' },
  { icon: 'network', text: 'IP 51.75.12.40 rattachée à web-1', who: 'API · ci-deploy', when: '25 oct.' },
]
const sparkPath = (values) => {
  const max = Math.max(...values)
  const step = 100 / (values.length - 1)
  return values.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(28 - (v / max) * 24).toFixed(1)}`).join(' ')
}
</script>

<template>
  <div class="mk" :class="{ 'is-nav-open': navOpen }">
    <!-- La barre du haut : meme structure qu'aujourd'hui, habillage neuf. -->
    <header class="mk-top">
      <button class="mk-icon-btn mk-only-narrow" aria-label="Menu" @click="navOpen = !navOpen"><Icon name="menu" /></button>
      <a class="mk-logo" href="#" aria-label="Adion Cloud">
        <span class="mk-pill" aria-hidden="true" />
        <span class="mk-logo__text">ADION<br />CLOUD</span>
      </a>
      <div class="mk-top__search">
        <Icon name="search" />
        <span>Rechercher un service, une facture, une IP…</span>
        <kbd>Ctrl K</kbd>
      </div>
      <nav class="mk-top__actions" aria-label="Raccourcis">
        <button class="mk-icon-btn is-brand" aria-label="Assistant"><Icon name="sparkles" /></button>
        <button class="mk-icon-btn" aria-label="Notifications"><Icon name="bell" /><span class="mk-dot" /></button>
        <button class="mk-icon-btn mk-hide-narrow" aria-label="Accueil"><Icon name="home" /></button>
        <button class="mk-icon-btn mk-hide-narrow" aria-label="Documentation"><Icon name="book" /></button>
        <button class="mk-icon-btn mk-hide-narrow" aria-label="Thème"><Icon name="sun" /></button>
        <span class="mk-avatar" title="Kévin Paly">KP</span>
      </nav>
    </header>

    <div class="mk-body">
      <!-- La barre de gauche : le perimetre, puis les familles de produits. -->
      <aside class="mk-side">
        <button class="mk-scope">
          <span class="mk-scope__mark">S</span>
          <span class="mk-scope__text"><strong>Sandbox – Kévin Paly</strong><small>Projet · Test Cloud</small></span>
          <Icon name="chevron" size="14" />
        </button>
        <nav class="mk-nav" aria-label="Services">
          <div v-for="group in nav" :key="group.title" class="mk-nav__group">
            <div v-if="group.title" class="mk-nav__title">{{ group.title }}</div>
            <a v-for="item in group.items" :key="item.label" href="#" class="mk-nav__item" :class="{ 'is-active': item.active }">
              <Icon :name="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </div>
        </nav>
        <div class="mk-side__foot">
          <a href="#" class="mk-nav__item"><Icon name="wallet" /><span>Facturation</span></a>
          <a href="#" class="mk-nav__item"><Icon name="key" /><span>Accès et clés</span></a>
          <a href="#" class="mk-nav__item"><Icon name="logout" /><span>Se déconnecter</span></a>
        </div>
      </aside>

      <main class="mk-main">
        <div class="mk-glow" aria-hidden="true" />
        <div class="mk-page">
          <nav class="mk-crumbs" aria-label="Fil d’Ariane">
            <a href="#">Cloud</a><Icon name="chevronRight" size="14" /><a href="#">Public Cloud</a>
          </nav>

          <header class="mk-head">
            <div class="mk-head__mark"><Icon name="cloud" size="22" /></div>
            <div class="mk-head__text">
              <div class="mk-head__line">
                <h1>Test Cloud</h1>
                <span class="mk-status is-ok"><i />Actif</span>
              </div>
              <p>Toulouse · FRTLS01 · créé le 27 octobre 2026 · facturé à l’heure ou au mois</p>
            </div>
            <div class="mk-head__actions">
              <button class="mk-btn"><Icon name="terminal" />Ouvrir Horizon</button>
              <button class="mk-btn is-icon" aria-label="Plus d’actions"><Icon name="more" /></button>
              <button class="mk-btn is-primary"><Icon name="plus" />Créer une instance</button>
            </div>
          </header>

          <section class="mk-kpis">
            <article v-for="k in kpis" :key="k.label" class="mk-kpi">
              <div class="mk-kpi__label">{{ k.label }}</div>
              <div class="mk-kpi__value">{{ k.value }}<small>{{ k.unit }}</small><span v-if="k.delta" class="mk-delta">{{ k.delta }}</span></div>
              <svg v-if="k.spark" class="mk-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
                <path :d="`${sparkPath(k.spark)} L100,30 L0,30 Z`" class="mk-spark__area" />
                <path :d="sparkPath(k.spark)" class="mk-spark__line" />
              </svg>
              <div v-else-if="k.gauge !== undefined" class="mk-gauge"><span :style="{ width: `${k.gauge}%` }" /></div>
              <div v-if="k.hint" class="mk-kpi__hint">{{ k.hint }}</div>
              <div v-else-if="k.gauge !== undefined" class="mk-kpi__hint">jusqu’à la première facture payée</div>
            </article>
          </section>

          <nav class="mk-tabs" role="tablist">
            <button v-for="t in tabs" :key="t.id" role="tab" class="mk-tab" :class="{ 'is-active': tab === t.id }" :aria-selected="tab === t.id" @click="tab = t.id">
              {{ t.label }}<span v-if="t.count" class="mk-tab__count">{{ t.count }}</span>
            </button>
          </nav>

          <div class="mk-grid">
            <section class="mk-card">
              <header class="mk-card__head">
                <div>
                  <h2>Instances</h2>
                  <p>Les machines de ce projet, toutes régions.</p>
                </div>
                <div class="mk-card__tools">
                  <label class="mk-input"><Icon name="search" size="14" /><input placeholder="Filtrer" /></label>
                  <button class="mk-btn is-icon" aria-label="Actualiser"><Icon name="refresh" /></button>
                </div>
              </header>
              <div class="mk-table" role="table">
                <div class="mk-tr mk-th" role="row">
                  <span role="columnheader">Nom</span><span role="columnheader">État</span><span role="columnheader">Gabarit</span><span role="columnheader">Adresse</span><span role="columnheader" class="num">Coût</span><span />
                </div>
                <a v-for="i in instances" :key="i.id" href="#" class="mk-tr" role="row">
                  <span class="mk-cell-name" role="cell">
                    <span class="mk-res"><Icon name="server" size="15" /></span>
                    <span><strong>{{ i.name }}</strong><small class="mono">{{ i.id }} · {{ i.region }}</small></span>
                  </span>
                  <span role="cell"><span class="mk-status" :class="`is-${i.tone}`"><i />{{ i.state }}</span></span>
                  <span role="cell" class="mk-cell-meta"><strong>{{ i.flavor }}</strong><small>{{ i.size }}</small></span>
                  <span role="cell" class="mono mk-dim">{{ i.ip }}</span>
                  <span role="cell" class="num mk-cell-meta"><strong>{{ i.cost }}</strong><small>{{ i.billing }}</small></span>
                  <span role="cell" class="mk-row-more"><Icon name="more" /></span>
                </a>
              </div>
            </section>

            <aside class="mk-aside">
              <section class="mk-card">
                <header class="mk-card__head"><div><h2>Activité</h2></div><a href="#" class="mk-link">Tout voir</a></header>
                <ol class="mk-feed">
                  <li v-for="a in activity" :key="a.text">
                    <span class="mk-feed__icon"><Icon :name="a.icon" size="14" /></span>
                    <span><strong>{{ a.text }}</strong><small>{{ a.who }} · {{ a.when }}</small></span>
                  </li>
                </ol>
              </section>
              <section class="mk-card mk-card--accent">
                <div class="mk-card__eyebrow"><Icon name="shield" size="14" />Vos données restent en Europe</div>
                <p>Accédez au projet avec vos outils : OpenStack, Terraform, ou l’API Adion.</p>
                <div class="mk-row">
                  <button class="mk-btn"><Icon name="copy" />clouds.yaml</button>
                  <button class="mk-btn"><Icon name="key" />Clés d’API</button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.mk {
  --bg: #09090b; --panel: #0f0f12; --raised: #141418; --hover: #1a1a1f;
  --line: #1f1f24; --line-2: #2a2a31;
  --text: #ececef; --text-2: #a1a1aa; --text-3: #71717a;
  --brand: #54ba9b; --brand-2: #67dcc6; --brand-ink: #04130e;
  --ok: #4ade80; --warn: #fbbf24; --bad: #f87171; --info: #60a5fa;
  min-height: 100vh; background: var(--bg); color: var(--text);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-size: 13.5px; line-height: 1.5;
  -webkit-font-smoothing: antialiased; font-feature-settings: 'cv11', 'ss01', 'tnum';
}
.mk * { box-sizing: border-box; letter-spacing: normal; }
.mk a { color: inherit; text-decoration: none; }
.mk button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
.mono { font-family: ui-monospace, 'JetBrains Mono', SFMono-Regular, Menlo, monospace; font-size: 12.5px; }
.num { text-align: right; justify-self: end; }

/* Barre du haut */
.mk-top { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 16px; height: 56px; padding: 0 16px; background: color-mix(in srgb, var(--bg) 80%, transparent); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); }
.mk-logo { display: flex; align-items: center; gap: 10px; width: 216px; }
.mk-pill { width: 30px; height: 16px; border-radius: 99px; border: 4px solid; border-image: none; border-color: var(--brand); background: transparent; box-shadow: inset 0 0 0 0 transparent; }
.mk-logo__text { font-family: 'Lilita One', sans-serif; font-size: 12.5px; line-height: 1.05; color: #fff; }
.mk-top__search { flex: 1; max-width: 520px; display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 10px; border: 1px solid var(--line-2); border-radius: 8px; background: var(--panel); color: var(--text-3); }
.mk-top__search span { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
kbd { padding: 1px 6px; border: 1px solid var(--line-2); border-radius: 5px; font: 11px/1.5 inherit; color: var(--text-3); background: var(--raised); }
.mk-top__actions { margin-left: auto; display: flex; align-items: center; gap: 4px; }
.mk-icon-btn { position: relative; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 8px; color: var(--text-2); }
.mk-icon-btn:hover { background: var(--hover); color: var(--text); }
.mk-icon-btn.is-brand { color: var(--brand-2); }
.mk-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; background: var(--brand-2); box-shadow: 0 0 0 2px var(--bg); }
.mk-avatar { display: grid; place-items: center; width: 30px; height: 30px; margin-left: 6px; border-radius: 50%; font-size: 11.5px; font-weight: 600; color: var(--brand-ink); background: linear-gradient(135deg, var(--brand-2), #37b9b8); }

/* Barre de gauche */
.mk-body { display: grid; grid-template-columns: 248px minmax(0, 1fr); }
.mk-side { position: sticky; top: 56px; height: calc(100vh - 56px); display: flex; flex-direction: column; gap: 12px; padding: 12px; border-right: 1px solid var(--line); background: var(--bg); overflow-y: auto; }
.mk-scope { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px; border: 1px solid var(--line-2); border-radius: 10px; background: var(--panel); text-align: left; }
.mk-scope:hover { border-color: #3a3a42; }
.mk-scope__mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 7px; font-weight: 700; font-size: 12px; color: #1b1406; background: linear-gradient(135deg, #fde68a, #f59e0b); }
.mk-scope__text { flex: 1; display: grid; min-width: 0; }
.mk-scope__text strong { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mk-scope__text small { color: var(--text-3); font-size: 12px; }
.mk-nav { display: grid; gap: 14px; }
.mk-nav__group { display: grid; gap: 1px; }
.mk-nav__title { padding: 4px 10px; font-size: 11.5px; font-weight: 500; color: var(--text-3); }
.mk-nav__item { display: flex; align-items: center; gap: 10px; height: 32px; padding: 0 10px; border-radius: 7px; color: var(--text-2); font-weight: 450; }
.mk-nav__item:hover { background: var(--hover); color: var(--text); }
.mk-nav__item.is-active { background: var(--raised); color: var(--text); box-shadow: inset 0 0 0 1px var(--line-2); }
.mk-nav__item.is-active svg { color: var(--brand-2); }
.mk-side__foot { margin-top: auto; display: grid; gap: 1px; padding-top: 12px; border-top: 1px solid var(--line); }

/* Contenu */
.mk-main { position: relative; min-width: 0; overflow: hidden; }
.mk-glow { position: absolute; inset: -200px auto auto -100px; width: 700px; height: 420px; background: radial-gradient(closest-side, color-mix(in srgb, var(--brand) 16%, transparent), transparent); pointer-events: none; filter: blur(10px); }
.mk-page { position: relative; max-width: 1240px; margin: 0 auto; padding: 24px 32px 64px; display: grid; gap: 24px; }
.mk-crumbs { display: flex; align-items: center; gap: 6px; color: var(--text-3); font-size: 12.5px; }
.mk-crumbs a:hover { color: var(--text); }
.mk-head { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.mk-head__mark { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 12px; color: var(--brand-2); background: linear-gradient(160deg, color-mix(in srgb, var(--brand) 22%, transparent), color-mix(in srgb, var(--brand) 4%, transparent)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand) 35%, transparent); }
.mk-head__text { flex: 1; min-width: 240px; }
.mk-head__line { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.mk-head h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.2; }
.mk-head p { margin: 2px 0 0; color: var(--text-2); }
.mk-head__actions { display: flex; gap: 8px; flex-wrap: wrap; }

.mk-btn { white-space: nowrap; display: inline-flex; align-items: center; gap: 7px; height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--line-2) !important; background: var(--panel) !important; color: var(--text) !important; font-weight: 500; font-size: 13px; transition: background 0.12s, border-color 0.12s; }
.mk-btn:hover { background: var(--hover) !important; border-color: #3a3a42 !important; }
.mk-btn.is-icon { width: 32px; padding: 0; justify-content: center; }
.mk-btn.is-primary { border-color: transparent !important; background: var(--brand) !important; color: var(--brand-ink) !important; box-shadow: 0 0 0 1px color-mix(in srgb, var(--brand) 50%, transparent), 0 8px 24px -10px color-mix(in srgb, var(--brand) 70%, transparent); }
.mk-btn.is-primary:hover { background: var(--brand-2) !important; }

.mk-status { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px 0 8px; border-radius: 99px; font-size: 12px; font-weight: 500; color: var(--text-2); background: var(--raised); box-shadow: inset 0 0 0 1px var(--line-2); white-space: nowrap; }
.mk-status i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.mk-status.is-ok { color: var(--ok); background: color-mix(in srgb, var(--ok) 9%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ok) 22%, transparent); }
.mk-status.is-ok i { box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok) 20%, transparent); }
.mk-status.is-info { color: var(--info); background: color-mix(in srgb, var(--info) 9%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--info) 22%, transparent); }
.mk-status.is-info i { animation: mk-pulse 1.2s ease-in-out infinite; }
.mk-status.is-muted i { background: var(--text-3); }
@keyframes mk-pulse { 50% { opacity: 0.3; } }

.mk-kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.mk-kpi { position: relative; display: grid; gap: 6px; padding: 16px; border: 1px solid var(--line); border-radius: 12px; background: linear-gradient(180deg, var(--raised), var(--panel)); overflow: hidden; }
.mk-kpi__label { color: var(--text-2); font-size: 12.5px; font-weight: 500; }
.mk-kpi__value { display: flex; flex-wrap: wrap; white-space: nowrap; align-items: baseline; gap: 2px 6px; font-size: 24px; font-weight: 600; letter-spacing: -0.03em; }
.mk-kpi__value small { font-size: 13px; font-weight: 500; color: var(--text-3); letter-spacing: 0; }
.mk-delta { margin-left: auto; font-size: 12px; font-weight: 500; color: var(--ok); letter-spacing: 0; }
.mk-kpi__hint { color: var(--text-3); font-size: 12px; }
.mk-spark { width: 100%; height: 30px; margin-top: 2px; }
.mk-spark__line { fill: none; stroke: var(--brand-2); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.mk-spark__area { fill: color-mix(in srgb, var(--brand) 12%, transparent); }
.mk-gauge { height: 6px; margin: 12px 0 4px; border-radius: 99px; background: var(--hover); overflow: hidden; }
.mk-gauge span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--brand), var(--brand-2)); }

.mk-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--line); overflow-x: auto; scrollbar-width: none; }
.mk-tab { display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 10px; color: var(--text-3) !important; font-weight: 500; white-space: nowrap; box-shadow: inset 0 -2px 0 transparent; }
.mk-tab:hover { color: var(--text) !important; }
.mk-tab.is-active { color: var(--text) !important; box-shadow: inset 0 -2px 0 var(--text); }
.mk-tab__count { padding: 0 6px; border-radius: 99px; font-size: 11.5px; color: var(--text-2); background: var(--raised); box-shadow: inset 0 0 0 1px var(--line-2); }

.mk-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; align-items: start; }
.mk-aside { display: grid; gap: 16px; }
.mk-card { border: 1px solid var(--line); border-radius: 12px; background: var(--panel); overflow: hidden; }
.mk-card__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--line); }
.mk-card__head h2 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.mk-card__head p { margin: 2px 0 0; font-size: 12.5px; color: var(--text-3); }
.mk-card__tools { display: flex; gap: 8px; }
.mk-input { display: flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border: 1px solid var(--line-2); border-radius: 8px; color: var(--text-3); background: var(--bg); }
.mk-input input { width: 140px; border: 0; outline: 0; background: none; color: var(--text); font: inherit; }
.mk-link { font-size: 12.5px; color: var(--text-2); }
.mk-link:hover { color: var(--brand-2); }

.mk-table { display: grid; }
.mk-tr { display: grid; grid-template-columns: minmax(180px, 1.6fr) minmax(110px, 1fr) minmax(110px, 1fr) minmax(110px, 1fr) minmax(100px, 0.9fr) 32px; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--line); }
.mk-tr:last-child { border-bottom: 0; }
a.mk-tr:hover { background: var(--raised); }
.mk-th { padding-top: 8px; padding-bottom: 8px; font-size: 12px; font-weight: 500; color: var(--text-3); background: color-mix(in srgb, var(--raised) 50%, transparent); }
.mk-cell-name { display: flex; align-items: center; gap: 10px; min-width: 0; }
.mk-cell-name strong, .mk-cell-meta strong { display: block; font-weight: 500; }
.mk-cell-name small, .mk-cell-meta small { display: block; color: var(--text-3); font-size: 12px; }
.mk-res { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; color: var(--text-2); background: var(--raised); box-shadow: inset 0 0 0 1px var(--line-2); }
.mk-dim { color: var(--text-2); }
.mk-row-more { display: grid; place-items: center; color: var(--text-3); }

.mk-feed { list-style: none; margin: 0; padding: 8px 16px 14px; display: grid; gap: 14px; }
.mk-feed li { display: flex; gap: 12px; position: relative; }
.mk-feed li:not(:last-child)::after { content: ''; position: absolute; left: 13px; top: 30px; bottom: -12px; width: 1px; background: var(--line-2); }
.mk-feed__icon { flex: none; display: grid; place-items: center; width: 27px; height: 27px; border-radius: 50%; color: var(--text-2); background: var(--raised); box-shadow: inset 0 0 0 1px var(--line-2); }
.mk-feed strong { display: block; font-weight: 500; }
.mk-feed small { color: var(--text-3); font-size: 12px; }
.mk-card--accent { display: grid; gap: 10px; padding: 16px; background: radial-gradient(120% 140% at 100% 0%, color-mix(in srgb, var(--brand) 14%, transparent), transparent 60%), var(--panel); }
.mk-card--accent p { margin: 0; color: var(--text-2); }
.mk-card__eyebrow { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; color: var(--brand-2); }
.mk-row { display: flex; gap: 8px; flex-wrap: wrap; }

.mk-only-narrow { display: none; }
@media (max-width: 1180px) {
  .mk-grid { grid-template-columns: minmax(0, 1fr); }
  .mk-aside { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
}
@media (max-width: 1024px) {
  .mk-body { grid-template-columns: minmax(0, 1fr); }
  .mk-side { position: fixed; z-index: 30; top: 56px; left: 0; width: 280px; transform: translateX(-100%); transition: transform 0.2s; }
  .is-nav-open .mk-side { transform: none; box-shadow: 24px 0 48px rgba(0, 0, 0, 0.5); }
  .mk-only-narrow { display: grid; }
  .mk-logo { width: auto; }
  .mk-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .mk-top { gap: 8px; padding: 0 8px; }
  .mk-top__search span, .mk-top__search kbd, .mk-hide-narrow, .mk-logo__text { display: none; }
  .mk-top__search { flex: 0 0 34px; justify-content: center; padding: 0; }
  .mk-page { padding: 16px 16px 48px; gap: 18px; }
  .mk-head__actions { width: 100%; }
  .mk-head__actions .mk-btn.is-primary { flex: 1 0 100%; order: -1; justify-content: center; height: 38px; }
  .mk-head__actions .mk-btn:not(.is-primary):not(.is-icon) { flex: 1; justify-content: center; }
  .mk-delta { margin-left: 0; }
  .mk-kpi__value { font-size: 20px; }
  .mk-th { display: none; }
  .mk-tr { grid-template-columns: minmax(0, 1fr) auto; row-gap: 8px; }
  .mk-tr > :nth-child(3), .mk-tr > :nth-child(4) { display: none; }
  .mk-tr > :nth-child(5) { grid-column: 1; justify-self: start; text-align: left; }
  .mk-tr > :nth-child(6) { grid-row: 1; grid-column: 2; }
  .mk-card__tools .mk-input { display: none; }
}
</style>
