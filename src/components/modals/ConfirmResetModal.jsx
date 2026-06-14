export function ConfirmResetModal({ count, onConfirm, onCancel }) {
  return (
    <div className="wtm-modal-scrim" onClick={onCancel}>
      <div className="wtm-confirm" onClick={e => e.stopPropagation()}>
        <p className="wtm-confirm-title">Reset your map?</p>
        <p className="wtm-confirm-body">
          This will remove all {count} pinned {count === 1 ? 'country' : 'countries'}. This can&rsquo;t be undone.
        </p>
        <div className="wtm-confirm-actions">
          <button className="wtm-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="wtm-confirm-ok" onClick={onConfirm}>Yes, reset</button>
        </div>
      </div>
    </div>
  )
}
