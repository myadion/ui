<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

/*
 * LA MAQUETTE v2 (2026-10-27), d'apres les references de Kevin (Memberset,
 * Coinbase, abyss, Dyte...) : bleu nuit profond et halos de lumiere, cartes
 * ardoise tres arrondies, une couleur d'action vive (le vert-sarcelle
 * d'Adion), typo geometrique (Manrope), grands chiffres, anneaux et courbes.
 * La barre du haut et la barre de gauche de l'espace client sont reproduites
 * telles qu'elles sont aujourd'hui (Kevin : on les garde).
 */
const tab = ref('instances')
const filter = ref('all')
const navOpen = ref(false)
const tabs = [
  { id: 'overview', label: 'Vue d’ensemble' },
  { id: 'instances', label: 'Instances', count: 3 },
  { id: 'volumes', label: 'Volumes', count: 2 },
  { id: 'network', label: 'Réseau' },
  { id: 'usage', label: 'Consommation' },
]
const filters = [
  { id: 'all', label: 'Toutes', count: 3 },
  { id: 'on', label: 'En marche', count: 2 },
  { id: 'off', label: 'Arrêtées', count: 1 },
]
const groups = [
  { title: 'Web', items: ['Hébergements web', 'Bases de données', 'Noms de domaine', 'Zones DNS', 'E-mails'] },
  { title: 'Télécom', items: ['Accès fibre', 'Lignes mobiles', 'Trunks SIP', 'Lilou', 'SMS'] },
  { title: 'Cloud', items: ['Public Cloud', 'VPS', 'Serveurs dédiés', 'IP publiques', 'Fabric'], active: 'Public Cloud' },
]
const instances = [
  { name: 'web-1', sub: 'Debian 12 · Toulouse', state: 'En marche', tone: 'ok', flavor: 'B2', size: '2 vCPU · 4 Go · 50 Go', ip: '51.75.12.40', cost: '0,0246 €', per: 'par heure', cpu: [20, 35, 30, 50, 42, 60, 48, 55, 40, 62, 58, 70] },
  { name: 'db-1', sub: 'Debian 12 · Toulouse', state: 'Arrêtée', tone: 'muted', flavor: 'B4', size: '4 vCPU · 8 Go · 100 Go', ip: '10.0.0.12', cost: '17,99 €', per: 'par mois', cpu: [10, 12, 8, 9, 6, 4, 3, 2, 1, 1, 1, 1] },
  { name: 'worker-2', sub: 'Ubuntu 24.04 · Toulouse', state: 'En création', tone: 'info', flavor: 'B2', size: '2 vCPU · 4 Go · 50 Go', ip: 'en attente', cost: '0,0246 €', per: 'par heure', cpu: [] },
]
const activity = [
  { icon: 'plus', text: 'worker-2 créée', who: 'Kévin Paly', when: 'il y a 2 min', tone: 'brand' },
  { icon: 'power', text: 'db-1 arrêtée', who: 'Kévin Paly', when: 'il y a 1 h', tone: 'muted' },
  { icon: 'wallet', text: 'db-1 passée au mois', who: 'Kévin Paly', when: 'hier', tone: 'violet' },
  { icon: 'network', text: '51.75.12.40 rattachée à web-1', who: 'API · ci-deploy', when: '25 oct.', tone: 'blue' },
]
const usage = [3, 4, 4, 5, 7, 6, 8, 9, 11, 12, 14, 15, 18]
const line = (values, w = 100, h = 36) => {
  if (!values.length) return ''
  const max = Math.max(...values, 1)
  const step = w / (values.length - 1)
  return values.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(h - 2 - (v / max) * (h - 6)).toFixed(1)}`).join(' ')
}
const ring = 37
</script>

<template>
  <div class="mk" :class="{ 'is-nav-open': navOpen }">
    <!-- ===== Barre de gauche : celle d'aujourd'hui ===== -->
    <aside class="side">
      <a class="side__brand" href="#"><span class="pill" /><span class="brand-text">ADION<br />CLOUD</span></a>
      <button class="ctx"><span class="ctx__label">Compte</span><span class="ctx__value">Sandbox – Kévin Paly</span></button>
      <button class="ctx"><span class="ctx__label">Projet</span><span class="ctx__value">Test Cloud</span></button>
      <div class="side__tabs"><span class="is-on">Produits</span><span>Par domaine</span></div>
      <div class="side__filter"><Icon name="search" size="12" />Filtrer</div>
      <nav class="side__nav">
        <div v-for="g in groups" :key="g.title" class="side__group">
          <div class="side__title">{{ g.title }}</div>
          <a v-for="item in g.items" :key="item" href="#" class="side__item" :class="{ 'is-on': item === g.active }">{{ item }}</a>
        </div>
      </nav>
    </aside>

    <div class="frame">
      <!-- ===== Barre du haut : celle d'aujourd'hui ===== -->
      <header class="top">
        <button class="top__burger" aria-label="Menu" @click="navOpen = !navOpen"><Icon name="menu" /></button>
        <span class="top__spacer" />
        <button class="top__icon is-ai" aria-label="Assistant"><Icon name="sparkles" /></button>
        <button class="top__icon" aria-label="Notifications"><Icon name="bell" /><span class="top__badge">4</span></button>
        <button class="top__icon" aria-label="Rechercher"><Icon name="search" /></button>
        <button class="top__icon" aria-label="Accueil"><Icon name="home" /></button>
        <button class="top__icon" aria-label="Documentation"><Icon name="book" /></button>
        <button class="top__icon" aria-label="Thème"><Icon name="sun" /></button>
        <button class="top__icon" aria-label="Se déconnecter"><Icon name="logout" /></button>
      </header>

      <!-- ===== Le contenu, dans la nouvelle direction ===== -->
      <main class="page">
        <div class="aura aura--a" aria-hidden="true" />
        <div class="aura aura--b" aria-hidden="true" />

        <section class="hero">
          <div class="hero__crumbs"><a href="#">Cloud</a><Icon name="chevronRight" size="13" /><a href="#">Public Cloud</a></div>
          <div class="hero__row">
            <div class="hero__mark"><Icon name="cloud" size="26" /></div>
            <div class="hero__text">
              <div class="hero__title">
                <h1>Test Cloud</h1>
                <span class="chip is-ok"><i />Actif</span>
              </div>
              <p>Toulouse · facturé à l’heure ou au mois · créé le 27 octobre 2026</p>
            </div>
            <div class="hero__actions">
              <button class="btn is-ghost"><Icon name="terminal" />Horizon</button>
              <button class="btn is-primary"><Icon name="plus" />Créer une instance</button>
            </div>
          </div>
        </section>

        <section class="kpis">
          <article class="kpi kpi--wide">
            <div class="kpi__head"><span class="kpi__icon is-teal"><Icon name="wallet" size="18" /></span>Consommé ce mois</div>
            <div class="kpi__value">18,42 €<small>HT</small></div>
            <div class="kpi__foot"><span class="up">+12 %</span> par rapport à septembre</div>
            <svg class="kpi__chart" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eead4" stop-opacity="0.45" /><stop offset="1" stop-color="#5eead4" stop-opacity="0" /></linearGradient></defs>
              <path :d="`${line(usage)} L100,36 L0,36 Z`" fill="url(#g1)" />
              <path :d="line(usage)" fill="none" stroke="#5eead4" stroke-width="1.6" vector-effect="non-scaling-stroke" />
            </svg>
          </article>
          <article class="kpi">
            <div class="kpi__head"><span class="kpi__icon is-blue"><Icon name="activity" size="18" /></span>Fin de mois estimée</div>
            <div class="kpi__value">41,90 €<small>HT</small></div>
            <div class="kpi__foot">si rien ne change</div>
          </article>
          <article class="kpi">
            <div class="kpi__head"><span class="kpi__icon is-violet"><Icon name="server" size="18" /></span>Instances</div>
            <div class="kpi__value">3<small>/ 4</small></div>
            <div class="kpi__foot"><span class="dot is-ok" />2 en marche · <span class="dot is-muted" />1 arrêtée</div>
          </article>
          <article class="kpi kpi--ring">
            <svg class="ring" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="18" class="ring__track" />
              <circle cx="22" cy="22" r="18" class="ring__value" :stroke-dasharray="`${(ring / 100) * 113.1} 113.1`" />
            </svg>
            <div>
              <div class="kpi__head">Plafond du mois</div>
              <div class="kpi__value kpi__value--sm">{{ ring }} %</div>
              <div class="kpi__foot">18,42 € sur 50 €</div>
            </div>
          </article>
        </section>

        <nav class="tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" role="tab" class="tab" :class="{ 'is-on': tab === t.id }" :aria-selected="tab === t.id" @click="tab = t.id">
            {{ t.label }}<span v-if="t.count" class="tab__count">{{ t.count }}</span>
          </button>
        </nav>

        <div class="grid">
          <section class="card">
            <header class="card__head">
              <h2>Instances</h2>
              <div class="seg">
                <button v-for="f in filters" :key="f.id" class="seg__opt" :class="{ 'is-on': filter === f.id }" @click="filter = f.id">{{ f.label }}<span>{{ f.count }}</span></button>
              </div>
              <label class="search"><Icon name="search" size="15" /><input placeholder="Rechercher" /></label>
            </header>
            <div class="rows">
              <div class="row row--head"><span>Instance</span><span>État</span><span>Gabarit</span><span>Activité</span><span class="r">Coût</span><span /></div>
              <a v-for="i in instances" :key="i.name" href="#" class="row">
                <span class="cell-name">
                  <span class="res" :class="`is-${i.tone}`"><Icon name="server" size="17" /></span>
                  <span><strong>{{ i.name }}</strong><small>{{ i.sub }}</small></span>
                </span>
                <span><span class="chip" :class="`is-${i.tone}`"><i />{{ i.state }}</span></span>
                <span class="cell-two"><strong>{{ i.flavor }}</strong><small>{{ i.size }}</small></span>
                <span>
                  <svg v-if="i.cpu.length" class="spark" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true"><path :d="line(i.cpu)" fill="none" :stroke="i.tone === 'ok' ? '#5eead4' : '#64748b'" stroke-width="1.6" vector-effect="non-scaling-stroke" /></svg>
                  <small v-else class="dim">—</small>
                </span>
                <span class="cell-two r"><strong>{{ i.cost }}</strong><small>{{ i.per }}</small></span>
                <span class="more"><Icon name="more" /></span>
              </a>
            </div>
          </section>

          <aside class="stack">
            <section class="card card--pad">
              <header class="card__head card__head--plain"><h2>Activité</h2><a href="#" class="link">Tout voir</a></header>
              <ol class="feed">
                <li v-for="a in activity" :key="a.text">
                  <span class="feed__icon" :class="`is-${a.tone}`"><Icon :name="a.icon" size="15" /></span>
                  <span><strong>{{ a.text }}</strong><small>{{ a.who }} · {{ a.when }}</small></span>
                </li>
              </ol>
            </section>
            <section class="card card--promo">
              <div class="promo__tag"><Icon name="shield" size="14" />Vos données restent en Europe</div>
              <h3>Pilotez ce projet avec vos outils</h3>
              <p>OpenStack, Terraform ou l’API Adion : vos accès sont prêts.</p>
              <div class="promo__row">
                <button class="btn is-soft"><Icon name="copy" />clouds.yaml</button>
                <button class="btn is-soft"><Icon name="key" />Clés d’API</button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.mk {
  --night: #0a0f1a;
  --night-2: #0d1422;
  --slate: #141c2b;
  --slate-2: #1a2436;
  --slate-3: #212d42;
  --edge: rgba(148, 178, 255, 0.08);
  --edge-2: rgba(148, 178, 255, 0.15);
  --ink: #f3f6fb;
  --ink-2: #b4bfd3;
  --ink-3: #7f8ba3;
  --teal: #5eead4;
  --brand: #54ba9b;
  --brand-hi: #37d6b4;
  --blue: #60a5fa;
  --violet: #a78bfa;
  --amber: #fbbf24;
  --ok: #4ade80;
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--night);
  color: var(--ink);
  font-family: 'Manrope', 'Inter', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: 'tnum';
}
.mk * { box-sizing: border-box; letter-spacing: normal; font-family: inherit; }
.mk a { color: inherit; text-decoration: none; }
.mk button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
.r { text-align: right; justify-self: end; }

/* ===== Les barres d'aujourd'hui (reproduites, inchangees) ===== */
.side { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; gap: 8px; padding: 12px; background: #0a0a0c; border-right: 1px solid rgba(255, 255, 255, 0.08); font-family: 'Raleway', sans-serif; overflow: hidden; }
.side__brand { display: flex; align-items: center; gap: 8px; padding: 4px 4px 10px; }
.pill { width: 22px; height: 12px; border: 3px solid #54ba9b; border-radius: 99px; }
.brand-text { font-family: 'Lilita One', sans-serif; font-size: 10.5px; line-height: 1.05; color: #fff; }
.ctx { display: grid; text-align: left; padding: 2px 4px; }
.ctx__label { font-size: 9.5px; letter-spacing: 1.5px !important; text-transform: uppercase; color: #a2adb6; }
.ctx__value { font-size: 12.5px; font-weight: 500; color: #eafcf6; }
.side__tabs { display: grid; grid-template-columns: 1fr 1fr; margin-top: 6px; font-size: 10px; letter-spacing: 1px !important; text-transform: uppercase; text-align: center; }
.side__tabs span { padding: 7px 0; color: #b6c0c8; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.side__tabs .is-on { background: rgba(84, 186, 155, 0.16); color: #67dcc6; }
.side__filter { display: flex; align-items: center; gap: 6px; padding: 6px 4px; font-size: 11px; color: #a2adb6; }
.side__nav { display: grid; gap: 8px; overflow: hidden; }
.side__title { padding: 4px; font-size: 9.5px; letter-spacing: 1.5px !important; text-transform: uppercase; color: #a2adb6; }
.side__item { display: block; padding: 5px 8px; font-size: 12px; color: #eafcf6; border-radius: 4px; }
.side__item.is-on { background: rgba(84, 186, 155, 0.16); color: #67dcc6; }
.frame { min-width: 0; display: flex; flex-direction: column; }
.top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 4px; height: 48px; padding: 0 12px; background: #0a0a0c; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.top__spacer { flex: 1; }
.top__burger { display: none; }
.top__icon { position: relative; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; color: #e6e6e6; }
.top__icon.is-ai { background: rgba(255, 255, 255, 0.06); }
.top__badge { position: absolute; top: 0; right: 0; min-width: 14px; height: 14px; border-radius: 7px; font-size: 9px; font-weight: 700; display: grid; place-items: center; background: #54ba9b; color: #06140f; }

/* ===== Le contenu ===== */
.page { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 22px; padding: 28px 32px 64px; overflow: hidden; }
.aura { position: absolute; pointer-events: none; border-radius: 50%; filter: blur(80px); opacity: 0.55; }
.aura--a { top: -180px; left: -120px; width: 620px; height: 420px; background: radial-gradient(closest-side, rgba(45, 212, 191, 0.35), transparent); }
.aura--b { top: 40px; right: -200px; width: 640px; height: 480px; background: radial-gradient(closest-side, rgba(99, 102, 241, 0.32), transparent); }
.page > *:not(.aura) { position: relative; min-width: 0; }
.hero, .hero__row, .card, .stack, .kpi { min-width: 0; }

.hero__crumbs { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; font-size: 13px; color: var(--ink-3); }
.hero__crumbs a:hover { color: var(--ink); }
.hero__row { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.hero__mark { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 18px; color: #04201a; background: linear-gradient(145deg, #7ff0dc, #37b9b8 60%, #2b8fd6); box-shadow: 0 12px 30px -10px rgba(55, 214, 180, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4); }
.hero__text { flex: 1; min-width: 220px; }
.hero__title { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.hero h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
.hero p { margin: 4px 0 0; color: var(--ink-2); font-size: 14.5px; }
.hero__actions { display: flex; gap: 10px; flex-wrap: wrap; }

.btn { display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 20px; border-radius: 999px; font-weight: 700; font-size: 14px; white-space: nowrap; transition: transform 0.15s, box-shadow 0.15s, background 0.15s; }
.btn:hover { transform: translateY(-1px); }
.btn.is-primary { color: #03201a; background: linear-gradient(180deg, #6ff2d8, #37d6b4); box-shadow: 0 10px 28px -10px rgba(55, 214, 180, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.5); }
.btn.is-ghost { color: var(--ink); background: rgba(255, 255, 255, 0.06); box-shadow: inset 0 0 0 1px var(--edge-2); }
.btn.is-soft { height: 36px; padding: 0 14px; font-size: 13px; background: rgba(255, 255, 255, 0.08); }

.chip { display: inline-flex; align-items: center; gap: 7px; height: 26px; padding: 0 11px; border-radius: 999px; font-size: 12.5px; font-weight: 700; white-space: nowrap; }
.chip i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.chip.is-ok { color: var(--ok); background: rgba(74, 222, 128, 0.13); }
.chip.is-ok i { box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.22), 0 0 10px rgba(74, 222, 128, 0.8); }
.chip.is-info { color: var(--blue); background: rgba(96, 165, 250, 0.14); }
.chip.is-info i { animation: pulse 1.2s ease-in-out infinite; }
.chip.is-muted { color: var(--ink-2); background: rgba(148, 163, 184, 0.13); }
@keyframes pulse { 50% { opacity: 0.25; } }

.kpis { display: grid; grid-template-columns: 1.35fr 1fr 1fr 1fr; gap: 16px; }
.kpi { position: relative; display: grid; align-content: start; gap: 8px; padding: 20px; border-radius: 20px; background: linear-gradient(180deg, var(--slate-2), var(--slate)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 0 1px var(--edge), 0 20px 40px -24px rgba(0, 0, 0, 0.8); overflow: hidden; }
.kpi--wide { background: radial-gradient(120% 120% at 100% 0%, rgba(45, 212, 191, 0.18), transparent 55%), linear-gradient(180deg, var(--slate-2), var(--slate)); }
.kpi__head { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 600; color: var(--ink-2); }
.kpi__icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 11px; }
.kpi__icon.is-teal { color: var(--teal); background: rgba(94, 234, 212, 0.14); }
.kpi__icon.is-blue { color: var(--blue); background: rgba(96, 165, 250, 0.14); }
.kpi__icon.is-violet { color: var(--violet); background: rgba(167, 139, 250, 0.15); }
.kpi__value { margin-top: 4px; font-size: 34px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.05; }
.kpi__value small { margin-left: 6px; font-size: 14px; font-weight: 600; color: var(--ink-3); letter-spacing: 0; }
.kpi__value--sm { font-size: 26px; margin-top: 2px; }
.kpi__foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: var(--ink-3); }
.up { color: var(--ok); font-weight: 700; }
.dot { width: 7px; height: 7px; border-radius: 50%; }
.dot.is-ok { background: var(--ok); }
.dot.is-muted { background: #64748b; }
.kpi__chart { width: 100%; height: 44px; margin-top: 2px; }
.kpi--ring { grid-template-columns: auto 1fr; align-items: center; gap: 16px; }
.ring { width: 76px; height: 76px; transform: rotate(-90deg); }
.ring__track { fill: none; stroke: rgba(148, 178, 255, 0.12); stroke-width: 5; }
.ring__value { fill: none; stroke: url(#none); stroke: var(--teal); stroke-width: 5; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(94, 234, 212, 0.6)); }

.tabs { display: flex; gap: 6px; padding: 5px; width: max-content; max-width: 100%; overflow-x: auto; border-radius: 999px; background: rgba(20, 28, 43, 0.8); box-shadow: inset 0 0 0 1px var(--edge); scrollbar-width: none; }
.tab { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 16px; border-radius: 999px; font-weight: 600; color: var(--ink-3) !important; white-space: nowrap; }
.tab:hover { color: var(--ink) !important; }
.tab.is-on { color: var(--ink) !important; background: var(--slate-3); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 12px -6px rgba(0, 0, 0, 0.6); }
.tab__count { min-width: 20px; padding: 0 6px; border-radius: 999px; font-size: 11.5px; font-weight: 700; text-align: center; color: #03201a; background: var(--teal); }
.tab:not(.is-on) .tab__count { color: var(--ink-2); background: rgba(255, 255, 255, 0.08); }

.grid { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 18px; align-items: start; }
.stack { display: grid; gap: 18px; }
.card { border-radius: 22px; background: linear-gradient(180deg, var(--slate), var(--night-2)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 0 1px var(--edge); overflow: hidden; }
.card--pad { padding-bottom: 6px; }
.card__head { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 18px 20px; }
.card__head h2 { margin: 0 auto 0 0; font-size: 17px; font-weight: 800; letter-spacing: -0.02em; }
.card__head--plain { padding-bottom: 6px; }
.link { font-size: 13px; font-weight: 600; color: var(--teal); }
.seg { display: inline-flex; gap: 4px; padding: 4px; border-radius: 999px; background: rgba(255, 255, 255, 0.04); box-shadow: inset 0 0 0 1px var(--edge); }
.seg__opt { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--ink-3) !important; }
.seg__opt span { font-size: 11.5px; opacity: 0.8; }
.seg__opt.is-on { color: #03201a !important; background: var(--teal); }
.search { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 14px; border-radius: 999px; color: var(--ink-3); background: rgba(255, 255, 255, 0.04); box-shadow: inset 0 0 0 1px var(--edge); }
.search input { width: 150px; border: 0; outline: 0; background: none; color: var(--ink); font: inherit; }

.rows { display: grid; padding: 0 10px 10px; }
.row { display: grid; grid-template-columns: minmax(190px, 1.6fr) minmax(120px, 1fr) minmax(150px, 1.1fr) minmax(90px, 0.8fr) minmax(90px, 0.8fr) 28px; align-items: center; gap: 14px; padding: 12px 12px; border-radius: 14px; }
a.row:hover { background: rgba(255, 255, 255, 0.04); }
.row--head { padding-top: 6px; padding-bottom: 6px; font-size: 12.5px; font-weight: 600; color: var(--ink-3); }
.cell-name { display: flex; align-items: center; gap: 12px; min-width: 0; }
.cell-name strong, .cell-two strong { display: block; font-weight: 700; }
.cell-name small, .cell-two small { display: block; font-size: 12.5px; color: var(--ink-3); }
.res { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; }
.res.is-ok { color: var(--teal); background: rgba(94, 234, 212, 0.12); }
.res.is-muted { color: var(--ink-3); background: rgba(148, 163, 184, 0.1); }
.res.is-info { color: var(--blue); background: rgba(96, 165, 250, 0.12); }
.spark { width: 100%; max-width: 110px; height: 28px; }
.dim { color: var(--ink-3); }
.more { display: grid; place-items: center; color: var(--ink-3); }

.feed { list-style: none; margin: 0; padding: 6px 20px 16px; display: grid; gap: 16px; }
.feed li { display: flex; gap: 12px; }
.feed strong { display: block; font-weight: 700; font-size: 13.5px; }
.feed small { font-size: 12.5px; color: var(--ink-3); }
.feed__icon { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 11px; }
.feed__icon.is-brand { color: var(--teal); background: rgba(94, 234, 212, 0.13); }
.feed__icon.is-muted { color: var(--ink-2); background: rgba(148, 163, 184, 0.1); }
.feed__icon.is-violet { color: var(--violet); background: rgba(167, 139, 250, 0.14); }
.feed__icon.is-blue { color: var(--blue); background: rgba(96, 165, 250, 0.13); }
.card--promo { display: grid; gap: 8px; padding: 22px; background: radial-gradient(140% 120% at 100% 0%, rgba(99, 102, 241, 0.45), transparent 60%), radial-gradient(120% 120% at 0% 100%, rgba(45, 212, 191, 0.3), transparent 60%), var(--slate); }
.card--promo h3 { margin: 4px 0 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
.card--promo p { margin: 0; color: var(--ink-2); }
.promo__tag { display: inline-flex; align-items: center; gap: 6px; width: max-content; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; color: var(--teal); background: rgba(94, 234, 212, 0.12); }
.promo__row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }

@media (max-width: 1280px) {
  .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid { grid-template-columns: minmax(0, 1fr); }
  .stack { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
}
@media (max-width: 960px) {
  .mk { grid-template-columns: minmax(0, 1fr); }
  .side { position: fixed; z-index: 20; left: 0; width: 260px; transform: translateX(-100%); transition: transform 0.2s; }
  .is-nav-open .side { transform: none; }
  .top__burger { display: grid; place-items: center; width: 32px; height: 32px; color: #e6e6e6; }
  .row { grid-template-columns: minmax(170px, 1.5fr) minmax(110px, 1fr) minmax(90px, 0.8fr) 28px; }
  .row > :nth-child(3), .row > :nth-child(4) { display: none; }
}
@media (max-width: 640px) {
  .page { padding: 20px 16px 48px; gap: 18px; }
  .hero h1 { font-size: 26px; }
  .hero__mark { width: 48px; height: 48px; border-radius: 15px; }
  .hero__actions { width: 100%; flex-direction: column-reverse; }
  .hero__actions .btn { width: 100%; justify-content: center; }
  .seg { order: 3; width: 100%; overflow-x: auto; scrollbar-width: none; }
  .row > :nth-child(6) { display: none; }
  .stack { grid-template-columns: minmax(0, 1fr); }
  .kpis { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .kpi__value { font-size: 30px; }
  .card__head { padding: 16px; }
  .search { display: none; }
  .row { grid-template-columns: minmax(0, 1fr) auto; gap: 10px; }
  .row > :nth-child(5) { display: none; }
  .row--head { display: none; }
}
</style>
