import SectionHead from './SectionHead.jsx'
import { fetchRatios } from '../api.js'
import { useApi } from '../hooks.js'
import { sameSetup } from '../metrics.js'

const COMBOS = [[46, 16], [48, 17], [48, 16], [49, 17], [50, 17], [51, 17]]

export default function Explore({ params, current, onRide, onCompare }) {
  const { data, error } = useApi(s => fetchRatios(COMBOS, params, s), [params.tire, params.cadence])
  const gis = [...(data ?? []), ...(current ? [current] : [])].map(x => x.gearInches)
  const lo = gis.length ? Math.floor((Math.min(...gis) - 3) / 5) * 5 : 60
  const hi = gis.length ? Math.ceil((Math.max(...gis) + 3) / 5) * 5 : 90
  const pos = gi => `${((gi - lo) / (hi - lo)) * 100}%`
  const ticks = Array.from({ length: (hi - lo) / 5 + 1 }, (_, i) => lo + i * 5)

  return (
    <section className="section tinted" id="explore">
      <div className="wrap" data-reveal>
        <SectionHead index="03" kicker="Explore" title="Six setups, one scale.">
          <p>Common street and track combinations plotted by gear inches with your tire and cadence. Starting points to compare, not recommendations.</p>
        </SectionHead>
        {error && <p className="error mono" role="alert">{error}</p>}
        <div className="explore" role="list">
          <div className="explore-axis mono" aria-hidden="true">
            <span className="explore-axis-label">Gear inches</span>
            <div className="track">
              {ticks.map(t => <span key={t} className="tick" style={{ left: pos(t) }}>{t}</span>)}
            </div>
          </div>
          {(data ?? []).map(x => {
            const mine = current && sameSetup(x, current)
            return (
              <div key={`${x.chainring}x${x.cog}`} className={mine ? 'explore-row mine' : 'explore-row'} role="listitem">
                <p className="combo display">{x.chainring}<span>/</span>{x.cog}</p>
                <div className="track" aria-hidden="true">
                  {ticks.map(t => <span key={t} className="grid" style={{ left: pos(t) }} />)}
                  {current && <span className="you" style={{ left: pos(current.gearInches) }} />}
                  <span className="pin" style={{ left: pos(x.gearInches) }} />
                </div>
                <dl className="explore-stats mono">
                  <div><dt>Ratio</dt><dd>{x.ratio.toFixed(2)}</dd></div>
                  <div><dt>GI</dt><dd>{x.gearInches.toFixed(2)}</dd></div>
                  <div><dt>Dev</dt><dd>{x.developmentM.toFixed(2)} m</dd></div>
                  <div><dt>Skid</dt><dd>{x.skidPatches}/{x.ambiPatches}</dd></div>
                </dl>
                <div className="explore-actions">
                  {mine ? <span className="tag mono">Your setup</span> : <button type="button" className="link-btn" onClick={() => onRide(x.chainring, x.cog)}>Ride it</button>}
                  <button type="button" className="link-btn" onClick={() => onCompare(x.chainring, x.cog)}>Compare</button>
                </div>
              </div>
            )
          })}
        </div>
        <p className="note mono"><i className="you-key" /> your current setup · skid shown as single / ambidextrous</p>
      </div>
    </section>
  )
}
