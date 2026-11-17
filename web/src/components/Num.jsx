import { useTween } from '../hooks.js'

export default function Num({ value, digits = 2, className = '' }) {
  const v = useTween(value)
  return (
    <span className={`num ${className}`}>
      <span aria-hidden="true">{typeof v === 'number' ? v.toFixed(digits) : '—'}</span>
      <span className="sr-only">{value ?? 'loading'}</span>
    </span>
  )
}
