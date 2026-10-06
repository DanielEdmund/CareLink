/**
 * Full-page screenshots of every route (desktop + mobile) for visual QA.
 *   node scripts/capture.mjs
 */
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'shots-full')
const BASE = process.env.BASE_URL || 'http://localhost:5173'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const routes = [
  ['home', '/'],
  ['dashboard', '/dashboard'],
  ['doctors', '/doctors'],
  ['appointments', '/appointments'],
  ['consultation', '/consultation'],
  ['laboratory', '/laboratory'],
  ['test-results', '/test-results'],
  ['prescriptions', '/prescriptions'],
  ['pharmacy', '/pharmacy'],
  ['health-records', '/health-records'],
  ['profile', '/profile'],
  ['settings', '/settings'],
]

const mobile = process.argv.includes('--mobile') || process.env.MOBILE === '1'

await mkdir(OUT, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport(
  mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 950, deviceScaleFactor: 1 }
)

for (const [name, route] of routes) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 1400))
  await page.screenshot({
    path: path.join(OUT, `${mobile ? 'm-' : ''}${name}.png`),
    fullPage: true,
  })
  console.log(`✓ ${name}`)
}

await browser.close()
console.log(`saved to ${OUT}`)
