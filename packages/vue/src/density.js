import { ref } from 'vue'

/*
 * LA DENSITE DES TABLEAUX (Adion UI, 2026-10-29) : normale (des lignes qui
 * respirent) ou compacte (plus de lignes a l'ecran). Un seul reglage pour tous
 * les tableaux de l'app, garde dans le navigateur : changer ici change partout.
 */
const KEY = 'adion.pref.table.density'

function read() {
  try { return localStorage.getItem(KEY) === 'compact' ? 'compact' : 'normal' } catch { return 'normal' }
}

const density = ref(typeof window === 'undefined' ? 'normal' : read())

export function useTableDensity() {
  const set = (value) => {
    density.value = value === 'compact' ? 'compact' : 'normal'
    try { localStorage.setItem(KEY, density.value) } catch { /* reglage le temps de la page */ }
  }
  return { density, set }
}
