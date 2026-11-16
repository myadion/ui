/*
 * LA TOPOLOGIE RESEAU, EN GRILLE (Adion UI) : une colonne par reseau, une
 * ligne par appareil (routeur, instance). Chaque cellule dit si l'appareil y
 * a un port (`port`), et ou passe le trait qui part de l'appareil : jusqu'au
 * dernier reseau ou il est branche (`through` avant, `end` sur le dernier,
 * `none` apres). Sans Vue, pour etre teste.
 */

/**
 * @param {Array<{id:string}>} networks
 * @param {Array<{id:string, ports?:Array<{network:string, label?:string, labels?:string[]}>}>} devices
 */
export function topologyRows(networks, devices) {
  const columns = (Array.isArray(networks) ? networks : []).map((n) => n.id)
  return (Array.isArray(devices) ? devices : []).map((device) => {
    const ports = Array.isArray(device.ports) ? device.ports : []
    const byNetwork = new Map()
    for (const port of ports) {
      if (!columns.includes(port.network)) continue
      const labels = byNetwork.get(port.network) || []
      for (const label of [port.label, ...(port.labels || [])]) if (label) labels.push(label)
      byNetwork.set(port.network, labels)
    }
    const last = columns.reduce((at, id, index) => (byNetwork.has(id) ? index : at), -1)
    const cells = columns.map((id, index) => ({
      network: id,
      port: byNetwork.has(id),
      labels: byNetwork.get(id) || [],
      line: last < 0 || index > last ? 'none' : index === last ? 'end' : 'through',
    }))
    return { device, cells, unplugged: last < 0 }
  })
}

/** Les routeurs d'abord, puis les instances, chacun dans l'ordre des noms. */
export function sortDevices(devices) {
  const rank = (d) => (d.kind === 'router' ? 0 : 1)
  return [...(Array.isArray(devices) ? devices : [])].sort((a, b) => rank(a) - rank(b) || String(a.name || '').localeCompare(String(b.name || ''), 'fr'))
}
