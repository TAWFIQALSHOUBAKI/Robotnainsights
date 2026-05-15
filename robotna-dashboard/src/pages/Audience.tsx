import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { T, GCOLS } from '../styles/tokens'
import { AGE, GENDER, AGE_BY_ADSET, Row } from '../data/data'
import { f } from '../components/fmt'
import { Card, CL, SHead, Chip } from '../components/Atoms'
import { CTip } from '../components/ChartTooltip'
import { DataTable } from '../components/DataTable'

const commonCols = [
  { k: 'seg',         label: 'Segment' },
  { k: 'spend',       label: 'Spend',       fmt: (v: unknown) => f.$(v as number),  r: true },
  { k: 'results',     label: 'Results',     fmt: (v: unknown) => f.n(v as number),  r: true },
  { k: 'impressions', label: 'Impressions', fmt: (v: unknown) => f.n(v as number),  r: true },
  { k: 'reach',       label: 'Reach',       fmt: (v: unknown) => f.n(v as number),  r: true },
  { k: 'cpr',         label: 'Cost/Result', fmt: (v: unknown) => f.$4(v as number), r: true },
]

export const Audience: React.FC = () => {
  const [filter, setFilter] = useState<'all' | string>('all')
  const ageData: Row[] = filter === 'all' ? AGE : AGE_BY_ADSET[filter] ?? AGE
  const maxAR = Math.max(...ageData.map(a => a.results))

  return (
    <div className="fade-in">
      <SHead eyebrow="Audience Analysis" title="Age & Gender Breakdown" sub="Engagement and spend by demographic segment" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: T.t3, fontFamily: "'DM Mono',monospace" }}>Filter by ad set:</span>
        {['all', 'DM_Broad_AMM_ZAR_IRB', 'Parents_Braod_AMM'].map(id => (
          <button key={id}
            onClick={() => setFilter(id)}
            style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${filter === id ? T.navy : T.border}`, background: filter === id ? T.navy : T.surface, color: filter === id ? '#fff' : T.t2, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all .15s', fontFamily: 'inherit' }}>
            {id === 'all' ? 'All Ad Sets' : id}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
        <Card>
          <CL>Results by Age Group{filter !== 'all' ? ` — ${filter}` : ''}</CL>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={ageData} barSize={20} barGap={4}>
              <CartesianGrid stroke={T.cGrid} vertical={false} />
              <XAxis dataKey="seg" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={54} tickFormatter={v => f.nK(v as number)} />
              <Tooltip content={<CTip fn={(n, v) => n === 'Results' ? f.n(v) : f.$(v)} />} />
              <Bar dataKey="results" fill={T.brand} radius={[4,4,0,0]} name="Results" />
              <Bar dataKey="spend"   fill={T.navy}  radius={[4,4,0,0]} name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CL>Cost Per Result — Ranked by Age</CL>
          {[...ageData].sort((a, b) => a.cpr - b.cpr).map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.t1, width: 44, fontFamily: "'DM Mono',monospace" }}>{a.seg}</span>
              <div style={{ flex: 1, height: 5, borderRadius: 3, background: T.border, overflow: 'hidden' }}>
                <div style={{ width: `${a.results / maxAR * 100}%`, height: '100%', background: i === 0 ? T.pos : T.brand, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 700, color: i === 0 ? T.pos : T.t1, width: 64, textAlign: 'right' }}>{f.$4(a.cpr)}</span>
              {i === 0 && <Chip color={T.pos} bg={T.posBg}>Best</Chip>}
            </div>
          ))}
        </Card>
      </div>

      <DataTable cols={commonCols} rows={ageData as unknown as Record<string, unknown>[]} bestKey="cpr" bestDir="min" />

      <div style={{ marginTop: 28 }}>
        <SHead eyebrow="Gender" title="Gender Performance" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
          {GENDER.map((g, i) => (
            <div key={i} style={{ background: i === 0 ? T.navyLight : i === 1 ? T.brandLight : T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: GCOLS[g.seg.toLowerCase()] ?? T.navy }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{g.seg}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.t1, letterSpacing: '-0.02em', marginBottom: 6 }}>{f.n(g.results)}</div>
              <div style={{ fontSize: 11, color: T.t3, fontFamily: "'DM Mono',monospace" }}>results</div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: T.t3, fontFamily: "'DM Mono',monospace", marginBottom: 3 }}>SPEND</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, fontFamily: "'DM Mono',monospace" }}>{f.$(g.spend)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: T.t3, fontFamily: "'DM Mono',monospace", marginBottom: 3 }}>CPR</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.pos, fontFamily: "'DM Mono',monospace" }}>{f.$4(g.cpr)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DataTable cols={commonCols} rows={GENDER as unknown as Record<string, unknown>[]} bestKey="cpr" bestDir="min" />
      </div>
    </div>
  )
}
