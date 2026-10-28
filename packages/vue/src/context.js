/*
 * LE CONTEXTE DANS L'ADRESSE.
 *
 *   /account/{compte}/project/{projet}/services/web/domain/{service}
 *
 * L'adresse fait foi : un lien partage ouvre le bon compte et le bon projet.
 * Le compte est l'identifiant de l'organisation (`org_…`), ou `personal`
 * pour le compte personnel. Le routeur applique ce contexte au store avant
 * d'ouvrir la page (`workspace.applyContext`) ; les anciennes adresses
 * `/services/…` se redirigent vers les nouvelles (`contextPath`).
 */
export const PERSONAL = 'personal'

const PREFIX = /^\/account\/([^/]+)\/project\/([^/]+)(\/.*)?$/

/* Le contexte que porte la route : ses parametres `account` et `project`, ou son chemin. */
export function contextFromRoute(route) {
  const params = route?.params || {}
  if (params.account || params.project) {
    return { account: String(params.account || ''), projectId: String(params.project || '') }
  }
  const m = String(route?.path || '').match(PREFIX)
  return m ? { account: decodeURIComponent(m[1]), projectId: decodeURIComponent(m[2]) } : { account: '', projectId: '' }
}

/* Le compte d'une selection du store : l'organisation, ou le compte personnel. */
export const accountOf = (workspace) => (workspace?.scopeType === 'organization' && workspace?.selectedOrgId ? workspace.selectedOrgId : PERSONAL)

/* L'adresse avec son contexte : `/services/web/domain` devient `/account/org_x/project/p_y/services/web/domain`. */
// Le serveur sert les adresses fixes en dossier (`/services/web/domain/`) : la barre finale ne compte pas.
const trimSlash = (path) => (path.length > 1 ? path.replace(/\/+$/, '') || '/' : path)

export function contextPath({ account, projectId }, path = '/') {
  const rest = trimSlash(String(path || '/').replace(PREFIX, (_, _a, _p, tail) => tail || '/'))
  if (!account || !projectId) return rest
  return `/account/${encodeURIComponent(account)}/project/${encodeURIComponent(projectId)}${rest === '/' ? '' : rest}`
}

/* Le chemin sans son contexte : ce que les routes d'aujourd'hui connaissent. */
export const stripContext = (path) => trimSlash(String(path || '/').replace(PREFIX, (_, _a, _p, tail) => tail || '/'))

/* Ce qu'il faut changer dans le store pour suivre l'adresse : rien, le compte, le projet. */
export function contextChanges(workspace, ctx) {
  const changes = []
  if (!ctx?.account) return changes
  if (ctx.account === PERSONAL) {
    if (workspace.scopeType !== 'personal') changes.push({ kind: 'personal' })
  } else if (workspace.scopeType !== 'organization' || workspace.selectedOrgId !== ctx.account) {
    changes.push({ kind: 'organization', id: ctx.account })
  }
  if (ctx.projectId && (changes.length || workspace.selectedProjectId !== ctx.projectId)) changes.push({ kind: 'project', id: ctx.projectId })
  return changes
}

/* Le contexte du store, dans la forme de l'adresse. */
export const contextOf = (workspace) => ({ account: accountOf(workspace), projectId: String(workspace?.selectedProjectId || '') })

/* Le store est-il deja dans ce contexte ? */
export const inContext = (workspace, ctx) => contextChanges(workspace, ctx).length === 0

/* Applique le contexte de l'adresse au store, en un seul chargement. */
export async function applyRouteContext(workspace, ctx) {
  if (ctx?.account && !inContext(workspace, ctx)) await workspace.applyContext(ctx)
}

/*
 * LES ROUTES QUI PORTENT LE CONTEXTE : tout ce qui vit dans un projet, sous
 * `/services`. Chaque route existe deux fois :
 *   - `/account/:account/project/:project/services/…`, avec son nom : c'est
 *     l'adresse affichee et partagee ;
 *   - `/services/…`, l'ancienne, que le routeur redirige (`meta.legacyContext`)
 *     vers la nouvelle avec le contexte du store. Les liens des ecrans y
 *     passent sans changer.
 */
export const CONTEXT_PARAMS = '/account/:account/project/:project'
const LegacyStub = { render: () => null }

export function contextRoutes(records) {
  const scoped = records.map((record) => ({ ...record, path: `${CONTEXT_PARAMS}${record.path}` }))
  const legacy = records.map(({ path, name }) => ({ path, name: `legacy:${name}`, component: LegacyStub, meta: { requiresAuth: true, legacyContext: true } }))
  return [...scoped, ...legacy]
}
