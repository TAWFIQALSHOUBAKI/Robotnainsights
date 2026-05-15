import React from 'react'
import { LucideIcon } from 'lucide-react'
import { T } from '../styles/tokens'

type Variant = 'default' | 'accent' | 'navy'

interface Props {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  variant?: Variant
}

export const KpiCard: React.FC<Props> = ({ icon: Icon, label, value, sub, variant = 'default' }) => {
  const ac = variant === 'accent', nv = variant === 'navy'
  const bg  = ac ? T.brand : nv ? T.navy  : T.surface
  const bdr = ac ? T.brand : nv ? T.navy  : T.border
  const ibg = ac ? 'rgba(255,255,255,.18)' : nv ? 'rgba(255,255,255,.12)' : T.brandLight
  const ic  = ac || nv ? '#fff' : T.brand
  const vc  = ac || nv ? '#fff' : T.t1
  const sc  = ac ? 'rgba(255,255,255,.58)' : nv ? 'rgba(255,255,255,.55)' : T.t3
  const lc  = ac ? 'rgba(255,255,255,.76)' : nv ? 'rgba(255,255,255,.70)' : T.t2

  return (
    <div style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      {(ac || nv) && (
        <div style={{ position: 'absolute', top: -28, right: -28, width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: ibg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={ic} strokeWidth={2.2} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: lc }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: vc, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: sc, marginTop: 7, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  )
}
