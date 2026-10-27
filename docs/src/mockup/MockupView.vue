<script setup>
import { computed, ref } from 'vue'
import Icon from './Icon.vue'

/*
 * LA MAQUETTE v3 (2026-10-27), d'apres les references de Kevin (Memberset,
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
// La flotte reagit : filtres, recherche, marche/arret, tiroir de detail.
const fleet = ref(instances.map((i) => ({ ...i })))
const query = ref('')
const isOn = (i) => i.tone === 'ok'
const isOff = (i) => i.tone === 'muted'
const filters = computed(() => [
  { id: 'all', label: 'Toutes', count: fleet.value.length },
  { id: 'on', label: 'En marche', count: fleet.value.filter(isOn).length },
  { id: 'off', label: 'Arrêtées', count: fleet.value.filter(isOff).length },
])
const shown = computed(() => fleet.value.filter((i) =>
  (filter.value === 'all' || (filter.value === 'on' ? isOn(i) : isOff(i))) &&
  i.name.includes(query.value.trim().toLowerCase())))
const selected = ref(null)
const toast = ref('')
let toastTimer
const notify = (text) => { toast.value = text; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.value = '' }, 2600) }
const toggle = (i) => {
  if (i.tone === 'info') return
  const on = isOn(i)
  i.tone = on ? 'muted' : 'ok'
  i.state = on ? 'Arrêtée' : 'En marche'
  notify(`${i.name} ${on ? 'arrêtée' : 'démarrée'}`)
}
const copy = (text) => { navigator.clipboard?.writeText(text).catch(() => {}); notify(`${text} copiée`) }
const gaugesOf = (i) => isOn(i)
  ? [{ label: 'Processeur', value: i.cpu.at(-1), tone: 'teal' }, { label: 'Mémoire', value: 46, tone: 'blue' }, { label: 'Disque', value: 38, tone: 'violet' }]
  : [{ label: 'Processeur', value: 0, tone: 'teal' }, { label: 'Mémoire', value: 0, tone: 'blue' }, { label: 'Disque', value: i.tone === 'info' ? 2 : 61, tone: 'violet' }]
const showNotice = ref(true)

// Les vagues de fond : des lignes de niveau qui derivent lentement.
const contour = (k) => {
  const base = 70 + k * 46
  const amp = 16 + k * 5
  const pts = []
  for (let x = 0; x <= 2400; x += 30) pts.push(`${x},${(base + amp * Math.sin((x / 600) * Math.PI * 2 + k * 0.9)).toFixed(1)}`)
  return `M${pts.join(' L')}`
}

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
// Consommation par jour d'octobre : calcul + stockage, en euros.
const days = Array.from({ length: 27 }, (_, i) => {
  const compute = i < 20 ? 0.32 + ((i * 7) % 5) * 0.03 : 0.62 + ((i * 3) % 4) * 0.04
  const storage = i < 12 ? 0.08 : 0.15
  return { day: i + 1, compute, storage }
})
const months = ['nov.', 'déc.', 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.']
const year = [6.1, 6.8, 7.2, 7.9, 8.6, 9.1, 9.8, 10.9, 11.7, 12.8, 14.6, 15.4].map((c, i) => ({ c, s: i < 11 ? 2 + i * 0.2 : 3.02 }))
const period = ref('month')
const fmt = (v) => `${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
const chart = computed(() => {
  if (period.value === 'year') return year.map((m, i) => ({ key: i, label: months[i], tip: months[i], c: m.c, s: m.s }))
  const list = period.value === 'week' ? days.slice(-7) : days
  return list.map((d) => ({ key: d.day, label: String(d.day), tip: `${d.day} oct.`, c: d.compute, s: d.storage }))
})
const chartMax = computed(() => (period.value === 'year' ? 20 : 1))
const hover = ref(null)
const focused = computed(() => chart.value[hover.value ?? chart.value.length - 1])
const focusIndex = computed(() => hover.value ?? chart.value.length - 1)
const sums = computed(() => {
  const totals = chart.value.map((b) => b.c + b.s)
  const best = totals.indexOf(Math.max(...totals))
  return { total: totals.reduce((a, b) => a + b, 0), mean: totals.reduce((a, b) => a + b, 0) / totals.length, best: totals[best], bestLabel: chart.value[best].tip }
})
const axis = computed(() => {
  const c = chart.value
  return period.value === 'month' ? ['1 oct.', '8', '15', '22', '27'] : [c[0].tip, c[Math.floor(c.length / 2)].tip, c.at(-1).tip]
})
const periodTitle = computed(() => ({ week: '7 derniers jours', month: 'Consommation d’octobre', year: '12 derniers mois' })[period.value])

// L'estimateur : gabarit + heures par jour -> heure ou mois ?
const flavors = [
  { id: 'B2', size: '2 vCPU · 4 Go · 50 Go', hour: 0.0246, month: 8.99 },
  { id: 'B4', size: '4 vCPU · 8 Go · 100 Go', hour: 0.0493, month: 17.99 },
  { id: 'B8', size: '8 vCPU · 16 Go · 200 Go', hour: 0.0986, month: 35.99 },
]
const flavorId = ref('B2')
const hours = ref(8)
const flavor = computed(() => flavors.find((f) => f.id === flavorId.value))
const hourly = computed(() => flavor.value.hour * hours.value * 30)
const hourlyWins = computed(() => hourly.value <= flavor.value.month)
const breakeven = computed(() => Math.ceil(flavor.value.month / (flavor.value.hour * 30)))
const periods = [{ id: 'week', label: '7 jours' }, { id: 'month', label: 'Mois' }, { id: 'year', label: '12 mois' }]
const volumes = [
  { name: 'data-web', to: 'web-1', size: '50 Go', used: 64, tone: 'teal' },
  { name: 'backup', to: 'non rattaché', size: '100 Go', used: 22, tone: 'blue' },
]
const network = [
  { icon: 'globe', title: '51.75.12.40', sub: 'IP publique · web-1', tone: 'teal' },
  { icon: 'network', title: 'lan-prod', sub: '10.0.0.0/24 · 2 instances', tone: 'blue' },
  { icon: 'shield', title: 'Pare-feu « web »', sub: '3 règles · 2 instances', tone: 'violet' },
]
const quotas = [
  { label: 'vCPU', used: 8, max: 20, unit: '', tone: 'teal' },
  { label: 'Mémoire', used: 16, max: 40, unit: ' Go', tone: 'blue' },
  { label: 'Stockage', used: 250, max: 1000, unit: ' Go', tone: 'violet' },
  { label: 'IP publiques', used: 1, max: 5, unit: '', tone: 'teal' },
]
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
        <svg class="page__bg" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true">
          <g class="bg-drift bg-drift--a"><path v-for="k in [0, 2, 4]" :key="k" :d="contour(k)" /></g>
          <g class="bg-drift bg-drift--b"><path v-for="k in [1, 3, 5]" :key="k" :d="contour(k)" /></g>
        </svg>

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
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#54ba9b" stop-opacity="0.16" /><stop offset="1" stop-color="#54ba9b" stop-opacity="0" /></linearGradient></defs>
              <path :d="`${line(usage)} L100,36 L0,36 Z`" fill="url(#g1)" />
              <path :d="line(usage)" fill="none" stroke="#54ba9b" stroke-width="1.5" vector-effect="non-scaling-stroke" />
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

        <div v-if="showNotice" class="notice">
          <span class="notice__icon"><Icon name="alert" size="16" /></span>
          <p><strong>Maintenance à Toulouse le 3 novembre, de 2 h à 4 h.</strong> Vos instances restent en marche ; la console Horizon sera indisponible.</p>
          <a href="#" class="link">En savoir plus</a>
          <button class="icon-btn" aria-label="Masquer" @click="showNotice = false"><Icon name="x" size="15" /></button>
        </div>

        <nav class="tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" role="tab" class="tab" :class="{ 'is-on': tab === t.id }" :aria-selected="tab === t.id" @click="tab = t.id">
            {{ t.label }}<span v-if="t.count" class="tab__count">{{ t.count }}</span>
          </button>
        </nav>

        <div class="grid">
          <div class="stack">
          <section class="card">
            <header class="card__head">
              <h2>Instances</h2>
              <div class="seg">
                <button v-for="f in filters" :key="f.id" class="seg__opt" :class="{ 'is-on': filter === f.id }" @click="filter = f.id">{{ f.label }}<span>{{ f.count }}</span></button>
              </div>
              <label class="search"><Icon name="search" size="15" /><input v-model="query" placeholder="Rechercher" /></label>
            </header>
            <div class="rows">
              <div class="row row--head"><span>Instance</span><span>État</span><span>Gabarit</span><span>Activité</span><span class="r">Coût</span><span /></div>
              <div v-for="i in shown" :key="i.name" class="row" tabindex="0" @click="selected = i" @keydown.enter="selected = i">
                <span class="cell-name">
                  <span class="res" :class="`is-${i.tone}`"><Icon name="server" size="17" /></span>
                  <span><strong>{{ i.name }}</strong><small>{{ i.sub }}</small></span>
                </span>
                <span><span class="chip" :class="`is-${i.tone}`"><i />{{ i.state }}</span></span>
                <span class="cell-two"><strong>{{ i.flavor }}</strong><small>{{ i.size }}</small></span>
                <span>
                  <svg v-if="i.cpu.length" class="spark" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true"><path :d="line(i.cpu)" fill="none" :stroke="i.tone === 'ok' ? '#54ba9b' : '#4b5567'" stroke-width="1.6" vector-effect="non-scaling-stroke" /></svg>
                  <small v-else class="dim">—</small>
                </span>
                <span class="cell-two r"><strong>{{ i.cost }}</strong><small>{{ i.per }}</small></span>
                <span class="quick">
                  <button v-if="i.tone !== 'info'" class="icon-btn" :aria-label="i.tone === 'ok' ? 'Arrêter' : 'Démarrer'" :title="i.tone === 'ok' ? 'Arrêter' : 'Démarrer'" @click.stop="toggle(i)"><Icon :name="i.tone === 'ok' ? 'power' : 'play'" size="15" /></button>
                  <button class="icon-btn" aria-label="Console" title="Console" @click.stop="notify(`Console de ${i.name} ouverte`)"><Icon name="terminal" size="15" /></button>
                </span>
              </div>
              <div v-if="!shown.length" class="empty"><Icon name="search" size="18" />Aucune instance ne correspond à « {{ query }} ».</div>
            </div>
          </section>

          <section class="card">
            <header class="card__head">
              <h2>{{ periodTitle }}</h2>
              <div class="legend"><span><i class="is-teal" />Calcul</span><span><i class="is-blue" />Stockage</span></div>
              <div class="seg">
                <button v-for="p in periods" :key="p.id" class="seg__opt" :class="{ 'is-on': period === p.id }" @click="period = p.id">{{ p.label }}</button>
              </div>
            </header>
            <div class="usage">
              <div class="usage__sum">
                <div><small>Total</small><strong>{{ fmt(sums.total) }}</strong></div>
                <div><small>Moyenne par {{ period === 'year' ? 'mois' : 'jour' }}</small><strong>{{ fmt(sums.mean) }}</strong></div>
                <div><small>Le plus cher</small><strong>{{ fmt(sums.best) }} <em>{{ sums.bestLabel }}</em></strong></div>
              </div>
              <div class="bars" @mouseleave="hover = null">
                <div class="bars__grid"><span>{{ fmt(chartMax) }}</span><span>{{ fmt(chartMax / 2) }}</span><span>0</span></div>
                <div class="bars__cols" :class="`is-${period}`">
                  <div v-for="(d, n) in chart" :key="`${period}-${d.key}`" class="bar" :class="{ 'is-focus': n === focusIndex }" :style="{ '--d': `${n * 18}ms` }" @mouseenter="hover = n">
                    <span class="bar__s" :style="{ height: `${(d.s / chartMax) * 100}%` }" />
                    <span class="bar__c" :style="{ height: `${(d.c / chartMax) * 100}%` }" />
                    <span v-if="n === focusIndex" class="bar__tip" :class="{ 'is-left': n > chart.length / 2 }">
                      <strong>{{ d.tip }}</strong>
                      <span><i class="is-teal" />Calcul {{ fmt(d.c) }}</span>
                      <span><i class="is-blue" />Stockage {{ fmt(d.s) }}</span>
                    </span>
                  </div>
                </div>
                <div class="bars__axis"><span v-for="t in axis" :key="t">{{ t }}</span></div>
              </div>
            </div>
          </section>

          <div class="pair">
            <section class="card card--pad">
              <header class="card__head card__head--plain"><h2>Volumes</h2><a href="#" class="link">Créer un volume</a></header>
              <ul class="vols">
                <li v-for="v in volumes" :key="v.name">
                  <span class="res" :class="`is-${v.tone}`"><Icon name="disk" size="16" /></span>
                  <span class="vols__main">
                    <span class="vols__top"><strong>{{ v.name }}</strong><small>{{ v.size }}</small></span>
                    <span class="meter"><span :class="`is-${v.tone}`" :style="{ width: `${v.used}%` }" /></span>
                    <small>{{ v.used }} % utilisés · {{ v.to }}</small>
                  </span>
                </li>
              </ul>
            </section>
            <section class="card card--pad">
              <header class="card__head card__head--plain"><h2>Réseau</h2><a href="#" class="link">Gérer</a></header>
              <ul class="net">
                <li v-for="n in network" :key="n.title">
                  <span class="feed__icon" :class="`is-${n.tone}`"><Icon :name="n.icon" size="15" /></span>
                  <span><strong>{{ n.title }}</strong><small>{{ n.sub }}</small></span>
                  <span class="net__go"><Icon name="chevronRight" size="14" /></span>
                </li>
              </ul>
            </section>
          </div>
          </div>

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
            <section class="card card--pad">
              <header class="card__head card__head--plain"><h2>Estimer une instance</h2></header>
              <div class="est">
                <div class="seg seg--full">
                  <button v-for="f in flavors" :key="f.id" class="seg__opt" :class="{ 'is-on': flavorId === f.id }" @click="flavorId = f.id">{{ f.id }}</button>
                </div>
                <small class="dim">{{ flavor.size }}</small>
                <label class="range">
                  <span>Allumée <strong>{{ hours }} h</strong> par jour</span>
                  <input v-model.number="hours" type="range" min="1" max="24" :style="{ '--p': `${((hours - 1) / 23) * 100}%` }" />
                </label>
                <div class="est__out">
                  <div :class="{ 'is-best': hourlyWins }"><small>À l’heure</small><strong>{{ fmt(hourly) }}</strong><small>par mois</small></div>
                  <div :class="{ 'is-best': !hourlyWins }"><small>Au mois</small><strong>{{ fmt(flavor.month) }}</strong><small>forfait</small></div>
                </div>
                <p class="est__tip"><Icon name="sparkles" size="14" />
                  <template v-if="hourlyWins">À {{ hours }} h par jour, l’heure revient moins cher. Le mois devient rentable à partir de {{ breakeven }} h.</template>
                  <template v-else>Au mois, vous économisez {{ fmt(hourly - flavor.month) }} chaque mois.</template>
                </p>
              </div>
            </section>
            <section class="card card--pad">
              <header class="card__head card__head--plain"><h2>Quotas du projet</h2><a href="#" class="link">Augmenter</a></header>
              <ul class="quotas">
                <li v-for="q in quotas" :key="q.label">
                  <span class="quotas__top"><span>{{ q.label }}</span><small><strong>{{ q.used }}</strong> / {{ q.max }}{{ q.unit }}</small></span>
                  <span class="meter"><span :class="`is-${q.tone}`" :style="{ width: `${(q.used / q.max) * 100}%` }" /></span>
                </li>
              </ul>
            </section>
            <section class="card card--promo">
              <div class="promo__tag"><Icon name="shield" size="14" />Vos données restent en Europe</div>
              <h3>Pilotez ce projet avec vos outils</h3>
              <p>OpenStack, Terraform ou l’API Adion : vos accès sont prêts.</p>
              <div class="promo__row">
                <button class="btn is-soft"><Icon name="copy" />clouds.yaml</button>
                <button class="btn is-soft"><Icon name="key" />Clés d’API</button>
              </div>
              <!-- Deux vagues qui ondulent lentement (coupees si l'on reduit les animations). -->
              <svg class="waves" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">
                <path class="wave wave--a" d="M0 44 C 50 30, 100 58, 150 44 S 250 30, 300 44 S 400 58, 450 44 S 550 30, 600 44 S 700 58, 750 44 S 850 30, 900 44 V 80 H 0 Z" />
                <path class="wave wave--b" d="M0 54 C 60 42, 120 66, 180 54 S 300 42, 360 54 S 480 66, 540 54 S 660 42, 720 54 S 840 66, 900 54 V 80 H 0 Z" />
              </svg>
            </section>
          </aside>
        </div>
      </main>
    </div>

    <transition name="drawer">
      <div v-if="selected" class="drawer-wrap" @click.self="selected = null" @keydown.esc="selected = null">
        <aside class="drawer" role="dialog" :aria-label="selected.name">
          <header class="drawer__head">
            <span class="res" :class="`is-${selected.tone}`"><Icon name="server" size="18" /></span>
            <div><h2>{{ selected.name }}</h2><small>{{ selected.sub }}</small></div>
            <button class="icon-btn" aria-label="Fermer" @click="selected = null"><Icon name="x" size="16" /></button>
          </header>
          <div class="drawer__body">
            <span class="chip" :class="`is-${selected.tone}`"><i />{{ selected.state }}</span>
            <div class="gauges">
              <div v-for="g in gaugesOf(selected)" :key="g.label" class="gauge">
                <svg viewBox="0 0 44 44" aria-hidden="true">
                  <circle cx="22" cy="22" r="18" class="gauge__track" />
                  <circle cx="22" cy="22" r="18" class="gauge__value" :class="`is-${g.tone}`" :stroke-dasharray="`${(g.value / 100) * 113.1} 113.1`" />
                </svg>
                <strong>{{ g.value }} %</strong>
                <small>{{ g.label }}</small>
              </div>
            </div>
            <dl class="facts">
              <div><dt>Adresse IP</dt><dd>{{ selected.ip }}<button v-if="selected.tone !== 'info'" class="icon-btn icon-btn--sm" aria-label="Copier" @click="copy(selected.ip)"><Icon name="copy" size="13" /></button></dd></div>
              <div><dt>Gabarit</dt><dd>{{ selected.flavor }} · {{ selected.size }}</dd></div>
              <div><dt>Coût</dt><dd>{{ selected.cost }} {{ selected.per }}</dd></div>
              <div><dt>Région</dt><dd>Toulouse</dd></div>
            </dl>
            <div v-if="selected.cpu.length" class="drawer__chart">
              <small>Processeur, dernière heure</small>
              <svg viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
                <path :d="`${line(selected.cpu)} L100,36 L0,36 Z`" fill="url(#g1)" />
                <path :d="line(selected.cpu)" fill="none" stroke="#54ba9b" stroke-width="1.5" vector-effect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
          <footer class="drawer__foot">
            <button class="btn is-ghost" @click="notify(`Console de ${selected.name} ouverte`)"><Icon name="terminal" />Console</button>
            <button v-if="selected.tone !== 'info'" class="btn is-primary" @click="toggle(selected)"><Icon :name="selected.tone === 'ok' ? 'power' : 'play'" />{{ selected.tone === 'ok' ? 'Arrêter' : 'Démarrer' }}</button>
          </footer>
        </aside>
      </div>
    </transition>

    <transition name="toast">
      <div v-if="toast" class="toast" role="status"><Icon name="check" size="15" />{{ toast }}</div>
    </transition>
  </div>
</template>

<style scoped>
/*
 * v3 (Kevin : « pas de fluo », « pas fan des border radius », « c'est pas
 * qualite ») : le vert d'Adion tel quel, sans lueur ni halo ; des arrondis de
 * 4 a 8 px ; Inter ; des filets precis ; des teintes de categorie
 * desaturees ; la profondeur bleu nuit des references.
 */
.mk {
  --night: #0c1018;
  --panel: #121823;
  --panel-2: #182131;
  --line: rgba(160, 180, 215, 0.1);
  --line-2: rgba(160, 180, 215, 0.18);
  --ink: #eef2f7;
  --ink-2: #aab4c4;
  --ink-3: #7b8699;
  --brand: #54ba9b;
  --brand-ink: #062019;
  --blue: #7b9fdc;
  --violet: #9b8fd6;
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
.page { position: relative; isolation: isolate; display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; max-width: 1360px; width: 100%; padding: 32px 40px 72px; background: linear-gradient(180deg, #111827 0, var(--night) 380px); }
.page > * { min-width: 0; }
.hero, .hero__row, .card, .stack, .kpi { min-width: 0; }

.hero__crumbs { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; font-size: 13px; color: var(--ink-3); }
.hero__crumbs a:hover { color: var(--ink); }
.hero__row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.hero__mark { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 8px; color: var(--brand); background: rgba(84, 186, 155, 0.1); box-shadow: inset 0 0 0 1px rgba(84, 186, 155, 0.26); }
.hero__text { flex: 1; min-width: 220px; }
.hero__title { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.hero h1 { margin: 0; font-size: 26px; font-weight: 650; letter-spacing: -0.022em; line-height: 1.2; }
.hero p { margin: 4px 0 0; color: var(--ink-2); font-size: 14px; }
.hero__actions { display: flex; gap: 8px; flex-wrap: wrap; }

.btn { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 6px; font-weight: 600; font-size: 13.5px; white-space: nowrap; transition: background 0.15s, box-shadow 0.15s; }
.btn.is-primary { color: var(--brand-ink); background: var(--brand); }
.btn.is-primary:hover { background: #61c3a5; }
.btn.is-ghost { color: var(--ink); background: var(--panel); box-shadow: inset 0 0 0 1px var(--line-2); }
.btn.is-ghost:hover { background: var(--panel-2); }
.btn.is-soft { height: 32px; padding: 0 12px; font-size: 13px; background: var(--panel-2); box-shadow: inset 0 0 0 1px var(--line-2); }

.chip { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 8px; border-radius: 4px; font-size: 12px; font-weight: 600; white-space: nowrap; }
.chip i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.chip.is-ok { color: var(--ok); background: rgba(92, 191, 138, 0.12); }
.chip.is-info { color: var(--blue); background: rgba(123, 159, 220, 0.13); }
.chip.is-info i { animation: pulse 1.4s ease-in-out infinite; }
.chip.is-muted { color: var(--ink-2); background: rgba(150, 165, 190, 0.1); }
@keyframes pulse { 50% { opacity: 0.3; } }

.kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; border-radius: 8px; overflow: hidden; background: var(--line); box-shadow: 0 0 0 1px var(--line); }
.kpi { display: grid; align-content: start; gap: 6px; padding: 20px 22px; background: var(--panel); }
.kpi--wide { background: linear-gradient(135deg, #15283a 0%, #142233 45%, var(--panel) 100%); }
.kpi__head { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: var(--ink-2); }
.kpi__icon { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 6px; }
.kpi__icon.is-teal { color: var(--brand); background: rgba(84, 186, 155, 0.12); }
.kpi__icon.is-blue { color: var(--blue); background: rgba(123, 159, 220, 0.12); }
.kpi__icon.is-violet { color: var(--violet); background: rgba(155, 143, 214, 0.13); }
.kpi__value { margin-top: 6px; font-size: 30px; font-weight: 650; letter-spacing: -0.03em; line-height: 1.1; }
.kpi__value small { margin-left: 5px; font-size: 13px; font-weight: 500; color: var(--ink-3); letter-spacing: 0; }
.kpi__value--sm { font-size: 30px; margin-top: 6px; }
.kpi__foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12.5px; color: var(--ink-3); }
.up { color: var(--ok); font-weight: 600; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.dot.is-ok { background: var(--ok); }
.dot.is-muted { background: var(--muted); }
.kpi__chart { width: 100%; height: 34px; margin-top: 4px; }
.kpi--ring { grid-template-columns: 1fr; }
.kpi--ring > div { display: grid; gap: 6px; }
.ring { display: none; }
.kpi--ring::after { content: ''; display: block; height: 4px; margin-top: 12px; border-radius: 2px; background: linear-gradient(90deg, var(--brand) 37%, var(--panel-2) 37%); }

.tabs { display: flex; gap: 24px; border-bottom: 1px solid var(--line); overflow-x: auto; scrollbar-width: none; }
.tab { display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 2px; font-weight: 500; color: var(--ink-3) !important; white-space: nowrap; box-shadow: inset 0 -2px 0 transparent; }
.tab:hover { color: var(--ink) !important; }
.tab.is-on { color: var(--ink) !important; box-shadow: inset 0 -2px 0 var(--brand); }
.tab__count { min-width: 20px; padding: 0 6px; border-radius: 4px; font-size: 11.5px; font-weight: 600; text-align: center; color: var(--ink-2); background: var(--panel-2); }

.grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 24px; align-items: start; }
.stack { display: grid; gap: 24px; }
.card { border-radius: 8px; background: var(--panel); box-shadow: 0 0 0 1px var(--line); overflow: hidden; }
.card--pad { padding-bottom: 8px; }
.card__head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid var(--line); }
.card__head h2 { margin: 0 auto 0 0; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.card__head--plain { border-bottom: 0; padding-bottom: 4px; }
.link { font-size: 13px; font-weight: 500; color: var(--brand); }
.seg { display: inline-flex; padding: 2px; border-radius: 6px; background: var(--night); box-shadow: inset 0 0 0 1px var(--line-2); }
.seg__opt { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 4px; font-size: 13px; font-weight: 500; color: var(--ink-3) !important; }
.seg__opt span { font-size: 11.5px; color: var(--ink-3); }
.seg__opt.is-on { color: var(--ink) !important; background: var(--panel-2); box-shadow: inset 0 0 0 1px var(--line-2); }
.search { display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 10px; border-radius: 6px; color: var(--ink-3); background: var(--night); box-shadow: inset 0 0 0 1px var(--line-2); }
.search input { width: 150px; border: 0; outline: 0; background: none; color: var(--ink); font: inherit; }

.rows { display: grid; }
.row { display: grid; grid-template-columns: minmax(150px, 1.5fr) minmax(110px, 1fr) minmax(130px, 1.1fr) minmax(70px, 0.8fr) minmax(80px, 0.8fr) 64px; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--line); }
.row:last-child { border-bottom: 0; }
.row[tabindex] { cursor: pointer; transition: background 0.15s; }
.row[tabindex]:hover, .row[tabindex]:focus-visible { background: rgba(255, 255, 255, 0.03); outline: 0; }
.quick { display: flex; justify-content: flex-end; gap: 2px; opacity: 0.35; transition: opacity 0.15s; }
.row:hover .quick, .row:focus-within .quick { opacity: 1; }
.empty { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 28px 20px; color: var(--ink-3); }
.row--head { padding-top: 10px; padding-bottom: 10px; font-size: 12px; font-weight: 500; color: var(--ink-3); background: rgba(0, 0, 0, 0.14); }
.cell-name { display: flex; align-items: center; gap: 12px; min-width: 0; }
.cell-name strong, .cell-two strong { display: block; font-weight: 600; }
.cell-name small, .cell-two small { display: block; font-size: 12.5px; color: var(--ink-3); }
.cell-two { min-width: 0; }
.cell-two small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.res { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 6px; box-shadow: inset 0 0 0 1px var(--line); }
.res.is-ok { color: var(--brand); background: rgba(84, 186, 155, 0.08); }
.res.is-muted { color: var(--ink-3); background: rgba(150, 165, 190, 0.06); }
.res.is-info { color: var(--blue); background: rgba(123, 159, 220, 0.08); }
.spark { width: 100%; max-width: 100px; height: 24px; }
.dim { color: var(--ink-3); }
.more { display: grid; place-items: center; color: var(--ink-3); }

.feed { list-style: none; margin: 0; padding: 4px 20px 14px; display: grid; gap: 14px; }
.feed li { display: flex; gap: 12px; }
.feed strong { display: block; font-weight: 600; font-size: 13.5px; }
.feed small { font-size: 12.5px; color: var(--ink-3); }
.feed__icon { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; }
.feed__icon.is-brand { color: var(--brand); background: rgba(84, 186, 155, 0.12); }
.feed__icon.is-muted { color: var(--ink-2); background: rgba(150, 165, 190, 0.1); }
.feed__icon.is-violet { color: var(--violet); background: rgba(155, 143, 214, 0.13); }
.feed__icon.is-blue { color: var(--blue); background: rgba(123, 159, 220, 0.12); }
.card--promo { position: relative; display: grid; gap: 8px; padding: 20px 20px 64px; background: linear-gradient(150deg, #19284a 0%, #14243a 45%, #11302d 100%); overflow: hidden; }
.card--promo > :not(.waves) { position: relative; z-index: 1; }
.waves { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 72px; overflow: visible; }
.wave { will-change: transform; }
.wave--a { fill: rgba(84, 186, 155, 0.16); animation: drift 14s linear infinite; }
.wave--b { fill: rgba(111, 149, 216, 0.14); animation: drift-b 22s linear infinite; }
@keyframes drift { from { transform: translateX(0); } to { transform: translateX(-300px); } }
@keyframes drift-b { from { transform: translateX(-360px); } to { transform: translateX(0); } }
@media (prefers-reduced-motion: reduce) { .wave { animation: none; } }
.card--promo h3 { margin: 4px 0 0; font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.card--promo p { margin: 0; color: var(--ink-2); font-size: 13.5px; }
.promo__tag { display: inline-flex; align-items: center; gap: 6px; width: max-content; font-size: 12px; font-weight: 600; color: var(--brand); }
.promo__row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }

/* ===== Elements ajoutes (bandeau, consommation, volumes, reseau, quotas) ===== */
.notice { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px 16px; border-radius: 8px; background: linear-gradient(90deg, rgba(123, 159, 220, 0.12), rgba(123, 159, 220, 0.04)); box-shadow: inset 0 0 0 1px rgba(123, 159, 220, 0.22); }
.notice__icon { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; color: var(--blue); background: rgba(123, 159, 220, 0.14); }
.notice p { flex: 1; min-width: 220px; margin: 0; font-size: 13.5px; color: var(--ink-2); }
.notice strong { color: var(--ink); font-weight: 600; }
.legend { display: flex; gap: 14px; font-size: 12.5px; color: var(--ink-3); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend i { width: 8px; height: 8px; border-radius: 2px; }
.legend .is-teal { background: var(--brand); }
.legend .is-blue { background: var(--blue); }
.usage { display: grid; gap: 18px; padding: 18px 20px 16px; }
.usage__sum { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.usage__sum small { display: block; font-size: 12px; color: var(--ink-3); }
.usage__sum strong { font-size: 20px; font-weight: 650; letter-spacing: -0.02em; }
.usage__sum em { font-style: normal; font-size: 12.5px; font-weight: 500; color: var(--ink-3); }
.bars { position: relative; display: grid; grid-template-columns: 44px minmax(0, 1fr); grid-template-rows: 150px auto; column-gap: 8px; row-gap: 6px; }
.bars__grid { display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; color: var(--ink-3); text-align: right; margin: -6px 0; }
.bars__cols { position: relative; display: flex; align-items: flex-end; gap: 4px; background: repeating-linear-gradient(180deg, var(--line) 0 1px, transparent 1px 75px); border-bottom: 1px solid var(--line-2); }
.bar { position: relative; flex: 1; height: 100%; display: flex; flex-direction: column-reverse; gap: 1px; }
.bar__c, .bar__s { display: block; transition: filter 0.15s; }
.bar__c { border-radius: 2px 2px 0 0; background: rgba(84, 186, 155, 0.55); }
.bar__s { background: rgba(123, 159, 220, 0.5); }
.bar:hover .bar__c, .bar:hover .bar__s { filter: brightness(1.35); }
.bar.is-today .bar__c { background: var(--brand); }
.bar.is-today .bar__s { background: var(--blue); }
.bar__tip { position: absolute; top: -4px; right: calc(100% + 8px); z-index: 2; display: grid; padding: 6px 10px; border-radius: 6px; white-space: nowrap; font-size: 12px; color: var(--ink-2); background: #1c2638; box-shadow: 0 0 0 1px var(--line-2), 0 8px 24px rgba(0, 0, 0, 0.35); }
.bar__tip strong { color: var(--ink); font-weight: 600; }
.bars__axis { grid-column: 2; display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-3); }
.pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.vols, .net, .quotas { list-style: none; margin: 0; padding: 6px 20px 14px; display: grid; gap: 16px; }
.vols li { display: flex; gap: 12px; align-items: flex-start; }
.vols__main { flex: 1; display: grid; gap: 6px; min-width: 0; }
.vols__top, .quotas__top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.vols strong { font-weight: 600; }
.vols small, .quotas small { font-size: 12.5px; color: var(--ink-3); }
.quotas__top span { font-size: 13.5px; font-weight: 500; }
.quotas strong { color: var(--ink); font-weight: 600; }
.quotas li { display: grid; gap: 7px; }
.res.is-teal { color: var(--brand); background: rgba(84, 186, 155, 0.08); }
.res.is-blue { color: var(--blue); background: rgba(123, 159, 220, 0.08); }
.meter { display: block; height: 6px; border-radius: 3px; background: var(--panel-2); overflow: hidden; }
.meter span { display: block; height: 100%; border-radius: 3px; }
.meter .is-teal { background: linear-gradient(90deg, #3f9d82, var(--brand)); }
.meter .is-blue { background: linear-gradient(90deg, #5b80c0, var(--blue)); }
.meter .is-violet { background: linear-gradient(90deg, #7a6fbb, var(--violet)); }
.net li { display: flex; align-items: center; gap: 12px; }
.net li > span:nth-child(2) { flex: 1; min-width: 0; }
.net strong { display: block; font-weight: 600; font-size: 13.5px; }
.net small { font-size: 12.5px; color: var(--ink-3); }
.net__go { display: grid; color: var(--ink-3); }
.feed__icon.is-teal { color: var(--brand); background: rgba(84, 186, 155, 0.12); }

/* ===== Fond, widgets et interactions ===== */
.page__bg { position: absolute; z-index: -1; top: 0; left: 0; width: 100%; height: 440px; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, #000 45%, transparent); mask-image: linear-gradient(180deg, #000 45%, transparent); }
.page__bg path { fill: none; stroke-width: 1; vector-effect: non-scaling-stroke; }
.bg-drift--a path { stroke: rgba(84, 186, 155, 0.22); }
.bg-drift--b path { stroke: rgba(123, 159, 220, 0.18); }
.bg-drift--a { animation: bg-a 70s linear infinite; }
.bg-drift--b { animation: bg-b 95s linear infinite; }
@keyframes bg-a { to { transform: translateX(-1200px); } }
@keyframes bg-b { from { transform: translateX(-1200px); } to { transform: translateX(0); } }
.icon-btn { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 6px; color: var(--ink-3); transition: background 0.15s, color 0.15s; }
.icon-btn:hover { color: var(--ink); background: var(--panel-2); }
.icon-btn--sm { width: 24px; height: 24px; }
.notice .icon-btn { margin: -4px -6px -4px 0; }
.bars__cols .bar { cursor: crosshair; }
.bar__c, .bar__s { animation: grow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; animation-delay: var(--d); transform-origin: bottom; }
@keyframes grow { from { transform: scaleY(0); } }
.bar.is-focus .bar__c { background: var(--brand); }
.bar.is-focus .bar__s { background: var(--blue); }
.bar__tip { top: 0; right: auto; left: calc(100% + 8px); gap: 2px; }
.bar__tip.is-left { left: auto; right: calc(100% + 8px); }
.bar__tip span { display: flex; align-items: center; gap: 6px; }
.bar__tip i { width: 7px; height: 7px; border-radius: 2px; }
.bar__tip .is-teal { background: var(--brand); }
.bar__tip .is-blue { background: var(--blue); }
.bars__cols.is-week { gap: 14px; }
.bars__cols.is-year { gap: 10px; }
.est { display: grid; gap: 12px; padding: 6px 20px 16px; }
.seg--full { display: grid; grid-template-columns: repeat(3, 1fr); }
.seg--full .seg__opt { justify-content: center; }
.range { display: grid; gap: 10px; font-size: 13.5px; color: var(--ink-2); }
.range strong { color: var(--ink); font-weight: 600; }
.range input { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; background: linear-gradient(90deg, var(--brand) var(--p), var(--panel-2) var(--p)); outline: 0; cursor: pointer; }
.range input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--ink); border: 4px solid var(--brand); box-shadow: 0 0 0 4px rgba(84, 186, 155, 0.15); }
.range input::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: var(--ink); border: 4px solid var(--brand); }
.est__out { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.est__out > div { display: grid; padding: 10px 12px; border-radius: 6px; background: var(--night); box-shadow: inset 0 0 0 1px var(--line); transition: box-shadow 0.2s, background 0.2s; }
.est__out small { font-size: 12px; color: var(--ink-3); }
.est__out strong { font-size: 18px; font-weight: 650; letter-spacing: -0.02em; }
.est__out .is-best { background: rgba(84, 186, 155, 0.08); box-shadow: inset 0 0 0 1px rgba(84, 186, 155, 0.45); }
.est__tip { display: flex; gap: 8px; margin: 0; font-size: 12.5px; color: var(--ink-2); }
.est__tip svg { flex: none; margin-top: 3px; color: var(--brand); }
.drawer-wrap { position: fixed; inset: 0; z-index: 40; display: flex; justify-content: flex-end; background: rgba(5, 8, 13, 0.55); backdrop-filter: blur(2px); }
.drawer { display: flex; flex-direction: column; width: min(420px, 100%); height: 100%; background: var(--panel); box-shadow: -1px 0 0 var(--line-2), -24px 0 48px rgba(0, 0, 0, 0.4); }
.drawer__head { display: flex; align-items: center; gap: 12px; padding: 20px; border-bottom: 1px solid var(--line); }
.drawer__head > div { flex: 1; }
.drawer__head h2 { margin: 0; font-size: 17px; font-weight: 650; }
.drawer__head small { color: var(--ink-3); font-size: 12.5px; }
.drawer__body { flex: 1; display: grid; align-content: start; gap: 20px; padding: 20px; overflow: auto; }
.drawer__body > .chip { width: max-content; }
.gauges { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.gauge { position: relative; display: grid; justify-items: center; gap: 2px; padding: 14px 8px 12px; border-radius: 8px; background: var(--night); box-shadow: inset 0 0 0 1px var(--line); }
.gauge svg { width: 64px; height: 64px; transform: rotate(-90deg); }
.gauge strong { position: absolute; top: 34px; font-size: 14px; font-weight: 650; }
.gauge small { font-size: 12px; color: var(--ink-3); }
.gauge__track { fill: none; stroke: var(--panel-2); stroke-width: 4; }
.gauge__value { fill: none; stroke-width: 4; stroke-linecap: round; transition: stroke-dasharray 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
.gauge__value.is-teal { stroke: var(--brand); }
.gauge__value.is-blue { stroke: var(--blue); }
.gauge__value.is-violet { stroke: var(--violet); }
.facts { display: grid; margin: 0; border-radius: 8px; box-shadow: inset 0 0 0 1px var(--line); }
.facts > div { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid var(--line); }
.facts > div:last-child { border-bottom: 0; }
.facts dt { font-size: 13px; color: var(--ink-3); }
.facts dd { display: flex; align-items: center; gap: 4px; margin: 0; font-weight: 500; text-align: right; }
.drawer__chart { display: grid; gap: 8px; }
.drawer__chart small { font-size: 12.5px; color: var(--ink-3); }
.drawer__chart svg { width: 100%; height: 80px; }
.drawer__foot { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 20px; border-top: 1px solid var(--line); }
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.2s; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(40px); }
.toast { position: fixed; z-index: 50; left: 50%; bottom: 24px; display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 500; transform: translateX(-50%); color: var(--ink); background: #1c2638; box-shadow: 0 0 0 1px var(--line-2), 0 12px 32px rgba(0, 0, 0, 0.45); }
.toast svg { color: var(--brand); }
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 8px); }
@media (prefers-reduced-motion: reduce) { .bg-drift, .bar__c, .bar__s { animation: none; } }

@media (max-width: 1280px) {
  .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid { grid-template-columns: minmax(0, 1fr); }
  aside.stack { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
}
@media (max-width: 960px) {
  .mk { grid-template-columns: minmax(0, 1fr); }
  .side { position: fixed; z-index: 20; left: 0; width: 260px; transform: translateX(-100%); transition: transform 0.2s; }
  .is-nav-open .side { transform: none; }
  .top__burger { display: grid; place-items: center; width: 32px; height: 32px; color: #e6e6e6; }
  .row { grid-template-columns: minmax(170px, 1.5fr) minmax(110px, 1fr) minmax(90px, 0.8fr) 64px; }
  .row > :nth-child(3), .row > :nth-child(4) { display: none; }
}
@media (max-width: 640px) {
  .page { padding: 24px 16px 48px; gap: 20px; }
  .hero h1 { font-size: 22px; }
  .hero__actions { width: 100%; flex-direction: column-reverse; }
  .hero__actions .btn { width: 100%; justify-content: center; height: 40px; }
  .kpis { grid-template-columns: minmax(0, 1fr); }
  .card__head { padding: 14px 16px; }
  .card__head .seg { order: 3; width: 100%; overflow-x: auto; scrollbar-width: none; }
  .search { display: none; }
  .row { grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 12px 16px; }
  .row > :nth-child(5), .row > :nth-child(6), .row--head { display: none; }
  .stack, aside.stack { grid-template-columns: minmax(0, 1fr); }
  .pair { grid-template-columns: minmax(0, 1fr); }
  .usage__sum { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .legend { order: 4; width: 100%; }
  .bars__cols { gap: 2px; }
}
</style>

