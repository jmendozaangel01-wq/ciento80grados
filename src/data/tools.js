/**
 * Single source of truth for the AI tools section.
 *
 * Read by the index (pages/ToolsIndex.jsx) and by the detail page
 * (pages/ToolDetail.jsx). Same rule as data/projects.js: never duplicate this
 * array, add here and it shows up everywhere.
 *
 * VOICE: all visitor-facing copy is Colombian Spanish (tú), never voseo.
 * This is the brand's own voice, not the writer's.
 *
 * Field guide
 * -----------
 * slug      URL segment. Lives at /herramientas/<slug>. This is the link that
 *           gets shared from a video, so it must never change once published.
 * kind      Drives the index filters and how the card reads:
 *             'herramienta' — something the visitor uses right now
 *             'guia'        — steps and prompts to copy
 *             'skill'       — a file to download and install
 * href      Set ONLY for entries that already have their own page elsewhere
 *           (the existing tools). The card links straight there and no detail
 *           page is generated. Leave empty and the entry gets
 *           /herramientas/<slug> built from `blocks`.
 * file      Optional download, served from /public. Renders a download button.
 * blocks    Page content, rendered in order. See ToolDetail for the types:
 *             { type: 'texto',  body }
 *             { type: 'paso',   title, body }
 *             { type: 'prompt', title, body?, code }   copyable
 *             { type: 'codigo', title?, lang?, code }  copyable
 *             { type: 'aviso',  title, body }          callout
 */

export const KINDS = [
  { key: 'todos',        label: 'Todo'          },
  { key: 'herramienta',  label: 'Herramientas'  },
  { key: 'guia',         label: 'Guías'         },
  { key: 'skill',        label: 'Skills'        },
]

const PROMPT_SEO = `Actúa como un ingeniero de performance web que audita sitios en producción.

CONTEXTO QUE TE DOY
- Stack del sitio: [React/Vite · WordPress · Shopify · HTML puro · otro]
- URL: [tu-sitio.com]
- ¿Tengo acceso al código fuente?: [sí / no]
- Reporte que ya tengo: [pega aquí el resultado de PageSpeed Insights o el que uses]

REGLAS QUE NO PUEDES ROMPER
1. No apliques NINGUNA recomendación del reporte sin verificarla antes contra el
   código real. Si el reporte pide algo que ya está puesto, dímelo y descártalo.
   Los reportes automáticos se equivocan seguido.
2. Mide antes y mide después. Nada de "esto debería mejorar". Quiero números.
3. Para CLS: identifica el elemento exacto que se mueve y cuántos shifts genera.
   No me des una lista genérica de causas posibles.
4. Para LCP: identifica cuál es el elemento LCP real. Si está oculto por CSS
   —opacity, visibility, una animación que arranca en 0— dímelo. El navegador
   no cuenta como pintado algo que es invisible, así que tu propio CSS puede
   estar frenando la métrica.
5. Si una recomendación es obsoleta, o el test que la genera ya no existe,
   dímelo en vez de hacerme perder el tiempo.
6. Si no puedes verificar algo, di "no puedo verificar esto" en vez de suponer.

CÓMO QUIERO QUE TRABAJES
1. Primero pregúntame todo lo que necesites saber. No propongas cambios todavía.
2. Después diagnostica causa por causa, ordenadas por impacto real, no por el
   orden en que aparecen en el reporte.
3. Para cada causa dime: qué archivo, qué parte, por qué pasa, y qué cambiar.
4. Después de cada cambio, dime cómo verificarlo yo mismo, con el comando o el
   paso concreto.

Empieza preguntándome lo que te falte.`

const PROMPT_CONSENT = `Actúa como un implementador de analítica web con foco en cumplimiento.

Quiero instalar Google Analytics 4 con Consent Mode v2 y un banner de cookies
que funcione de verdad, no uno decorativo.

CONTEXTO
- Stack del sitio: [React/Vite · WordPress · Shopify · HTML puro · otro]
- Desde dónde me visita la gente: [país o región]
- ¿Ya tengo GA4 instalado?: [sí / no]

REQUISITOS
1. Los defaults de Consent Mode v2 tienen que dispararse ANTES de que cargue
   nada de analítica. Si el default llega tarde, el modo de consentimiento no
   sirve para nada.
2. El banner tiene que dejar aceptar, rechazar y elegir qué permitir. Rechazar
   tiene que rechazar de verdad, no solo cerrar el aviso.
3. Dime qué cookies quedan FUERA de mi banner: widgets de chat, embeds de
   video, píxeles de terceros. Esas también cuentan y son las que se olvidan.
4. Adviérteme si con tu implementación el usuario va a poder retirar el
   consentimiento después. Si no hay forma de reabrir el banner, dímelo ahora.
5. Dime qué pasa con el page_view inicial cuando alguien rechaza.

Antes de darme una sola línea de código, pregúntame lo que te falte.`

export const TOOLS = [
  {
    slug: 'seo-performance-con-ia',
    title: 'Arregla el SEO y el performance de tu sitio con IA',
    kind: 'guia',
    tag: 'Guía · SEO y Core Web Vitals',
    desc: 'Los prompts que uso para auditar un sitio de verdad, en vez de seguir una lista que suele estar mal.',
    href: '',
    file: '',
    blocks: [
      {
        type: 'texto',
        body: 'Corres PageSpeed Insights, te da un puntaje feo y una lista de cosas para arreglar. Copias esa lista, se la pegas a una IA, y la IA te devuelve exactamente lo mismo pero redactado más bonito. Cambias cosas, vuelves a medir, y el puntaje casi no se mueve.',
      },
      {
        type: 'texto',
        body: 'El problema no es la IA. Es que le estás pidiendo que obedezca un reporte, y esos reportes se equivocan bastante seguido. En mi propio sitio la auditoría pedía cosas que ya estaban puestas, y marcaba un error con un test que Google apagó hace años. Mientras tanto, la causa real de mi problema no aparecía por ningún lado en la lista.',
      },
      {
        type: 'aviso',
        title: 'Lo que quiero que te lleves',
        body: 'La IA no te sirve para seguir la lista. Te sirve para verificar la lista. Los prompts de abajo están escritos para eso: obligan a medir antes de afirmar, y a decirte cuándo el reporte está equivocado.',
      },
      {
        type: 'prompt',
        title: 'Prompt 1 — Auditoría de performance',
        body: 'Pégalo en Claude o ChatGPT, completa los corchetes y envíalo. Te va a hacer preguntas antes de proponer nada. Eso es a propósito.',
        code: PROMPT_SEO,
      },
      {
        type: 'paso',
        title: 'Cómo usarlo bien',
        body: 'Contéstale las preguntas con datos reales, no con aproximaciones. Si tienes acceso al código, díselo: cambia por completo lo que puede verificar. Y cuando te diga que una recomendación del reporte está mal, pídele que te muestre por qué antes de creerle.',
      },
      {
        type: 'prompt',
        title: 'Prompt 2 — Cookies y Consent Mode v2',
        body: 'Para la parte de analítica y consentimiento. Está armado para que te avise de las cosas que casi siempre se olvidan.',
        code: PROMPT_CONSENT,
      },
      {
        type: 'aviso',
        title: 'La trampa con la que me estrellé',
        body: 'No le pongas analytics.js a tu archivo de analítica, ni CookieBanner.jsx a tu banner. Los bloqueadores de contenido filtran por NOMBRE de archivo: cancelan la petición y en desarrollo te queda la pantalla en blanco sin un solo error en consola. Usa nombres neutros. A mí me costó media tarde descubrirlo.',
      },
    ],
  },
  {
    slug: 'renovar-ai',
    title: 'Renovar AI',
    kind: 'herramienta',
    tag: 'Herramienta · Diseño de espacios',
    desc: 'Subes la foto de un espacio y la IA te devuelve la renovación, y el video antes/después.',
    href: '/renovar-ai',
    file: '',
    blocks: [],
  },
  {
    slug: 'senal-ia',
    title: 'SeñalIA',
    kind: 'herramienta',
    tag: 'Herramienta · Trading',
    desc: 'Score fundamental, técnico y de sentimiento para cualquier ticker del S&P 500.',
    href: '/senalia',
    file: '',
    blocks: [],
  },
  {
    slug: 'analizador-instagram',
    title: 'Analizador de Instagram',
    kind: 'herramienta',
    tag: 'Herramienta · Redes',
    desc: 'Analiza una cuenta y te manda por correo un reporte de competencia con datos reales.',
    href: '/instagram',
    file: '',
    blocks: [],
  },
  {
    slug: 'monitor-inventario',
    title: 'Monitor de Inventario',
    kind: 'herramienta',
    tag: 'Herramienta · E-commerce',
    desc: 'Precios y disponibilidad de tallas en tiempo real, alimentado por n8n.',
    href: '/dashboard',
    file: '',
    blocks: [],
  },
  {
    slug: 'hero-animado-con-ia',
    title: 'Hero animado con IA',
    kind: 'guia',
    tag: 'Guía · Video con IA',
    desc: 'Cómo crear videos exploded view y particle morph con Kling y montarlos como hero.',
    href: '/guia-hero',
    file: '',
    blocks: [],
  },
]

/** Looks up one entry by slug. Returns undefined when missing. */
export function getTool(slug) {
  return TOOLS.find(t => t.slug === slug)
}

/** Entries with their own page elsewhere link out and get no detail route. */
export function hasOwnPage(tool) {
  return Boolean(tool.href)
}
