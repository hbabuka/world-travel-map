import { useRef, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react'
import * as d3 from 'd3'

const VB_W = 980
const VB_H = 480

const WorldMap = forwardRef(function WorldMap(
  { features, visited, justAdded, onToggle, onHover, decorative },
  ref
) {
  const svgRef = useRef(null)
  const gRef = useRef(null)
  const zoomRef = useRef(null)

  const paths = useMemo(() => {
    if (!features || !features.length) return null
    const fc = { type: 'FeatureCollection', features }
    const projection = d3.geoNaturalEarth1().fitSize([VB_W, VB_H], fc)
    const pathGen = d3.geoPath(projection)
    return {
      graticule: pathGen(d3.geoGraticule10()),
      sphere: pathGen({ type: 'Sphere' }),
      countries: features
        .map(f => ({ name: f.properties.name, d: pathGen(f) }))
        .filter(c => c.d),
    }
  }, [features])

  useEffect(() => {
    if (decorative || !svgRef.current || !gRef.current || !paths) return
    const svg = d3.select(svgRef.current)
    const g = d3.select(gRef.current)
    const zoom = d3.zoom()
      .scaleExtent([1, 9])
      .translateExtent([[0, 0], [VB_W, VB_H]])
      .on('zoom', event => g.attr('transform', event.transform))
    svg.call(zoom).on('dblclick.zoom', null)
    zoomRef.current = zoom
    return () => svg.on('.zoom', null)
  }, [paths, decorative])

  useImperativeHandle(ref, () => ({
    zoomIn() {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.6)
    },
    zoomOut() {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1 / 1.6)
    },
    reset() {
      d3.select(svgRef.current).transition().duration(450).call(zoomRef.current.transform, d3.zoomIdentity)
    },
  }), [])

  if (!paths) {
    return (
      <div className="wtm-map-loading">
        <div className="wtm-spinner" />
      </div>
    )
  }

  return (
    <svg
      ref={svgRef}
      className="wtm-map-svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="World map"
      style={decorative ? { pointerEvents: 'none' } : undefined}
    >
      <rect className="wtm-ocean" x="0" y="0" width={VB_W} height={VB_H} />
      <g ref={gRef}>
        <path className="wtm-sphere" d={paths.sphere} />
        <path className="wtm-graticule" d={paths.graticule} vectorEffect="non-scaling-stroke" />
        {paths.countries.map(c => {
          const isVisited = visited.has(c.name)
          const isPulse = justAdded === c.name
          const cls = ['wtm-country', isVisited && 'is-visited', isPulse && 'is-pulse']
            .filter(Boolean).join(' ')
          if (decorative) {
            return (
              <path key={c.name} className={cls} d={c.d} vectorEffect="non-scaling-stroke" />
            )
          }
          return (
            <path
              key={c.name}
              className={cls}
              d={c.d}
              vectorEffect="non-scaling-stroke"
              onClick={() => onToggle(c.name)}
              onMouseEnter={() => onHover(c.name)}
              onMouseLeave={() => onHover(null)}
            />
          )
        })}
      </g>
    </svg>
  )
})

export { WorldMap }
