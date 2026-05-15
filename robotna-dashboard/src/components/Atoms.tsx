import React from 'react'
import { T } from '../styles/tokens'

// ── Chip ─────────────────────────────────────────────────────────────────────
export const Chip: React.FC<{ children: React.ReactNode; color?: string; bg?: string }> = ({
  children, color = T.t3, bg = T.bg,
}) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 5,
    fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color, background: bg,
    fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', whiteSpace: 'nowrap',
  }}>{children}</span>
)

// ── Card ─────────────────────────────────────────────────────────────────────
export const Card: React.FC<{ children: React.ReactNode; p?: string; style?: React.CSSProperties }> = ({
  children, p = '22px 24px', style = {},
}) => (
  <div style={{
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: p, ...style,
  }}>{children}</div>
)

// ── Card Label ────────────────────────────────────────────────────────────────
export const CL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: T.t3, marginBottom: 14, fontFamily: "'DM Mono',monospace",
  }}>{children}</div>
)

// ── Section Header ────────────────────────────────────────────────────────────
export const SHead: React.FC<{ eyebrow?: string; title: string; sub?: string }> = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 20 }}>
    {eyebrow && (
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: T.brand, marginBottom: 5, fontFamily: "'DM Mono',monospace",
      }}>{eyebrow}</div>
    )}
    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.t1, letterSpacing: '-0.01em' }}>{title}</h2>
    {sub && <p style={{ margin: '4px 0 0', fontSize: 13, color: T.t2 }}>{sub}</p>}
  </div>
)

// ── Score Tile ────────────────────────────────────────────────────────────────
export const Score: React.FC<{ label: string; value: string; sub: string; color: string; bg: string }> = ({
  label, value, sub, color, bg,
}) => (
  <div style={{ background: bg, border: `1px solid ${color}33`, borderRadius: 10, padding: '22px' }}>
    <div style={{
      fontSize: 11, fontWeight: 600, color, letterSpacing: '0.06em', textTransform: 'uppercase',
      fontFamily: "'DM Mono',monospace", marginBottom: 10,
    }}>{label}</div>
    <div style={{ fontSize: 34, fontWeight: 800, color: T.t1, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: T.t3, marginTop: 8, lineHeight: 1.5 }}>{sub}</div>
  </div>
)

// ── Mini Bar Row ──────────────────────────────────────────────────────────────
export const MRow: React.FC<{ label: string; value: string; share: number; color?: string }> = ({
  label, value, share, color = T.brand,
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '9px 0', borderBottom: `1px solid ${T.border}`,
  }}>
    <div style={{ flex: 1, fontSize: 13, color: T.t2 }}>{label}</div>
    <div style={{ width: 100, height: 5, borderRadius: 3, background: T.border, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(share, 100)}%`, height: '100%', borderRadius: 3, background: color }} />
    </div>
    <div style={{
      width: 68, textAlign: 'right', fontSize: 12, fontWeight: 700,
      color: T.t1, fontFamily: "'DM Mono',monospace",
    }}>{value}</div>
  </div>
)
