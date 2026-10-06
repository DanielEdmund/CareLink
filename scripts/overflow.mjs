import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE_URL || 'http://localhost:5173'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
const W = Number(process.env.WIDTH || 390)
const H = Number(process.env.HEIGHT || 844)
await page.setViewport({ width: W, height: H, isMobile: W < 700, hasTouch: W < 700, deviceScaleFactor: W < 700 ? 2 : 1 })

for (const route of process.argv.slice(2).length ? process.argv.slice(2) : ['/']) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 1200))

  const result = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const offenders = []
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return
      if (rect.right > vw + 1 || rect.left < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 90),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          w: Math.round(rect.width),
        })
      }
    })
    return { vw, scrollW: document.documentElement.scrollWidth, count: offenders.length, offenders: offenders.slice(0, 25) }
  })

  console.log(`\n=== ${route} ===`)
  console.log(`viewport=${result.vw} scrollWidth=${result.scrollW} offenders=${result.count}`)
  for (const o of result.offenders) console.log(`  ${o.tag}.${o.cls} [${o.left}→${o.right}] w=${o.w}`)
}

await browser.close()
