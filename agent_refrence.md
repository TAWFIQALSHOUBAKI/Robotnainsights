# Robotna Dashboard — Update Protocol

## Architecture (important — read first)

The dashboard is **fully dynamic**. There are NO static data constants to patch inside `index.html`.
All data lives in **`data.js`** — a separate file loaded by `index.html` as a script tag.

`data.js` exports three constants:

```js
const CAMPAIGN_META = { name, goal, since, until };
const FINDINGS      = [ { date, note }, ... ];   // empty array = panel hidden
const RAW_DATA      = [ { day, adset, ad, age, gender, spend, results, impressions, reach }, ... ];
```

Every chart, table, KPI, and dropdown recomputes from `RAW_DATA` on every date filter change.

**To update the dashboard: generate a new `data.js` (via portal) and replace the file.**

---

## Preferred update path — Control Portal (`portal.html`)

1. Open `portal.html` in a browser and log in (password: `robotna2026`)
2. Upload the new `.csv` export from Meta Ads Manager
3. Fill in Campaign Meta (name, goal, date range)
4. Add / edit Analyst Findings if needed
5. Click **Download data.js**
6. Replace `data.js` in the project root with the downloaded file
7. Reload `index.html` — dashboard updates automatically

---

## Manual update path — script extraction (fallback)

Use when the portal is unavailable or CSV needs pre-processing.

### Daily CSV (preferred — has `Day` column)

```python
import pandas as pd, json, warnings
warnings.filterwarnings('ignore')

df = pd.read_csv('/mnt/user-data/uploads/FILENAME.csv')
df = df[df['Campaign name'].notna()].copy()
for col in ['Results','Amount spent (USD)','Impressions','Reach']:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

rows = []
for _, r in df.iterrows():
    rows.append({
        'day':    str(r['Day']).strip(),
        'adset':  str(r['Ad set name']),
        'ad':     str(r['Ad name']),
        'age':    str(r['Age']),
        'gender': str(r['Gender']).lower(),
        'spend':  round(float(r['Amount spent (USD)']), 6),
        'results':     int(r['Results']),
        'impressions': int(r['Impressions']),
        'reach':       int(r['Reach']),
    })

days = sorted(set(r['day'] for r in rows))
print('const RAW_DATA =', json.dumps(rows, ensure_ascii=False) + ';')
print('// Days:', days[0], '→', days[-1], '| Rows:', len(rows))
```

### Weekly XLSX (fallback — has `Week` column, no daily breakdown)

```python
import pandas as pd, json, warnings
warnings.filterwarnings('ignore')

df = pd.read_excel('/mnt/user-data/uploads/FILENAME.xlsx', sheet_name=0)
df = df[df['Campaign name'].notna()].copy()
for col in ['Results','Amount spent (USD)','Impressions','Reach']:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

rows = []
for _, r in df.iterrows():
    ws, we = str(r['Week']).split(' - ')
    rows.append({
        'day':    ws.strip(),   # use week start as day key
        'ws':     ws.strip(),
        'we':     we.strip(),
        'adset':  str(r['Ad set name']),
        'ad':     str(r['Ad name']),
        'age':    str(r['Age']),
        'gender': str(r['Gender']).lower(),
        'spend':  round(float(r['Amount spent (USD)']), 6),
        'results':     int(r['Results']),
        'impressions': int(r['Impressions']),
        'reach':       int(r['Reach']),
    })

print('const RAW_DATA =', json.dumps(rows, ensure_ascii=False) + ';')
```

> Note: for weekly XLSX also update `filterRows` in `index.html` to use `r.ws <= until && r.we >= since` instead of `r.day`.

---

## `data.js` full template

```js
// ── CAMPAIGN META ──────────────────────────────────────────────
const CAMPAIGN_META = {
  "name":  "Robotna",
  "goal":  "Outcome Engagement",
  "since": "YYYY-MM-DD",
  "until": "YYYY-MM-DD"
};

// ── ANALYST FINDINGS ────────────────────────────────────────────
const FINDINGS = [
  { "date": "YYYY-MM-DD", "note": "your note here" }
];
// Set FINDINGS = []; to hide the panel entirely.

// ── RAW DATA ─────────────────────────────────────────────────────
const RAW_DATA = [...];
```

---

## What NOT to touch in `index.html`

- `filterRows()` — already handles `day` field
- `computeData()` — auto-groups by day, computes all aggregates
- `initCharts()` — reads from `D.*` (computed dataset), not RAW_DATA directly
- `updateTrendChart()` — reads from RAW_DATA + dropdowns dynamically
- Any CSS, chart code, table builders, or PDF renderer

---

## Token budget per update

| Step | Tokens |
|---|---|
| Extraction script | ~200 |
| RAW_DATA replace | ~500 |
| CAMPAIGN_META + FINDINGS | ~100 |
| **Total** | **~800** |

---

## Feature inventory

| Feature | Status | Notes |
|---|---|---|
| 4 tabs: Overview, Weekly, Creative & Ads, Audience | ✓ | |
| Date range picker — desktop + mobile FAB | ✓ | Fully working, both responsive |
| Daily / Weekly / Ad Set chart toggle (Overview) | ✓ | |
| Trend chart with Metric + Campaign + Ad Set + Ad dropdowns | ✓ | Weekly tab |
| Metrics: CPR, Post Engagements, CTR, Frequency | ✓ | |
| Download PDF — html2canvas, 2-page vertical A4 | ✓ | Arabic renders natively; `unit:'mm'` for correct A4 sizing |
| Sortable tables, best-row highlight | ✓ | |
| Ad set cards — dynamic from `D.adsets` | ✓ | Any number of ad sets; was previously hardcoded to 2 |
| Age filter by ad set (Audience tab) | ✓ | Filter buttons generated dynamically from `D.adsets` |
| Per-ad audience dropdown (Audience tab) | ✓ | |
| Embedded Robotna logo (base64 webp) | ✓ | No external URL needed |
| Mobile responsive — scroll tabs, FAB date button | ✓ | |
| Analyst Findings Panel | ✓ | Yellow panel below tabbar; hidden when `FINDINGS = []` |
| Control Portal (`portal.html`) | ✓ | CSV upload → `data.js` generation |
| Footer: Created by Tawfeeq Alshobaki | ✓ | |
| Export JSON | ✗ | Removed |

---

## RAW_DATA row schema

```js
{
  day:          "2026-05-16",   // YYYY-MM-DD — used by filterRows()
  adset:        "DM_Broad_AMM_ZAR_IRB",
  ad:           "لغة الأرقام_Reel",
  age:          "25-34",
  gender:       "male",         // lowercase: male | female | unknown
  spend:        1.234567,
  results:      842,
  impressions:  2100,
  reach:        1890,
}
```

## computeData() output schema (D.*)

```js
D.core        // { spend, reach, impressions, results, cpr, engRate }
D.daily       // [ { week(label), ws, we, spend, results, impressions, reach, cpr } ] — one entry per day
D.weekly      // [ { week(label), ws, we, spend, results, impressions, reach, cpr } ] — one entry per Mon–Sun calendar week
D.adsets      // [ { name, spend, results, impressions, reach, cpr } ]
D.ads         // [ { name, adset, key, spend, results, impressions, reach, cpr } ]
              //   key = "adName|||adsetName" — unique per ad+adset delivery unit
              //   ⚠ same creative in multiple ad sets = multiple entries with different key/adset/cpr
D.age         // [ { seg, spend, results, impressions, reach, cpr } ]
D.gender      // [ { seg, spend, results, impressions, reach, cpr } ]
D.ageByAdset  // { adsetName: [ { seg, ... } ] }
D.adsAudience // { "adName|||adsetName": [ { seg, ... } ] }  — keyed by composite, NOT ad name alone
```

`D.daily` is used by: Overview "Daily" toggle.  
`D.weekly` is used by: Overview "Weekly" toggle, Weekly tab charts, Weekly tab table.  
`D.ads[].key` is used by: audience dropdown option values, `setAdAudience`, `adsAudience` lookup.

## PDF export notes

- Uses **html2canvas + jsPDF** — browser renders HTML including Arabic RTL text natively
- jsPDF: `unit:'mm', format:'a4'` → page = 210mm × 297mm; HTML wrap = 794px (A4 at 96dpi)
- html2canvas: `scale:2` → 1588px-wide canvas; placed in PDF at full 210mm width, proportional height
- Padding: 48px top/bottom, 56px left/right (~15mm margins)
- Arabic cells detected via `/[؀-ۿ]/` regex → `direction:rtl` applied
- 2 pages: Page 1 = KPIs + Daily table + Ad Sets table | Page 2 = Ads + Age + Gender
- Reflects **current date filter** — PDF matches what's on screen
- Button shows `⏳ Generating…` during render (~1–2 seconds)

## File locations

| File | Purpose |
|---|---|
| `index.html` | Stakeholder dashboard |
| `portal.html` | Analyst control portal — generates `data.js` |
| `data.js` | Live data layer — replace to update dashboard |
| `agent_refrence.md` | This update protocol |
| `DASHBOARD_CHECK.md` | QA checklist |
| GitHub repo | https://github.com/TAWFIQALSHOUBAKI/Robotnainsights |
