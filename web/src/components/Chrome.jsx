import Num from './Num.jsx'

const NAV = [
  ['gearing', 'Gearing'],
  ['calculator', 'Calculator'],
  ['explore', 'Explore'],
  ['compare', 'Compare'],
  ['skid', 'Skid'],
  ['cadence', 'Cadence'],
  ['saved', 'Garage'],
]

export function Header() {
  return (
    <header className="topbar">
      <a className="wordmark" href="#top" aria-label="Cogculus home">
        <span>COG</span>CULUS
      </a>
      <nav aria-label="Sections">
        {NAV.map(([id, label]) => <a key={id} className="mono" href={`#${id}`}>{label}</a>)}
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <p className="display footer-mark"><span>COG</span>CULUS</p>
      <p className="display footer-tagline">Driven by Ratios. Defined by Rotation.</p>
      <p className="mono">All figures assume 700c wheels (622 mm bead seat) plus twice your tire width. Ratio, gear inches, development, speed and skid patches are calculated on the server and rounded to two decimals.</p>
    </footer>
  )
}

export function MobileBar({ r }) {
  return (
    <a className="mobilebar mono" href="#calculator" aria-label="Current setup, jump to calculator">
      <strong>{r.chainring}/{r.cog}</strong>
      <span><Num value={r.ratio} /></span>
      <span><Num value={r.gearInches} /> GI</span>
      <span><Num value={r.ambiPatches} digits={0} /> skid</span>
    </a>
  )
}
