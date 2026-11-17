import SectionHead from './SectionHead.jsx'
import Num from './Num.jsx'

const C0 = 40
const C1 = 160
const W = 640
const H = 300
const P = { l: 44, r: 16, t: 16, b: 36 }
const STOPS = [70, 90, 110, 130]

const speedAt = (dev, c) => (dev * c * 60) / 1000

export default function Cadence({ cadence, setCadence, rA, rB }) {
  const cad = Number(cadence)
  const top = Math.ceil(Math.max(10, ...[rA, rB].filter(Boolean).map(r => speedAt(r.developmentM, C1))) / 10) * 10
  const x = c => P.l + ((c - C0) / (C1 - C0)) * (W - P.l - P.r)
  const y = v => H - P.b - (v / top) * (H - P.t - P.b)
  const line = r => `M${x(C0)} ${y(speedAt(r.developmentM, C0))}L${x(C1)} ${y(speedAt(r.developmentM, C1))}`
  const inRange = Number.isFinite(cad) && cad >= C0 && cad <= C1

  return (
    <section className="section" id="cadence">
      <div className="wrap" data-reveal>
        <SectionHead index="06" kicker="Cadence × speed" title="Find your rhythm.">
          <p>On a fixed gear your legs and the wheel move together. Drag the cadence to feel how fast each setup carries you.</p>
        </SectionHead>
        <div className="cadence">
          <div className="cadence-control">
            <label className="mono" htmlFor="cad-range">Cadence</label>
            <p className="cadence-big"><Num value={Number.isFinite(cad) ? cad : undefined} digits={0} /><small>rpm</small></p>
            <input id="cad-range" type="range" min="20" max="200" step="1" value={Number.isFinite(cad) ? cad : 90} onChange={e => setCadence(e.target.value)} />
            {rA && <p className="mono cadence-speed"><span className="key a" />A {rA.chainring}/{rA.cog} · <strong>{rA.speedKmh.toFixed(2)}</strong> km/h</p>}
            {rB && <p className="mono cadence-speed"><span className="key b" />B {rB.chainring}/{rB.cog} · <strong>{rB.speedKmh.toFixed(2)}</strong> km/h</p>}
          </div>
          <figure className="cadence-chart">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Speed in km/h against cadence for setups A and B">
              {Array.from({ length: top / 10 + 1 }, (_, i) => i * 10).map(v => (
                <g key={v} className="grid">
                  <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} />
                  <text x={P.l - 8} y={y(v) + 4} textAnchor="end">{v}</text>
                </g>
              ))}
              {[40, 60, 80, 100, 120, 140, 160].map(c => (
                <text key={c} className="axis" x={x(c)} y={H - 12} textAnchor="middle">{c}</text>
              ))}
              {rB && <path className="series b" d={line(rB)} />}
              {rA && <path className="series a" d={line(rA)} />}
              {inRange && <line className="now" x1={x(cad)} x2={x(cad)} y1={P.t} y2={H - P.b} />}
              {inRange && rA && <circle className="pt a" cx={x(cad)} cy={y(rA.speedKmh)} r="6" />}
              {inRange && rB && <circle className="pt b" cx={x(cad)} cy={y(rB.speedKmh)} r="5" />}
            </svg>
            <figcaption className="mono">km/h ↑ · rpm →</figcaption>
          </figure>
        </div>
        <table className="cadence-table mono">
          <thead>
            <tr><th scope="col">rpm</th>{STOPS.map(c => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {[['A', rA], ['B', rB]].filter(([, r]) => r).map(([k, r]) => (
              <tr key={k}>
                <th scope="row">{k} {r.chainring}/{r.cog}</th>
                {STOPS.map(c => <td key={c}>{speedAt(r.developmentM, c).toFixed(1)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
