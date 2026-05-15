import { f } from './fmt'
import { WEEKLY, ADSETS, ADS, AGE, GENDER } from '../data/data'

export function printReport(rangeLabel: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Robotna — Campaign Performance Report</title>
<style>
@page{size:A4 landscape;margin:14mm 16mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;color:#0D1526;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{page-break-after:always;padding-bottom:12mm}.page:last-child{page-break-after:avoid}
.cover{display:flex;flex-direction:column;justify-content:center;min-height:160mm}
.logo-bar{display:flex;align-items:center;gap:14px;margin-bottom:28px}
.lm{width:54px;height:54px;border-radius:12px;background:#E8410A;color:#fff;font-size:30px;font-weight:900;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif}
.bn{font-size:22px;font-weight:800}.bu{font-size:12px;color:#7A8595;font-family:monospace;margin-top:2px}
.rule{height:3px;background:#E8410A;width:64px;border-radius:2px;margin-bottom:24px}
.ct{font-size:36px;font-weight:800;color:#0D2445;letter-spacing:-0.02em;line-height:1.1;margin-bottom:10px}
.cs{font-size:16px;color:#3D4A5C;margin-bottom:32px}
.mg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px 28px}
.mi{display:flex;flex-direction:column;gap:3px}
.ml{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#7A8595;font-family:monospace}
.mv{font-size:13px;font-weight:600}
hr{border:none;border-top:1px solid #E2E5EB;margin:28px 0 14px}
.note{font-size:11px;color:#7A8595;font-style:italic}
.sh{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#E8410A;margin:20px 0 12px;padding-bottom:6px;border-bottom:2px solid #E8410A;font-family:monospace}
.sh:first-child{margin-top:0}
.kg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:8px}
.kc{background:#F5F6F8;border:1px solid #E2E5EB;border-radius:8px;padding:12px 14px}
.ka{background:#FEF0EB;border-color:#F06030}.kn{background:#EBF0F8;border-color:#0D2445}
.kl{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#7A8595;font-family:monospace;margin-bottom:6px}
.kv{font-size:22px;font-weight:800;letter-spacing:-0.02em}.ks{font-size:10px;color:#7A8595;margin-top:4px}
table{width:100%;border-collapse:collapse;font-size:10px}
th{background:#0D2445;color:#fff;padding:7px 8px;font-weight:700;font-size:9px;text-transform:uppercase;letter-spacing:.05em;font-family:monospace;white-space:nowrap}
td{padding:6px 8px;border-bottom:1px solid #E2E5EB;font-family:monospace}
.alt td{background:#F9FAFB}.best td{background:#ECFDF5}
.foot{margin-top:18px;padding-top:8px;border-top:1px solid #E2E5EB;display:flex;justify-content:space-between;font-size:9px;color:#7A8595;font-family:monospace}
</style></head><body>

<div class="page cover">
<div class="logo-bar"><div class="lm">R</div><div><div class="bn">Robotna</div><div class="bu">robotna.org</div></div></div>
<div class="rule"></div>
<div class="ct">Campaign Performance Report</div>
<div class="cs">Meta Ads · Paid Engagement · ${rangeLabel}</div>
<div class="mg">
<div class="mi"><span class="ml">Campaign</span><span class="mv">Engagements_Robotna_</span></div>
<div class="mi"><span class="ml">Objective</span><span class="mv">Outcome Engagement</span></div>
<div class="mi"><span class="ml">Status</span><span class="mv">Active</span></div>
<div class="mi"><span class="ml">Period</span><span class="mv">${rangeLabel}</span></div>
<div class="mi"><span class="ml">Account</span><span class="mv">36890470</span></div>
<div class="mi"><span class="ml">Campaign ID</span><span class="mv">6939423326522</span></div>
</div><hr>
<div class="note">Source: Analysis-Report.csv · Meta Ads Manager export · No estimated values.</div>
</div>

<div class="page">
<div class="sh">Executive Summary</div>
<div class="kg">
<div class="kc ka"><div class="kl">Total Spend</div><div class="kv">$96.57</div><div class="ks">$48.28 avg/period</div></div>
<div class="kc kn"><div class="kl">Reach</div><div class="kv">148,000</div><div class="ks">176,458 impressions</div></div>
<div class="kc"><div class="kl">Engagements</div><div class="kv">72,410</div><div class="ks">$0.0013 cost/result</div></div>
<div class="kc"><div class="kl">Engagement Rate</div><div class="kv">41.04%</div><div class="ks">Results ÷ Impressions</div></div>
</div>
<div class="sh">Weekly</div>
<table><thead><tr><th style="text-align:left">Week</th><th style="text-align:right">Spend</th><th style="text-align:right">Results</th><th style="text-align:right">Impressions</th><th style="text-align:right">Reach</th><th style="text-align:right">CPR</th></tr></thead>
<tbody>${WEEKLY.map((r, i) => `<tr class="${i===1?'best alt':''}"><td>${r.week}</td><td style="text-align:right">${f.$(r.spend)}</td><td style="text-align:right">${f.n(r.results)}</td><td style="text-align:right">${f.n(r.impressions)}</td><td style="text-align:right">${f.n(r.reach)}</td><td style="text-align:right">${f.$4(r.cpr)}</td></tr>`).join('')}</tbody></table>
<div class="sh">Ad Sets</div>
<table><thead><tr><th style="text-align:left">Ad Set</th><th style="text-align:right">Spend</th><th style="text-align:right">Results</th><th style="text-align:right">Impressions</th><th style="text-align:right">Reach</th><th style="text-align:right">CPR</th></tr></thead>
<tbody>${ADSETS.map((r, i) => `<tr class="${i===1?'best alt':''}"><td>${r.name}</td><td style="text-align:right">${f.$(r.spend)}</td><td style="text-align:right">${f.n(r.results)}</td><td style="text-align:right">${f.n(r.impressions)}</td><td style="text-align:right">${f.n(r.reach)}</td><td style="text-align:right">${f.$4(r.cpr)}</td></tr>`).join('')}</tbody></table>
</div>

<div class="page">
<div class="sh">Ad-Level Performance</div>
<table><thead><tr><th style="text-align:left">Ad</th><th style="text-align:left">Ad Set</th><th style="text-align:right">Spend</th><th style="text-align:right">Results</th><th style="text-align:right">Impr.</th><th style="text-align:right">Reach</th><th style="text-align:right">CPR</th></tr></thead>
<tbody>${[...ADS].sort((a,b)=>a.cpr-b.cpr).map((r, i) => `<tr class="${i===0?'best':i%2?'alt':''}"><td style="direction:rtl">${r.name}</td><td>${r.adset}</td><td style="text-align:right">${f.$(r.spend)}</td><td style="text-align:right">${f.n(r.results)}</td><td style="text-align:right">${f.n(r.impressions)}</td><td style="text-align:right">${f.n(r.reach)}</td><td style="text-align:right">${f.$4(r.cpr)}</td></tr>`).join('')}</tbody></table>
</div>

<div class="page">
<div class="sh">Age Breakdown</div>
<table><thead><tr><th style="text-align:left">Age</th><th style="text-align:right">Spend</th><th style="text-align:right">Results</th><th style="text-align:right">Impressions</th><th style="text-align:right">Reach</th><th style="text-align:right">CPR</th></tr></thead>
<tbody>${[...AGE].sort((a,b)=>a.cpr-b.cpr).map((r, i) => `<tr class="${i===0?'best':i%2?'alt':''}"><td>${r.seg}</td><td style="text-align:right">${f.$(r.spend)}</td><td style="text-align:right">${f.n(r.results)}</td><td style="text-align:right">${f.n(r.impressions)}</td><td style="text-align:right">${f.n(r.reach)}</td><td style="text-align:right">${f.$4(r.cpr)}</td></tr>`).join('')}</tbody></table>
<div class="sh">Gender Breakdown</div>
<table><thead><tr><th style="text-align:left">Gender</th><th style="text-align:right">Spend</th><th style="text-align:right">Results</th><th style="text-align:right">Impressions</th><th style="text-align:right">Reach</th><th style="text-align:right">CPR</th></tr></thead>
<tbody>${GENDER.map((r, i) => `<tr class="${i===0?'best':i%2?'alt':''}"><td>${r.seg}</td><td style="text-align:right">${f.$(r.spend)}</td><td style="text-align:right">${f.n(r.results)}</td><td style="text-align:right">${f.n(r.impressions)}</td><td style="text-align:right">${f.n(r.reach)}</td><td style="text-align:right">${f.$4(r.cpr)}</td></tr>`).join('')}</tbody></table>
<div class="foot">
<span>Robotna · robotna.org · Meta Ads Campaign Report · ${rangeLabel}</span>
<span>Source: Analysis-Report.csv · Account 36890470 · No estimated values</span>
</div></div>

</body></html>`

  const win = window.open('', '_blank', 'width=1200,height=900')!
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 500)
}
