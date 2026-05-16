# Robotna Dashboard — Update Protocol

## Architecture (important — read first)

The dashboard is **fully dynamic**. There are NO static data constants to patch.
All data lives in `const RAW_DATA = [...]` — a flat array of daily rows.
Every chart, table, KPI, and dropdown recomputes from `RAW_DATA` on every date filter change.

**To update the dashboard: replace only `RAW_DATA` + date defaults.**

---

## Daily update prompt (paste as-is)

```
Update robotna-dashboard.html with this new CSV/XLSX.
Follow UPDATE_PROTOCOL.md
```

---

## Step 1 — Run extraction script

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

> Note: for weekly XLSX also update `filterRows` to use `r.ws <= until && r.we >= since` instead of `r.day`.

---

## Step 2 — Patch exactly these 5 things

| # | What | Where in HTML |
|---|---|---|
| 1 | `const RAW_DATA = [...]` | Replace entire JS array |
| 2 | `currentRange = { since:'...', until:'...' }` | First/last day from new data |
| 3 | `id="date-since" value="..."` | HTML date input |
| 4 | `id="date-until" value="..."` | HTML date input |
| 5 | Static display strings (5 elements) | See below |

### Static display strings to update

```
id="header-range"  → "robotna.org · [DATE RANGE] · Outcome Engagement"
id="range-label"   → "[DATE RANGE]"
id="notice-range"  → "Reporting period: [DATE RANGE]"
id="weekly-sub"    → "[DATE RANGE]"
id="footer-range"  → "[DATE RANGE] · No estimated values"
id="mob-range-label" → short format e.g. "May 10 – May 16"
```

### Preset buttons (update since/until values)

```html
<button ... onclick="applyPreset('[SINCE]','[UNTIL]',this)">Full report</button>
```

---

## What NOT to touch

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
| 5 str_replace patches | ~300 |
| **Total** | **~1,000** |

---

## Feature inventory

| Feature | Status | Notes |
|---|---|---|
| 4 tabs: Overview, Weekly, Creative & Ads, Audience | ✓ | |
| Date range picker — desktop + mobile FAB | ✓ | Fully working, both responsive |
| Daily / Weekly / Ad Set chart toggle (Overview) | ✓ | |
| Trend chart with Metric + Campaign + Ad Set + Ad dropdowns | ✓ | Weekly tab |
| Metrics: CPR, Post Engagements, CTR, Frequency | ✓ | |
| Download PDF — html2canvas, 2-page vertical A4 | ✓ | Arabic renders natively |
| Sortable tables, best-row highlight | ✓ | |
| Age filter by ad set (Audience tab) | ✓ | |
| Per-ad audience dropdown (Audience tab) | ✓ | |
| Embedded Robotna logo (base64 webp) | ✓ | No external URL needed |
| Mobile responsive — scroll tabs, FAB date button | ✓ | |
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
D.weekly      // [ { week(label), ws, we, spend, results, impressions, reach, cpr } ]
D.adsets      // [ { name, spend, results, impressions, reach, cpr } ]
D.ads         // [ { name, adset, spend, results, impressions, reach, cpr } ]
D.age         // [ { seg, spend, results, impressions, reach, cpr } ]
D.gender      // [ { seg, spend, results, impressions, reach, cpr } ]
D.ageByAdset  // { adsetName: [ { seg, ... } ] }
D.adsAudience // { adName: [ { seg, ... } ] }
```

## PDF export notes

- Uses **html2canvas** — browser renders HTML including Arabic RTL text natively
- Arabic cells detected via `/[\u0600-\u06FF]/` regex → `direction:rtl` applied
- 2 pages: Page 1 = KPIs + Daily + Ad Sets | Page 2 = Ads + Age + Gender
- Reflects **current date filter** — PDF matches what's on screen
- Button shows `⏳ Generating…` during render (~1–2 seconds)

## File locations

| File | Path |
|---|---|
| Dashboard HTML | `/mnt/user-data/outputs/robotna-dashboard.html` |
| This protocol | `/mnt/user-data/outputs/UPDATE_PROTOCOL.md` |
| CSV/XLSX uploads | `/mnt/user-data/uploads/<filename>` |
| GitHub repo | https://github.com/TAWFIQALSHOUBAKI/Robotnainsights |
