import SectionHead from './SectionHead.jsx'

export default function Saved({ saved, onLoad, onRemove }) {
  return (
    <section className="section tinted" id="saved">
      <div className="wrap" data-reveal>
        <SectionHead index="07" kicker="Saved setups" title="Your garage.">
          <p>Setups you save stay in this browser. Nothing is uploaded.</p>
        </SectionHead>
        {saved.length === 0 ? (
          <p className="empty mono">Nothing here yet. Hit “Save setup” in the calculator.</p>
        ) : (
          <ul className="garage">
            {saved.map((s, i) => (
              <li key={`${s.chainring}-${s.cog}-${s.tire}-${s.cadence}-${i}`}>
                <p className="combo display">{s.chainring}<span>/</span>{s.cog}</p>
                <p className="mono garage-spec">{s.tire} mm · {s.cadence} rpm</p>
                <div className="garage-actions">
                  <button type="button" className="link-btn" onClick={() => onLoad(s)}>Load</button>
                  <button type="button" className="link-btn quiet" onClick={() => onRemove(i)} aria-label={`Remove ${s.chainring}/${s.cog}`}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
