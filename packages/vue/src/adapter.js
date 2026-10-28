import { reactive } from 'vue'

/*
 * L'ADAPTATEUR (2026-10-27). Le kit ne connait aucune application : il ne lit
 * ni store, ni client d'API, ni composant d'une app. Chaque app le branche une
 * fois au demarrage, et le kit lui demande ce dont il a besoin :
 *
 *   app.use(createAdionUi({
 *     request,               // (options) => Promise : un appel a l'API
 *                            //   { method, path, data, params, projectId }
 *     context,               // objet reactif { orgId, projectId } (le perimetre ouvert)
 *     services: {            // les gestes communs d'un service
 *       fetchActions(projectId, serviceId),
 *       cancelTermination(projectId, subscriptionId),
 *       updateDescription(serviceId, text),
 *       monitoringStatus(serviceId),
 *     },
 *     labels: { serviceLabel, offerLabel, stateLabel },
 *     notifications: { useNotifications, useAssistant, onUpdate },
 *     components: { OrderButton, ServiceTermination, ServiceMigration },
 *   }))
 *
 * Un morceau absent rend le composant qui en a besoin plus discret (pas de
 * bouton Commander sans OrderButton), jamais en panne.
 */
const empty = () => ({
  request: null,
  context: reactive({ orgId: '', projectId: '' }),
  services: {},
  labels: {},
  notifications: {},
  components: {},
})

let current = empty()

export function createAdionUi(options = {}) {
  current = {
    ...empty(),
    ...options,
    context: options.context || reactive({ orgId: '', projectId: '' }),
  }
  return {
    install(app) {
      app.provide('adion-ui', current)
    },
  }
}

/** Ce que l'app a branche ; lisible hors d'un composant (preferences, tableaux). */
export const useAdion = () => current

/** Un appel a l'API par l'app, ou une erreur claire si l'app n'en a pas donne. */
export function adionRequest(options) {
  if (!current.request) return Promise.reject(Object.assign(new Error('Adion UI : aucune fonction « request » branchée (createAdionUi).'), { status: 0 }))
  return current.request(options)
}
