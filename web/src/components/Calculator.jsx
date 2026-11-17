import { useState } from 'react'
import Bike from './Bike.jsx'
import Num from './Num.jsx'
import SectionHead from './SectionHead.jsx'
import Stepper from './Stepper.jsx'
import { LIMITS, METRICS } from '../metrics.js'

export default function Calculator({ params, set, r, error, onSave, isSaved }) {
  const [copied, setCopied] = useState(false)
  const copy = () =>
    navigator.clipboard?.writeText(location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  const field = (key, label, suffix, step = 1, big = false) => (
    <Stepper big={big} label={label} suffix={suffix} step={step} min={LIMITS[key][0]} max={LIMITS[key][1]} value={params[key]} onChange={v => set({ [key]: v })} />
  )

  return (
    <section className="section" id="calculator">
      <div className="wrap" data-reveal>
        <SectionHead index="02" kicker="Calculator" title="Build your setup.">
          <p>Change a tooth, see everything move. The link in your address bar always holds your current setup.</p>
        </SectionHead>
        <div className="calc">
          <div className="calc-controls">
            <div className="calc-teeth">
              {field('chainring', 'Chainring teeth', undefined, 1, true)}
              <span className="calc-x display" aria-hidden="true">×</span>
              {field('cog', 'Cog teeth', undefined, 1, true)}
            </div>
            <div className="calc-env">
              {field('tire', 'Tire width', 'mm')}
              {field('cadence', 'Cadence', 'rpm', 5)}
            </div>
            {error && <p className="error mono" role="alert">{error}. Chainring 28–60, cog 9–24, tire 18–60 mm, cadence 20–200 rpm.</p>}
            <div className="calc-actions">
              <md-filled-button onClick={onSave} disabled={isSaved || !!error}>{isSaved ? 'Saved' : 'Save setup'}</md-filled-button>
              <md-outlined-button onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</md-outlined-button>
              <md-text-button href="#compare">Compare →</md-text-button>
            </div>
          </div>
          <dl className="spec">
            {METRICS.map(m => (
              <div key={m.key} className="spec-row">
                <dt>
                  <span className="spec-label">{m.label}</span>
                  <span className="spec-desc">{m.desc}</span>
                </dt>
                <dd>
                  <Num value={r?.[m.key]} digits={m.digits ?? 2} />
                  <small>{m.unit}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {r && (
          <figure className="calc-bike">
            <Bike chainring={r.chainring} cog={r.cog} skid={r.skidPatches} ambi={r.ambiPatches} />
            <figcaption className="legend mono">
              <span><i className="swatch" /> favourite foot forward · {r.skidPatches}</span>
              {r.ambiPatches > r.skidPatches
                ? <span><i className="swatch other" /> other foot forward · +{r.ambiPatches - r.skidPatches}</span>
                : <span>Other foot forward lands on the same patches.</span>}
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}
