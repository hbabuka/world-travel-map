export function Chip({ name, isNew, onRemove }) {
  return (
    <span className={`wtm-chip${isNew ? ' is-new' : ''}`}>
      {name}
      <button className="wtm-chip-x" onClick={() => onRemove(name)} aria-label={`Remove ${name}`}>
        ×
      </button>
    </span>
  )
}
