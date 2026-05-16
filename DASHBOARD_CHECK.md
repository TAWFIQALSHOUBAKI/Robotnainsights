# Robotna Dashboard — QA System

> **Agent instructions:** Run every check in order. For each item: open the file in a browser (or use browser DevTools console), perform the action, observe the result. Mark ✅ PASS or ❌ FAIL with a one-line note. If any FAIL is found, stop and fix it before continuing. Do not mark PASS without actually verifying.

---

## Pre-flight

Before starting any check, run these in the browser console on `index.html`:

```js
// 1. Verify data layer loaded
console.assert(Array.isArray(RAW_DATA) && RAW_DATA.length > 0, 'RAW_DATA missing or empty');
console.assert(typeof CAMPAIGN_META === 'object' && CAMPAIGN_META.since, 'CAMPAIGN_META missing');
console.assert(Array.isArray(FINDINGS), 'FINDINGS missing');

// 2. Verify all rows have required fields
const bad = RAW_DATA.filter(r =>
  !r.day || !r.adset || !r.ad || !r.age || r.gender === undefined
  || typeof r.spend !== 'number' || typeof r.results !== 'number'
  || typeof r.impressions !== 'number' || typeof r.reach !== 'number'
);
console.assert(bad.length === 0, 'Bad rows:', bad.length, bad.slice(0,3));

// 3. Count unique ad sets (note the number — checks below depend on it)
const adsets = [...new Set(RAW_DATA.map(r => r.adset))];
console.log('Ad sets:', adsets.length, adsets);
```

All three must pass before proceeding.

---

## 1. Initial Load

| # | Check | How to verify |
|---|---|---|
| 1.1 | No console errors | Open DevTools → Console — should be empty on load |
| 1.2 | KPI cards show non-zero values | All 4 KPI cards (Spend, Reach, Results, Eng. Rate) have values > 0 |
| 1.3 | Date range matches `CAMPAIGN_META.since/until` | Header range text and date inputs match dates in `data.js` |
| 1.4 | Robotna logo renders | Logo mark is visible in header (base64 embedded — no broken image) |
| 1.5 | Tab meta shows correct counts | e.g. `"1 week · 3 ad sets · 2 ads"` — counts match data, not hardcoded |
| 1.6 | `#findings-panel` hidden when `FINDINGS = []` | Set FINDINGS to `[]` in data.js, reload — no yellow box appears |
| 1.7 | `#findings-panel` visible when FINDINGS has entries | Current data has 1 finding — yellow panel appears below tabbar |

---

## 2. Ad Set Cards (Overview Tab)

> **Critical:** Cards are generated from `D.adsets`. Count must match unique ad sets in `RAW_DATA`.

| # | Check | How to verify |
|---|---|---|
| 2.1 | Card count matches data | Run `document.querySelectorAll('#adset-cards .card').length` in console — must equal `[...new Set(RAW_DATA.map(r=>r.adset))].length` |
| 2.2 | Each card shows correct ad set name | Card header text matches names from `RAW_DATA` |
| 2.3 | Spend % chip sums to ~100% | Add all chip percentages — should total ≈ 100% |
| 2.4 | CPR values are green | All `.adset-mini-val.green` have a $ value, not "—" |
| 2.5 | Cards update when date range changes | Apply Mon–Wed preset → card values change to match filtered data |

---

## 3. Overview Tab — Charts

| # | Check | How to verify |
|---|---|---|
| 3.1 | **Weekly** toggle: bars = one per Mon–Sun week | Click Weekly — if data spans 2 weeks, see 2 bars; 1 week → 1 bar |
| 3.2 | **Daily** toggle: bars = one per calendar day | Click Daily — each day in range gets its own bar |
| 3.3 | **Ad Set** toggle: bars = one per ad set | Click Ad Set — bar count matches unique ad set count |
| 3.4 | Chart title updates on toggle | "By Week" / "By Day" / "By Ad Set" text changes |
| 3.5 | Gender donut renders with segments | Donut shows Male / Female / Unknown proportions |
| 3.6 | Age bar chart renders | Bars visible for all age groups present in data |

---

## 4. Tabs — Switching

| # | Check | How to verify |
|---|---|---|
| 4.1 | Overview active on load (orange highlight) | First tab button has `.active` class |
| 4.2 | Weekly tab switches without error | Click — no console errors, charts visible |
| 4.3 | Creative & Ads tab switches without error | Click — ads table visible |
| 4.4 | Audience tab switches without error | Click — age chart and filter buttons visible |
| 4.5 | Active state resets correctly | Only the clicked tab button is orange |

---

## 5. Date Picker — Desktop (viewport > 600px)

| # | Check | How to verify |
|---|---|---|
| 5.1 | Orange date button opens popover | Click `#date-trigger` — popover appears |
| 5.2 | Date inputs are editable | Type new dates in `#date-since` and `#date-until` |
| 5.3 | **Mon–Wed preset** filters data | Click → labels update, charts show only Mon–Wed data |
| 5.4 | **Thu–Sat preset** filters data | Click → labels update, charts show only Thu–Sat data |
| 5.5 | **Full report preset** restores all data | Click → all data visible again |
| 5.6 | All range labels update after apply | Check `#range-label`, `#header-range`, `#notice-range`, `#weekly-sub`, `#footer-range` |
| 5.7 | Invalid range shows error | Set since > until, click Apply → `#date-error` appears |
| 5.8 | Click outside closes popover | Click outside the popover — it closes |

---

## 6. Date Picker — Mobile (DevTools → 375px width)

| # | Check | How to verify |
|---|---|---|
| 6.1 | Mobile FAB (orange pill) visible | `#mobile-fab` is visible at 375px width |
| 6.2 | Desktop trigger hidden on mobile | `#date-trigger` is not visible at 375px |
| 6.3 | FAB opens same popover | Tap FAB — same `#date-popover` opens |
| 6.4 | Preset buttons work on mobile | Tap preset → data filters correctly |
| 6.5 | `#mob-range-label` updates | Short-format label (e.g. "May 10 – May 16") updates after applying |

---

## 7. Weekly Tab

| # | Check | How to verify |
|---|---|---|
| 7.1 | Spend chart bars = one per Mon–Sun week | `chart-weekly-spend` bar count = number of calendar weeks in range |
| 7.2 | Results chart bars = one per Mon–Sun week | Same as 7.1 for `chart-weekly-results` |
| 7.3 | Weekly table rows = one per Mon–Sun week | `#table-weekly` row count matches weeks, label format "May 10–16" |
| 7.4 | Trend line renders with metric | `chart-weekly-cpr` shows a line, not empty |
| 7.5 | Metric dropdown changes Y axis | Select "Post Engagements" → line values change |
| 7.6 | Ad set dropdown filters trend line | Select an ad set → line updates to that ad set's data only |
| 7.7 | Ad dropdown filters trend line | Select an individual ad → line updates |
| 7.8 | Legend shows Min / Max / Latest values | Values below trend chart are non-zero |

---

## 8. Creative & Ads Tab

| # | Check | How to verify |
|---|---|---|
| 8.1 | `chart-ads-spend` horizontal bar renders | Bars visible, one per ad |
| 8.2 | CPR rank list is populated | Ads listed with CPR values, best has green ▲ |
| 8.3 | `table-ads` has rows | Rows match number of unique ads in data |
| 8.4 | Best-performing ad row is highlighted | Row with lowest CPR has distinct background |
| 8.5 | Column header click sorts table | Click "Spend" → rows re-order descending |

---

## 9. Audience Tab

| # | Check | How to verify |
|---|---|---|
| 9.1 | Age filter "All" button active on load | First filter button has `.active` class |
| 9.2 | Ad set filter button count matches data | Run `document.querySelectorAll('#adset-filter-btns .filter-btn').length` — must equal unique ad set count |
| 9.3 | Filter button updates age chart | Click each ad set button — chart data changes |
| 9.4 | "All" button restores full data | Click All after filtering — chart shows combined data |
| 9.5 | Ad dropdown populated from data | `#ad-audience-select` has one option per unique ad |
| 9.6 | Selecting ad updates `chart-ad-age` | Choose an ad → ad-level age chart appears |
| 9.7 | Audience table updates with selection | `#table-ad-audience` rows match selected ad's age breakdown |

---

## 10. Analyst Findings Panel

| # | Check | How to verify |
|---|---|---|
| 10.1 | Panel hidden when `FINDINGS = []` | Set FINDINGS to `[]`, reload — `#findings-panel` has `display:none` |
| 10.2 | Panel visible with entries | Current data has 1 finding — yellow card appears below tabbar |
| 10.3 | Date and note render correctly | Finding shows date chip "2026-05-16" and note text |
| 10.4 | HTML in note is escaped | Set `note:"<script>alert(1)</script>"` — must render as text, not execute |
| 10.5 | Panel updates on date filter | Panel is static (findings are not date-filtered); it always shows all findings |

---

## 11. PDF Export

| # | Check | How to verify |
|---|---|---|
| 11.1 | Button shows `⏳ Generating…` during render | Click "Print PDF" — button text changes while generating |
| 11.2 | PDF downloads as 2-page A4 portrait | File downloads; open and check page size is A4 (210×297mm) |
| 11.3 | Content fills full page width | Tables and text span the full width — not a narrow column |
| 11.4 | Margins are ~15mm on all sides | Content does not touch page edges; clear white margin visible |
| 11.5 | Page 1 content: KPIs + Daily table + Ad Sets table | Verify all 3 sections present on page 1 |
| 11.6 | Page 2 content: Ads + Age + Gender tables | Verify all 3 sections present on page 2 |
| 11.7 | Arabic text is readable and RTL | Ad names in Arabic (e.g. لغة الأرقام) display right-to-left |
| 11.8 | PDF reflects active date filter | Apply Mon–Wed preset → download PDF → data matches that filter |

---

## 12. Control Portal (`portal.html`)

| # | Check | How to verify |
|---|---|---|
| 12.1 | Password gate appears on load | Only `#auth-gate` is visible before login |
| 12.2 | Wrong password shows error | Enter wrong password → error message appears |
| 12.3 | Correct password (`robotna2026`) unlocks app | Portal content (`#portal-wrap`) becomes visible |
| 12.4 | ← View Dashboard link works | Click → opens `index.html` |
| 12.5 | CSV upload parses to preview table | Drag-drop or browse a Meta Ads CSV → preview table shows rows |
| 12.6 | Date range auto-fills from CSV | `#meta-since` and `#meta-until` populate from CSV min/max Day values |
| 12.7 | Add Finding creates a row | Click "+ Add Finding" → date + note fields appear |
| 12.8 | Remove (✕) deletes a finding row | Click ✕ → row disappears |
| 12.9 | Download data.js contains correct structure | Open downloaded file — has `CAMPAIGN_META`, `FINDINGS`, `RAW_DATA` |
| 12.10 | Replacing data.js refreshes dashboard | Swap file → reload `index.html` → all data updates |
| 12.11 | Portal state persists on refresh | Reload portal — previously entered meta and rows are restored from localStorage |

---

## 13. Mobile Responsive (DevTools → 375px)

| # | Check | How to verify |
|---|---|---|
| 13.1 | Tab bar scrolls horizontally | Tabs overflow → horizontal scroll, no layout break |
| 13.2 | All tables scroll horizontally | Table content wider than screen → scroll bar inside `.table-wrap` |
| 13.3 | Charts resize to fit | No horizontal page scroll caused by charts |
| 13.4 | Ad set cards stack vertically | `#adset-cards` grid collapses to 1 column |
| 13.5 | Date popover fits on screen | Popover does not overflow or clip off-screen |

---

## 14. Data Integrity Checks (browser console)

Run after loading `index.html` with latest `data.js`:

```js
// Ad set count matches cards
const dataAdsets = [...new Set(RAW_DATA.map(r => r.adset))];
const cardCount  = document.querySelectorAll('#adset-cards .card').length;
console.assert(cardCount === dataAdsets.length, `Cards: ${cardCount} vs data: ${dataAdsets.length}`);

// Audience filter buttons match ad set count
const filterBtns = document.querySelectorAll('#adset-filter-btns .filter-btn').length;
console.assert(filterBtns === dataAdsets.length, `Filter btns: ${filterBtns} vs data: ${dataAdsets.length}`);

// Tab meta is not hardcoded
const meta = document.getElementById('tab-meta').textContent;
console.assert(meta && !meta.includes('2 weeks · 6 ads'), 'Tab meta is still hardcoded!');

// FINDINGS panel state
if (FINDINGS.length === 0) {
  console.assert(document.getElementById('findings-panel').style.display === 'none' ||
    getComputedStyle(document.getElementById('findings-panel')).display === 'none',
    'Findings panel visible with empty FINDINGS');
} else {
  console.assert(document.getElementById('findings-panel').style.display === 'block',
    'Findings panel hidden despite having entries');
}
```

---

## Known Hardcoded Values (must stay in sync with data.js)

| Location | Element | What to update |
|---|---|---|
| `index.html` ~line 443 | `#notice-range` inner text | Updated dynamically by JS — no action needed |
| `index.html` date presets | `applyPreset(since, until)` calls | Update since/until values when campaign dates change |
| `index.html` footer | `#footer-range` | Updated dynamically by JS — no action needed |
| `portal.html` | Password `robotna2026` | Hardcoded — change in source if rotating credentials |

---

## Changelog

| Date | Change | Checked by |
|---|---|---|
| 2026-05-16 | Initial QA system created | — |
| 2026-05-16 | Fixed `#findings-panel` missing from HTML; added `display:none` default | — |
| 2026-05-16 | Fixed Weekly/Daily toggle — added proper Mon–Sun weekly grouping (`D.weekly` vs `D.daily`) | — |
| 2026-05-16 | Fixed PDF sizing — `unit:'mm'` + correct image placement; improved padding to 48/56px | — |
| 2026-05-16 | Fixed ad set cards — dynamic from `D.adsets`; removed 2-card hardcoded HTML | — |
| 2026-05-16 | Fixed audience filter buttons — dynamic from `D.adsets`; removed hardcoded 2-button HTML | — |
| 2026-05-16 | Fixed tab meta — dynamic count of weeks/ad sets/ads; removed hardcoded "2 weeks · 6 ads" | — |
