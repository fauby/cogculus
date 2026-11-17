export default function Stepper({ label, suffix, value, step = 1, min, max, onChange, big = false }) {
  const n = Number(value)
  const bump = d => onChange(String(Math.min(max, Math.max(min, (Number.isFinite(n) && value !== '' ? n : min) + d))))
  return (
    <div className={big ? 'stepper big' : 'stepper'}>
      <button type="button" className="step" aria-label={`Decrease ${label}`} disabled={n <= min} onClick={() => bump(-step)}>−</button>
      <md-outlined-text-field
        label={label}
        type="number"
        suffix-text={suffix}
        min={min}
        max={max}
        value={String(value)}
        onInput={e => onChange(e.target.value)}
      />
      <button type="button" className="step" aria-label={`Increase ${label}`} disabled={n >= max} onClick={() => bump(step)}>+</button>
    </div>
  )
}
