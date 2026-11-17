import Drivetrain from './Drivetrain.jsx'
import Num from './Num.jsx'

export default function Hero({ r }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="kicker mono">Driven by Ratios. Defined by Rotation.</p>
        <h1 className="display hero-title">
          Find your<br />perfect <em>gear.</em>
        </h1>
        <p className="lede">
          Explore the relationship between gearing, cadence and the way you ride. Build your setup. Understand your ratios. Find your rhythm.
        </p>
        <div className="cta">
          <md-filled-button href="#calculator">Open the calculator</md-filled-button>
          <md-outlined-button href="#explore">Explore combinations</md-outlined-button>
        </div>
      </div>
      <figure className="hero-visual">
        <Drivetrain chainring={r.chainring} cog={r.cog} labels={false} />
        <figcaption className="hero-readout mono">
          <span>{r.chainring}T × {r.cog}T</span>
          <strong><Num value={r.ratio} /><small>:1</small></strong>
        </figcaption>
      </figure>
      <dl className="spec-band">
        <div><dt>Gear inches</dt><dd><Num value={r.gearInches} /></dd></div>
        <div><dt>Development</dt><dd><Num value={r.developmentM} /><small>m</small></dd></div>
        <div><dt>Speed</dt><dd><Num value={r.speedKmh} /><small>km/h</small></dd></div>
        <div><dt>Skid patches</dt><dd><Num value={r.skidPatches} digits={0} /><small>/ {r.ambiPatches ?? '—'} ambi</small></dd></div>
      </dl>
    </section>
  )
}
