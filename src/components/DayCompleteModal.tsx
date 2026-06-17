import { useEffect } from 'react'

type Props = {
  dayTitle: string
  /** Number of tickets closed in the day. */
  count: number
  /** Whether this was the final day (changes the send-off copy). */
  lastDay: boolean
  onBackToDays: () => void
}

/** Celebratory overlay shown when the player closes the last ticket in a day. */
export function DayCompleteModal({ dayTitle, count, lastDay, onBackToDays }: Props) {
  // Enter/Escape both dismiss back to the hub.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onBackToDays()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBackToDays])

  return (
    <div className="modal-overlay" role="presentation" onClick={onBackToDays}>
      <div
        className="modal day-complete"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-complete-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="day-complete-emoji" aria-hidden="true">
          🎉
        </div>
        <h2 id="day-complete-title" className="modal-title">
          Day complete!
        </h2>
        <p className="modal-body">
          You closed all {count} tickets for <strong>{dayTitle}</strong>.
          {lastDay
            ? ' That was the final day — head back to wrap up.'
            : ' Pick your next day whenever you’re ready.'}
        </p>
        <div className="modal-actions">
          <button className="btn btn--primary" onClick={onBackToDays} autoFocus>
            {lastDay ? 'Finish →' : 'Back to days →'}
          </button>
        </div>
      </div>
    </div>
  )
}
