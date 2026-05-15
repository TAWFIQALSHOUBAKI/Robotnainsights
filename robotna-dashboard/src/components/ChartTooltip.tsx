import React from 'react'
import { T } from '../styles/tokens'

interface Props {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  fn?: (name: string, value: number) => string
}

export const CTip: React.FC<Props> = ({ active, payload, label, fn }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: T.navy, borderRadius: 8, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.20)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.72)' }}>{p.name}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginLeft: 'auto', paddingLeft: 14, fontFamily: "'DM Mono',monospace" }}>
            {fn ? fn(p.name, p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}
