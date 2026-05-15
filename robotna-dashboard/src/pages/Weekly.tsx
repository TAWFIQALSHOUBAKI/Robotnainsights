import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { T } from '../styles/tokens'
import { WEEKLY } from '../data/data'
import { f } from '../components/fmt'
import { Card, CL, Chip, SHead } from '../components/Atoms'
import { CTip } from '../components/ChartTooltip'
import { DataTable } from '../components/DataTable'

export const Weekly: React.FC<{ rangeLabel: string }> = ({ rangeLabel }) => (
  <div className="fade-in">
    <SHead eyebrow="Time Series" title="Weekly Performance" sub={`${rangeLabel} · May 7–13 (full week) vs May 14–15 (2 days)`} />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
      <Card>
        <CL>Spend per Week</CL>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={WEEKLY} barSize={60}>
            <CartesianGrid stroke={T.cGrid} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CTip fn={(_, v) => f.$(v)} />} />
            <Bar dataKey="spend" fill={T.brand} radius={[4,4,0,0]} name="Spend" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <CL>Results per Week</CL>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={WEEKLY} barSize={60}>
            <CartesianGrid stroke={T.cGrid} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={54} tickFormatter={v => f.nK(v as number)} />
            <Tooltip content={<CTip fn={(_, v) => f.n(v)} />} />
            <Bar dataKey="results" fill={T.navy} radius={[4,4,0,0]} name="Results" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <DataTable
      cols={[
        { k: 'week',        label: 'Period' },
        { k: 'spend',       label: 'Spend',       fmt: v => f.$(v as number), r: true },
        { k: 'results',     label: 'Results',     fmt: v => f.n(v as number), r: true },
        { k: 'impressions', label: 'Impressions', fmt: v => f.n(v as number), r: true },
        { k: 'reach',       label: 'Reach',       fmt: v => f.n(v as number), r: true },
        { k: 'cpr',         label: 'Cost/Result', fmt: v => f.$4(v as number), r: true },
      ]}
      rows={WEEKLY as unknown as Record<string, unknown>[]}
      bestKey="cpr" bestDir="min"
    />

    <div style={{ marginTop: 24 }}>
      <Card>
        <CL>Cost Per Result — Week over Week</CL>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={WEEKLY} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={T.cGrid} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.t3, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} width={62} tickFormatter={v => `$${(v as number).toFixed(4)}`} domain={['auto', 'auto']} />
            <Tooltip content={<CTip fn={(_, v) => f.$4(v)} />} />
            <Line type="monotone" dataKey="cpr" stroke={T.pos} strokeWidth={2.5} dot={{ r: 6, fill: T.pos, strokeWidth: 0 }} name="CPR" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 12, display: 'flex', gap: 24 }}>
          {WEEKLY.map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.pos }} />
              <span style={{ fontSize: 12, color: T.t2 }}>{w.week}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.t1, fontFamily: "'DM Mono',monospace" }}>{f.$4(w.cpr)}</span>
              {i === 1 && <Chip color={T.pos} bg={T.posBg}>↓ Improving</Chip>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)
