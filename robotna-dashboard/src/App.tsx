import React, { useState } from 'react'
import { BarChart2, TrendingUp, Play, Users, Download, Printer } from 'lucide-react'
import { T } from './styles/tokens'
import { DateRangePicker } from './components/DateRangePicker'
import { Chip } from './components/Atoms'
import { prettyDate } from './components/fmt'
import { printReport } from './components/PrintPDF'
import { Overview } from './pages/Overview'
import { Weekly } from './pages/Weekly'
import { Creative } from './pages/Creative'
import { Audience } from './pages/Audience'
import { META } from './data/data'

type Tab = 'overview' | 'weekly' | 'creative' | 'audience'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',  label: 'Overview',       icon: BarChart2 },
  { id: 'weekly',    label: 'Weekly',          icon: TrendingUp },
  { id: 'creative',  label: 'Creative & Ads',  icon: Play },
  { id: 'audience',  label: 'Audience',        icon: Users },
]

const btnBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 7,
  border: `1px solid ${T.border}`, background: T.surface, color: T.t2, cursor: 'pointer',
  fontSize: 12, fontWeight: 600, letterSpacing: '.01em', transition: 'all .15s', fontFamily: 'inherit',
}

export default function App() {
  const [tab, setTab] = useState<Tab>('overview')
  const [range, setRange] = useState({ since: '2026-05-07', until: '2026-05-15' })

  const rangeLabel = `${prettyDate(range.since)} – ${prettyDate(range.until)}`

  const handleExport = () => {
    const b = new Blob([JSON.stringify({ meta: META, range, note: 'Data from Analysis-Report.csv' }, null, 2)], { type: 'application/json' })
    const u = URL.createObjectURL(b)
    const a = document.createElement('a')
    a.href = u; a.download = 'robotna_campaign_data.json'; a.click()
    URL.revokeObjectURL(u)
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif", color: T.t1 }}>

      {/* ── HEADER ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 0 rgba(0,0,0,.04)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${T.brand}40` }}>
                <span style={{ color: '#fff', fontSize: 19, fontWeight: 900, fontFamily: 'Georgia,serif', lineHeight: '1' }}>R</span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.t1, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  Robotna
                  <span style={{ color: T.t3, fontWeight: 500, marginLeft: 8, fontSize: 13 }}>/ Campaign Analytics</span>
                </div>
                <div style={{ fontSize: 11, color: T.t3, fontFamily: "'DM Mono',monospace", marginTop: 1 }}>
                  robotna.org · {rangeLabel} · Outcome Engagement
                </div>
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: T.border }} />
            <Chip color={T.pos} bg={T.posBg}>● Active</Chip>
            <Chip color={T.t3}  bg={T.bg}>Account 36890470</Chip>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={btnBase} onClick={handleExport}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.brand; (e.currentTarget as HTMLElement).style.color = T.brand }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.border; (e.currentTarget as HTMLElement).style.color = T.t2 }}>
              <Download size={13} /> Export JSON
            </button>
            <button style={{ ...btnBase, background: T.navy, color: '#fff', border: `1px solid ${T.navy}` }} onClick={() => printReport(rangeLabel)}>
              <Printer size={13} /> Print PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: 50, gap: 2 }}>
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 7,
                border: '1px solid transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                transition: 'all .15s', fontFamily: 'inherit',
                background: active ? T.brand : 'transparent',
                color: active ? '#fff' : T.t3,
              }}
                onMouseEnter={e => { if (!active) { (e.currentTarget).style.background = T.brandLight; (e.currentTarget).style.color = T.brand } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = T.t3 } }}>
                <Icon size={13} strokeWidth={2} />{t.label}
              </button>
            )
          })}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: T.t3, fontFamily: "'DM Mono',monospace" }}>2 weeks · 6 ads</span>
            <div style={{ width: 1, height: 20, background: T.border }} />
            <DateRangePicker since={range.since} until={range.until} onApply={(s, u) => setRange({ since: s, until: u })} />
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '30px 32px 64px' }}>
        {tab === 'overview'  && <Overview  rangeLabel={rangeLabel} />}
        {tab === 'weekly'    && <Weekly    rangeLabel={rangeLabel} />}
        {tab === 'creative'  && <Creative  />}
        {tab === 'audience'  && <Audience  />}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: '14px 32px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'Georgia,serif' }}>R</span>
            </div>
            <span style={{ fontSize: 12, color: T.t3, fontFamily: "'DM Mono',monospace" }}>
              Robotna · robotna.org · Source: Analysis-Report.csv · Account 36890470
            </span>
          </div>
          <span style={{ fontSize: 12, color: T.t3, fontFamily: "'DM Mono',monospace" }}>
            {rangeLabel} · 72,410 engagements · No estimated values
          </span>
        </div>
      </div>

    </div>
  )
}
