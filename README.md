# CareLink — Healthcare, Connected Around You

A **frontend-only React prototype** of a Nigerian healthcare app. Every appointment,
consultation, test result, prescription, price and pharmacy order in CareLink is
**sample data held in local React state** — there is no backend, no database, no
authentication, and nothing here diagnoses, treats or transacts anything real.

> CareLink is not a real healthcare provider. Nothing in this prototype is medical advice.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Stack

| Concern            | Choice                                                        |
| ------------------ | ------------------------------------------------------------- |
| App shell          | React 18 + Vite                                               |
| Styling            | Tailwind CSS 3.4 (design tokens in `tailwind.config.js`)      |
| Animation          | Framer Motion (restrained presets, reduced-motion support)    |
| Icons              | Lucide React                                                  |
| Charts             | Recharts (only where a chart adds clarity)                    |
| Routing            | React Router v6                                               |
| Data               | Local mock data + a simulated async service layer             |
| Imagery            | Unsplash photos with a custom-SVG fallback (`SmartImage`)     |
| Illustrations      | Hand-written inline SVG (logo, hero pulse, empty states)      |

## Routes

`/` · `/dashboard` · `/doctors` · `/appointments` · `/consultation` · `/laboratory` ·
`/test-results` · `/prescriptions` · `/pharmacy` · `/health-records` · `/profile` · `/settings`

Mobile (< lg) uses a five-item bottom bar — Home, Appointments, Records, Pharmacy,
Profile — with the full navigation in the desktop sidebar.

## Structure

```
src/
  components/
    ui/          CareLinkButton, cards, badges, modals, forms, DoctorCard,
                 AppointmentCard, PrescriptionCard, TestResultCard, SmartImage…
    layout/      Logo, AppHeader, Sidebar, MobileNav, Footer
    sections/    Hero, QuickActions, UpcomingAppointment, HealthJourney,
                 DoctorsSection, PharmacySection, HealthStats
  pages/         the 12 routed pages
  context/       CareLinkContext — reducer, toasts, preferences, consultation timer
  hooks/         useMockHealth (loading / error / retry over the mock service)
  services/      mockHealthService — simulated async actions (300–800 ms delays)
  data/          mockData — Nigerian sample profiles, appointments, results,
                 prescriptions, products, records, journey, stats
  lib/           utils, motion presets
  styles/        index.css — tokens + @layer components classes
scripts/         headless QA (see below)
```

## Design system

Tokens live in `tailwind.config.js` (`brand.*`, `status.*`) and reusable component
classes live in `src/styles/index.css`.

| Token           | Value     | Used for                       |
| --------------- | --------- | ------------------------------ |
| Deep Medical Blue | `#155EEF` | primary actions, trust        |
| Aqua Teal       | `#0E9F9A` | progress, calm feedback        |
| Soft Sky        | `#E8F3FF` | information panels             |
| Mint            | `#E7F8F3` | completed states               |
| Slate           | `#475467` | supporting text                |
| Dark Navy       | `#101828` | headings                       |
| Success/Warning/Emergency | `#12B76A` / `#F79009` / `#D92D20` | status |

**Status is never colour alone** — every status pairs colour with an icon *and* text
(`✓ Completed`, `⚠ Needs review`, `● Current step`).

**Motion is deliberately quiet.** Entrances are a 280 ms fade with an 8 px lift
(40 ms stagger), menus settle in 160 ms, route changes crossfade with a 4 px settle,
and nothing loops for decoration — no pulsing, pinging or spinning icons, no
scroll-driven travel, no glow or gradient headlines. Motion only confirms state; it
never competes with content, and `prefers-reduced-motion` (or the **Reduce motion**
toggle) switches it off entirely.

## Safety rules baked into the UI

- Demo/sample labelling on every record: *Demo Appointment*, *Sample Health Record*,
  *Mock Test Result*, *Demo Prescription*, *Demo Price*, *Simulated Consultation*.
- Page-level disclaimers (`SafetyNotice`) and a persistent prototype strip in the header.
- No diagnosis, no medication guidance, no real payment — checkout, booking and
  "orders" only ever mutate local state.
- `Settings → About this prototype` repeats the scope and lets you reset demo data.

## Responsive & accessibility

- Mobile-first: < 640 mobile, 640–1024 tablet, > 1024 desktop sidebar layout.
- 48 px minimum touch targets in the mobile bottom bar, visible focus rings,
  skip-to-content link, labelled controls, ARIA roles on dialogs/tab groups,
  `prefers-reduced-motion` honoured (plus a manual **Reduce motion** toggle).

## Headless QA scripts

These use `puppeteer-core` against the local dev server (`http://localhost:5173`)
and expect Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`
(override with `BASE_URL` / your own install).

```bash
npm run smoke            # renders all routes, logs console/page errors, runs the
                         # booking + pharmacy-cart flows, writes scripts/shots/
npm run shots            # full-page desktop screenshots → scripts/shots-full/
npm run shots:mobile     # full-page mobile screenshots (prefix m-)
npm run check:responsive # horizontal-overflow audit at 360 px (WIDTH/HEIGHT to override)
npm run check:images     # scrolls each route and reports broken images
node scripts/doctor-grid.mjs  # doctor photos rendered exactly as the cards frame them
node scripts/mincontent.mjs /profile 335  # min-content overflow audit for a route
```

`scripts/shots/` and `scripts/shots-full/` hold the captured screenshots from the
last run and can be deleted at any time.
