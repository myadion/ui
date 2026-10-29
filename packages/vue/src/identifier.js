/*
 * E-mail ou telephone ? Une lettre ou un @ : un e-mail. Sinon, des chiffres :
 * un telephone (Adion UI, 2026-10-29). Partage par UiIdentifierInput et l'app.
 */
export function identifierKindOf(value) {
  const v = String(value || '').trim()
  if (!v) return ''
  return /[a-z@]/i.test(v) ? 'email' : 'phone'
}
