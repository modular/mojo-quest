import { useState } from 'react'
import type { GameState } from '../state/gameState'
import { IssueCard } from './IssueCard'
import { ConfirmModal } from './ConfirmModal'

type Props = { game: GameState; onReset: () => void }

export function IssuesPanel({ game, onReset }: Props) {
  const { assigned, backlog, done, selectedIssue } = game
  const total = game.issues.length
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <section className="panel issues-panel">
      <header className="panel-header">
        <span>MQ Robotics</span>
        <span className="progress-pill">
          {done.length}/{total} done
        </span>
      </header>

      <div className="issues-scroll">
        <div className="lane">
          <div className="lane-title">Assigned to you</div>
          {assigned.length === 0 && <div className="lane-empty">All caught up! 🎉</div>}
          {assigned.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              lane="assigned"
              selected={selectedIssue?.id === issue.id}
              onSelect={() => game.selectIssue(issue.id)}
            />
          ))}
        </div>

        {backlog.length > 0 && (
          <div className="lane">
            <div className="lane-title">Backlog</div>
            {backlog.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                lane="backlog"
                selected={selectedIssue?.id === issue.id}
                onSelect={() => game.selectIssue(issue.id)}
              />
            ))}
          </div>
        )}

        {done.length > 0 && (
          <div className="lane">
            <div className="lane-title">Done</div>
            {done.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                lane="done"
                selected={selectedIssue?.id === issue.id}
                onSelect={() => game.selectIssue(issue.id)}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="issues-footer">
        <button className="btn btn--ghost" onClick={() => setConfirmReset(true)}>
          Reset progress
        </button>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done.length}
          aria-label={`${done.length} of ${total} exercises completed`}
        >
          <div
            className="progress-fill"
            style={{ width: `${total ? (done.length / total) * 100 : 0}%` }}
          />
        </div>
      </footer>

      <ConfirmModal
        open={confirmReset}
        title="Reset all progress?"
        body="This clears every completed ticket and your saved code, and returns you to the start screen. This cannot be undone."
        confirmLabel="Reset progress"
        danger
        onConfirm={() => {
          setConfirmReset(false)
          onReset()
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </section>
  )
}
