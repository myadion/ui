<script setup>
import { computed, onMounted, ref } from 'vue'
import Icon from './Icon.vue'

/*
 * LA MAQUETTE v4 (2026-10-27, puis Kevin : chiffres trop hauts, place mal
 * utilisee, plus d'espace, de l'animation, de la vie). Base retenue : la v3 (Kevin : « on s'approche
 * d'un truc que j'aime »). v4 travaille ce qu'il a demande ensuite :
 * l'ergonomie (gestes sur la ligne, une carte « A surveiller » qui dit quoi
 * faire, le reste du plafond plutot qu'un pourcentage, des chiffres qui
 * menent quelque part), l'espace (deux colonnes equilibrees, la
 * consommation par ressource sous le tableau) et les fonds des cartes (un
 * voile de couleur par sujet, des en-tetes legerement contrastes). Toujours
 * sans fluo ni lueur, arrondis de 4 a 8 px. Les barres de l'espace client sont
 * reproduites telles quelles.
 */
const tab = ref('instances')
const filter = ref('all')
const navOpen = ref(false)
const tabs = [
  { id: 'overview', label: 'Vue d’ensemble' },
  { id: 'instances', label: 'Instances', count: 3 },
  { id: 'volumes', label: 'Volumes', count: 2 },
  { id: 'network', label: 'Réseau' },
  { id: 'firewall', label: 'Pare-feu' },
  { id: 'usage', label: 'Consommation' },
]
const groups = [
  { title: 'Web', items: ['Hébergements web', 'Bases de données', 'Noms de domaine', 'Zones DNS', 'E-mails'] },
  { title: 'Télécom', items: ['Accès fibre', 'Lignes mobiles', 'Trunks SIP', 'Lilou', 'SMS'] },
  { title: 'Cloud', items: ['Public Cloud', 'VPS', 'Serveurs dédiés', 'IP publiques', 'Fabric'], active: 'Public Cloud' },
]
const instances = [
  { name: 'web-1', sub: 'Debian 12', state: 'En marche', tone: 'ok', flavor: 'B2', size: '2 vCPU · 4 Go · 50 Go', ip: '51.75.12.40', cost: '0,0246 €', per: '/ h', month: '12,30 €', cpu: [20, 35, 30, 50, 42, 60, 48, 55, 40, 62, 58, 70], cpuNow: '58 %', gestures: [['terminal', 'Console'], ['power', 'Arrêter']] },
  { name: 'db-1', sub: 'Debian 12', state: 'Arrêtée', tone: 'muted', flavor: 'B4', size: '4 vCPU · 8 Go · 100 Go', ip: '10.0.0.12', cost: '17,99 €', per: '/ mois', month: '17,99 €', cpu: [], cpuNow: '—', gestures: [['play', 'Démarrer'], ['moon', 'Mettre en sommeil']] },
  { name: 'worker-2', sub: 'Ubuntu 24.04', state: 'En création', tone: 'info', flavor: 'B2', size: '2 vCPU · 4 Go · 50 Go', ip: 'adresse à venir', cost: '0,0246 €', per: '/ h', month: '0,05 €', cpu: [], cpuNow: '—', gestures: [] },
]
const shown = computed(() => instances.filter((i) => filter.value === 'all' || (filter.value === 'on' ? i.tone === 'ok' : i.tone === 'muted')))
const usage = [3, 4, 4, 5, 7, 6, 8, 9, 11, 12, 14, 15, 18]
const breakdown = [
  { label: 'Instances', value: 12.35, color: 'var(--c-brand)' },
  { label: 'Volumes', value: 3.6, color: 'var(--c-blue)' },
  { label: 'IP publiques', value: 1.92, color: 'var(--c-violet)' },
  { label: 'Instantanés', value: 0.55, color: 'var(--c-amber)' },
]
const total = breakdown.reduce((n, b) => n + b.value, 0)
const euro = (n) => `${n.toFixed(2).replace('.', ',')} €`
const activity = [
  { icon: 'plus', text: 'worker-2 créée', who: 'Kévin Paly', when: 'il y a 2 min', tone: 'brand' },
  { icon: 'power', text: 'db-1 arrêtée', who: 'Kévin Paly', when: 'il y a 3 j', tone: 'muted' },
  { icon: 'wallet', text: 'db-1 passée au mois', who: 'Kévin Paly', when: 'il y a 4 j', tone: 'violet' },
  { icon: 'network', text: '51.75.12.40 rattachée à web-1', who: 'API · ci-deploy', when: '25 oct.', tone: 'blue' },
]
/* Les chiffres s'incrementent jusqu'a leur valeur a l'ouverture (coupe si l'on a reduit les animations). */
const shownValues = ref({ spent: 0, estimate: 0, left: 0, count: 0 })
const targets = { spent: 18.42, estimate: 41.9, left: 31.58, count: 3 }
const money = (n) => n.toFixed(2).replace('.', ',')
const still = new URLSearchParams(location.search).has('fige')
onMounted(() => {
  if (still || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { shownValues.value = { ...targets }; return }
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 900)
    const e = 1 - Math.pow(1 - t, 3)
    shownValues.value = Object.fromEntries(Object.entries(targets).map(([k, v]) => [k, v * e]))
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
const estimate = [3, 4, 4, 5, 7, 6, 8, 9, 11, 12, 14, 15, 18, 20, 23, 25, 28, 30, 33, 36, 39, 42]
const line = (values, w = 100, h = 36, top = 0) => {
  if (!values.length) return ''
  const max = top || Math.max(...values, 1)
  const step = w / (values.length - 1)
  return values.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(h - 2 - (v / max) * (h - 6)).toFixed(1)}`).join(' ')
}
</script>

<template>
  <div class="mk" :class="{ 'is-nav-open': navOpen, 'is-still': still }">
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

      <main class="page">
        <!-- L'en-tete : qui, ou, combien, et l'action principale. -->
        <section class="hero" style="--i: 0">
          <div class="hero__crumbs"><a href="#">Cloud</a><Icon name="chevronRight" size="13" /><a href="#">Public Cloud</a></div>
          <div class="hero__row">
            <div class="hero__mark"><Icon name="cloud" size="22" /></div>
            <div class="hero__text">
              <div class="hero__title"><h1>Test Cloud</h1><span class="chip is-ok"><i />Actif</span></div>
              <ul class="facts">
                <li><Icon name="globe" size="14" />Toulouse</li>
                <li><Icon name="wallet" size="14" />À l’heure ou au mois</li>
                <li><Icon name="network" size="14" />1 IP publique</li>
                <li><Icon name="shield" size="14" />Données en Europe</li>
              </ul>
            </div>
            <div class="hero__actions">
              <button class="btn is-ghost"><Icon name="terminal" />Horizon</button>
              <button class="btn is-primary"><Icon name="plus" />Créer une instance</button>
            </div>
          </div>
        </section>

        <!-- Les chiffres : chacun son voile de couleur, et un lien vers le detail. -->
        <section class="kpis">
          <a href="#" class="kpi is-brand" style="--i: 1">
            <div class="kpi__text">
              <div class="kpi__head"><span class="kpi__icon"><Icon name="wallet" size="15" /></span>Consommé ce mois</div>
              <div class="kpi__value">{{ money(shownValues.spent) }} €<small>HT</small></div>
              <div class="kpi__foot"><span class="up">+12 %</span>vs septembre</div>
            </div>
            <svg class="kpi__chart" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#54ba9b" stop-opacity="0.24" /><stop offset="1" stop-color="#54ba9b" stop-opacity="0" /></linearGradient></defs>
              <path class="area" :d="`${line(usage, 100, 40)} L100,40 L0,40 Z`" fill="url(#g1)" />
              <path class="draw" pathLength="1" :d="line(usage, 100, 40)" fill="none" stroke="#54ba9b" stroke-width="1.6" vector-effect="non-scaling-stroke" />
            </svg>
          </a>
          <a href="#" class="kpi is-blue" style="--i: 2">
            <div class="kpi__text">
              <div class="kpi__head"><span class="kpi__icon"><Icon name="activity" size="15" /></span>Fin de mois estimée</div>
              <div class="kpi__value">{{ money(shownValues.estimate) }} €<small>HT</small></div>
              <div class="kpi__foot">facturée le 1ᵉʳ novembre</div>
            </div>
            <svg class="kpi__chart" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <path class="draw" pathLength="1" :d="line(estimate.slice(0, 13), 57, 40, 42)" fill="none" stroke="#6f95d8" stroke-width="1.6" vector-effect="non-scaling-stroke" />
              <path class="draw draw--late" pathLength="1" :d="line(estimate, 100, 40)" fill="none" stroke="#6f95d8" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.55" vector-effect="non-scaling-stroke" />
            </svg>
          </a>
          <a href="#" class="kpi is-violet" style="--i: 3">
            <div class="kpi__text">
              <div class="kpi__head"><span class="kpi__icon"><Icon name="server" size="15" /></span>Instances</div>
              <div class="kpi__value">{{ Math.round(shownValues.count) }}<small>sur 4 possibles</small></div>
              <div class="kpi__foot kpi__foot--nowrap"><i class="dot is-ok" />2 en marche<i class="dot is-muted" />1 arrêtée</div>
            </div>
            <div class="slots" aria-hidden="true">
              <span class="is-ok" /><span class="is-ok" /><span class="is-muted" /><span class="is-free" />
            </div>
          </a>
          <div class="kpi is-amber" style="--i: 4">
            <div class="kpi__text">
              <div class="kpi__head"><span class="kpi__icon"><Icon name="shield" size="15" /></span>Plafond du mois</div>
              <div class="kpi__value">{{ money(shownValues.left) }} €<small>restants</small></div>
              <div class="kpi__foot">18,42 € sur 50 € utilisés</div>
            </div>
            <div class="gauge" aria-hidden="true"><span style="--h: 37%" /><em>37 %</em></div>
          </div>
        </section>

        <nav class="tabs" role="tablist" style="--i: 5">
          <button v-for="t in tabs" :key="t.id" role="tab" class="tab" :class="{ 'is-on': tab === t.id }" :aria-selected="tab === t.id" @click="tab = t.id">
            {{ t.label }}<span v-if="t.count" class="tab__count">{{ t.count }}</span>
          </button>
        </nav>

        <div class="grid" style="--i: 6">
          <div class="main-col">
            <!-- Les instances : les gestes courants sur la ligne, au survol. -->
            <section class="card">
              <header class="card__head">
                <div class="card__title"><h2>Instances</h2><p>Gestes rapides au survol d’une ligne</p></div>
                <div class="seg">
                  <button class="seg__opt" :class="{ 'is-on': filter === 'all' }" @click="filter = 'all'">Toutes <span>3</span></button>
                  <button class="seg__opt" :class="{ 'is-on': filter === 'on' }" @click="filter = 'on'">En marche <span>2</span></button>
                  <button class="seg__opt" :class="{ 'is-on': filter === 'off' }" @click="filter = 'off'">Arrêtées <span>1</span></button>
                </div>
                <label class="search"><Icon name="search" size="14" /><input placeholder="Nom, adresse, image…" /></label>
              </header>
              <div class="rows">
                <div class="row row--head"><span>Instance</span><span>État</span><span>Gabarit</span><span>Processeur</span><span class="r">Ce mois</span></div>
                <a v-for="i in shown" :key="i.name" href="#" class="row" :class="`is-${i.tone}`">
                  <span class="cell-name">
                    <span class="res"><Icon name="server" size="16" /></span>
                    <span><strong>{{ i.name }}</strong><small>{{ i.sub }} · <span class="mono">{{ i.ip }}</span></small></span>
                  </span>
                  <span><span class="chip" :class="`is-${i.tone}`"><i />{{ i.state }}</span></span>
                  <span class="cell-two"><strong>{{ i.flavor }}</strong><small>{{ i.size }}</small></span>
                  <span class="cell-cpu">
                    <svg v-if="i.cpu.length" class="spark" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true"><path class="draw" pathLength="1" :d="line(i.cpu)" fill="none" stroke="#54ba9b" stroke-width="1.5" vector-effect="non-scaling-stroke" /></svg>
                    <small>{{ i.cpuNow }}</small>
                  </span>
                  <span class="cell-two r"><strong>{{ i.month }}</strong><small>{{ i.cost }} {{ i.per }}</small></span>
                  <span v-if="i.gestures.length" class="quick">
                    <button v-for="[icon, label] in i.gestures" :key="label" class="quick__btn" :title="label" @click.prevent><Icon :name="icon" size="14" />{{ label }}</button>
                    <button class="quick__btn is-icon" title="Plus de gestes" @click.prevent><Icon name="more" size="15" /></button>
                  </span>
                </a>
              </div>
            </section>

            <!-- La consommation par ressource : la couleur dit ce qui coute. -->
            <section class="card">
              <header class="card__head card__head--soft">
                <div class="card__title"><h2>Ce qui compose le mois</h2><p>Octobre 2026 · {{ euro(total) }} HT à ce jour</p></div>
                <a href="#" class="link">Relevé détaillé<Icon name="arrowRight" size="14" /></a>
              </header>
              <div class="split">
                <div class="split__bar">
                  <span v-for="b in breakdown" :key="b.label" :style="{ width: `${(b.value / total) * 100}%`, background: b.color }" :title="b.label" />
                </div>
                <ul class="split__legend">
                  <li v-for="b in breakdown" :key="b.label">
                    <i :style="{ background: b.color }" />
                    <span>{{ b.label }}</span>
                    <strong>{{ euro(b.value) }}</strong>
                    <small>{{ Math.round((b.value / total) * 100) }} %</small>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <aside class="stack">
            <!-- Ce qu'il faut faire, avec le bouton pour le faire. -->
            <section class="card card--watch">
              <header class="card__head card__head--soft"><div class="card__title"><h2>À surveiller</h2></div><span class="count">2</span></header>
              <ul class="watch">
                <li>
                  <span class="watch__icon is-amber"><Icon name="moon" size="15" /></span>
                  <div>
                    <strong>db-1 est arrêtée depuis 3 jours</strong>
                    <p>Elle coûte encore 17,99 € par mois. En sommeil, vous ne payez plus que son disque.</p>
                    <button class="btn is-soft">Mettre en sommeil</button>
                  </div>
                </li>
                <li>
                  <span class="watch__icon is-blue"><Icon name="key" size="15" /></span>
                  <div>
                    <strong>Aucune clé SSH sur worker-2</strong>
                    <p>Ajoutez-en une avant la fin de sa création pour vous y connecter.</p>
                    <button class="btn is-soft">Ajouter une clé</button>
                  </div>
                </li>
              </ul>
            </section>

            <section class="card">
              <header class="card__head card__head--soft"><div class="card__title"><h2>Activité</h2></div><a href="#" class="link">Tout voir</a></header>
              <ol class="feed">
                <li v-for="a in activity" :key="a.text">
                  <span class="feed__icon" :class="`is-${a.tone}`"><Icon :name="a.icon" size="14" /></span>
                  <span><strong>{{ a.text }}</strong><small>{{ a.who }} · {{ a.when }}</small></span>
                </li>
              </ol>
            </section>

            <section class="card card--access">
              <div class="access__tag"><Icon name="terminal" size="14" />Accès au projet</div>
              <p>OpenStack, Terraform ou l’API Adion : vos accès sont prêts.</p>
              <div class="access__row">
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
/*
 * v4 : la v3 (bleu nuit sobre, vert d'Adion sans lueur, arrondis de 4 a 8 px,
 * Inter, filets precis) + des fonds de carte qui disent leur sujet, des
 * en-tetes de carte legerement contrastes, et les couleurs de categorie
 * (vert, bleu, violet, ambre) desaturees, en voile ou en aplat discret.
 */
.mk {
  --night: #0c1018;
  --panel: #121823;
  --panel-2: #172031;
  --panel-3: #1c2639;
  --line: rgba(160, 180, 215, 0.1);
  --line-2: rgba(160, 180, 215, 0.18);
  --ink: #eef2f7;
  --ink-2: #aeb8c8;
  --ink-3: #7d889b;
  --c-brand: #54ba9b;
  --c-blue: #6f95d8;
  --c-violet: #9284d1;
  --c-amber: #d1a24a;
  --brand-ink: #062019;
  --ok: #5cbf8a;
  --muted: #5d6779;
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--night);
  color: var(--ink);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: 'tnum', 'cv11';
}
.mk * { box-sizing: border-box; letter-spacing: normal; font-family: inherit; }
.mk a { color: inherit; text-decoration: none; }
.mk button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
.r { text-align: right; justify-self: end; }
.mono { font-family: ui-monospace, 'JetBrains Mono', SFMono-Regular, Menlo, monospace !important; font-size: 12px; }

/* ===== Les barres d'aujourd'hui (reproduites, inchangees) ===== */
.side { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; gap: 8px; padding: 12px; background: #0a0a0c; border-right: 1px solid rgba(255, 255, 255, 0.08); font-family: 'Raleway', sans-serif; overflow: hidden; }
.side * { font-family: 'Raleway', sans-serif; }
.side__brand { display: flex; align-items: center; gap: 8px; padding: 4px 4px 10px; }
.pill { width: 22px; height: 12px; border: 3px solid #54ba9b; border-radius: 99px; }
.brand-text { font-family: 'Lilita One', sans-serif !important; font-size: 10.5px; line-height: 1.05; color: #fff; }
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
.page { display: grid; grid-template-columns: minmax(0, 1fr); gap: 28px; max-width: 1400px; width: 100%; padding: 32px 44px 64px; background: linear-gradient(180deg, #111827 0, var(--night) 340px); }
.page > *, .hero__row, .card, .stack, .kpi, .main-col { min-width: 0; }

.hero__crumbs { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; font-size: 13px; color: var(--ink-3); }
.hero__crumbs a:hover { color: var(--ink); }
.hero__row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.hero__mark { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 8px; color: var(--c-brand); background: linear-gradient(160deg, rgba(84, 186, 155, 0.2), rgba(84, 186, 155, 0.06)); box-shadow: inset 0 0 0 1px rgba(84, 186, 155, 0.28); }
.hero__text { flex: 1; min-width: 240px; }
.hero__title { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.hero h1 { margin: 0; font-size: 26px; font-weight: 650; letter-spacing: -0.022em; line-height: 1.2; }
.facts { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 8px 0 0; padding: 0; list-style: none; font-size: 13px; color: var(--ink-2); }
.facts li { display: inline-flex; align-items: center; gap: 6px; }
.facts svg { color: var(--ink-3); }
.hero__actions { display: flex; gap: 8px; flex-wrap: wrap; }

.btn { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 6px; font-weight: 600; font-size: 13.5px; white-space: nowrap; transition: background 0.15s, box-shadow 0.15s; }
.btn.is-primary { color: var(--brand-ink); background: var(--c-brand); }
.btn.is-primary:hover { background: #61c3a5; }
.btn.is-ghost { color: var(--ink); background: var(--panel); box-shadow: inset 0 0 0 1px var(--line-2); }
.btn.is-ghost:hover { background: var(--panel-2); }
.btn.is-soft { height: 30px; padding: 0 11px; font-size: 12.5px; background: var(--panel-3); box-shadow: inset 0 0 0 1px var(--line-2); }
.btn.is-soft:hover { background: #22304a; }

.chip { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 8px; border-radius: 4px; font-size: 12px; font-weight: 600; white-space: nowrap; }
.chip i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.chip.is-ok { color: var(--ok); background: rgba(92, 191, 138, 0.12); }
.chip.is-info { color: var(--c-blue); background: rgba(111, 149, 216, 0.13); }
.chip.is-info i { animation: pulse 1.4s ease-in-out infinite; }
.chip.is-muted { color: var(--ink-2); background: rgba(150, 165, 190, 0.1); }
@keyframes pulse { 50% { opacity: 0.3; } }

/* Les chiffres : compacts, la valeur a gauche, son graphique a droite. */
.kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.kpi { --c: var(--c-brand); position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(56px, 36%); align-items: center; gap: 12px; min-height: 0; padding: 16px 18px; border-radius: 8px; background: linear-gradient(180deg, color-mix(in srgb, var(--c) 9%, var(--panel)), var(--panel) 85%); box-shadow: inset 0 0 0 1px var(--line), inset 0 2px 0 color-mix(in srgb, var(--c) 70%, transparent); transition: box-shadow 0.2s, transform 0.2s; }
a.kpi:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px var(--line-2), inset 0 2px 0 var(--c), 0 12px 24px -16px rgba(0, 0, 0, 0.8); }
.kpi.is-blue { --c: var(--c-blue); }
.kpi.is-violet { --c: var(--c-violet); }
.kpi.is-amber { --c: var(--c-amber); }
.kpi__text { display: grid; gap: 4px; min-width: 0; }
.kpi__head { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 500; color: var(--ink-2); white-space: nowrap; }
.kpi__icon { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 6px; color: var(--c); background: color-mix(in srgb, var(--c) 15%, transparent); }
.kpi__value { margin-top: 4px; font-size: 26px; font-weight: 650; letter-spacing: -0.03em; line-height: 1.1; white-space: nowrap; font-variant-numeric: tabular-nums; }
.kpi__value small { margin-left: 5px; font-size: 12.5px; font-weight: 500; color: var(--ink-3); letter-spacing: 0; }
.kpi__foot { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; font-size: 12px; color: var(--ink-3); }
.kpi__foot--nowrap { flex-wrap: nowrap; white-space: nowrap; gap: 6px; }
.kpi__foot--nowrap .dot + * { margin: 0; }
.kpi__foot--nowrap .dot:not(:first-child) { margin-left: 6px; }
.up { color: var(--ok); font-weight: 600; }
.dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; }
.dot.is-ok { background: var(--ok); }
.dot.is-muted { background: var(--muted); }
.kpi__chart { width: 100%; height: 56px; align-self: end; }
.slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; align-self: center; height: 44px; }
.slots span { border-radius: 3px; background: rgba(160, 180, 215, 0.08); box-shadow: inset 0 0 0 1px var(--line); transform-origin: bottom; animation: grow 0.6s cubic-bezier(.2, .8, .2, 1) both; }
.slots span:nth-child(2) { animation-delay: 0.08s; }
.slots span:nth-child(3) { animation-delay: 0.16s; }
.slots span:nth-child(4) { animation-delay: 0.24s; }
.slots .is-ok { background: color-mix(in srgb, var(--c-violet) 55%, transparent); box-shadow: none; }
.slots .is-muted { background: rgba(160, 180, 215, 0.22); box-shadow: none; }
.slots .is-free { background: transparent; box-shadow: inset 0 0 0 1px var(--line-2); }
.gauge { position: relative; justify-self: end; width: 46px; height: 56px; border-radius: 6px; background: rgba(160, 180, 215, 0.1); overflow: hidden; }
.gauge span { position: absolute; inset: auto 0 0 0; height: var(--h); background: linear-gradient(180deg, color-mix(in srgb, var(--c-amber) 85%, white 0%), color-mix(in srgb, var(--c-amber) 55%, transparent)); transform-origin: bottom; animation: grow 0.9s cubic-bezier(.2, .8, .2, 1) 0.2s both; }
.gauge em { position: absolute; inset: 0; display: grid; place-items: center; font-style: normal; font-size: 11.5px; font-weight: 700; color: var(--ink); }

.tabs { display: flex; gap: 24px; border-bottom: 1px solid var(--line); overflow-x: auto; scrollbar-width: none; }
.tab { display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 2px; font-weight: 500; color: var(--ink-3) !important; white-space: nowrap; box-shadow: inset 0 -2px 0 transparent; }
.tab:hover { color: var(--ink) !important; }
.tab.is-on { color: var(--ink) !important; box-shadow: inset 0 -2px 0 var(--c-brand); }
.tab__count { min-width: 20px; padding: 0 6px; border-radius: 4px; font-size: 11.5px; font-weight: 600; text-align: center; color: var(--ink-2); background: var(--panel-2); }
.tab.is-on .tab__count { color: var(--c-brand); background: rgba(84, 186, 155, 0.14); }

/* Deux colonnes equilibrees. */
.grid { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; align-items: start; }
.main-col, .stack { display: grid; gap: 24px; }
.card { border-radius: 8px; background: var(--panel); box-shadow: inset 0 0 0 1px var(--line); overflow: hidden; }
.card__head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 14px 18px; border-bottom: 1px solid var(--line); background: var(--panel-2); }
.card__head--soft { background: linear-gradient(180deg, var(--panel-2), var(--panel)); }
.card__title { margin-right: auto; min-width: 0; }
.card__title h2 { margin: 0; font-size: 14.5px; font-weight: 600; letter-spacing: -0.01em; }
.card__title p { margin: 1px 0 0; font-size: 12.5px; color: var(--ink-3); }
.link { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 500; color: var(--c-brand); }
.count { min-width: 22px; height: 22px; padding: 0 7px; border-radius: 4px; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #2a1d05; background: var(--c-amber); }
.seg { display: inline-flex; padding: 2px; border-radius: 6px; background: var(--night); box-shadow: inset 0 0 0 1px var(--line-2); }
.seg__opt { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 4px; font-size: 13px; font-weight: 500; color: var(--ink-3) !important; }
.seg__opt span { font-size: 11.5px; color: var(--ink-3); }
.seg__opt.is-on { color: var(--ink) !important; background: var(--panel-3); box-shadow: inset 0 0 0 1px var(--line-2); }
.search { display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 10px; border-radius: 6px; color: var(--ink-3); background: var(--night); box-shadow: inset 0 0 0 1px var(--line-2); }
.search input { width: 130px; border: 0; outline: 0; background: none; color: var(--ink); font: inherit; }

/* Les lignes : un filet de couleur a gauche dit l'etat ; les gestes viennent au survol. */
.rows { display: grid; }
.row { position: relative; display: grid; grid-template-columns: minmax(150px, 1.5fr) minmax(104px, 0.9fr) minmax(120px, 1fr) minmax(92px, 0.8fr) minmax(80px, 0.7fr); align-items: center; gap: 16px; padding: 16px 20px; transition: background 0.15s; border-bottom: 1px solid var(--line); }
.row:last-child { border-bottom: 0; }
.row:not(.row--head)::before { content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 2px; border-radius: 0 2px 2px 0; background: transparent; }
.row.is-ok::before { background: var(--ok); }
.row.is-info::before { background: var(--c-blue); }
a.row:hover { background: rgba(160, 180, 215, 0.04); }
.row--head { padding-top: 9px; padding-bottom: 9px; font-size: 12px; font-weight: 500; color: var(--ink-3); background: rgba(0, 0, 0, 0.14); }
.cell-name { display: flex; align-items: center; gap: 12px; min-width: 0; }
.cell-name strong, .cell-two strong { display: block; font-weight: 600; }
.cell-name small, .cell-two small { display: block; font-size: 12.5px; color: var(--ink-3); }
.res { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 6px; color: var(--ink-2); background: var(--panel-2); box-shadow: inset 0 0 0 1px var(--line); }
.row.is-ok .res { color: var(--c-brand); background: rgba(84, 186, 155, 0.1); }
.row.is-info .res { color: var(--c-blue); background: rgba(111, 149, 216, 0.1); }
.cell-cpu { display: flex; align-items: center; gap: 10px; }
.cell-cpu small { font-size: 12.5px; color: var(--ink-2); white-space: nowrap; }
.cell-name > span:last-child, .cell-two { min-width: 0; }
.cell-name small, .cell-two small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cell-name small .mono { font-size: 11.5px; }
.spark { width: 56px; height: 22px; flex: none; }
.quick { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: flex; gap: 6px; padding: 4px; border-radius: 6px; background: var(--panel-3); box-shadow: inset 0 0 0 1px var(--line-2), 0 8px 20px -10px rgba(0, 0, 0, 0.7); opacity: 0; pointer-events: none; transition: opacity 0.12s; }
a.row:hover .quick, a.row:focus-within .quick { opacity: 1; pointer-events: auto; }
.quick__btn { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 4px; font-size: 12.5px; font-weight: 600; color: var(--ink) !important; }
.quick__btn:hover { background: rgba(160, 180, 215, 0.1); }
.quick__btn.is-icon { width: 28px; padding: 0; justify-content: center; }

/* La consommation par ressource. */
.split { display: grid; gap: 14px; padding: 16px 18px 18px; }
.split__bar { display: flex; gap: 2px; height: 10px; border-radius: 3px; overflow: hidden; }
.split__bar span { display: block; height: 100%; transform-origin: left; animation: growx 0.9s cubic-bezier(.2, .8, .2, 1) 0.35s both; }
.split__legend { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
.split__legend li { display: grid; grid-template-columns: auto 1fr; column-gap: 8px; align-items: center; padding: 10px 12px; border-radius: 6px; background: var(--panel-2); }
.split__legend i { grid-row: span 2; width: 8px; height: 28px; border-radius: 2px; }
.split__legend span { font-size: 12.5px; color: var(--ink-2); }
.split__legend strong { font-size: 15px; font-weight: 650; }
.split__legend small { grid-column: 2; font-size: 12px; color: var(--ink-3); }

/* A surveiller : fond ambre tres leger, une action par alerte. */
.card--watch { background: linear-gradient(180deg, rgba(209, 162, 74, 0.07), var(--panel) 60%); }
.watch { margin: 0; padding: 4px 18px 16px; list-style: none; display: grid; }
.watch li { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line); }
.watch li:last-child { border-bottom: 0; padding-bottom: 2px; }
.watch strong { display: block; font-size: 13.5px; font-weight: 600; }
.watch p { margin: 3px 0 10px; font-size: 13px; color: var(--ink-2); line-height: 1.5; }
.watch__icon { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; }
.watch__icon.is-amber { color: var(--c-amber); background: rgba(209, 162, 74, 0.15); }
.watch__icon.is-blue { color: var(--c-blue); background: rgba(111, 149, 216, 0.15); }

.feed { list-style: none; margin: 0; padding: 10px 18px 16px; display: grid; gap: 14px; }
.feed li { display: flex; gap: 12px; }
.feed strong { display: block; font-weight: 600; font-size: 13.5px; }
.feed small { font-size: 12.5px; color: var(--ink-3); }
.feed__icon { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; }
.feed__icon.is-brand { color: var(--c-brand); background: rgba(84, 186, 155, 0.12); }
.feed__icon.is-muted { color: var(--ink-2); background: rgba(150, 165, 190, 0.1); }
.feed__icon.is-violet { color: var(--c-violet); background: rgba(146, 132, 209, 0.14); }
.feed__icon.is-blue { color: var(--c-blue); background: rgba(111, 149, 216, 0.13); }

.card--access { display: grid; gap: 8px; padding: 16px 18px; background: linear-gradient(160deg, rgba(111, 149, 216, 0.1), var(--panel) 65%); }
.access__tag { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--ink); }
.access__tag svg { color: var(--c-blue); }
.card--access p { margin: 0; color: var(--ink-2); font-size: 13px; }
.access__row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }


/* ===== La vie : apparitions decalees, courbes qui se dessinent, barres qui poussent ===== */
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes grow { from { transform: scaleY(0); } to { transform: none; } }
@keyframes growx { from { transform: scaleX(0); } to { transform: none; } }
@keyframes draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
.hero, .kpi, .tabs, .grid { animation: rise 0.5s cubic-bezier(.2, .8, .2, 1) both; animation-delay: calc(var(--i, 0) * 70ms); }
.draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.1s cubic-bezier(.4, 0, .2, 1) 0.35s forwards; }
.draw--late { stroke-dasharray: 0.012 0.012; stroke-dashoffset: 0; animation: fade 0.8s ease 1.2s both; }
.area { animation: fade 0.8s ease 0.9s both; }
.chip.is-ok i { animation: beat 2.4s ease-in-out infinite; }
@keyframes beat { 0%, 100% { box-shadow: 0 0 0 0 rgba(92, 191, 138, 0.45); } 50% { box-shadow: 0 0 0 4px rgba(92, 191, 138, 0); } }
/* Une capture figee (?fige) : l'etat final, sans animation. */
.is-still .hero, .is-still .kpi, .is-still .tabs, .is-still .grid, .is-still .slots span, .is-still .gauge span, .is-still .split__bar span, .is-still .area, .is-still .chip i { animation: none !important; }
.is-still .draw { animation: none !important; stroke-dashoffset: 0; }
@media (prefers-reduced-motion: reduce) {
  .hero, .kpi, .tabs, .grid, .slots span, .gauge span, .split__bar span, .area { animation: none !important; }
  .draw { animation: none !important; stroke-dashoffset: 0; }
  .chip i { animation: none !important; }
}

@media (max-width: 1320px) {
  .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid { grid-template-columns: minmax(0, 1fr); }
  .stack { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); align-items: start; }
}
@media (max-width: 960px) {
  .mk { grid-template-columns: minmax(0, 1fr); }
  .side { position: fixed; z-index: 20; left: 0; width: 260px; transform: translateX(-100%); transition: transform 0.2s; }
  .is-nav-open .side { transform: none; }
  .top__burger { display: grid; place-items: center; width: 32px; height: 32px; color: #e6e6e6; }
  .row { grid-template-columns: minmax(180px, 1.5fr) minmax(110px, 1fr) minmax(90px, 0.8fr); }
  .row > :nth-child(3), .row > :nth-child(4) { display: none; }
  .split__legend { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .page { padding: 20px 16px 40px; gap: 20px; }
  .hero h1 { font-size: 22px; }
  .hero__actions { width: 100%; flex-direction: column-reverse; }
  .hero__actions .btn { width: 100%; justify-content: center; height: 40px; }
  .kpis { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .kpi__value { font-size: 24px; }
  .card__head { padding: 12px 14px; }
  .seg { order: 3; width: 100%; overflow-x: auto; scrollbar-width: none; }
  .search { display: none; }
  .row { grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 12px 14px; }
  .row > :nth-child(5), .row--head { display: none; }
  .quick { display: none; }
  .stack { grid-template-columns: minmax(0, 1fr); }
}
</style>
