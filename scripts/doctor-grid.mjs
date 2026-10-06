import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const ids = [
  ['doc_01 current (Chiamaka)', 'photo-1651008376811-b90baee60c1f'],
  ['doc_02 current (Tunde)', 'photo-1612349317150-e413f6a5b16d'],
  ['doc_03 current (Amina) ✗', 'photo-1614608682850-e0d6ed316d47'],
  ['doc_04 current (Emeka)', 'photo-1537368910025-700350fe46c7'],
  ['doc_05 current (Folake)', 'photo-1559839734-2b71ea197ec2'],
  ['doc_06 current (Ibrahim) ✗', 'photo-1582750433449-648ed127bb54'],
  ['doc_07 current (Ngozi)', 'photo-1527613426441-4da17471b66d'],
  ['doc_08 current (Kelechi)', 'photo-1618498082410-b4aa22193b38'],
  ['cand A male scrubs', 'photo-1622253692010-333f2da6031d'],
  ['cand B black male dr', 'photo-1666214280557-f1b5022eb634'],
  ['cand C female dr+pt', 'photo-1631217868264-e5b90bb7e133'],
  ['cand D female portrait', 'photo-1594824476967-48c8b964273f'],
  ['cand E', 'photo-1584515933487-779824d29309'],
  ['cand F', 'photo-1607990281513-2c110a25bd8c'],
]

const url = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=faces&w=640&h=400&q=70`

const html = `<html><body style="margin:0;font-family:sans-serif;background:#fff">
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:10px">
${ids
  .map(
    ([label, id]) => `<div>
      <div style="position:relative;height:160px;background:#E8F3FF;overflow:hidden">
        <img src="${url(id)}" style="height:100%;width:100%;object-fit:cover;object-position:50% 35%" />
        <span style="position:absolute;left:8px;bottom:8px;background:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700">★ Sample profile</span>
      </div>
      <div style="font-size:12px;font-weight:700;margin-top:4px">${label}</div>
      <div style="font-size:10px;color:#666">${id}</div>
    </div>`
  )
  .join('')}
</div></body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle2', timeout: 60000 })
await page.screenshot({ path: 'scripts/shots/_card-grid.png', fullPage: true })
console.log('saved scripts/shots/_card-grid.png')
await browser.close()
