import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE_URL || 'http://localhost:5173'

const routes = [
  '/', '/dashboard', '/doctors', '/appointments', '/consultation', '/laboratory',
  '/test-results', '/prescriptions', '/pharmacy', '/health-records', '/profile', '/settings',
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 })

let totalFail = 0
for (const route of routes) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 })
  // scroll through the page slowly so lazy images enter the viewport and settle
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 150))
    }
  })
  await new Promise((r) => setTimeout(r, 3000))
  const res = await page.evaluate(() => {
    const imgs = [...document.images]
    return {
      total: imgs.length,
      failed: imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    }
  })
  totalFail += res.failed.length
  console.log(`${route.padEnd(18)} imgs=${res.total} failed=${res.failed.length}`)
  for (const f of res.failed) console.log('   ✗ ' + f)
}

await browser.close()
process.exit(totalFail ? 1 : 0)
