import React, { useState, useMemo } from 'react'
import { T } from '../styles/tokens'

export interface Col {
  k: string
  label: string
  fmt?: (v: unknown) => string
  r?: boolean
}

interface Props {
  cols: Col[]
  rows: Record<string, unknown>[]
  bestKey?: string
  bestDir?: 'min' | 'max'
}

export const DataTable: React.FC<Props> = ({ cols, rows, bestKey, bestDir = 'min' }) => {
  const [sk, setSk] = useState<string | null>(null)
  const [sd, setSd] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    if (!sk) return rows
    return [...rows].sort((a, b) => {
      const [av, bv] = [a[sk], b[sk]]
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return sd === 'asc' ? av - bv : bv - av
      return sd === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
  }, [rows, sk, sd])

  const vals = bestKey ? rows.map(r => r[bestKey]).filter((v): v is number => typeof v === 'number') : []
  const best = vals.length ? (bestDir === 'min' ? Math.min(...vals) : Math.max(...vals)) : null

  const thStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
    textTransform: 'uppercase', color: T.t3, cursor: 'pointer', whiteSpace: 'nowrap',
    borderBottom: `2px solid ${T.border}`, userSelect: 'none', fontFamily: "'DM Mono',monospace",
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 8, border: `1px solid ${T.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: T.surfaceAlt }}>
            {cols.map(c => (
              <th key={c.k}
                onClick={() => { if (sk === c.k) setSd(d => d === 'asc' ? 'desc' : 'asc'); else { setSk(c.k); setSd('desc') } }}
                style={{ ...thStyle, textAlign: c.r ? 'right' : 'left' }}>
                {c.label}
                {sk === c.k && <span style={{ marginLeft: 4, color: T.brand }}>{sd === 'asc' ? '↑' : '↓'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => {
            const isBest = bestKey != null && r[bestKey] === best
            const rowBg = isBest ? T.posBg : i % 2 === 0 ? T.surface : T.surfaceAlt
            return (
              <tr key={i} style={{ background: rowBg, transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = T.brandLight)}
                onMouseLeave={e => (e.currentTarget.style.background = rowBg)}>
                {cols.map(c => (
                  <td key={c.k} style={{
                    padding: '11px 14px', borderBottom: `1px solid ${T.border}`,
                    color: c.k === bestKey && isBest ? T.pos : T.t1,
                    fontWeight: c.k === bestKey && isBest ? 700 : c.r ? 600 : 400,
                    textAlign: c.r ? 'right' : 'left',
                    fontFamily: c.r ? "'DM Mono',monospace" : 'inherit',
                    fontSize: c.r ? 12 : 13, whiteSpace: 'nowrap',
                  }}>
                    {c.fmt ? c.fmt(r[c.k]) : String(r[c.k] ?? '—')}
                    {c.k === bestKey && isBest && <span style={{ marginLeft: 6, fontSize: 10, color: T.pos }}>▲ Best</span>}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
