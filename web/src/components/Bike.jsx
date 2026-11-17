const RW = { x: 95, y: 165, r: 68 }
const FW = { x: 315, y: 165, r: 68 }
const BB = { x: 195, y: 170 }

export function skidDots(skid, ambi, cx, cy, r) {
  const doubled = ambi !== skid
  return Array.from({ length: ambi }, (_, i) => {
    const a = (i / ambi) * 2 * Math.PI - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), other: doubled && i % 2 === 1 }
  })
}

export function SkidDial({ skid, ambi }) {
  return (
    <svg className="skid-dial" viewBox="0 0 240 240" role="img" aria-label={`${ambi} skid patches around the rear tire`}>
      <circle className="dial-tire" cx="120" cy="120" r="96" />
      <circle className="dial-rim" cx="120" cy="120" r="80" />
      {skidDots(skid, ambi, 120, 120, 96).map((d, i) => (
        <circle key={`${ambi}-${i}`} className={d.other ? 'dot other' : 'dot'} cx={d.x} cy={d.y} r="6.5" style={{ animationDelay: `${i * 25}ms` }} />
      ))}
      <text className="dial-num" x="120" y="132" textAnchor="middle">{ambi}</text>
      <text className="dial-cap" x="120" y="156" textAnchor="middle">PATCHES</text>
    </svg>
  )
}

export default function Bike({ chainring, cog, skid, ambi }) {
  const ringR = chainring / 2.2
  const cogR = cog / 2.2
  return (
    <svg className="bike-svg" viewBox="0 0 410 250" role="img" aria-label={`Bike with ${ambi} skid patches on the rear tire`}>
      <g className="tire">
        <circle cx={RW.x} cy={RW.y} r={RW.r} />
        <circle cx={FW.x} cy={FW.y} r={FW.r} />
      </g>
      <g className="spokes">
        {[0, 1, 2, 3, 4, 5].map(i => {
          const a = (i * Math.PI) / 6
          return [RW, FW].map((w, j) => (
            <line key={`${i}${j}`} x1={w.x - (w.r - 4) * Math.cos(a)} y1={w.y - (w.r - 4) * Math.sin(a)} x2={w.x + (w.r - 4) * Math.cos(a)} y2={w.y + (w.r - 4) * Math.sin(a)} />
          ))
        })}
      </g>
      <g className="frame">
        <path d={`M${RW.x} ${RW.y} L${BB.x} ${BB.y} L175 75 Z`} />
        <path d={`M175 75 L290 80 L297 100 L${BB.x} ${BB.y}`} />
        <path d={`M290 80 L${FW.x} ${FW.y}`} />
        <path d="M175 75 L170 58 M155 56 L188 56" />
        <path d="M290 80 L287 64 L312 64 Q322 66 316 80" />
      </g>
      <g className="bike-drive">
        <circle cx={BB.x} cy={BB.y} r={ringR} />
        <circle cx={RW.x} cy={RW.y} r={cogR} />
        <line x1={RW.x} y1={RW.y - cogR} x2={BB.x} y2={BB.y - ringR} />
        <line x1={RW.x} y1={RW.y + cogR} x2={BB.x} y2={BB.y + ringR} />
      </g>
      {skidDots(skid, ambi, RW.x, RW.y, RW.r).map((d, i) => (
        <circle key={`${ambi}-${i}`} className={d.other ? 'dot other' : 'dot'} cx={d.x} cy={d.y} r="5" />
      ))}
    </svg>
  )
}
