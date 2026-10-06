/**
 * Headless smoke test for the CareLink prototype.
 * Verifies every route renders, captures console/page errors and saves screenshots.
 *
 *   node scripts/smoke.mjs
 */
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS = path.join(__dirname, 'shots')
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

const problems = []

async function run() {
  await mkdir(SHOTS, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 })

  page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`[console] ${msg.text()}`)
  })

  for (const [name, route] of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise((r) => setTimeout(r, 1100))
    const text = await page.evaluate(() => document.getElementById('root')?.innerText || '')
    if (text.trim().length < 40) problems.push(`[render] ${route} rendered almost nothing (${text.length} chars)`)
    await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: false })
    console.log(`✓ ${route.padEnd(18)} ${text.length} chars`)
  }

  // ---- interaction: book a demo appointment from the doctors page ----
  await page.goto(`${BASE}/doctors`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 900))
  const booked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /Book demo/i.test(b.textContent || ''))
    if (!btn) return false
    btn.click()
    return true
  })
  await new Promise((r) => setTimeout(r, 700))
  const modalText = await page.evaluate(() => document.querySelector('[role="dialog"]')?.innerText || '')
  if (!booked) problems.push('[interaction] could not find a "Book demo" button on /doctors')
  if (!/demo appointment/i.test(modalText)) problems.push('[interaction] booking dialog did not open')
  await page.screenshot({ path: path.join(SHOTS, 'booking-dialog.png') })

  // confirm a booking end-to-end (choose a slot, then submit)
  const slotClicked = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]')
    if (!dialog) return false
    const slot = [...dialog.querySelectorAll('button')].find((b) => /\d{1,2}:\d{2}\s*(AM|PM)/i.test(b.textContent || ''))
    if (!slot) return false
    slot.click()
    return true
  })
  await new Promise((r) => setTimeout(r, 500))

  const confirmed = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]')
    if (!dialog) return 'no-dialog'
    const submit = [...dialog.querySelectorAll('button')].find((b) => /Confirm demo booking/i.test(b.textContent || ''))
    if (!submit) return 'no-submit'
    submit.click()
    return 'submitted'
  })
  await new Promise((r) => setTimeout(r, 2200))
  const successText = await page.evaluate(() => document.querySelector('[role="dialog"]')?.innerText || '')
  if (!/confirmed/i.test(successText)) {
    problems.push(`[interaction] booking confirmation not shown (state: ${confirmed})`)
  }
  await page.screenshot({ path: path.join(SHOTS, 'booking-confirmed.png') })

  // ---- interaction: add pharmacy item to cart ----
  await page.goto(`${BASE}/pharmacy`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 900))
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /Add to cart/i.test(b.textContent || ''))
    btn?.click()
  })
  await new Promise((r) => setTimeout(r, 1200))
  const cartText = await page.evaluate(() => document.body.innerText)
  if (!/added to your demo cart/i.test(cartText)) problems.push('[interaction] pharmacy cart toast did not appear')
  await page.screenshot({ path: path.join(SHOTS, 'pharmacy-cart.png') })

  // ---- mobile viewport pass ----
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  for (const [name, route] of [['mobile-home', '/'], ['mobile-doctors', '/doctors'], ['mobile-consultation', '/consultation']]) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' })
    await new Promise((r) => setTimeout(r, 1100))
    await page.screenshot({ path: path.join(SHOTS, `${name}.png`) })
  }
  console.log('✓ mobile screenshots captured')

  await browser.close()

  console.log('\n--- SMOKE REPORT ---')
  if (problems.length === 0) {
    console.log('No problems detected.')
  } else {
    console.log(`${problems.length} problem(s):`)
    for (const p of [...new Set(problems)]) console.log(' • ' + p)
  }
  process.exit(problems.length ? 1 : 0)
}

run().catch((err) => {
  console.error('Smoke test crashed:', err)
  process.exit(2)
})
