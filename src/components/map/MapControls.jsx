// TODO: zoom in/out buttons and projection selector
import { Button } from '@/components/ui/button'
import { Plus, Minus, RotateCcw } from 'lucide-react'
import { useMapStore } from '@/store/mapStore'

export function MapControls() {
  const { zoom, setZoom, setPanOffset } = useMapStore()

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1">
      <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.min(z * 1.4, 12))} aria-label="Zoom in">
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.max(z / 1.4, 1))} aria-label="Zoom out">
        <Minus className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }) }} aria-label="Reset view">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}
