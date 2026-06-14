export const RANKS = [
  { name: 'Blank Page',      min: 0,   max: 4   },
  { name: 'First Ink',       min: 5,   max: 14  },
  { name: 'Dog-Eared',       min: 15,  max: 29  },
  { name: 'Full Passport',   min: 30,  max: 49  },
  { name: 'Second Passport', min: 50,  max: 74  },
  { name: 'Diplomat',        min: 75,  max: 99  },
  { name: 'Cartographer',    min: 100, max: 149 },
  { name: 'World Atlas',     min: 150, max: Infinity },
]

export function getRank(count) {
  const index = RANKS.findIndex(r => count <= r.max)
  const rank = RANKS[index]
  const next = RANKS[index + 1] ?? null
  const progress = next
    ? (count - rank.min) / (next.min - rank.min)
    : 1
  return { rank, next, index, progress: Math.min(progress, 1) }
}
