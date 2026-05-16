# Dashboard Debug Checklist
> Open `index.html` in browser. Check each item. Mark ✅ pass / ❌ fail.

---

## 1. Initial Load
- [ ] No console errors on load (`F12 → Console`)
- [ ] KPI cards show non-zero values (spend, results, impressions, reach)
- [ ] Default date range matches `CAMPAIGN_META.since/until` in `data.js`
- [ ] Robotna logo renders in header (embedded base64)
- [ ] `#header-range` shows correct campaign goal from `CAMPAIGN_META.goal`

---

## 2. Tabs
- [ ] **Overview** tab activates on load (orange active state)
- [ ] **Weekly** tab switches without error
- [ ] **Creative & Ads** tab switches without error
- [ ] **Audience** tab switches without error
- [ ] Active tab stays highlighted; others reset

---

## 3. Date Picker — Desktop (viewport > 600px)
- [ ] `#date-trigger` button opens `#date-popover`
- [ ] `#date-since` and `#date-until` inputs are editable
- [ ] Preset: **Mon–Wed** filters data and updates all labels
- [ ] Preset: **Thu–Sat** filters data and updates all labels
- [ ] Preset: **Full report** restores full range
- [ ] After applying: `#range-label`, `#header-range`, `#notice-range`, `#weekly-sub`, `#footer-range` all update
- [ ] Invalid range (since > until) shows `#date-error` message
- [ ] Clicking outside popover closes it

---

## 4. Date Picker — Mobile (viewport ≤ 600px, use DevTools)
- [ ] `#mobile-fab` (orange button) is visible; desktop `#date-trigger` is hidden
- [ ] FAB tap opens same `#date-popover`
- [ ] Preset buttons work on mobile
- [ ] `#mob-range-label` updates after applying

---

## 5. Overview Tab
- [ ] `#chart-weekly-overview` renders — toggle **Daily / Weekly / Ad Set** cycles correctly
- [ ] `#chart-gender-donut` renders with gender segments
- [ ] `#chart-age-overview` renders with age segments
- [ ] `#table-adsets` has rows; clicking column headers sorts ascending/descending
- [ ] Best-performing row is highlighted

---

## 6. Weekly Tab
- [ ] `#chart-weekly-spend` renders
- [ ] `#chart-weekly-results` renders
- [ ] `#chart-weekly-cpr` renders
- [ ] `#table-weekly` has rows and is sortable
- [ ] Trend chart: `#trend-metric` dropdown changes Y-axis metric
- [ ] Trend chart: `#trend-campaign` filters by campaign
- [ ] Trend chart: `#trend-adset` filters by ad set
- [ ] Trend chart: `#trend-ad` filters by individual ad

---

## 7. Creative & Ads Tab
- [ ] `#chart-ads-spend` renders
- [ ] `#table-ads` has rows and is sortable
- [ ] Best-performing ad is highlighted

---

## 8. Audience Tab
- [ ] Age filter buttons (All / DM_Broad / Parents) update `#chart-age-main`
- [ ] Active filter button shows highlighted state
- [ ] `#ad-audience-select` dropdown is populated with ad names
- [ ] Changing dropdown updates `#chart-ad-age` and `#table-ad-audience`

---

## 9. Analyst Findings Panel
> **Fixed 2026-05-16** — `#findings-panel` div was missing from HTML; also added `display:none` default so the panel stays hidden until `renderFindings()` shows it.
- [ ] When `FINDINGS = []` in `data.js` — panel is hidden (no empty box)
- [ ] When `FINDINGS` has entries — yellow panel appears between tabbar and body with notes
- [ ] HTML in note text is escaped (no XSS)
- [ ] Panel does not flash empty on load before JS runs

---

## 10. PDF Export
- [ ] Click **Download PDF** — button shows `⏳ Generating…`
- [ ] PDF downloads (2-page A4 vertical)
- [ ] Page 1: KPIs + main chart + Ad Sets table
- [ ] Page 2: Ads table + Age chart + Gender chart
- [ ] Arabic text is readable and RTL in PDF
- [ ] PDF reflects **current** date filter (not full range if filtered)

---

## 11. Mobile Responsive (DevTools → 375px width)
- [ ] Tab bar scrolls horizontally — no overflow cutoff
- [ ] All tables scroll horizontally inside their container
- [ ] Charts resize to fit — no horizontal page scroll
- [ ] `#mobile-fab` visible; header controls adapt
- [ ] Date popover fits on screen without clipping

---

## 12. Control Portal (`portal.html`)
- [ ] Page loads with password gate
- [ ] Wrong password shows error; correct password (`robotna2026`) shows app
- [ ] **← View Dashboard** link opens `index.html`
- [ ] CSV drag-and-drop or browse parses file and shows preview table
- [ ] Date inputs auto-fill from CSV date range after parse
- [ ] Campaign goal dropdown has all 6 goal types
- [ ] Add Finding → row appears with date + note fields; remove (✕) removes it
- [ ] **Download data.js** downloads file containing `CAMPAIGN_META`, `FINDINGS`, and `RAW_DATA`
- [ ] Downloaded `data.js` drop-in replaces existing file → dashboard reloads with new data
- [ ] Portal state (rows, findings, meta) persists after page refresh (localStorage)
- [ ] Multi-line CSV fields and non-comma delimiters parse correctly

---

## 13. data.js Schema Integrity
Run in browser console on `index.html`:
```js
// All rows have required fields
RAW_DATA.every(r => r.day && r.adset && r.ad && r.age && r.gender !== undefined
  && typeof r.spend === 'number' && typeof r.results === 'number')
// → true

// CAMPAIGN_META has all keys
['name','goal','since','until'].every(k => k in CAMPAIGN_META)
// → true

// FINDINGS is an array
Array.isArray(FINDINGS)
// → true
```

---

**File locations**
| File | Purpose |
|---|---|
| `index.html` | Stakeholder dashboard |
| `portal.html` | Analyst control portal — generates `data.js` |
| `data.js` | Live data layer — replace to update dashboard |
| `agent_refrence.md` | Update protocol (manual + portal paths) |
| `DASHBOARD_CHECK.md` | This QA checklist |
