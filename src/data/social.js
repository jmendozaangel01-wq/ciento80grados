/**
 * Redes de 180 Grados. Fuente única: cualquier página que enlace a las redes
 * lee de acá, para que un cambio de handle no haya que perseguirlo por el
 * repo entero.
 *
 * Las URLs van limpias a propósito. Los enlaces que da el botón de compartir
 * traen parámetros de rastreo de sesión (`_r`, `_t`, `igsh`, `utm_source=qr`)
 * que identifican desde dónde se compartió: no aportan nada en un enlace fijo
 * del sitio y quedan viejos enseguida.
 */
export const SOCIAL = [
  {
    key: 'tiktok',
    label: 'TikTok',
    handle: '@ciento80_grados',
    url: 'https://www.tiktok.com/@ciento80_grados',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    handle: '@jairothebuilder',
    url: 'https://www.instagram.com/jairothebuilder',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    handle: '@cien80grados',
    url: 'https://www.youtube.com/@cien80grados',
  },
]

/** Las dos que van en el navbar: las de contenido corto. */
export const SOCIAL_NAV = SOCIAL.filter(s => s.key === 'tiktok' || s.key === 'instagram')

export const TIKTOK = SOCIAL.find(s => s.key === 'tiktok').url
export const INSTAGRAM = SOCIAL.find(s => s.key === 'instagram').url
