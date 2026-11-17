export const LIMITS = { chainring: [28, 60], cog: [9, 24], tire: [18, 60], cadence: [20, 200] }

export const METRICS = [
  { key: 'ratio', label: 'Ratio', unit: ':1', formula: 'chainring ÷ cog', desc: 'Rear wheel turns per pedal turn.' },
  { key: 'gearInches', label: 'Gear inches', unit: 'in', formula: 'ratio × wheel diameter', desc: 'The classic yardstick. Lower spins up and skids easier, higher holds more speed.' },
  { key: 'developmentM', label: 'Development', unit: 'm', formula: 'ratio × tire circumference', desc: 'Distance covered in one full pedal turn, also called rollout.' },
  { key: 'speedKmh', label: 'Speed', unit: 'km/h', formula: 'development × cadence × 60', desc: 'Road speed at your chosen cadence.' },
  { key: 'skidPatches', label: 'Skid patches', unit: '', digits: 0, formula: 'cog ÷ gcd(chainring, cog)', desc: 'Spots where the tire meets the road when you skid with your favourite foot forward.' },
  { key: 'ambiPatches', label: 'Ambidextrous', unit: '', digits: 0, formula: 'doubled when chainring ÷ gcd is odd', desc: 'Patches when you skid with either foot forward.' },
]

export const sameSetup = (a, b) => String(a.chainring) === String(b.chainring) && String(a.cog) === String(b.cog)
