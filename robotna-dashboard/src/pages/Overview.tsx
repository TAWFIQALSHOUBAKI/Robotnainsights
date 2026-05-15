import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, Eye, Target, Activity, CalendarDays } from 'lucide-react'
import { T, GCOLS } from '../styles/tokens'
import { CORE, WEEKLY, ADSETS, AGE, GENDER } from '../data/data'
import { f } from '../components/fmt'
import { KpiCard } from '../components/KpiCard'
import { Card, CL, Chip } from '../components/Atoms'
import { CTip } from '../components/ChartTooltip'
import { MRow } from '../components/Atoms'

const maxAS = Math.max(...ADSETS.map(a => a.spend))

export const Overview: React.FC<{ rangeLabel: string }> = ({ rangeLabel }) => (
  <div className="fade-in">
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 16px', borderRadius: 8, background: T.navyLight, border: `1px solid ${T.navy}22` }}>
      <CalendarDays size={14} color={T.navy} strokeWidth={2} />
      <span style={{ fontSize: 13, color: T.navy, fontWeight: 600 }}>Reporting period: {rangeLabel}</span>
      <span style={{ fontSize: 12, color: T.t3, marginLeft: 4 }}>— data sourced from Analysis-Report.csv</span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 14 }}>
      <KpiCard icon={DollarSign} label="Total Spend"      value={f.$(CORE.spend)}      sub={`${f.$(CORE.avgDaily)} avg / period`}         variant="accent" />
      <KpiCard icon={Eye}        label="Reach"            value={f.nK(CORE.reach)}     sub={`${f.nK(CORE.impressions)} total impressions`} variant="navy" />
      <KpiCard icon={Target}     label="Post Engagements" value={f.nK(CORE.results)}   sub={`${f.$4(CORE.cpr)} cost per result`} />
      <KpiCard icon={Activity}   label="Engagement Rate"  value={f.pct(CORE.engRate)}  sub="Results ÷ Impressions" />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 18 }}>
      <Card>
        <CL>Spend vs Results — By Week</CL>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={WEEKLY} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={T.cGrid} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="l" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={40} />
            <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={58} tickFormatter={v => f.nK(v as number)} />
            <Tooltip content={<CTip fn={(n, v) => n === 'Spend' ? f.$(v) : f.n(v)} />} />
            <Bar yAxisId="l" dataKey="spend"   fill={T.brand} radius={[4,4,0,0]} name="Spend" />
            <Bar yAxisId="r" dataKey="results" fill={T.navy}  radius={[4,4,0,0]} name="Results" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CL>Results by Gender</CL>
        <ResponsiveContainer width="100%" height={158}>
          <PieChart>
            <Pie data={GENDER} dataKey="results" nameKey="seg" cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={3}>
              {GENDER.map((g, i) => <Cell key={i} fill={GCOLS[g.seg.toLowerCase()] ?? T.navy} />)}
            </Pie>
            <Tooltip content={<CTip fn={(_, v) => f.n(v)} />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
          {GENDER.map((g, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: GCOLS[g.seg.toLowerCase()] ?? T.navy }} />
                <span style={{ fontSize: 13, color: T.t2 }}>{g.seg}</span>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: T.t1 }}>{f.n(g.results)}</span>
                <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: T.t3, width: 40, textAlign: 'right' }}>{f.pct(g.spend / CORE.spend * 100)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
      {ADSETS.map((as, i) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.t3, fontFamily: "'DM Mono',monospace", marginBottom: 5 }}>Ad Set</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>{as.name}</div>
            </div>
            <Chip color={i === 0 ? T.brand : T.navy} bg={i === 0 ? T.brandLight : T.navyLight}>
              {f.pct(as.spend / CORE.spend * 100)} of spend
            </Chip>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { l: 'Spend',       v: f.$(as.spend) },
              { l: 'Results',     v: f.n(as.results) },
              { l: 'CPR',         v: f.$4(as.cpr), hi: true },
              { l: 'Reach',       v: f.nK(as.reach) },
              { l: 'Impressions', v: f.nK(as.impressions) },
              { l: 'Eng. Rate',   v: f.pct(as.results / as.impressions * 100) },
            ].map((item, j) => (
              <div key={j} style={{ background: T.surfaceAlt, borderRadius: 7, border: `1px solid ${T.border}`, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: T.t3, fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{item.l}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'hi' in item && item.hi ? T.pos : T.t1, letterSpacing: '-0.01em' }}>{item.v}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>

    <Card>
      <CL>Spend Distribution by Ad Set</CL>
      {ADSETS.map((as, i) => (
        <MRow key={i} label={as.name} value={f.$(as.spend)} share={as.spend / maxAS * 100} color={i === 0 ? T.brand : T.navy} />
      ))}
      <div style={{ height: 20 }} />
      <CL>Results & Spend by Age Group</CL>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={AGE} barSize={18} barGap={4}>
          <CartesianGrid stroke={T.cGrid} vertical={false} />
          <XAxis dataKey="seg" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={54} tickFormatter={v => f.nK(v as number)} />
          <Tooltip content={<CTip fn={(n, v) => n === 'Results' ? f.n(v) : f.$(v)} />} />
          <Bar dataKey="results" fill={T.brand} radius={[4,4,0,0]} name="Results" />
          <Bar dataKey="spend"   fill={T.navy}  radius={[4,4,0,0]} name="Spend" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
)
