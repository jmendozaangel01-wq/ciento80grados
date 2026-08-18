/**
 * Regenerates public/sitemap.xml from the project list.
 *
 * Runs automatically before every build (see the prebuild script in
 * package.json), so adding a project to src/data/projects.js is enough to get
 * it indexed. Editing the sitemap by hand will be overwritten.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { PROJECTS } from '../src/data/projects.js'

const ORIGIN = 'https://ciento80grados.com'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const STATIC_ROUTES = [
  { path: '/',            changefreq: 'weekly',  priority: '1.0' },
  { path: '/portfolio',   changefreq: 'weekly',  priority: '0.9' },
  { path: '/renovar-ai',  changefreq: 'monthly', priority: '0.7' },
  { path: '/senalia',     changefreq: 'monthly', priority: '0.7' },
  { path: '/dashboard',   changefreq: 'monthly', priority: '0.6' },
  { path: '/instagram',   changefreq: 'monthly', priority: '0.6' },
  { path: '/guia-hero',   changefreq: 'monthly', priority: '0.6' },
]

const routes = [
  ...STATIC_ROUTES,
  ...PROJECTS.map(p => ({
    path: `/portfolio/${p.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  })),
]

const body = routes.map(r => `  <url>
    <loc>${ORIGIN}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8')
console.log(`[sitemap] ${routes.length} URLs escritas en public/sitemap.xml`)
