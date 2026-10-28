/*
 * LE PERSONNEL D'ADION, VU DE L'ESPACE CLIENT (2026-10-13).
 *
 * L'espace client n'a pas de droit « interne » a lire : /iam/effective-access
 * evalue l'espace `client`. Il renvoie en revanche les roles de la personne
 * (`user.roles`), par leur nom. Un client n'y porte que les roles de tout le
 * monde ; un membre de l'equipe en porte au moins un autre.
 *
 * Ce n'est qu'un confort d'affichage (la doc du kit, /ui) : rien de ce qu'il
 * ouvre ne touche aux donnees, et l'API reste seul juge de ce qui est permis.
 */
const EVERYONE = ['client', 'customer', 'tous le monde', 'tout le monde', 'everyone', 'user', 'utilisateur']

export function staffRoles(effectiveAccess) {
  const roles = effectiveAccess?.user?.roles
  if (!Array.isArray(roles)) return []
  return roles.filter((role) => role && !EVERYONE.includes(String(role).trim().toLowerCase()))
}

export const isAdionStaff = (effectiveAccess) => staffRoles(effectiveAccess).length > 0
