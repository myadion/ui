import { ref } from 'vue'
import { adionRequest as apiRequest } from './adapter.js'

/*
 * UNE PREFERENCE D'AFFICHAGE QUI SUIT LE CLIENT (Adion UI, 2026-10-13).
 *
 * L'API la garde (GET/PUT/DELETE /me/preference/{key}) pour qu'elle suive la
 * personne d'un appareil a l'autre ; le stockage local sert de repli quand
 * L'API ne repond pas, et d'affichage immediat en attendant sa reponse.
 */
const local = (key) => `adion.pref.${key}`

function readLocal(key) {
  try {
    const raw = localStorage.getItem(local(key))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeLocal(key, value) {
  try {
    if (value === null) localStorage.removeItem(local(key))
    else localStorage.setItem(local(key), JSON.stringify(value))
  } catch { /* stockage plein ou refuse : la preference vit le temps de la page */ }
}

export function usePreference(key) {
  const value = ref(key ? readLocal(key) : null)
  let timer = null

  async function load() {
    if (!key) return
    try {
      const result = await apiRequest({ method: 'GET', path: `/me/preference/${key}`, projectId: '' })
      value.value = result?.value ?? null
      writeLocal(key, value.value)
    } catch { /* L'API muet : on garde la copie locale */ }
  }

  function save(next) {
    value.value = next
    if (!key) return
    writeLocal(key, next)
    clearTimeout(timer)
    timer = setTimeout(() => {
      const request = next === null
        ? apiRequest({ method: 'DELETE', path: `/me/preference/${key}`, projectId: '' })
        : apiRequest({ method: 'PUT', path: `/me/preference/${key}`, data: { value: next }, projectId: '' })
      request.catch(() => { /* gardee localement ; l'API la recevra au prochain choix */ })
    }, 500)
  }

  return { value, load, save, reset: () => save(null) }
}
