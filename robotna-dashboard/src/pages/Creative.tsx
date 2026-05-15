import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { T } from '../styles/tokens'
import { ADS, ADSETS } from '../data/data'
import { f } from '../components/fmt'
import { Card, CL, SHead, Score } from '../components/Atoms'
import { CTip } from '../components/ChartTooltip'
import { DataTable } from '../components/DataTable'
import { CORE } from '../data/data'

const sorted = [...ADS].sort((a, b) => a.cpr - b.cpr)

export const Creative: React.FC = () => (
  <div className="fade-in">
    <SHead eyebrow="Creative Performance" title="Ad & Ad Set Analysis" sub="Sorted by cost per result — lower is better" />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
      <Score label="Overall CPR"    value={f.$4(CORE.cpr)}  sub="Campaign avg cost per engagement"     color={T.brand} bg={T.brandLight} />
      <Score label="Best Ad CPR"    value="$0.001293"        sub="رسالة لكل أب وأم_Reel"               color={T.pos}   bg={T.posBg} />
      <Score label="Top Ad Spend %" value="60.7%"            sub="لغة الأرقام_Reel — $58.67 of $96.57" color={T.navy}  bg={T.navyLight} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 18, marginBottom: 22 }}>
      <Card>
        <CL>Spend by Ad Creative</CL>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={[...ADS].sort((a, b) => b.spend - a.spend)} layout="vertical" margin={{ left: 4, right: 8 }}>
            <CartesianGrid stroke={T.cGrid} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: T.t2, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={170}
              tickFormatter={(v: string) => v.length > 24 ? v.slice(0, 24) + '…' : v} />
            <Tooltip content={<CTip fn={(_, v) => f.$(v)} />} />
            <Bar dataKey="spend" fill={T.brand} radius={[0,4,4,0]} name="Spend" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CL>Cost Per Result — Ranked</CL>
        {sorted.map((ad, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: T.t2, direction: 'rtl' }}>{ad.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: i === 0 ? T.pos : T.t1 }}>
                {f.$4(ad.cpr)}{i === 0 && ' ▲'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: T.t3, fontFamily: "'DM Mono',monospace" }}>{f.$(ad.spend)} spend</span>
              <span style={{ fontSize: 11, color: T.t3, fontFamily: "'DM Mono',monospace" }}>{f.n(ad.results)} results</span>
            </div>
          </div>
        ))}
      </Card>
    </div>

    <SHead eyebrow="Ad Level" title="Full Ad Performance Table" />
    <DataTable
      cols={[
        { k: 'name',        label: 'Ad Creative' },
        { k: 'adset',       label: 'Ad Set' },
        { k: 'spend',       label: 'Spend',       fmt: v => f.$(v as number),  r: true },
        { k: 'results',     label: 'Results',     fmt: v => f.n(v as number),  r: true },
        { k: 'impressions', label: 'Impressions', fmt: v => f.n(v as number),  r: true },
        { k: 'reach',       label: 'Reach',       fmt: v => f.n(v as number),  r: true },
        { k: 'cpr',         label: 'Cost/Result', fmt: v => f.$4(v as number), r: true },
      ]}
      rows={ADS as unknown as Record<string, unknown>[]}
      bestKey="cpr" bestDir="min"
    />

    <div style={{ marginTop: 24 }}>
      <SHead eyebrow="Ad Set Level" title="Ad Set Performance" />
      <DataTable
        cols={[
          { k: 'name',        label: 'Ad Set' },
          { k: 'spend',       label: 'Spend',       fmt: v => f.$(v as number),  r: true },
          { k: 'results',     label: 'Results',     fmt: v => f.n(v as number),  r: true },
          { k: 'impressions', label: 'Impressions', fmt: v => f.n(v as number),  r: true },
          { k: 'reach',       label: 'Reach',       fmt: v => f.n(v as number),  r: true },
          { k: 'cpr',         label: 'Cost/Result', fmt: v => f.$4(v as number), r: true },
        ]}
        rows={ADSETS as unknown as Record<string, unknown>[]}
        bestKey="cpr" bestDir="min"
      />
    </div>
  </div>
)
