import Drivetrain from './Drivetrain.jsx'
import Num from './Num.jsx'
import SectionHead from './SectionHead.jsx'
import { METRICS } from '../metrics.js'

const SHOWN = ['ratio', 'gearInches', 'developmentM', 'skidPatches']

export default function Anatomy({ r }) {
  return (
    <section className="section dark" id="gearing">
      <div className="wrap" data-reveal>
        <SectionHead index="01" kicker="How gearing works" title="One gear. Every number.">
          <p>A fixed gear has one chainring, one cog and no freewheel. Those two tooth counts decide how hard you push, how far you roll and where your tire wears when you skid.</p>
        </SectionHead>
        <div className="anatomy">
          <figure className="anatomy-figure">
            <Drivetrain chainring={r.chainring} cog={r.cog} />
            <figcaption className="mono">Live: your current setup, turning at 10 rpm.</figcaption>
          </figure>
          <ol className="anatomy-list">
            {METRICS.filter(m => SHOWN.includes(m.key)).map((m, i) => (
              <li key={m.key}>
                <span className="mono idx">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{m.label}</h3>
                  <p className="mono formula">{m.formula}</p>
                  <p>{m.desc}</p>
                </div>
                <p className="anatomy-value"><Num value={r[m.key]} digits={m.digits ?? 2} /><small>{m.unit}</small></p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
