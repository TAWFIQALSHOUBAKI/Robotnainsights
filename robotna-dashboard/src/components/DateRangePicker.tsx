import React, { useState, useRef, useEffect } from 'react'
import { CalendarDays, Check, X } from 'lucide-react'
import { T } from '../styles/tokens'
import { prettyDate } from './fmt'

interface Props {
  since: string
  until: string
  onApply: (since: string, until: string) => void
}

const PRESETS = [
  { label: 'This week',   since: '2026-05-07', until: '2026-05-13' },
  { label: 'Latest 2d',   since: '2026-05-14', until: '2026-05-15' },
  { label: 'Full report', since: '2026-05-07', until: '2026-05-15' },
  { label: 'May 2026',    since: '2026-05-01', until: '2026-05-31' },
]

export const DateRangePicker: React.FC<Props> = ({ since, until, onApply }) => {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ since, until })
  const [error, setError] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setDraft({ since, until }) }, [since, until])

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const apply = () => {
    if (!draft.since || !draft.until) { setError('Both dates are required.'); return }
    if (draft.since > draft.until) { setError('Start must be before end.'); return }
    setError(''); onApply(draft.since, draft.until); setOpen(false)
  }

  const cancel = () => { setDraft({ since, until }); setError(''); setOpen(false) }
  const label = since && until ? `${prettyDate(since)} – ${prettyDate(until)}` : 'Select range'

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => { setOpen(o => !o); setError('') }} style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 13px', borderRadius: 7,
        cursor: 'pointer', border: `1px solid ${open ? T.brand : T.border}`,
        background: open ? T.brandLight : T.surface, color: open ? T.brand : T.t2,
        fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'all .15s', whiteSpace: 'nowrap',
      }}>
        <CalendarDays size={13} strokeWidth={2} />
        {label}
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: open ? T.brand : T.t3, fontFamily: "'DM Mono',monospace" }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px 22px', zIndex: 200,
          boxShadow: '0 8px 32px rgba(13,36,69,.14)', minWidth: 310, animation: 'popIn .15s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>Reporting Period</div>
            <button onClick={cancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.t3 }}>
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: error ? 8 : 16 }}>
            {(['since', 'until'] as const).map(k => (
              <div key={k}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.t3, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>
                  {k === 'since' ? 'Start Date' : 'End Date'}
                </div>
                <input type="date" value={draft[k]}
                  onChange={e => { setDraft(d => ({ ...d, [k]: e.target.value })); setError('') }}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.t1, background: T.surface, fontFamily: 'inherit', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = T.brand)}
                  onBlur={e  => (e.target.style.borderColor = T.border)}
                />
              </div>
            ))}
          </div>

          {error && (
            <div style={{ fontSize: 12, color: T.neg, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.t3, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>
              Quick Select
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESETS.map(p => {
                const active = draft.since === p.since && draft.until === p.until
                return (
                  <button key={p.label} onClick={() => { setDraft({ since: p.since, until: p.until }); setError('') }}
                    style={{ padding: '5px 11px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .12s', border: `1px solid ${active ? T.brand : T.border}`, background: active ? T.brandLight : T.surfaceAlt, color: active ? T.brand : T.t2, fontFamily: 'inherit' }}>
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
            <button onClick={cancel} style={{ padding: '8px 16px', borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface, color: T.t2, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={apply} style={{ padding: '8px 18px', borderRadius: 7, border: `1px solid ${T.brand}`, background: T.brand, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Check size={13} strokeWidth={2.5} /> Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
