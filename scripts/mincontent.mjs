import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:5173'
const route = process.argv[2] || '/profile'
const MAX = Number(process.argv[3] || 340)

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 1200))

const rows = await page.evaluate((limit) => {
  const results = []
  const els = [...document.querySelectorAll('.cl-page *')]
  for (const el of els) {
    const prev = el.style.width
    el.style.width = 'min-content'
    const w = el.getBoundingClientRect().width
    el.style.width = prev
    if (w > limit) {
      results.push({
        w: Math.round(w),
        t: el.tagName.toLowerCase(),
        c: String(el.className).slice(0, 80),
        text: (el.textContent || '').trim().slice(0, 70),
      })
    }
  }
  results.sort((a, b) => b.w - a.w)
  return results.slice(0, 20)
}, MAX)

console.log(`min-content offenders on ${route} (> ${MAX}px):`)
for (const r of rows) console.log(`  ${r.w}px  ${r.t}.${r.c}\n        "${r.text}"`)

await browser.close()
