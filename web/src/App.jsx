import { useEffect, useRef, useState } from 'react'
import { fetchRatio } from './api.js'
import { useApi, useReveal, useStoredList } from './hooks.js'
import { sameSetup } from './metrics.js'
import Anatomy from './components/Anatomy.jsx'
import Cadence from './components/Cadence.jsx'
import Calculator from './components/Calculator.jsx'
import { Footer, Header, MobileBar } from './components/Chrome.jsx'
import Compare from './components/Compare.jsx'
import Explore from './components/Explore.jsx'
import Hero from './components/Hero.jsx'
import Saved from './components/Saved.jsx'
import Skid from './components/Skid.jsx'

const DEFAULTS = { chainring: '48', cog: '17', tire: '25', cadence: '90' }
const FALLBACK = { chainring: 48, cog: 17 }
const KEYS = Object.keys(DEFAULTS)

const readUrl = () => {
  const q = new URLSearchParams(location.search)
  return Object.fromEntries(KEYS.map(k => [k, q.get(k) ?? DEFAULTS[k]]))
}

const scrollTo = id => document.getElementById(id)?.scrollIntoView()

export default function App() {
  const [params, setParams] = useState(readUrl)
  const [b, setB] = useState({ chainring: '46', cog: '16' })
  const [saved, setSaved] = useStoredList('onegear.saved')
  const { data: r, error } = useApi(s => fetchRatio(params, s), [params])
  const { data: rB } = useApi(s => fetchRatio({ ...b, tire: params.tire, cadence: params.cadence }, s), [b, params.tire, params.cadence])
  useReveal()

  const jumped = useRef(false)
  useEffect(() => {
    if (!r || jumped.current) return
    jumped.current = true
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
  }, [r])

  useEffect(() => {
    history.replaceState(null, '', `?${new URLSearchParams(params)}${location.hash}`)
  }, [params])

  const set = patch => setParams(p => ({ ...p, ...patch }))
  const ride = (chainring, cog) => {
    set({ chainring: String(chainring), cog: String(cog) })
    scrollTo('calculator')
  }
  const compareWith = (chainring, cog) => {
    setB({ chainring: String(chainring), cog: String(cog) })
    scrollTo('compare')
  }
  const isSaved = saved.some(s => KEYS.every(k => String(s[k]) === String(params[k])))
  const save = () => !isSaved && setSaved(list => [{ ...params }, ...list].slice(0, 24))
  const load = s => {
    set(Object.fromEntries(KEYS.map(k => [k, String(s[k] ?? DEFAULTS[k])])))
    scrollTo('calculator')
  }
  const swap = () => {
    setB({ chainring: params.chainring, cog: params.cog })
    set({ chainring: b.chainring, cog: b.cog })
  }
  const shown = r ?? FALLBACK

  return (
    <>
      <a className="skip mono" href="#calculator">Skip to calculator</a>
      <Header />
      <main>
        <Hero r={shown} />
        <Anatomy r={shown} />
        <Calculator params={params} set={set} r={r} error={error} onSave={save} isSaved={isSaved} />
        <Explore params={params} current={r} onRide={ride} onCompare={compareWith} />
        <Compare a={shown} b={b} rA={r} rB={rB} setB={setB} onSwap={swap} />
        <Skid params={params} r={r} onRide={ride} />
        <Cadence cadence={params.cadence} setCadence={v => set({ cadence: v })} rA={r} rB={rB && !sameSetup(rB, shown) ? rB : null} />
        <Saved saved={saved} onLoad={load} onRemove={i => setSaved(list => list.filter((_, j) => j !== i))} />
      </main>
      <Footer />
      <MobileBar r={shown} />
    </>
  )
}
