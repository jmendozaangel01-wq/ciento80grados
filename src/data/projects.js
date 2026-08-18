/**
 * Single source of truth for every project shown on the site.
 *
 * Three places read from this file: the orbital teaser on the home page
 * (components/Portfolio.jsx), the portfolio index (pages/PortfolioIndex.jsx),
 * and the per-project detail page (pages/ProjectDetail.jsx). Adding a project
 * here makes it appear in all three, so never duplicate this array.
 *
 * Field guide
 * -----------
 * slug      URL segment. Lives at /portfolio/<slug>. Must be unique, and should
 *           never change once shared or existing links break.
 * category  Drives the index filters. Must match a key in CATEGORIES below.
 * desc      Short pitch. Used on cards and in the orbital panel. Keep it near
 *           two lines so the card grid stays even.
 * detail    Longer body for the detail page. Falls back to desc when empty.
 * problem   Optional. What the client faced before. Section hides when empty.
 * result    Optional. What changed afterwards. Section hides when empty.
 * cover     Optional path under /public, such as /portfolio/crc-clinica.jpg.
 *           Leave empty and the card renders a generated placeholder instead,
 *           so the grid stays presentable before screenshots exist.
 * gallery   Optional extra images for the detail page. Same rules as cover.
 * link      Live project. External URLs start with http, anything else is
 *           treated as an internal route. Leave empty when nothing is public.
 */

export const CATEGORIES = [
  { key: 'todos',          label: 'Todos'          },
  { key: 'web',            label: 'Web'            },
  { key: 'ecommerce',      label: 'E-commerce'     },
  { key: 'automatizacion', label: 'Automatización' },
  { key: 'ia',             label: 'IA'             },
]

export const PROJECTS = [
  {
    slug: 'crc-clinica',
    title: 'CRC Clínica',
    tag: 'Salud · Web Institucional',
    category: 'web',
    year: '2026',
    role: 'Diseño y desarrollo',
    desc: 'Sitio institucional para Centro Radiológico del Caribe, IPS líder en Cartagena.',
    detail: 'Sitio institucional para Centro Radiológico del Caribe, una IPS de Cartagena de Indias. Tema oscuro con identidad médica, carrusel de servicios en portada, grilla de especialidades y formulario de contacto. Construido en HTML y CSS puro, sin frameworks, para que el equipo interno pueda mantenerlo sin depender de un proceso de build.',
    problem: '',
    result: '',
    tech: ['HTML / CSS', 'JavaScript', 'Diseño Web'],
    link: 'https://crcsas.com/',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: true,
  },
  {
    slug: 'salimeh-store',
    title: 'Salimeh Store',
    tag: 'E-commerce · Shopify',
    category: 'ecommerce',
    year: '2026',
    role: 'Desarrollo y optimización',
    desc: 'Tienda Shopify de moda con diseño personalizado y catálogo optimizado para conversión.',
    detail: 'Tienda Shopify de moda con diseño personalizado sobre tema base, apps de conversión integradas y catálogo optimizado para maximizar ventas. Incluye trabajo de estructura de colecciones y ajustes de plantilla en Liquid.',
    problem: '',
    result: '',
    tech: ['Shopify', 'Liquid', 'Apps'],
    link: 'https://www.salimehstore.com/',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: true,
  },
  {
    slug: 'bornos-buy',
    title: 'Bornos Buy',
    tag: 'E-commerce · Shopify',
    category: 'ecommerce',
    year: '2026',
    role: 'Desarrollo y optimización',
    desc: 'Plataforma de comercio electrónico con catálogo extenso y checkout optimizado.',
    detail: 'Plataforma de comercio electrónico en Shopify con un catálogo extenso de sneakers y accesorios, y un checkout ajustado para reducir la fricción en el cierre de compra.',
    problem: '',
    result: '',
    tech: ['Shopify', 'Apps'],
    link: 'https://www.bornosbuy.com/',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: true,
  },
  {
    slug: 'panel-haccp',
    title: 'Panel HACCP',
    tag: 'Automatización · Dashboard',
    category: 'automatizacion',
    year: '2026',
    role: 'Automatización y dashboard',
    desc: 'Panel de control HACCP para planta de producción, sincronizado con Google Sheets.',
    detail: 'Panel de control HACCP para una planta de producción: monitoreo de freidoras, cuartos fríos y puntos críticos en tiempo real, sincronizado con Google Sheets como fuente de datos. Reemplaza el registro manual en papel de los controles del proceso.',
    problem: '',
    result: '',
    tech: ['Google Sheets', 'APIs'],
    link: 'https://jmendozaangel01-wq.github.io/control-freidora/',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: false,
  },
  {
    slug: 'feed-noticias',
    title: 'Feed de Noticias',
    tag: 'Automatización · n8n',
    category: 'automatizacion',
    year: '2026',
    role: 'Automatización',
    desc: 'Flujo n8n que agrega noticias de múltiples fuentes RSS y las publica solo.',
    detail: 'Flujo en n8n que agrega noticias de múltiples fuentes RSS, las procesa y las publica automáticamente en este mismo sitio a través de un webhook. El feed se mantiene actualizado sin ninguna intervención manual.',
    problem: '',
    result: '',
    tech: ['n8n', 'RSS', 'Automatización'],
    link: '/#noticias',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: false,
  },
  {
    slug: 'analizador-instagram',
    title: 'Analizador de Instagram',
    tag: 'Automatización · n8n',
    category: 'automatizacion',
    year: '2026',
    role: 'Automatización y análisis',
    desc: 'Scrapea cuentas de Instagram y genera un reporte de competencia con datos reales.',
    detail: 'Flujo que scrapea cuentas de Instagram y genera un reporte detallado de competencia: likes, comentarios, posts ganadores y patrones de contenido. La idea es dejar de opinar sobre qué funciona y empezar a decidirlo con datos.',
    problem: '',
    result: '',
    tech: ['n8n', 'Scraping', 'Análisis'],
    link: '/instagram',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: true,
  },
  {
    slug: 'hero-animado-ia',
    title: 'Hero Animado con IA',
    tag: 'Herramienta IA · Guía',
    category: 'ia',
    year: '2026',
    role: 'Investigación y guía',
    desc: 'Guía para crear videos exploded view y particle morph con IA e integrarlos como hero.',
    detail: 'Guía práctica para crear videos tipo exploded view y particle morph con Kling AI, y montarlos como hero banner de una página web sin destrozar el rendimiento de carga. Incluye los prompts concretos y el proceso completo.',
    problem: '',
    result: '',
    tech: ['Kling AI', 'Video IA', 'Hero Web'],
    link: '/guia-hero',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: false,
  },
  {
    slug: 'renovar-ai',
    title: 'Renovar AI',
    tag: 'Herramienta IA · Diseño',
    category: 'ia',
    year: '2026',
    role: 'Producto e integración IA',
    desc: 'Subís la foto de un espacio y la IA devuelve la renovación visual y el video antes/después.',
    detail: 'Herramienta que transforma espacios con IA: subís una foto de tu cuarto, sala u oficina y obtenés una renovación visual en estilo minimalista o de construcción. También genera videos de transición antes/después, pensado para arquitectos e ingenieros civiles que necesitan mostrar una propuesta sin renderizar nada a mano.',
    problem: '',
    result: '',
    tech: ['IA Generativa', 'n8n', 'Diseño'],
    link: '/renovar-ai',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: true,
  },
  {
    slug: 'monitor-nike',
    title: 'Monitor Nike',
    tag: 'Herramienta IA · Dashboard',
    category: 'ia',
    year: '2026',
    role: 'Automatización y dashboard',
    desc: 'Dashboard en tiempo real de precios y disponibilidad de tallas Nike.',
    detail: 'Dashboard en tiempo real que monitorea precios y disponibilidad de tallas de Nike. Lee los datos desde una hoja de Google Sheets que n8n mantiene actualizada, y muestra fotos de producto, diferencial de precio y alertas de stock.',
    problem: '',
    result: '',
    tech: ['Google Sheets', 'n8n', 'React'],
    link: '/dashboard',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: false,
  },
  {
    slug: 'comparador-precios',
    title: 'Comparador de Precios',
    tag: 'Automatización · n8n',
    category: 'automatizacion',
    year: '2026',
    role: 'Automatización',
    desc: 'Escanea más de 500 productos de Coach y On Running y arma el reporte de stock solo.',
    detail: 'Workflows de scraping para Coach y On Running: escanean más de 500 productos, detectan disponibilidad de stock y generan un reporte detallado de forma automatizada. Es un trabajo que a mano tomaba horas y ahora corre sin que nadie lo mire.',
    problem: '',
    result: '',
    tech: ['n8n', 'Scraping', 'Automatización'],
    link: '',
    cover: '',
    gallery: [],
    symbol: '○',
    featured: false,
  },
]

/** Looks up a single project by its URL slug. Returns undefined when missing. */
export function getProject(slug) {
  return PROJECTS.find(p => p.slug === slug)
}

/** True when a link points outside the site and needs target="_blank". */
export function isExternal(link) {
  return typeof link === 'string' && /^https?:\/\//.test(link)
}
