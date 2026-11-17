import { useState } from 'react'
import { SkidDial } from './Bike.jsx'
import SectionHead from './SectionHead.jsx'
import { fetchRatios } from '../api.js'
import { useApi } from '../hooks.js'

const RINGS = Array.from({ length: 12 }, (_, i) => 42 + i)
const COGS = Array.from({ length: 7 }, (_, i) => 13 + i)
const COMBOS = RINGS.flatMap(c => COGS.map(g => [c, g]))

export default function Skid({ params, r, onRide }) {
  const [ambi, setAmbi] = useState(true)
  const { data, error } = useApi(s => fetchRatios(COMBOS, params, s), [])
  const key = ambi ? 'ambiPatches' : 'skidPatches'
  const byCombo = new Map((data ?? []).map(x => [`${x.chainring}x${x.cog}`, x]))
  const max = Math.max(1, ...(data ?? []).map(x => x[key]))

  return (
    <section className="section dark" id="skid">
      <div className="wrap" data-reveal>
        <SectionHead index="05" kicker="Skid patches" title="Where your tire wears.">
          <p>When you skid, the rear wheel locks at the same few spots. The number of spots depends on how the chainring and cog divide. More patches spread the wear around the tire.</p>
        </SectionHead>
        <div className="skid">
          <figure className="skid-current">
            {r && <SkidDial skid={r.skidPatches} ambi={r.ambiPatches} />}
            <figcaption className="mono">
              {r ? `${r.chainring}/${r.cog}: ${r.skidPatches} single, ${r.ambiPatches} ambidextrous` : 'Loading'}
            </figcaption>
          </figure>
          <div className="skid-matrix">
            <div className="toggle mono" role="group" aria-label="Skid style">
              <button type="button" aria-pressed={!ambi} onClick={() => setAmbi(false)}>One foot</button>
              <button type="button" aria-pressed={ambi} onClick={() => setAmbi(true)}>Either foot</button>
            </div>
            {error && <p className="error mono" role="alert">{error}</p>}
            <div className="matrix-scroll">
              <table className="matrix mono">
                <caption className="sr-only">Skid patches by chainring and cog. Select a cell to load it into the calculator.</caption>
                <thead>
                  <tr><th scope="col"><span className="sr-only">Chainring</span>↓ / →</th>{COGS.map(g => <th key={g} scope="col">{g}</th>)}</tr>
                </thead>
                <tbody>
                  {RINGS.map(c => (
                    <tr key={c}>
                      <th scope="row">{c}</th>
                      {COGS.map(g => {
                        const x = byCombo.get(`${c}x${g}`)
                        const mine = r && r.chainring === c && r.cog === g
                        return (
                          <td key={g}>
                            <button
                              type="button"
                              className={mine ? 'cell mine' : 'cell'}
                              style={{ '--w': x ? x[key] / max : 0 }}
                              aria-label={`${c} by ${g}: ${x ? x[key] : 'loading'} patches`}
                              onClick={() => onRide(c, g)}
                            >
                              {x ? x[key] : ''}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note mono">Rows: chainring · Columns: cog · Select a cell to ride it</p>
          </div>
        </div>
      </div>
    </section>
  )
}
