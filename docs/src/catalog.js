/*
 * LE SOMMAIRE DE LA DOC : la barre de gauche, une page par composant (ou par
 * petite famille de composants qui vont ensemble). Chaque exemple est un
 * fichier de ./examples : la doc l'affiche en direct, et son code dessous est
 * ce fichier lui-meme.
 */
export const guides = [
  { id: 'principes', title: 'Principes', path: '/' },
  { id: 'installation', title: 'Installation', path: '/installation' },
  { id: 'jetons', title: 'Jetons', path: '/jetons' },
  { id: 'contrastes', title: 'Contrastes', path: '/contrastes' },
  { id: 'maquette', title: 'Maquette Public Cloud', path: '/maquette', external: true },
]

export const groups = [
  {
    title: 'Gabarits de page',
    pages: [
      { id: 'list-layout', title: 'Liste', components: ['UiListLayout', 'UiServiceTable'], lead: 'La page d’une famille de services : en-tête, chiffres, tableau, liens du produit. Toutes les listes de l’espace client ont cette structure.', examples: [{ file: 'list-layout.base', title: 'Une liste de services' }] },
      { id: 'detail-layout', title: 'Fiche', components: ['UiDetailLayout'], lead: 'La page d’un service : fil d’Ariane, nom, état, gestes, bandeaux, chiffres, onglets. Le gabarit range les onglets : « Vue d’ensemble » en premier, réglages et résiliation à la fin.', examples: [{ file: 'detail-layout.base', title: 'La fiche d’un hébergement' }] },
      { id: 'wizard-layout', title: 'Création pas à pas', components: ['UiWizardLayout'], lead: 'Une question par écran, Précédent et Suivant en bas, un récapitulatif à droite.', examples: [{ file: 'wizard-layout.base', title: 'Créer une application' }] },
      { id: 'app-shell', title: 'Coque d’application', components: ['UiAppShell', 'UiTopBar', 'UiIconActions'], lead: 'La barre de gauche de haut en bas, la barre du haut à sa droite, puis la page. Sur un écran de 900 px et moins, la barre de gauche se cache et le bouton menu de la barre du haut l’ouvre dans un panneau.', examples: [{ file: 'app-shell.layout', title: 'La coque entière' }, { file: 'app-shell.topbar', title: 'La barre du haut', text: 'brand-always montre le logo même sur ordinateur, pour une app sans barre de gauche.' }, { file: 'app-shell.actions', title: 'Des gestes en icônes', text: 'Décrits par des données : un lien (to, href) ou un bouton qui émet action. tone: danger rougit au survol.' }] },
      { id: 'sidebar', title: 'Barre de gauche', components: ['UiSidebar', 'UiSidebarContext', 'UiSidebarModes', 'UiSidebarSearch', 'UiSidebarSection', 'UiSidebarProduct', 'UiSidebarEntry', 'UiSidebarEmpty', 'UiSidebarFooter', 'UiSidebarLink', 'UiSidebarChild'], lead: 'La barre de gauche d’une application : le logo et ses gestes, le compte et le projet, les rangements, le filtre, l’arbre des produits et de leurs services, le pied. Le kit la dessine ; l’app la remplit et dit ce que fait chaque clic.', examples: [{ file: 'sidebar.base', title: 'La barre de l’espace client' }] },
      { id: 'form-layout', title: 'Réglages', components: ['UiFormLayout'], lead: 'Des sections titrées, des champs alignés et une barre d’enregistrement qui apparaît dès qu’un champ change.', examples: [{ file: 'form-layout.base', title: 'Les réglages du compte' }] },
    ],
  },
  {
    title: 'Structure',
    pages: [
      { id: 'page-header', title: 'En-tête de page', components: ['UiPageHeader'], lead: 'Une liste (famille, titre, phrase) ou une fiche (fil d’Ariane, nom, état, faits). Les gestes à droite, l’action principale tout à droite.', examples: [{ file: 'page-header.list', title: 'En-tête de liste' }, { file: 'page-header.resource', title: 'En-tête de fiche', text: 'resource : le cartouche, avec l’état et les faits du service.' }] },
      { id: 'section', title: 'Section', components: ['UiSection'], lead: 'Le rythme d’une page : un titre, une phrase, un contenu. Une section dans une section perd son cadre.', examples: [{ file: 'section.base', title: 'Section avec un geste' }, { file: 'section.collapsible', title: 'Section repliable' }] },
      { id: 'card', title: 'Carte', components: ['UiCard'], lead: 'Pour comparer côte à côte, dans .ui-cards. Une seule carte choisie (selected) à la fois.', examples: [{ file: 'card.offers', title: 'Des offres à comparer' }, { file: 'card.families', title: 'En dégradé, une teinte par famille', text: 'family : la marque ou la famille du produit. Le texte reste vérifié AA.' }] },
      { id: 'tabs', title: 'Onglets', components: ['UiTabs', 'UiSubTabs'], lead: 'UiTabs sous l’en-tête d’une fiche (query="onglet" garde l’onglet dans l’adresse) ; UiSubTabs à l’intérieur d’un onglet.', examples: [{ file: 'tabs.base', title: 'Onglets et sous-onglets' }] },
    ],
  },
  {
    title: 'Actions',
    pages: [
      { id: 'button', title: 'Bouton', components: ['UiButton'], lead: 'Quatre sortes, pas une de plus. Une seule action primaire par zone ; danger se confirme toujours (UiConfirm).', examples: [{ file: 'button.kinds', title: 'Les quatre sortes' }, { file: 'button.states', title: 'Chargement, désactivé, icône seule, lien' }] },
      { id: 'action-menu', title: 'Menu d’actions', components: ['UiActionMenu'], lead: 'Le bouton « Actions » d’une fiche. L’API envoie la liste ; une action indisponible est grisée avec sa raison, « Résilier » est en rouge, à part, tout en bas.', examples: [{ file: 'action-menu.base', title: 'Les actions d’un service' }] },
      { id: 'drawer', title: 'Tiroir', components: ['UiDrawer'], lead: 'Le détail d’une ligne ou un formulaire qui glisse de la droite sans quitter la page : 420 px sur ordinateur, tout l’écran sur téléphone. Échap ou le voile le ferment.', examples: [{ file: 'drawer.base', title: 'Le détail d’une instance' }] },
      { id: 'command-palette', title: 'Palette de recherche', components: ['UiCommandPalette'], lead: 'Une carte posée au centre : le champ en haut, les résultats groupés dessous, l’aide du clavier au pied. Les flèches parcourent, Entrée ouvre, Échap ferme ; l’app fournit les résultats.', examples: [{ file: 'command-palette.base', title: 'Chercher un service, une facture, une page' }] },
      { id: 'help-menu', title: 'Aide à la demande', components: ['UiHelpMenu'], lead: 'Un lien discret qui ouvre une fenêtre de questions, chacune avec son icône ; un clic déplie sa réponse, une seule à la fois.', examples: [{ file: 'help-menu.base', title: 'L’aide d’une page de connexion' }] },
      { id: 'identifier-input', title: 'E-mail ou téléphone', components: ['UiIdentifierInput'], lead: 'Une lettre ou un @ : un e-mail. Des chiffres : un téléphone, mis en forme pendant la frappe au format international, avec le drapeau de son pays. « 07… » devient « +33 7… » selon le pays du navigateur. Les drapeaux viennent de flag-icons, que l’app charge.', examples: [{ file: 'identifier-input.base', title: 'Le champ de connexion' }] },
      { id: 'split-layout', title: 'Page en deux volets', components: ['UiSplitLayout'], lead: 'Une photo à gauche sur toute la hauteur, qui reste en place ; le contenu à droite, un formulaire entier. Au téléphone, la photo s’efface. À poser dans UiAppShell flush.', examples: [{ file: 'split-layout.base', title: 'L’inscription' }] },
      { id: 'date-input', title: 'Date', components: ['UiDateInput'], lead: 'Au clavier (JJ/MM/AAAA, les barres se posent seules) ou au calendrier, qui s’ouvre au clic. Pour une date de naissance (birthday), le calendrier s’ouvre sur l’année d’il y a seize ans, et rien d’après n’est choisissable.', examples: [{ file: 'date-input.base', title: 'Une date de naissance' }] },
      { id: 'country-select', title: 'Pays', components: ['UiCountrySelect'], lead: 'Un pays avec son drapeau et son nom en français ; on tape pour chercher. La France vient en tête (first). Les drapeaux viennent de flag-icons, que l’app charge.', examples: [{ file: 'country-select.base', title: 'Le pays d’une société' }] },
      { id: 'welcome', title: 'Accueil', components: ['UiWelcome'], lead: 'Après une réussite (une inscription, une commande) : le titre, une coche verte qui se dessine dans un halo avec deux ondes et une gerbe d’étincelles, puis le bouton. Sans animation si la personne l’a demandé.', examples: [{ file: 'welcome.base', title: 'Bienvenue' }] },
      { id: 'account-picker', title: 'Choix du compte', components: ['UiAccountPicker'], lead: 'Les comptes déjà connectés sur l’appareil, comme des sessions ouvertes : l’initiale, le prénom, l’identifiant et un indice du dernier moyen (clé, e-mail, SMS). Un clic choisit, la croix retire de l’appareil, et « Utiliser un autre compte » ouvre le champ.', examples: [{ file: 'account-picker.base', title: 'Trois comptes' }] },
      { id: 'passkey-list', title: 'Passkeys', components: ['UiPasskeyList'], lead: 'Les passkeys d’un compte, dans le dessin du choix du compte : le nom, la dernière utilisation et la croix pour retirer. Le retrait se confirme dans l’app.', examples: [{ file: 'passkey-list.base', title: 'Deux passkeys' }] },
      { id: 'signed-in-badge', title: 'Compte connecté', components: ['UiSignedInBadge'], lead: 'Une petite pastille d’une ligne en haut d’une page de compte (UiSplitLayout #top) : l’avatar, « Connecté en tant que » et le nom, l’identifiant en infobulle, et « Changer de compte » (action).', examples: [{ file: 'signed-in-badge.base', title: 'Kévin' }] },
      { id: 'dialog', title: 'Fenêtre', components: ['UiDialog'], lead: 'Plein écran sur téléphone. Annuler à gauche, l’action à droite.', examples: [{ file: 'dialog.base', title: 'Une fenêtre avec un champ' }] },
      { id: 'confirm', title: 'Confirmation', components: ['UiConfirm'], lead: 'Le bouton dit ce qu’il fait. Un geste définitif demande de cocher une case.', examples: [{ file: 'confirm.base', title: 'Confirmer un geste' }, { file: 'confirm.danger', title: 'Confirmer un geste dangereux' }] },
    ],
  },
  {
    title: 'Données',
    pages: [
      { id: 'table', title: 'Tableau', components: ['UiTable'], lead: 'Recherche, filtres, tri, colonnes choisies par le client, pagination, ligne cliquable, états vide, chargement et erreur ; une fiche par ligne sur téléphone.', examples: [{ file: 'table.maquette', title: 'À la forme de la maquette', text: 'icon et tone posent une tuile, sub une seconde ligne ; quick donne les gestes au survol et émet quick.' }, { file: 'table.base', title: 'Un tableau et ses états' }] },
      { id: 'stat', title: 'Chiffres', components: ['UiStat'], lead: 'Dans .ui-stats ou le créneau stats des gabarits. Une tendance, une courbe, une aide courte.', examples: [{ file: 'stat.base', title: 'Une rangée de chiffres' }] },
      { id: 'key-value', title: 'Faits', components: ['UiKeyValue'], lead: 'Une seule forme de faits, aux colonnes alignées. Une valeur vide s’affiche « — ».', examples: [{ file: 'key-value.columns', title: 'En colonnes' }, { file: 'key-value.tiles', title: 'En tuiles' }] },
      { id: 'link-list', title: 'Raccourcis', components: ['UiLinkList'], lead: 'Les portes d’entrée d’un accueil ou d’une page introuvable : une ligne par destination, sa tuile d’icône, une aide courte et la flèche.', examples: [{ file: 'link-list.base', title: 'Aller directement à' }] },
      { id: 'activity', title: 'Activité', components: ['UiActivity'], lead: 'Ce qui vient de se passer, du plus récent au plus ancien : une tuile d’icône teintée par le ton, le titre, puis qui et quand.', examples: [{ file: 'activity.base', title: 'L’activité d’un projet' }] },
      { id: 'list', title: 'Liste', components: ['UiList'], lead: 'Des phrases à puces, avec une icône si elle aide.', examples: [{ file: 'list.base', title: 'Une liste' }] },
      { id: 'timeline', title: 'Frise', components: ['UiTimeline'], lead: 'Ce qui s’est passé, du plus récent au plus ancien, avec le ton de chaque événement.', examples: [{ file: 'timeline.base', title: 'Le journal d’une application' }] },
      { id: 'code', title: 'Code et identifiants', components: ['UiCode', 'UiCopyId'], lead: 'Un bloc de code avec son bouton Copier ; un identifiant à copier d’un clic.', examples: [{ file: 'code.block', title: 'Un appel à l’API' }, { file: 'code.wrap', title: 'Un texte à lire en entier (wrap)' }, { file: 'code.copy-id', title: 'Un identifiant à copier' }] },
      { id: 'charts', title: 'Graphiques', components: ['UiLineChart', 'UiBarChart'], lead: 'Couleurs --adion-chart-*, un trait différent par série, valeurs lisibles au survol et aux flèches du clavier.', examples: [{ file: 'charts.line', title: 'Courbes' }, { file: 'charts.bar', title: 'Barres' }] },
      { id: 'meter', title: 'Jauge', components: ['UiMeter'], lead: 'Une quantité sur un maximum, avec son aide.', examples: [{ file: 'meter.base', title: 'La longueur d’un SMS' }] },
      { id: 'health', title: 'État des services', components: ['UiHealthGroup'], lead: 'healthOf(état) donne le mot et le ton d’un état de l’API ; UiHealthGroup montre une famille de services et leur disponibilité.', examples: [{ file: 'health.base', title: 'Une famille perturbée' }] },
    ],
  },
  {
    title: 'États et retours',
    pages: [
      { id: 'badge', title: 'Badge et état', components: ['UiBadge', 'UiStatus'], lead: 'Le ton vient de l’API (tone, status_tone) et se traduit en ok, warn, bad, info, accent, muted. Un état ne se dit jamais par la seule couleur.', examples: [{ file: 'badge.base', title: 'Les badges' }, { file: 'badge.status', title: 'L’état d’un service' }] },
      { id: 'notice', title: 'Encadré', components: ['UiNotice', 'UiSandboxBanner'], lead: 'UiNotice remplace v-alert, .callout, .banner et .flash.', examples: [{ file: 'notice.tones', title: 'Les quatre tons' }, { file: 'notice.sandbox', title: 'Le bandeau Sandbox' }] },
      { id: 'secret', title: 'Secret', components: ['UiSecret'], lead: 'Un secret montré une seule fois, à copier tout de suite.', examples: [{ file: 'secret.base', title: 'Le secret d’une application' }] },
      { id: 'feedback', title: 'Vide, chargement, erreur', components: ['UiEmpty', 'UiLoading', 'UiError', 'UiDenied'], lead: 'Chaque liste a ces quatre états ; aucun écran ne les dessine lui-même.', examples: [{ file: 'feedback.empty', title: 'Vide' }, { file: 'feedback.loading', title: 'Chargement' }, { file: 'feedback.error', title: 'Erreur et refus' }] },
    ],
  },
  {
    title: 'Formulaires',
    pages: [
      { id: 'form', title: 'Grille de formulaire', components: ['UiForm'], lead: 'Libellé, contrôle, aide ou erreur dessous. Deux colonnes pour les champs courts, toute la largeur pour les longs (wide).', examples: [{ file: 'form.grid', title: 'Un formulaire complet' }] },
      { id: 'input', title: 'Champ', components: ['UiInput'], lead: 'Un libellé au-dessus, une aide en infobulle (tip), l’erreur dessous.', examples: [{ file: 'input.base', title: 'Champ, erreur, zone de texte' }] },
      { id: 'select', title: 'Liste de choix', components: ['UiSelect', 'UiCombobox'], lead: 'UiSelect pour choisir dans une liste ; UiCombobox quand on peut aussi saisir.', examples: [{ file: 'select.base', title: 'Choix et saisie libre' }] },
      { id: 'segmented', title: 'Segment', components: ['UiSegmented'], lead: 'Deux à quatre choix courts, tous visibles.', examples: [{ file: 'segmented.base', title: 'Le type de compte' }] },
      { id: 'slider', title: 'Curseur', components: ['UiSlider'], lead: 'Une valeur dans une plage : le libellé, la valeur dite en clair à droite, la piste remplie du vert d’Adion.', examples: [{ file: 'slider.base', title: 'Des heures et un plafond' }] },
      { id: 'checkbox', title: 'Case et interrupteur', components: ['UiCheckbox'], lead: 'Une case pour accepter ; un interrupteur pour un réglage qui agit tout de suite.', examples: [{ file: 'checkbox.base', title: 'Case, case dangereuse, interrupteur' }] },
      { id: 'choices', title: 'Choix décrits', components: ['UiChoices'], lead: 'Plusieurs choix, chacun avec sa phrase.', examples: [{ file: 'choices.base', title: 'Les droits d’une application' }] },
      { id: 'tags-input', title: 'Pastilles', components: ['UiTagsInput'], lead: 'Une liste de valeurs ; coller une liste la découpe, les valeurs invalides sont signalées.', examples: [{ file: 'tags-input.base', title: 'Des numéros' }] },
      { id: 'address', title: 'Adresse', components: ['UiAddress'], lead: 'L’adresse postale, avec la recherche d’adresse.', examples: [{ file: 'address.base', title: 'Une adresse' }] },
      { id: 'file-input', title: 'Dépôt de fichier', components: ['UiFileInput'], lead: 'Glisser-déposer ou clic ; le nom et la taille s’affichent.', examples: [{ file: 'file-input.base', title: 'Un fichier CSV' }] },
      { id: 'column-mapper', title: 'Colonnes d’import', components: ['UiColumnMapper'], lead: 'Chaque colonne d’un fichier vers un champ.', examples: [{ file: 'column-mapper.base', title: 'Importer des contacts' }] },
      { id: 'sortable-list', title: 'Liste à réordonner', components: ['UiSortableList'], lead: 'Glisser une ligne, ou Monter et Descendre au clavier.', examples: [{ file: 'sortable-list.base', title: 'L’ordre d’une cascade' }] },
      { id: 'checklist', title: 'Liste de contrôle', components: ['UiChecklist'], lead: 'Ce qui est prêt, ce qui manque, et pourquoi.', examples: [{ file: 'checklist.base', title: 'Avant un envoi' }] },
      { id: 'wizard', title: 'Assistant', components: ['UiWizard'], lead: 'Les étapes seules, à poser dans une fenêtre ou une section ; UiWizardLayout pour une page entière.', examples: [{ file: 'wizard.base', title: 'Quatre étapes' }] },
    ],
  },
  {
    title: 'Messages',
    pages: [
      { id: 'message-preview', title: 'Aperçu de SMS', components: ['UiMessagePreview', 'UiUnicodeNotice'], lead: 'Le message tel que le verra le destinataire, et l’avertissement Unicode.', examples: [{ file: 'message-preview.base', title: 'L’aperçu' }, { file: 'message-preview.unicode', title: 'Un caractère spécial' }] },
      { id: 'channel-chip', title: 'Canal', components: ['UiChannelChip'], lead: 'Un canal d’un contact et son accord.', examples: [{ file: 'channel-chip.base', title: 'E-mail et mobile' }] },
      { id: 'order-block', title: 'Commander', components: ['UiOrderBlock'], lead: 'L’offre et ses paquets, quand le service manque dans le projet. Les liens viennent de l’API.', examples: [{ file: 'order-block.base', title: 'Commander le SMS' }] },
    ],
  },
  {
    title: 'Notifications et assistant',
    pages: [
      { id: 'notifications', title: 'Notifications', components: ['UiNotificationBell', 'UiNotificationDrawer', 'UiAssistantButton'], lead: 'La cloche en haut à droite et le volet qui s’ouvre à droite. Dans l’espace client, UiNotificationCenter les branche seul.', examples: [{ file: 'notifications.base', title: 'La cloche et le volet' }] },
      { id: 'assistant', title: 'Assistant (volet)', components: ['UiAssistantPanel', 'UiAssistantMessage', 'UiAssistantConfirmCard', 'UiAssistantLimit'], lead: 'Le client pilote son espace en discutant. Un geste se confirme ; un plafond remplace la saisie.', examples: [{ file: 'assistant.thread', title: 'Une conversation à confirmer' }, { file: 'assistant.limit', title: 'Le plafond atteint' }] },
    ],
  },
  {
    title: 'Pages qui donnent envie',
    pages: [
      { id: 'hero', title: 'Accroche', components: ['UiHero', 'UiFeatureGrid'], lead: 'Pour la page vide d’un produit : une promesse, une action, trois bénéfices. Une couleur par famille.', examples: [{ file: 'hero.base', title: 'L’hébergement web' }] },
      { id: 'promo', title: 'Carte à vagues', components: ['UiPromoCard'], lead: 'Une carte qui donne envie : dégradé bleu nuit vers vert, deux vagues qui ondulent lentement. Une par écran, pas plus.', examples: [{ file: 'promo.base', title: 'Brancher ses outils' }] },
      { id: 'setup', title: 'Mise en route', components: ['UiSetup', 'UiChoiceCards', 'UiCopyCallout', 'UiPromptList'], lead: 'Trois étapes : choisir, copier, essayer.', examples: [{ file: 'setup.base', title: 'Brancher son IA' }] },
    ],
  },
  {
    title: 'Courriels',
    pages: [
      { id: 'mail-studio', title: 'Éditeur de courriel', components: ['UiMailStudio', 'UiMailCanvas', 'UiMailBlockSettings', 'UiMailTemplatePicker', 'UiColorInput'], lead: 'Cliquer, double-cliquer pour écrire, glisser, « + » entre deux blocs, clair ou sombre, ordinateur ou téléphone. Dans l’espace, le HTML vient de l’API.', examples: [{ file: 'mail-studio.base', title: 'Le studio' }] },
      { id: 'mail-gallery', title: 'Modèles de courriel', components: ['UiMailGallery', 'UiMailTemplateGallery', 'UiMailStyleFields', 'UiMailDropZone'], lead: 'Les modèles en vignettes, la galerie, les réglages de style.', examples: [{ file: 'mail-gallery.base', title: 'Les vignettes' }, { file: 'mail-gallery.rich', title: 'Réglages et galerie' }] },
    ],
  },
]

export const pages = groups.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.title })))
export const pageById = Object.fromEntries(pages.map((p) => [p.id, p]))
