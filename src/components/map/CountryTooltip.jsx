// TODO: floating tooltip shown when hovering a country on the map
// Props: country (name, code), position (x, y), isVisited
export function CountryTooltip({ country, position, isVisited }) {
  if (!country) return null
  return (
    <div
      className="pointer-events-none absolute z-20 rounded-[var(--radius)] bg-[var(--color-surface)] shadow-[var(--shadow-panel)] px-3 py-1.5 text-sm"
      style={{ left: position?.x, top: position?.y, transform: 'translate(-50%, -110%)' }}
    >
      <span className="font-medium">{country.name}</span>
      {isVisited && <span className="ml-2 text-[var(--color-primary-600)]">✓ Visited</span>}
    </div>
  )
}
