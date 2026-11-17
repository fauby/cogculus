import { useEffect, useRef, useState } from 'react'

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useApi(load, deps) {
  const [state, setState] = useState({ data: null, error: '' })
  useEffect(() => {
    const ctrl = new AbortController()
    load(ctrl.signal)
      .then(data => setState({ data, error: '' }))
      .catch(e => e.name !== 'AbortError' && setState(s => ({ ...s, error: e.message })))
    return () => ctrl.abort()
  }, deps)
  return state
}

export function useTween(target, ms = 420) {
  const [value, setValue] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (reduceMotion || typeof target !== 'number' || typeof from.current !== 'number') {
      from.current = target
      setValue(target)
      return
    }
    const start = performance.now()
    const a = from.current
    let raf
    const step = now => {
      const t = Math.min(1, (now - start) / ms)
      const x = a + (target - a) * (1 - (1 - t) ** 3)
      from.current = x
      setValue(x)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

export function useStoredList(key) {
  const [list, setList] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key))
      return Array.isArray(v) ? v.filter(x => x && typeof x === 'object') : []
    } catch {
      return []
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(list))
    } catch {
      return
    }
  }, [key, list])
  return [list, setList]
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
