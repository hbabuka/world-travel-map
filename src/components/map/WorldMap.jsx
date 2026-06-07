// TODO: render interactive D3 world map using world-atlas TopoJSON
// Props: visitedCountryCodes, onCountryClick
export function WorldMap({ visitedCountryCodes = [], onCountryClick }) {
  return (
    <div className="relative w-full h-full bg-[var(--color-ocean)] rounded-[var(--radius-lg)] overflow-hidden">
      <svg className="w-full h-full" />
      <p className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
        Map coming soon…
      </p>
    </div>
  )
}
