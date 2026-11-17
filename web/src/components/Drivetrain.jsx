import { reduceMotion } from '../hooks.js'

const K = 1.6
const PITCH = 2 * Math.PI * K
const CRANK_SECONDS = 6

function gearPath(teeth, r, hole) {
  const step = (2 * Math.PI) / teeth
  const pts = []
  for (let i = 0; i < teeth; i++) {
    for (const [f, rr] of [[0, r - 3.2], [0.18, r + 3], [0.5, r + 3], [0.68, r - 3.2]]) {
      const a = (i + f) * step
      pts.push(`${(rr * Math.cos(a)).toFixed(2)} ${(rr * Math.sin(a)).toFixed(2)}`)
    }
  }
  return `M${pts.join('L')}ZM${hole} 0A${hole} ${hole} 0 1 0 ${-hole} 0A${hole} ${hole} 0 1 0 ${hole} 0Z`
}

function Spin({ seconds, on }) {
  return on ? <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${seconds}s`} repeatCount="indefinite" /> : null
}

export default function Drivetrain({ chainring = 48, cog = 17, spin = true, labels = true, className = '' }) {
  const on = spin && !reduceMotion
  const R = chainring * K
  const r = cog * K
  const ring = { x: 330, y: 160 }
  const sp = { x: 100, y: 160 }
  const nx = (r - R) / (ring.x - sp.x)
  const ny = Math.sqrt(1 - nx * nx)
  const run = s => [sp.x + r * nx, sp.y + s * r * ny, ring.x + R * nx, ring.y + s * R * ny]
  const [ax, ay, bx, by] = run(-1)
  const [cx, cy, dx, dy] = run(1)
  const chains = [`M${ax} ${ay}L${bx} ${by}`, `M${dx} ${dy}L${cx} ${cy}`]
  const spokes = [0, 72, 144, 216, 288]

  return (
    <svg className={`drivetrain-svg ${className}`} viewBox="0 0 460 320" role="img" aria-label={`Drivetrain: ${chainring} tooth chainring driving a ${cog} tooth cog`}>
      {chains.map(d => <path key={`b${d}`} className="dt-chain-base" d={d} />)}
      {chains.map(d => (
        <path key={d} className="dt-chain" d={d} strokeDasharray={`${PITCH * 0.55} ${PITCH * 0.45}`}>
          {on && <animate key={chainring} attributeName="stroke-dashoffset" from="0" to={-PITCH} dur={`${CRANK_SECONDS / chainring}s`} repeatCount="indefinite" />}
        </path>
      ))}
      <g transform={`translate(${sp.x} ${sp.y})`}>
        <g>
          <path className="dt-cog" d={gearPath(cog, r, r * 0.42)} fillRule="evenodd" />
          <Spin key={`${cog}-${chainring}`} seconds={(CRANK_SECONDS * cog) / chainring} on={on} />
        </g>
      </g>
      <g transform={`translate(${ring.x} ${ring.y})`}>
        <g>
          <path className="dt-ring" d={gearPath(chainring, R, R - 9)} fillRule="evenodd" />
          {spokes.map(a => (
            <line key={a} className="dt-spider" x1="0" y1="0" x2={(R - 9) * Math.cos((a * Math.PI) / 180)} y2={(R - 9) * Math.sin((a * Math.PI) / 180)} />
          ))}
          <line className="dt-crank" x1="0" y1="0" x2="0" y2={R * 0.92} />
          <circle className="dt-pedal" cx="0" cy={R * 0.92} r="7" />
          <circle className="dt-hub" r="10" />
          <Spin seconds={CRANK_SECONDS} on={on} />
        </g>
      </g>
      {labels && (
        <g className="dt-label">
          <text x={sp.x} y={sp.y + r + 30} textAnchor="middle">COG {cog}T</text>
          <text x={ring.x} y={Math.min(312, ring.y + R + 26)} textAnchor="middle">CHAINRING {chainring}T</text>
        </g>
      )}
    </svg>
  )
}
