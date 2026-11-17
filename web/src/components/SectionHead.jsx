export default function SectionHead({ index, kicker, title, children }) {
  return (
    <header className="sec-head">
      <p className="sec-index mono"><span>{index}</span>{kicker}</p>
      <h2 className="display">{title}</h2>
      {children && <div className="sec-lede">{children}</div>}
    </header>
  )
}
