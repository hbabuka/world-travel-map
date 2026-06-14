export function EmptyState({ onLoadSample, onDismiss }) {
  return (
    <div className="wtm-empty">
      <div className="wtm-empty-card">
        <button className="wtm-empty-close" onClick={onDismiss} aria-label="Dismiss">×</button>
        <div className="mono wtm-empty-eyebrow">Get started</div>
        <h2 className="wtm-empty-title">Start your travel map</h2>
        <p className="wtm-empty-sub">
          Search a country up top, or click any shape on the map to pin where you&rsquo;ve been.
        </p>
        <div className="wtm-empty-actions">
          <button className="wtm-empty-btn" onClick={onLoadSample}>Load a sample trip</button>
          <span className="mono wtm-empty-hint">or click the map</span>
        </div>
      </div>
    </div>
  )
}
