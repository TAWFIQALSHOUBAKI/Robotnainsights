# Robotna Campaign Dashboard

Executive-ready Meta Ads performance dashboard for the **Engagements_Robotna_** campaign.  
Built with **React + TypeScript + Vite**.

## Live Preview

After pushing to GitHub, enable **GitHub Pages** under:  
`Settings → Pages → Source → GitHub Actions`

Your dashboard will be live at:  
`https://<your-username>.github.io/robotna-dashboard/`

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # output → dist/
npm run preview    # preview the build locally
```

## Stack

| Tool | Version |
|------|---------|
| React | 18 |
| TypeScript | 5 |
| Vite | 5 |
| Recharts | 2 |
| Lucide React | 0.383 |

## Features

- **4 tabs** — Overview, Weekly, Creative & Ads, Audience  
- **Editable date range** — calendar picker with quick presets, reflected in header + PDF  
- **Print PDF** — opens branded A4 report (cover page + all tables) and triggers print dialog  
- **Sortable tables** — click any column header; best CPR row highlighted in green  
- **Ad set filter** — age breakdown filterable by ad set  
- **Export JSON** — downloads all hardcoded data as structured JSON  

## Data Source

All data is hardcoded from `Analysis-Report.csv` (Meta Ads Manager export, May 7–15, 2026).  
No API calls. No estimated values.

| Metric | Value |
|--------|-------|
| Total Spend | $96.57 |
| Post Engagements | 72,410 |
| Cost Per Result | $0.0013 |
| Reach | 148,000 |
| Impressions | 176,458 |
| Reporting Period | May 7–15, 2026 |
