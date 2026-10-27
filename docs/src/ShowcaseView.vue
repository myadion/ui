<script setup>
import { computed, reactive, ref } from 'vue'
import {
  UiActionMenu, UiAddress, UiBadge, UiButton, UiCard, UiCheckbox, UiChoices, UiCode, UiCombobox, UiCopyId, UiConfirm, UiDenied,
  UiDetailLayout, UiDialog, UiEmpty, UiError, UiForm, UiFormLayout, UiInput, UiKeyValue, UiList,
  UiListLayout, UiLoading, UiAssistantButton, UiAssistantConfirmCard, UiAssistantLimit, UiAssistantMessage, UiAssistantPanel, UiNotificationBell, UiNotificationDrawer, UiServiceTable, UiNotice, UiSandboxBanner, UiPageHeader, UiSection, UiSecret, UiSegmented, UiSelect, UiStat,
  UiStatus, UiSubTabs, UiTable, UiTabs, UiTimeline, UiWizard, UiWizardLayout,
  UiHero, UiFeatureGrid, UiChoiceCards, UiSetup, UiCopyCallout, UiPromptList, UiTagsInput, UiMessagePreview, UiUnicodeNotice, UiOrderBlock, UiColumnMapper, UiChannelChip, UiFileInput,
  UiMailStudio, UiMailTemplatePicker, UiMailGallery, UiColorInput,
  UiMailStyleFields, UiMailDropZone, UiMailTemplateGallery,
  UiLineChart, UiBarChart, UiChecklist, UiSortableList, UiMeter,
  healthOf,
  UiHealthGroup,
} from '@adion-cloud/ui-vue'
import tokensCss from '@adion-cloud/tokens/tokens.css?raw'
import { themeReport, themeVars } from '@adion-cloud/tokens/contrast'

/*
 * LA DOC VIVANTE DU KIT (/ui), reservee a l'equipe d'Adion. Chaque gabarit,
 * chaque composant, chaque etat - avec des donnees inventees : rien ici ne
 * parle a Nexus, sauf la recherche d'adresse.
 */
const SECTIONS = [
  ['gabarits', 'Gabarits'], ['entetes', 'En-têtes'], ['actions', 'Menu d’actions'], ['onglets', 'Onglets'], ['sections', 'Sections et cartes'],
  ['chiffres', 'Chiffres'], ['graphiques', 'Graphiques et contrôles'], ['tableau', 'Tableau'], ['formulaires', 'Formulaires'], ['assistant', 'Assistant'],
  ['fenetres', 'Fenêtres'], ['notifications', 'Notifications'], ['degrades', 'Dégradés'], ['boutons', 'Boutons'], ['etats', 'Badges et états'], ['encadres', 'Encadrés'],
  ['vides', 'Vide, chargement, erreur'], ['faits', 'Faits, liste, frise, code'], ['contrastes', 'Contrastes'], ['envie', 'Pages qui donnent envie'], ['courriels', 'Courriels'],
]

const productLinks = [
  { key: 'documentation', label: 'Documentation', href: 'https://docs.myadion.com' },
  { key: 'offers', label: 'Offres', href: 'https://myadion.com' },
  { key: 'terms', label: 'Conditions', href: 'https://myadion.com' },
]
const demoServices = [
  { id: 'd1', name: 'atelier-lumiere.fr', subscription: { status: 'active', offer: { public_label: 'Hébergement Pro' }, renews_at: '2026-12-04' }, account_service: { project_name: 'Atelier' } },
  { id: 'd2', name: 'boutique-nord.fr', customer_description: 'Boutique en ligne', subscription: { status: 'active', offer: { public_label: 'WordPress' }, renews_at: '2027-01-18' }, account_service: { project_name: 'Atelier' } },
  { id: 'd3', name: 'vieux-site.fr', subscription: { status: 'suspended', offer: { public_label: 'Hébergement Essentiel' } }, account_service: { project_name: 'Archives' } },
]
const notifOpen = ref(false)
const demoNotifications = [
  { id: 'n1', severity: 'warning', title: 'Moyen de paiement manquant', message: 'Aucun moyen de paiement sur Compte principal. Ajoutez-en un pour que vos factures soient réglées automatiquement.', at: new Date(Date.now() - 3600e3).toISOString(), action: { label: 'Ajouter un moyen de paiement', to: '/billing' } },
  { id: 'n2', severity: 'critical', title: 'Facture en retard', message: 'Une facture de 24,00 € est en retard sur Compte principal.', at: new Date(Date.now() - 26 * 3600e3).toISOString(), action: { label: 'Voir les factures', to: '/billing' } },
  { id: 'n3', severity: 'info', title: 'Maintenance programmée', message: 'Les hébergements web redémarrent cette nuit entre 2 h et 3 h.', at: new Date(Date.now() - 3 * 86400e3).toISOString(), read: true },
]
const assistantThread = {
  messages: [
    { id: 'm1', role: 'user', text: 'Quels sont mes domaines ?', actions: [], tools: [] },
    { id: 'm2', role: 'assistant', text: 'Vous avez **2 domaines** :\n- atelier-lumiere.fr, renouvelé le 4 décembre\n- boutique-nord.fr\n\nVoir la [liste des domaines](/domains).', actions: [], tools: [{ title: 'Lecture de vos domaines…', status: 'done' }] },
    { id: 'm3', role: 'user', text: 'Supprime boutique-nord.fr', actions: [], tools: [] },
    { id: 'm4', role: 'assistant', text: 'Je prépare la suppression, à confirmer ci-dessous.', actions: [{ id: 'a0', status: 'executed', title: 'Enregistrement TXT ajouté' }], tools: [] },
  ],
  pending: [{ id: 'a1', title: 'Supprimer le domaine boutique-nord.fr', question: 'Confirmer cette suppression ? Elle est définitive.', kind: 'delete', danger: true, args: { domain: 'boutique-nord.fr' }, method: 'DELETE', path: '/domain/dom_AbCdEf123456' }],
  limit: null, error: '', status: 'awaiting_confirmation', streaming: false,
}
const assistantLimited = { messages: assistantThread.messages.slice(0, 2), pending: [], limit: { kind: 'conversation_max_messages', message: 'Cette conversation est arrivée à sa longueur maximale.', resetsAt: null }, error: '', status: 'limit', streaming: false }
const layout = ref('list')
const layouts = [
  { value: 'list', label: 'UiListLayout' },
  { value: 'detail', label: 'UiDetailLayout' },
  { value: 'wizard', label: 'UiWizardLayout' },
  { value: 'form', label: 'UiFormLayout' },
]
const detailTab = ref('ensemble')
const chartLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')} h`)
const chartSeries = [
  { key: 'sent', label: 'Envoyés', points: chartLabels.map((_, i) => Math.round(40 + 30 * Math.sin(i / 4) + i)) },
  { key: 'opened', label: 'Ouverts', points: chartLabels.map((_, i) => Math.round(18 + 12 * Math.sin(i / 3 + 1))) },
  { key: 'clicked', label: 'Clics', points: chartLabels.map((_, i) => Math.round(6 + 4 * Math.sin(i / 5))) },
]
const channelBars = [{ key: 'email', label: 'E-mail', value: 42.5, hint: '1 280 envois' }, { key: 'sms', label: 'SMS', value: 18, hint: '640 envois' }]
const cascade = ref([{ key: 'email', label: 'E-mail', hint: 'Premier essai', icon: 'mdi-email-outline' }, { key: 'sms', label: 'SMS', hint: 'Si pas ouvert sous 24 h', icon: 'mdi-message-text-outline' }, { key: 'post', label: 'Courrier', hint: 'Bientôt', icon: 'mdi-mailbox-outline', fixed: true }])
const checks = [
  { key: 'list', label: 'Une liste de contacts', ready: true },
  { key: 'sender', label: 'Un expéditeur validé', ready: true },
  { key: 'consent', label: 'Des contacts avec accord', ready: false, reason: 'Aucun des 12 contacts n’a donné son accord pour le SMS.' },
]
const smsText = ref('Bonjour Anne, votre commande est prête. STOP au 36180')
// Ce que Nexus enverra sur un service (coordination#54) ; ici, des donnees d'exemple.
const sampleActions = [
  { key: 'purge', label: 'Vider le cache', icon: 'mdi-broom' },
  { key: 'migrate', label: 'Migrer le service', icon: 'mdi-folder-swap-outline', available: false, reason: 'Un seul projet dans cette organisation.' },
  { key: 'change-offer', label: 'Changer d’offre', icon: 'mdi-swap-horizontal' },
  { key: 'terminate', label: 'Résilier', icon: 'mdi-close-circle-outline', danger: true },
]
const lastAction = ref('')
const detailTabs = [
  { id: 'resiliation', label: 'Résiliation' },
  { id: 'historique', label: 'Historique' },
  { id: 'reglages', label: 'Réglages' },
  { id: 'ensemble', label: 'Vue d’ensemble' },
  { id: 'api', label: 'API', count: 2 },
]
const tab = ref('ensemble')
const subtab = ref('fichiers')

const rows = [
  { id: 'a', name: 'boutique.fr', offer: 'Pro', php: '8.3', state: { label: 'En ligne', tone: 'ok' }, visits: 12840 },
  { id: 'b', name: 'atelier-lumiere.fr', offer: 'Starter', php: '8.2', state: { label: 'Suspendu', tone: 'warn' }, visits: 310 },
  { id: 'c', name: 'ancien-site.com', offer: 'Business', php: '7.4', state: { label: 'Erreur', tone: 'bad' }, visits: 0 },
  { id: 'd', name: 'zephyr.io', offer: 'Pro', php: '8.3', state: { label: 'En ligne', tone: 'ok' }, visits: 5302 },
]
const columns = [
  { key: 'name', label: 'Site', main: true, mono: true, sortable: true },
  { key: 'offer', label: 'Offre', muted: true, sortable: true },
  { key: 'php', label: 'PHP', muted: true },
  { key: 'visits', label: 'Visites', align: 'num', sortable: true, value: (r) => r.visits },
  { key: 'state', label: 'État', value: (r) => r.state.label },
]
const filters = [{ key: 'offer', label: 'Offre', items: ['Starter', 'Pro', 'Business'] }]
const tableState = ref('rows')

const form = reactive({ name: '', plan: null, tags: [], kind: 'company', agree: false, auto: true, scopes: ['sms.send'], numbers: ['06 12 34 56 78', '0700000000', '12'] })
const demoFile = ref(null)
const demoColumns = [{ index: 0, header: 'Courriel', example: 'anne@exemple.fr', field_target: 'field:courriel', field_label: 'Courriel' }, { index: 1, header: 'Email pro', example: 'a.martin@societe.fr', field_target: 'field:email_pro', field_label: 'Email pro' }, { index: 2, header: 'Ville', example: 'Lyon', field_target: 'field:ville', field_label: 'Ville' }]
const demoTargets = [{ value: 'email', label: 'E-mail', group: 'Canaux' }, { value: 'mobile', label: 'Mobile', group: 'Canaux' }, { value: 'first_name', label: 'Prénom', group: 'Identité' }, { value: 'ignore', label: 'Ne pas importer', group: 'Autre' }]
const demoMap = ref({ 0: 'email', 1: 'email', 2: 'field:ville' })
const address = reactive({ line1: '', line2: '', postal_code: '', city: '', country: 'FR' })
const scopes = [
  { value: 'sms.send', label: 'Envoyer des SMS', description: 'Envoyer depuis votre logiciel, au nom du service choisi.' },
  { value: 'sms.read', label: 'Lire l’historique', description: 'Lire les SMS envoyés et leur état de remise.' },
  { value: 'billing.read', label: 'Lire la facturation', description: 'Consulter factures et moyens de paiement.' },
]

const steps = [
  { key: 'nom', label: 'Le nom' },
  { key: 'type', label: 'Le type' },
  { key: 'droits', label: 'Les droits' },
  { key: 'projets', label: 'Les projets' },
]
const step = ref('nom')
const stepIndex = computed(() => steps.findIndex((s) => s.key === step.value))
const nextStep = () => { if (stepIndex.value < steps.length - 1) step.value = steps[stepIndex.value + 1].key }

const dialog = ref(false)
const confirm = ref(false)
const danger = ref(false)
const secret = ref('7Hq2kP9sLm4Vx8Rt1Zc6Wy3Nb5Jd0FgQ2kP9sLm4')
const statsLayout = ref('aside')
const contrastColumns = [
  { key: 'label', label: 'Couple' },
  { key: 'value', label: 'Rapport', align: 'num', value: (r) => (r.value === null ? '—' : `${String(r.value).replace('.', ',')}:1`) },
  { key: 'min', label: 'Seuil', align: 'num', value: (r) => `${String(r.min).replace('.', ',')}:1` },
  { key: 'state', label: 'AA', value: (r) => (r.ok ? 'AA' : 'Sous AA') },
]
const contrast = ['dark', 'light'].map((theme) => ({ theme, rows: themeReport(themeVars(tokensCss, theme)) }))
const apiExample = [
  '# 1. Votre application obtient un jeton (une heure), avec son identifiant et son secret',
  'curl -X POST https://adion-api.eu/api/auth/token \\',
  '  -d grant_type=client_credentials -d client_id=$CLIENT_ID -d client_secret=$CLIENT_SECRET',
  '',
  '# 2. Elle appelle l’API avec ce jeton',
  'curl -X POST https://adion-api.eu/api/v1/sms \\',
  '  -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \\',
  `  -d '{"to": "+33612345678", "message": "Votre code : 482913", "type": "transactional"}'`,
].join('\n')
const dirty = ref(true)

const families = ['web', 'telecom', 'payment', 'marketing', 'cloud', 'ai']
const family = ref('web')
const setupStep = ref('choose')
const setupDone = ref([])
const pick = ref('')
const heroBenefits = [
  { icon: 'mdi-rocket-launch-outline', title: 'En ligne en une minute', text: 'Votre site, son certificat et son domaine, prêts sans réglage.' },
  { icon: 'mdi-shield-check-outline', title: 'Sauvegardé chaque nuit', text: 'Revenez en arrière d’un clic, sans ticket.' },
  { icon: 'mdi-headset', title: 'Des humains au bout du fil', text: 'Une équipe à Toulouse, joignable par téléphone.' },
]

/*
 * Le studio des courriels, avec un rendu de demonstration. Dans l'espace,
 * le HTML vient de Nexus (MailBlockRenderer, apercu `editable`) ; ici, un
 * rendu minuscule pose les memes reperes, pour voir le canevas vivre.
 */
const mailDoc = ref({
  subject: 'Nos nouvelles du mois',
  blocks: [
    { type: 'badge', text: 'Octobre' },
    { type: 'heading', level: 1, text: 'Bonjour Camille,' },
    { type: 'text', text: 'Trois nouveautés en boutique, et un conseil pour l’hiver.' },
    { type: 'columns', ratio: '50-50', columns: [{ blocks: [{ type: 'heading', level: 2, text: 'Le pain du mois' }] }, { blocks: [{ type: 'text', text: 'Au levain, cuit au feu de bois.' }] }] },
    { type: 'button', label: 'Voir la boutique', url: 'https://myadion.com' },
  ],
})
const mailScheme = ref('light')
/* L'editeur riche (2026-10-15) : un reglage de demonstration, la galerie ouverte a la demande. */
const demoStyle = ref({ font: 'playfair', size: 32, background: '#fef3c7' })
const demoEditor = {
  fonts: [{ key: 'helvetica', label: 'Helvetica', web: false }, { key: 'playfair', label: 'Playfair Display', web: true }],
  font_web_hint: 'Police web : Gmail et Outlook montrent la police de repli.',
  weights: [{ value: 400, label: 'Normal' }, { value: 700, label: 'Gras' }],
  transforms: [{ value: 'none', label: 'Aucune' }, { value: 'uppercase', label: 'MAJUSCULES' }],
  shapes: [{ value: 'square', label: 'Carré' }, { value: 'pill', label: 'Pilule' }],
  button_sizes: [{ value: 'sm', label: 'Petit' }, { value: 'md', label: 'Moyen' }, { value: 'lg', label: 'Grand' }],
  border_styles: [{ value: 'solid', label: 'Plein' }, { value: 'dashed', label: 'Tirets' }],
}
const demoGallery = ref(false)
const mailHtml = ref('')
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
function demoBlock(block, attrs) {
  const field = (name, tag, style, text) => `<${tag} data-mail-field="${name}" style="${style}">${esc(text)}</${tag}>`
  const inner = {
    badge: () => field('text', 'p', 'margin:0;font-size:11px;letter-spacing:.1em;text-transform:uppercase', block.text),
    heading: () => field('text', 'h2', `margin:0;font-size:${block.level === 2 ? 18 : 24}px`, block.text),
    text: () => field('text', 'p', 'margin:0;line-height:1.6', block.text),
    button: () => `<a style="display:inline-block;padding:10px 18px;border-radius:6px;background:var(--b);color:var(--bt);text-decoration:none" data-mail-field="label">${esc(block.label)}</a>`,
    divider: () => '<hr style="border:0;border-top:1px solid currentColor;opacity:.2">',
    spacer: () => `<div style="height:${block.size || 24}px"></div>`,
  }[block.type]
  return `<tr ${attrs}><td style="padding:8px 0">${inner ? inner() : esc(block.text || block.title || block.type)}</td></tr>`
}
function renderDemo() {
  const dark = mailScheme.value === 'dark'
  const rows = mailDoc.value.blocks.map((block, i) => {
    if (block.type !== 'columns') return demoBlock(block, `data-mail-zone="body" data-mail-block="${i}"`)
    const cells = (block.columns || []).map((col, c) => `<td valign="top" style="padding:0 8px" data-mail-zone="body" data-mail-columns="${i}" data-mail-column-box="${c}"><table width="100%">${(col.blocks || []).map((child, k) => demoBlock(child, `data-mail-zone="body" data-mail-block="${i}" data-mail-column="${c}" data-mail-child="${k}"`)).join('')}</table></td>`).join('')
    return `<tr data-mail-zone="body" data-mail-block="${i}"><td><table width="100%"><tr>${cells}</tr></table></td></tr>`
  }).join('')
  const bg = dark ? '#1c1c1f' : '#ffffff'
  const fg = dark ? '#ececec' : '#1b1b1b'
  mailHtml.value = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:${bg};color:${fg};font-family:Helvetica,Arial,sans-serif;--b:#15803d;--bt:#ffffff"><table width="100%" style="max-width:600px;margin:0 auto">${rows}<tr data-mail-zone="footer" data-mail-block="0"><td style="padding:16px 0;font-size:12px;opacity:.7">Boulangerie Martin - 3 rue du Four, Paris</td></tr></table></body></html>`
}
renderDemo()

const timeline = [
  { id: 1, title: 'Clé « site de réservation » créée', text: 'Par Kévin, depuis l’espace client.', at: 'aujourd’hui à 10:42', tone: 'ok' },
  { id: 2, title: 'Appel refusé : droit manquant', text: 'sms.send demandé, non accordé à cette application.', at: 'hier à 18:03', tone: 'bad' },
  { id: 3, title: 'Application enregistrée', at: '2 octobre 2026', tone: 'accent' },
]
</script>

<template>
  <div class="ui-page">
    <UiPageHeader eyebrow="Équipe Adion" title="Adion UI" lead="Le kit de l’espace client : quatre gabarits de page, les composants et leurs états. Tout nouvel écran s’assemble avec ces pièces ; un motif qui manque s’ajoute ici, jamais dans l’écran. Les règles sont dans src/ui/README.md.">
      <template #actions><UiBadge label="Réservé à l’équipe" tone="accent" /></template>
    </UiPageHeader>
    <nav class="ui-doc__nav">
      <UiButton v-for="[id, label] in SECTIONS" :key="id" kind="quiet" :href="`#${id}`">{{ label }}</UiButton>
    </nav>

    <UiSection id="gabarits" title="Gabarits de page" lead="Un même type de page a la même structure, au même endroit, d’un produit à l’autre. Une vue de page emploie l’un des quatre ; le garde-fou le vérifie.">
      <UiSegmented v-model="layout" :items="layouts" />
      <div class="ui-doc__frame">
        <UiListLayout
          v-if="layout === 'list'"
          family="Web"
          title="Mes hébergements"
          lead="Vos sites, leur disponibilité et leur environnement d’exécution."
          list-title="Vos sites"
          :order="['WEB_HOSTING']"
          :links="productLinks"
          :stats-layout="statsLayout"
        >
          <template #before>
            <UiSegmented v-model="statsLayout" label="Chiffres" :items="[{ value: 'aside', label: 'En colonne à droite (retenu)' }, { value: 'band', label: 'En bande' }]" />
          </template>
          <template #stats>
            <UiStat label="Hébergements" value="4" hint="rattachés à ce projet" />
            <UiStat label="En ligne" value="2" hint="sur 4" />
            <UiStat label="Visites" value="18 452" :trend="12" higher-is-better hint="ce mois" />
          </template>
          <UiServiceTable :services="demoServices" :to="() => '/ui'" pref-key="ui-demo-services" />
        </UiListLayout>

        <UiDetailLayout
          v-else-if="layout === 'detail'"
          v-model:tab="detailTab"
          title="boutique.fr"
          :crumbs="[{ label: 'Web' }, { label: 'Mes hébergements', to: '/ui' }, { label: 'boutique.fr' }]"
          :status="{ label: 'En ligne', tone: 'ok' }"
          :tabs="detailTabs"
          :actions="sampleActions"
          @action="(key) => (lastAction = key)"
        >
          <template #meta><span>Hébergement Pro</span><span class="ui-header__sep">·</span><span>PHP 8.3</span></template>
          <template #actions><UiButton kind="quiet" icon="mdi-refresh" icon-only title="Actualiser" /><UiButton kind="secondary" icon="mdi-open-in-new">Voir mon site</UiButton></template>
          <template #notices><UiNotice tone="warn" title="Résiliation programmée" text="Le site s’arrêtera le 1er novembre 2026." /></template>
          <template #stats>
            <UiStat label="Visites" value="12 840" icon="mdi-chart-line" hint="ce mois" />
            <UiStat label="Espace" value="2,1 Go" icon="mdi-harddisk" hint="sur 20 Go" />
          </template>
          <UiSection first :title="`Onglet « ${detailTabs.find((t) => t.id === detailTab)?.label} »`" lead="Les onglets ont été déclarés dans le désordre : le gabarit met « Vue d’ensemble » en premier, les réglages puis la résiliation à la fin." />
        </UiDetailLayout>

        <UiWizardLayout
          v-else-if="layout === 'wizard'"
          v-model:step="step"
          title="Nouvelle application"
          :crumbs="[{ label: 'Mon compte' }, { label: 'Applications', to: '/ui' }, { label: 'Nouvelle' }]"
          :steps="steps"
          :question="steps[stepIndex].label"
          hint="Une question par écran ; Précédent et Suivant restent en bas."
          @next="nextStep"
          @finish="step = 'nom'"
        >
          <UiInput v-if="step === 'nom'" v-model="form.name" label="Nom de l’application" tip="Le nom que vous verrez dans le journal." required />
          <UiSegmented v-else-if="step === 'type'" v-model="form.kind" label="Type" :items="[{ value: 'company', label: 'Serveur' }, { value: 'spa', label: 'Navigateur' }]" />
          <UiChoices v-else-if="step === 'droits'" v-model="form.scopes" label="Droits" :items="scopes" />
          <UiSelect v-else v-model="form.tags" label="Projets autorisés" :items="['Kévin Paly', 'Boutique', 'Atelier']" multiple />
          <template #aside>
            <UiCard eyebrow="Récapitulatif" :title="form.name || 'Sans nom'">
              <UiKeyValue layout="list" :items="[{ label: 'Type', value: form.kind }, { label: 'Droits', value: form.scopes.length }]" />
            </UiCard>
          </template>
        </UiWizardLayout>

        <UiFormLayout v-else title="Réglages du compte" eyebrow="Mon compte" lead="Sections avec leur titre, champs alignés, barre d’enregistrement en bas." :dirty="dirty" @save="dirty = false" @cancel="dirty = false">
          <UiSection first title="Identité">
            <div class="ui-form__grid">
              <UiInput v-model="form.name" label="Nom" @update:model-value="dirty = true" />
              <UiSelect v-model="form.plan" label="Langue" :items="['Français', 'English']" @update:model-value="dirty = true" />
            </div>
          </UiSection>
          <UiSection title="Adresse"><UiAddress :address="address" /></UiSection>
        </UiFormLayout>
      </div>
    </UiSection>

    <UiSection id="entetes" title="En-têtes" lead="UiPageHeader : une liste (famille, titre, phrase) ou une fiche (fil d’Ariane, nom, état, faits). Les gestes à droite : Actualiser, les secondaires, l’action principale tout à droite.">
      <div class="ui-doc__demo">
        <UiPageHeader eyebrow="Télécom" title="SMS" lead="Envoyez des SMS sous le nom de votre entreprise.">
          <template #actions><UiButton kind="quiet" icon="mdi-refresh">Actualiser</UiButton><UiButton kind="primary" icon="mdi-plus">Commander</UiButton></template>
        </UiPageHeader>
        <UiPageHeader resource title="Boutique Lumière" :crumbs="[{ label: 'Télécom' }, { label: 'SMS', to: '/ui' }]" :status="{ label: 'Actif', tone: 'ok' }">
          <template #meta><span>Expéditeur LUMIERE</span><span class="ui-header__sep">·</span><span>Rechargement automatique sous 100</span></template>
          <template #actions><UiButton kind="secondary" icon="mdi-send-outline">Envoyer</UiButton></template>
        </UiPageHeader>
      </div>
    </UiSection>

    <UiSection id="actions" title="Menu d’actions" lead="UiActionMenu : le bouton « Actions » à droite de l’en-tête d’une fiche (UiDetailLayout :actions). Nexus envoie la liste sur chaque service ; le menu l’affiche telle quelle, une action indisponible est grisée avec sa raison, « Résilier » est en rouge, séparé, tout en bas.">
      <UiActionMenu :actions="sampleActions" @action="(key) => (lastAction = key)" />
      <p class="ui-muted">{{ lastAction ? `Action choisie : ${lastAction}` : 'Choisissez une action : l’écran ouvre le parcours correspondant.' }}</p>
    </UiSection>

    <UiSection id="onglets" title="Onglets" lead="UiTabs (avec query=&quot;onglet&quot; pour garder l’onglet dans l’adresse) et UiSubTabs à l’intérieur d’un onglet.">
      <UiTabs v-model="tab" :tabs="[{ id: 'ensemble', label: 'Vue d’ensemble' }, { id: 'envoyer', label: 'Envoyer' }, { id: 'expediteur', label: 'Expéditeur', count: 1, countHint: '1 nom en attente de validation' }, { id: 'reglages', label: 'Réglages' }]" />
      <UiSubTabs v-model="subtab" :tabs="[{ id: 'fichiers', label: 'Fichiers', icon: 'mdi-folder-outline' }, { id: 'ftp', label: 'Accès FTP', count: 2 }]" />
    </UiSection>

    <UiSection id="sections" title="Sections et cartes" lead="UiSection porte le rythme d’une page, sans cadre. UiCard, bordée, sert à comparer côte à côte (dans .ui-cards).">
      <template #actions><UiButton kind="quiet" icon="mdi-plus">Geste de section</UiButton></template>
      <div class="ui-cards">
        <UiCard eyebrow="Paquet" value="25,00 €" unit="HT" text="0,050 € HT le SMS"><template #actions><UiButton>Acheter</UiButton></template></UiCard>
        <UiCard eyebrow="Paquet" value="90,00 €" unit="HT" text="0,045 € HT le SMS" selected><template #actions><UiButton kind="primary">Payer 90,00 € HT</UiButton><UiButton kind="quiet">Annuler</UiButton></template></UiCard>
        <UiCard title="Une carte avec un titre" text="Et un texte d’appoint, gris, sur deux lignes au plus." />
        <UiCard eyebrow="10 000 SMS" value="850,00 €" unit="HT" text="0,085 € HT le SMS" badge="Le plus avantageux"><template #actions><UiButton>Acheter</UiButton></template></UiCard>
      </div>
      <UiSection title="Une section repliable" lead="collapsible : le titre ouvre et ferme ; pour des règles qu’on relit au besoin." collapsible>
        <UiList :items="[{ text: 'Un SMS commercial part du lundi au samedi, de 8 h à 20 h.' }, { text: 'Les crédits ne périment pas tant que le service est actif.' }]" />
      </UiSection>
    </UiSection>

    <UiSection id="etat-services" title="État des services" lead="healthOf(famille) donne le mot et le ton d'un état de Nexus ; UiServiceNotice (automatique dans UiDetailLayout avec service-id) pose le bandeau du service touché, avec le message de Nexus.">
      <div class="ui-section__body">
        <UiBadge v-for="code in ['operational', 'degraded', 'outage', 'maintenance', 'unknown']" :key="code" :label="healthOf({ status: code }).label" :tone="healthOf({ status: code }).tone" />
      </div>
      <UiHealthGroup title="Web" status="degraded" open :services="[
        { name: 'Static Website', status: 'degraded', uptime_24h: 99.65, uptime_90d: null, measured_days: 4, history: [{ date: '2026-10-15', uptime: 99.65 }, { date: '2026-10-16', uptime: 100 }] },
        { name: 'Hébergement PHP', status: 'operational', uptime_24h: 100, uptime_90d: 99.98, measured_days: 90 },
      ]" />
      <UiNotice tone="warn" title="Perturbé" text="Votre hébergement est ralenti depuis 10 h 12. Nos équipes interviennent ; vos données ne sont pas touchées." />
    </UiSection>

    <UiSection id="chiffres" title="Chiffres" lead="UiStat dans .ui-stats (ou le créneau stats des gabarits) : deux colonnes sur téléphone.">
      <div class="ui-stats">
        <UiStat label="Crédits restants" value="1 240" icon="mdi-wallet-outline" hint="60 consommés ce mois" />
        <UiStat label="Envoyés" value="312" :trend="-8" hint="ce mois" />
        <UiStat label="Dépense" value="6,67 €" :trend="24" :spark="[2, 3, 3, 5, 4, 6, 8]" hint="face au mois dernier" />
      </div>
    </UiSection>

    <UiSection id="graphiques" title="Graphiques et contrôles" lead="Courbes et barres (couleurs --adion-chart-*, trait différent par série, valeurs lisibles au survol et aux flèches), liste à réordonner, liste de contrôle, jauge.">
      <div class="ui-doc__demo">
        <UiLineChart :labels="chartLabels" :series="chartSeries" title="Envois, ouvertures et clics par heure" />
        <UiBarChart :items="channelBars" title="Taux d’ouverture par canal" unit="%" :max="100" />
      </div>
      <div class="ui-doc__demo">
        <UiSortableList v-model="cascade" label="Ordre de la cascade" hint="Glisser une ligne, ou Monter et Descendre." />
        <UiChecklist :items="checks" title="Avant l’envoi" />
        <div>
          <UiInput v-model="smsText" label="Message" multiline />
          <UiMeter :value="smsText.length" :max="160" hint="lien et mention STOP compris · 1 SMS par contact" />
        </div>
      </div>
    </UiSection>

    <UiSection id="tableau" title="Tableau" lead="UiTable : recherche, filtres, tri, colonnes choisies par le client (enregistrées par Nexus), en-tête collant, pagination, ligne cliquable avec « Ouvrir », état vide, et une fiche par ligne sur téléphone.">
      <UiSegmented v-model="tableState" :items="[{ value: 'rows', label: 'Lignes' }, { value: 'empty', label: 'Vide' }, { value: 'loading', label: 'Chargement' }, { value: 'error', label: 'Erreur' }]" />
      <UiTable
        :columns="columns"
        :rows="tableState === 'rows' ? rows : []"
        :loading="tableState === 'loading'"
        :error="tableState === 'error' ? 'La liste n’a pas pu être chargée.' : ''"
        search="Rechercher un site"
        :filters="filters"
        :page-size="3"
        :row-to="() => '/ui'"
        pref-key="ui-demo-table"
        empty="Aucun hébergement dans ce projet."
      >
        <template #cell-state="{ row }"><UiBadge :label="row.state.label" :tone="row.state.tone" /></template>
        <template #toolbar><UiButton kind="quiet" icon="mdi-download">Exporter</UiButton></template>
      </UiTable>
    </UiSection>

    <UiSection id="formulaires" title="Formulaires" lead="Une grille : libellé (16 px), contrôle (32 px), aide ou erreur dessous. Deux colonnes pour les champs courts, toute la largeur pour les longs (wide).">
      <UiForm grid>
        <UiInput v-model="form.name" label="Nom de la clé" tip="Pour la reconnaître dans la liste." placeholder="site de réservation" />
        <UiInput model-value="ab" label="Avec une erreur" error="Lettres et chiffres, 3 à 11." />
        <UiSelect v-model="form.plan" label="Liste de choix" :items="['Starter', 'Pro', 'Business']" hint="Une aide sous le champ, si elle est courte." />
        <UiCombobox v-model="form.tags" label="Choix ou saisie libre" :items="['paly.li', 'boutique.fr']" multiple />
        <UiSegmented v-model="form.kind" label="Segment" :items="[{ value: 'company', label: 'Société' }, { value: 'individual', label: 'Individuel' }]" />
        <div class="ui-field"><span class="ui-field__label">Bouton</span><div class="ui-form__actions"><UiButton kind="primary">Enregistrer</UiButton><UiButton>Secondaire</UiButton></div></div>
        <UiInput model-value="" label="Zone de texte" multiline wide />
        <UiTagsInput v-model="form.numbers" label="Pastilles (UiTagsInput)" tip="Entrée ou virgule pour ajouter ; coller une liste la découpe." placeholder="06 12 34 56 78" :invalid="{ 12: 'Numéro de mobile français invalide' }" hint="3 numéros, dont 1 écarté" wide />
      </UiForm>
      <div class="ui-doc__demo">
        <UiColumnMapper v-model="demoMap" :columns="demoColumns" :targets="demoTargets" />
        <UiFileInput v-model="demoFile" label="Dépôt de fichier (UiFileInput)" accept=".csv,text/csv" tip="Glisser-déposer ou clic ; le nom et la taille s’affichent." />
        <div><UiChannelChip value="anne@exemple.fr" label="Accord" tone="ok" icon="mdi-email-outline" /> <UiChannelChip value="06 12 34 56 78" label="Retiré" tone="warn" icon="mdi-message-text-outline" mono /></div>
      </div>
      <div class="ui-doc__demo">
        <UiMessagePreview sender="LUMIERE" text="Bonjour, votre commande est prête : passez la chercher dès demain." note="1 partie · 64 caractères" />
        <UiMessagePreview sender="N° court" />
      </div>
      <div class="ui-doc__demo">
        <UiMessagePreview sender="LUMIERE" text="Bonjour, votre commande est prête 🎉" note="2 parties · 36 caractères" :highlight="['🎉']" />
        <UiUnicodeNotice :unicode="{ message: 'Ce message contient un caractère spécial : il part en Unicode, 70 caractères par SMS au lieu de 160.', characters: ['🎉'], segments_per_recipient: 2, segments_total: 200 }" />
      </div>
        <h3 class="ui-section__sub">Le bloc « Commander » : UiOrderBlock (offre, paquets, liens de Nexus)</h3>
        <UiOrderBlock title="Pas de service SMS dans ce projet" text="Commandez le service SMS avec un paquet pour ajouter le SMS à vos campagnes." :offers="[{ offer_id: 'o1', name: 'Adion SMS', description: 'Vos crédits, votre expéditeur, votre liste STOP.', packs: [{ pack: '1000', label: '1 000 SMS', price_ht: 95, unit_price_ht: 0.095, shop_url: '/shop' }, { pack: '5000', label: '5 000 SMS', price_ht: 425, unit_price_ht: 0.085, shop_url: '/shop' }] }]" />
      <div class="ui-doc__demo">
        <UiCheckbox v-model="form.agree" label="Une case et son libellé" text="Une explication facultative dessous." />
        <UiCheckbox v-model="form.agree" danger label="Je comprends que tout sera supprimé" />
        <UiCheckbox v-model="form.auto" switch label="Interrupteur : agit tout de suite" />
        <UiChoices v-model="form.scopes" label="Choix multiples décrits (droits)" :items="scopes" columns />
        <UiAddress :address="address" />
      </div>
    </UiSection>

    <UiSection id="assistant" title="Assistant" lead="UiWizard seul, à poser dans une fenêtre ou une section ; UiWizardLayout pour une page entière.">
      <UiWizard v-model="step" :steps="steps" :question="steps[stepIndex].label" @next="nextStep" @finish="step = 'nom'">
        <UiInput v-model="form.name" label="Réponse" />
      </UiWizard>
    </UiSection>

    <UiSection id="notifications" title="Notifications" lead="UiNotificationBell : la cloche en haut à droite, avec le nombre de non-lues ; à côté, UiAssistantButton ouvre le même volet sur l’assistant (Ctrl+K). UiNotificationDrawer : le volet qui s’ouvre à droite (gravité, titre, message, date, action). Dans l’espace client, UiNotificationCenter les branche seul ; les bandeaux d’état du compte y vivent. Ici, des données d’exemple.">
      <div class="ui-doc__row">
        <UiAssistantButton />
        <UiNotificationBell :count="2" :open="notifOpen" @click="notifOpen = !notifOpen" />
        <UiNotificationBell :count="0" />
      </div>
      <UiNotificationDrawer v-model="notifOpen" :notifications="demoNotifications" />
    </UiSection>

    <UiSection id="assistant-ia" title="Assistant (volet)" lead="Le second onglet du volet de droite : le client pilote son espace en discutant. UiAssistantPanel (fil, historique, saisie, compteur), UiAssistantMessage (bulle en markdown léger, lectures, gestes), UiAssistantConfirmCard (Confirmer / Annuler, rouge si danger), UiAssistantLimit (plafond à la place de la saisie). Dans l’espace client, UiNotificationCenter les branche à Nexus. Ici, des données d’exemple.">
      <div class="ui-doc__row">
        <div class="ui-doc__frame ui-doc__frame--assist">
          <UiAssistantPanel :thread="assistantThread" counter="3 / 50 messages aujourd’hui" :conversations="[{ id: 'c1', title: 'Mes domaines', last_message_at: new Date(Date.now() - 3600e3).toISOString() }]" />
        </div>
        <div class="ui-doc__frame ui-doc__frame--assist">
          <UiAssistantPanel :thread="assistantLimited" counter="50 / 50 messages aujourd’hui" />
        </div>
        <div class="ui-doc__frame ui-doc__frame--assist">
          <UiAssistantPanel :available="false" unavailable="L’assistant n’est pas encore disponible." :thread="{ messages: [], pending: [], limit: null, error: '', status: '', streaming: false }" />
        </div>
      </div>
    </UiSection>

    <UiSection id="degrades" title="Dégradés" lead="Les cartes en dégradé : la marque (la pilule, #5ebc9e vers #37b9b8) et une teinte par famille de produits. Les chiffres, le cartouche d’une fiche et UiCard family les emploient ; le texte reste celui de la page, vérifié AA.">
      <div class="ui-cards">
        <UiCard v-for="f in ['brand', 'web', 'telecom', 'payment', 'marketing', 'cloud', 'ai']" :key="f" :family="f" :eyebrow="f" title="Une carte en dégradé" text="Le texte principal, le secondaire et les méta-informations gardent leur contraste." />
      </div>
    </UiSection>

    <UiSection id="fenetres" title="Fenêtres" lead="UiDialog (plein écran sur téléphone) et UiConfirm, dont le bouton dit ce qu’il fait.">
      <div class="ui-doc__row">
        <UiButton @click="dialog = true">Ouvrir une fenêtre</UiButton>
        <UiButton @click="confirm = true">Confirmer un geste</UiButton>
        <UiButton kind="danger" @click="danger = true">Confirmer un geste dangereux</UiButton>
      </div>
      <UiDialog v-model="dialog" title="Déclarer un expéditeur" icon="mdi-card-account-details-outline" text="Le nom affiché sur le téléphone de vos destinataires.">
        <UiInput v-model="form.name" label="Nouveau nom" />
        <template #actions="{ close }"><UiButton kind="quiet" @click="close">Annuler</UiButton><UiButton kind="primary" @click="close">Déclarer</UiButton></template>
      </UiDialog>
      <UiConfirm v-model="confirm" title="Utiliser ce nom ?" text="Vos prochains SMS partiront sous LUMIERE." confirm-label="Utiliser LUMIERE" @confirm="confirm = false" />
      <UiConfirm v-model="danger" danger title="Révoquer la clé ?" text="Les appels qui l’emploient seront refusés aussitôt." tick="Je comprends que ce geste est définitif" confirm-label="Révoquer la clé" @confirm="danger = false" />
    </UiSection>

    <UiSection id="boutons" title="Boutons" lead="Quatre sortes. Une seule action primaire par zone.">
      <div class="ui-doc__row">
        <UiButton kind="primary" icon="mdi-plus">Primaire</UiButton>
        <UiButton kind="secondary">Secondaire</UiButton>
        <UiButton kind="quiet" icon="mdi-refresh">Discret</UiButton>
        <UiButton kind="danger">Danger</UiButton>
        <UiButton kind="primary" loading>Chargement</UiButton>
        <UiButton disabled>Désactivé</UiButton>
        <UiButton kind="quiet" icon="mdi-refresh" icon-only title="Actualiser" />
      </div>
    </UiSection>

    <UiSection id="etats" title="Badges et états" lead="Le ton vient de Nexus (tone, status_tone) et se traduit en ok, warn, bad, info, accent, muted.">
      <div class="ui-doc__row">
        <UiStatus :status="{ label: 'Actif', tone: 'success' }" />
        <UiStatus :status="{ label: 'En attente', tone: 'warning' }" />
        <UiStatus :status="{ label: 'Suspendu', tone: 'danger' }" />
        <UiStatus :status="{ label: 'Résilié', tone: 'neutral' }" />
      </div>
      <div class="ui-doc__row">
        <UiBadge label="Validé" tone="ok" />
        <UiBadge label="En attente" tone="warn" />
        <UiBadge label="Refusé" tone="bad" />
        <UiBadge label="Information" tone="info" />
        <UiBadge label="Essai" tone="accent" icon="mdi-flask-outline" />
        <UiBadge label="Effacé" />
      </div>
    </UiSection>

    <UiSection id="encadres" title="Encadrés" lead="UiNotice remplace v-alert, .callout, .banner et .flash.">
      <UiNotice tone="info" text="Une information : rien à faire, mais bon à savoir." />
      <UiNotice tone="ok" text="Rechargement automatique activé." closable />
      <UiNotice tone="warn" title="Plus de crédits." text="Achetez un paquet pour envoyer.">
        <template #actions><UiButton>Acheter</UiButton></template>
      </UiNotice>
      <UiNotice tone="bad" text="L’achat n’a pas pu se faire." />
      <UiSandboxBanner label="Sandbox" message="Sandbox : rien n’est réel, rien n’est facturé." />
      <UiSecret :secret="secret" title="Le secret de l’application, à copier maintenant : il ne s’affichera plus." @done="secret = '7Hq2kP9sLm4Vx8Rt1Zc6Wy3Nb5Jd0FgQ2kP9sLm4'" />
    </UiSection>

    <UiSection id="vides" title="Vide, chargement, erreur, refus">
      <UiEmpty text="Aucun service SMS dans ce projet. À la commande, le service s’ouvre sans abonnement.">
        <template #actions><UiButton>Commander SMS</UiButton></template>
      </UiEmpty>
      <UiLoading label="Chargement de la liste…" />
      <UiLoading variant="inline" label="Envoi en cours" />
      <UiError message="Vos services SMS sont momentanément indisponibles." />
      <UiDenied what="les services SMS de ce projet" />
      <UiLoading variant="page" />
    </UiSection>

    <UiSection id="faits" title="Faits, liste, frise, code" lead="Une seule forme de faits, aux colonnes alignées ; chaque bloc garde son air.">
      <UiKeyValue :columns="2" :items="[{ label: 'Expéditeur', value: 'LUMIERE' }, { label: 'Parties', value: 2 }, { label: 'Provenance', value: 'API', tip: 'Envoyé par une application.' }, { label: 'Échec', value: '' }, { label: 'Nom', value: 'Kévin Paly' }, { label: 'Courriel', value: 'hello@myadion.com', mono: true }]" />
      <UiKeyValue tiles :items="[{ label: 'Commission', value: '1,4 % + 0,25 € par transaction' }, { label: 'Mise à disposition', value: '7 jours après chaque encaissement' }, { label: 'Réserve', value: 'Aucune' }, { label: 'Versements', value: 'Actifs' }]" />
      <div class="ui-grid-2">
        <div class="ui-section__body">
          <h3 class="ui-section__sub">Liste</h3>
          <UiList :items="['Un crédit envoie une partie de SMS.', { text: '3 numéros ont répondu STOP.', icon: 'mdi-cancel' }]" />
        </div>
        <div class="ui-section__body">
          <h3 class="ui-section__sub">Frise</h3>
          <UiTimeline :items="timeline" />
        </div>
      </div>
      <h3 class="ui-section__sub">Un appel à l’API, avec une application</h3>
      <UiCode :code="apiExample" />
      <h3 class="ui-section__sub">Un identifiant à copier</h3>
      <UiCopyId value="pay_whk_01HZX8K3M2Q9" />
      <h3 class="ui-section__sub">Un texte à lire en entier (wrap)</h3>
      <UiCode wrap code="Un texte à lire en entier, comme un prompt à coller dans une IA : avec wrap, il revient à la ligne au lieu de défiler de côté, et le bouton Copier reste en haut à droite." />
    </UiSection>

    <UiSection id="envie" title="Pages qui donnent envie" lead="Pour la page vide d’un produit, une découverte, une mise en route : une accroche (UiHero), des bénéfices (UiFeatureGrid), des cartes à choisir (UiChoiceCards), une mise en route (UiSetup), la phrase à copier (UiCopyCallout), des demandes à essayer (UiPromptList). Une couleur par famille de produit.">
      <UiSegmented v-model="family" label="Famille" :items="families.map((f) => ({ value: f, label: f }))" />
      <UiHero :family="family" eyebrow="Hébergement web" icon="mdi-web" title="Votre site en ligne, sans y penser" promise="Un hébergement rapide, sauvegardé chaque nuit, avec son nom de domaine et ses adresses e-mail.">
        <template #actions><UiButton kind="primary" icon="mdi-plus">Commander un hébergement</UiButton></template>
        <template #foot><UiFeatureGrid :family="family" :items="heroBenefits" /></template>
      </UiHero>
      <UiSetup v-model="setupStep" :family="family" :done="setupDone" :steps="[{ key: 'choose', title: 'Choisissez', summary: pick }, { key: 'copy', title: 'Copiez' }, { key: 'try', title: 'Essayez' }]">
        <template #step-choose>
          <UiChoiceCards v-model="pick" :family="family" :items="[{ value: 'Starter', label: 'Starter', hint: '1 site' }, { value: 'Pro', label: 'Pro', hint: '5 sites' }, { value: 'Business', label: 'Business', hint: 'Sites illimités' }]" @update:model-value="() => { setupDone = [...new Set([...setupDone, 'choose'])]; setupStep = 'copy' }" />
        </template>
        <template #step-copy>
          <UiCopyCallout :family="family" lead="Collez ceci dans votre IA, elle s’occupe du reste." text="Lis https://adion-api.eu/ia et suis les instructions pour connecter Adion Cloud." />
          <div class="ui-form__actions"><UiButton icon="mdi-check" @click="() => { setupDone = [...new Set([...setupDone, 'copy'])]; setupStep = 'try' }">C’est fait</UiButton></div>
        </template>
        <template #step-try>
          <UiPromptList :family="family" :items="['Quelles factures dois-je payer ?', 'Envoie un SMS de test à mon numéro.']" />
        </template>
      </UiSetup>
    </UiSection>

    <UiSection id="courriels" title="Courriels" lead="L’éditeur visuel d’Orbit, porté dans le kit : UiMailStudio assemble le canevas (UiMailCanvas : cliquer, double-cliquer pour écrire, glisser, « + » entre deux blocs, clair/sombre, ordinateur/téléphone, annuler), les réglages du bloc choisi (UiMailBlockSettings, colonnes comprises), le menu d’ajout (UiMailBlockMenu) et l’alignement (UiMailAlignPicker). UiMailTemplatePicker choisit le message, UiMailGallery et UiMailThumbnail montrent les modèles en vignettes, UiColorInput prend une couleur. Dans l’espace, le HTML vient de Nexus ; ici, un rendu de démonstration.">
      <UiMailStudio v-model="mailDoc" v-model:scheme="mailScheme" document-key="demo" :html="mailHtml" :subject="mailDoc.subject" @refresh="renderDemo">
        <template #panel>
          <div class="ui-mail-panel">
            <p class="ui-mail-panel__title">Le message</p>
            <UiInput v-model="mailDoc.subject" label="Objet" />
            <UiMailTemplatePicker :templates="[{ key: 'a', name: 'Lettre du mois', subject: 'Nos nouvelles du mois', version: 3 }, { key: 'b', name: 'Promotion', subject: '-20 % ce week-end' }]" selected-key="a" />
            <UiColorInput model-value="#15803d" label="Couleur des boutons" />
          </div>
        </template>
      </UiMailStudio>
      <UiMailGallery :items="[{ id: 'a', name: 'Lettre du mois', subject: 'Nos nouvelles du mois', meta: 'Version 3', html: mailHtml }, { id: 'b', name: 'Promotion', subject: '-20 % ce week-end', loading: true }]">
        <template #actions><UiButton kind="quiet" icon="mdi-pencil-outline" icon-only title="Ouvrir" /></template>
      </UiMailGallery>
      <h3 class="ui-section__sub">L’éditeur riche : UiMailStyleFields (texte, bouton, boîte, section), UiMailDropZone, UiMailTemplateGallery</h3>
      <div class="ui-grid-2">
        <UiMailStyleFields v-model="demoStyle" :groups="['text', 'box']" :editor="demoEditor" />
        <div class="ui-section__body">
          <UiMailDropZone />
          <div><UiButton kind="secondary" icon="mdi-view-gallery-outline" @click="demoGallery = true">Ouvrir la galerie des modèles</UiButton></div>
        </div>
      </div>
      <UiMailTemplateGallery v-model="demoGallery" :items="[{ key: 'a', name: 'Lettre d’information', description: 'Un bandeau, deux rubriques.', category: 'newsletter', category_label: 'Lettre d’information', html: mailHtml }]" :categories="[{ key: 'newsletter', label: 'Lettre d’information' }]" />
    </UiSection>

    <UiSection id="contrastes" title="Contrastes" lead="Chaque couple texte/surface des jetons, calculé (WCAG). Le seuil AA est de 4,5:1 pour un texte, 3:1 pour l’anneau de focus. Le garde-fou (contrast.test.js) échoue sous le seuil.">
      <div class="ui-grid-2">
        <div v-for="block in contrast" :key="block.theme" class="ui-section__body">
          <h3 class="ui-section__sub">Thème {{ block.theme === 'dark' ? 'sombre' : 'clair' }}</h3>
          <UiTable :columns="contrastColumns" :rows="block.rows" :row-key="(r) => r.fg + r.bg" dense :stack="false">
            <template #cell-state="{ row }"><UiBadge :label="row.ok ? 'AA' : 'Sous AA'" :tone="row.ok ? 'ok' : 'bad'" /></template>
          </UiTable>
        </div>
      </div>
    </UiSection>
  </div>
</template>
