import { useState } from 'react'
import type { GameState } from '../state/gameState'
import { days, issuesForDay } from '../data/days'
import { BarActions } from './BarActions'
import { ConfirmModal } from './ConfirmModal'

type Theme = 'dark' | 'light'

type Props = {
  game: GameState
  theme: Theme
  soundOn: boolean
  onToggleTheme: () => void
  onToggleSound: () => void
  onReset: () => void
}

/**
 * The day-select hub — the persistent "main page." Lists the six days with
 * per-day progress; selecting one opens its (scoped) board.
 */
export function DayHub({ game, theme, soundOn, onToggleTheme, onToggleSound, onReset }: Props) {
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="landing day-hub">
      <header className="app-bar day-hub-bar">
        <span className="app-logo">🔥 Mojo Quest</span>
        <span className="app-tagline">Pick a day and get to work</span>
        <BarActions
          theme={theme}
          soundOn={soundOn}
          onToggleTheme={onToggleTheme}
          onToggleSound={onToggleSound}
        />
      </header>

      <div className="landing-inner">
        <header className="landing-hero day-hub-hero">
          <h1 className="landing-title">Six days to learn Mojo</h1>
          <p className="landing-lede">
            The MQ Robotics backlog is split into six days, each a focused set of
            tickets. Work them in any order - your progress saves automatically.
          </p>
        </header>

        <section className="landing-section">
          <div className="day-grid">
            {days.map((day) => {
              const dayIssues = issuesForDay(day.id)
              const total = dayIssues.length
              const doneCount = dayIssues.filter((i) => game.completedIds.has(i.id)).length
              const complete = total > 0 && doneCount === total
              const pct = total ? (doneCount / total) * 100 : 0
              return (
                <button
                  key={day.id}
                  className={`day-card${complete ? ' is-complete' : ''}`}
                  onClick={() => game.selectDay(day.id)}
                >
                  <div className="day-card-top">
                    <span className="day-card-num">Day {day.id}</span>
                    {complete && (
                      <span className="day-card-check" aria-label="Day complete">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="day-card-title">{day.title}</div>
                  <p className="day-card-blurb">{day.blurb}</p>
                  <div className="day-card-foot">
                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={total}
                      aria-valuenow={doneCount}
                      aria-label={`${doneCount} of ${total} tickets closed`}
                    >
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="day-card-count">
                      {doneCount}/{total}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <footer className="landing-foot">
          <button className="btn btn--ghost" onClick={() => setConfirmReset(true)}>
            Reset progress
          </button>
        </footer>
      </div>

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
    </div>
  )
}
