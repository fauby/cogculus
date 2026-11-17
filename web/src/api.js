const get = (path, params, signal) =>
  fetch(`${path}?${new URLSearchParams(params)}`, { signal }).then(res =>
    res.ok ? res.json() : res.text().then(t => Promise.reject(new Error(t.trim()))),
  )

export const fetchRatio = (params, signal) => get('/api/ratio', params, signal)

export const fetchRatios = (combos, { tire, cadence }, signal) =>
  get('/api/ratios', { combos: combos.map(([c, g]) => `${c}x${g}`).join(','), tire, cadence }, signal)
