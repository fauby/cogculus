import SectionHead from './SectionHead.jsx'
import Stepper from './Stepper.jsx'
import { LIMITS, METRICS } from '../metrics.js'

export default function Compare({ a, b, rA, rB, setB, onSwap }) {
  return (
    <section className="section" id="compare">
      <div className="wrap" data-reveal>
        <SectionHead index="04" kicker="Compare" title="A versus B.">
          <p>A is your calculator setup. Dial in B to see what changes when you swap a chainring or cog. Both use your tire and cadence.</p>
        </SectionHead>
        <div className="compare-head">
          <div className="compare-side">
            <p className="side-tag mono">A</p>
            <p className="combo display">{a.chainring}<span>/</span>{a.cog}</p>
          </div>
          <button type="button" className="swap mono" onClick={onSwap} aria-label="Swap A and B">⇄ swap</button>
          <div className="compare-side b">
            <p className="side-tag mono">B</p>
            <div className="compare-b">
              <Stepper label="Chainring" suffix="T" min={LIMITS.chainring[0]} max={LIMITS.chainring[1]} value={b.chainring} onChange={v => setB({ ...b, chainring: v })} />
              <Stepper label="Cog" suffix="T" min={LIMITS.cog[0]} max={LIMITS.cog[1]} value={b.cog} onChange={v => setB({ ...b, cog: v })} />
            </div>
          </div>
        </div>
        <table className="compare-table">
          <thead className="sr-only">
            <tr><th>Metric</th><th>A</th><th>Bars</th><th>B</th><th>Difference</th></tr>
          </thead>
          <tbody>
            {METRICS.map(m => {
              const va = rA?.[m.key]
              const vb = rB?.[m.key]
              const max = Math.max(va ?? 0, vb ?? 0) || 1
              const d = va != null && vb != null ? vb - va : null
              const fmt = v => (v == null ? '—' : v.toFixed(m.digits ?? 2))
              return (
                <tr key={m.key}>
                  <th scope="row">{m.label}<small className="mono">{m.unit}</small></th>
                  <td className="mono va">{fmt(va)}</td>
                  <td className="bars" aria-hidden="true">
                    <span className="bar a" style={{ width: `${((va ?? 0) / max) * 100}%` }} />
                    <span className="bar b" style={{ width: `${((vb ?? 0) / max) * 100}%` }} />
                  </td>
                  <td className="mono vb">{fmt(vb)}</td>
                  <td className={`mono delta ${d > 0 ? 'up' : d < 0 ? 'down' : ''}`}>{d == null ? '' : `${d > 0 ? '+' : ''}${fmt(d)}`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
