export const f = {
  $:   (v: number | null | undefined) => v == null ? '—' : `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  $4:  (v: number | null | undefined) => v == null ? '—' : `$${v.toFixed(4)}`,
  n:   (v: number | null | undefined) => v == null ? '—' : v.toLocaleString(),
  nK:  (v: number | null | undefined) => v == null ? '—' : v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v),
  pct: (v: number | null | undefined) => v == null ? '—' : `${v.toFixed(2)}%`,
  d2:  (v: number | null | undefined) => v == null ? '—' : v.toFixed(2),
}

export function prettyDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[m - 1]} ${d}, ${y}`
}
