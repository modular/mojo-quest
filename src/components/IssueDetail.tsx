import type { ReactNode } from 'react'
import type { GameState } from '../state/gameState'

/** Render a single line, turning inline `code` spans into <code> elements. */
function renderInline(text: string): ReactNode {
  return text.split('`').map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="desc-inline">
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

/** Minimal renderer for the issue description: ``` fences and inline `code`. */
function renderDescription(text: string): ReactNode {
  const out: ReactNode[] = []
  const lines = text.split('\n')
  let i = 0
  let key = 0
  while (i < lines.length) {
    if (lines[i].trim().startsWith('```')) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i])
        i++
      }
      i++ // skip closing fence
      out.push(
        <pre key={key++} className="desc-code">
          {buf.join('\n')}
        </pre>,
      )
      continue
    }
    out.push(
      <p key={key++} className="desc-line">
        {renderInline(lines[i])}
      </p>,
    )
    i++
  }
  return out
}

type Props = { game: GameState; onSubmit: () => void }

/** The "active ticket" reading pane, shown above the editor. */
export function IssueDetail({ game, onSubmit }: Props) {
  const issue = game.selectedIssue

  if (!issue) {
    return (
      <section className="panel issue-detail-panel">
        <header className="panel-header">Active ticket</header>
        <div className="issue-detail-empty">Select a ticket to read its brief.</div>
      </section>
    )
  }

  const done = game.completedIds.has(issue.id)
  const passed = game.passedIds.has(issue.id)
  // Reveal the concept as a success banner once the check passes, and keep it
  // visible on already-completed tickets as a recap.
  const showConcept = passed || done

  return (
    <section className="panel issue-detail-panel" data-tour="issue-detail">
      <header className="panel-header">
        <span>Active ticket</span>
        <span
          className={`prio prio--${issue.priority.toLowerCase()}`}
          title={`${issue.priority} priority`}
        />
      </header>
      <div className="issue-detail">
        <div className="issue-detail-head">
          <span className="issue-id">{issue.id}</span>
          <h2>{issue.title}</h2>
        </div>

        {showConcept && (
          <div className="issue-success-row">
            <div className="issue-concept issue-concept--success">
              <span className="issue-concept-label">✓ {done ? 'Learned' : 'Solved'}</span>
              <span className="issue-concept-text">{renderInline(issue.concept)}</span>
            </div>
            {passed && !done && (
              <button className="btn btn--primary issue-submit" onClick={onSubmit}>
                Submit &amp; next ticket →
              </button>
            )}
          </div>
        )}

        <div className="issue-desc">{renderDescription(issue.description)}</div>
        {issue.dayDocUrls && issue.dayDocUrls.length > 0 && (
          <div className="day-doc-links">
            <span className="day-doc-links-label">Optional reading</span>
            {issue.dayDocUrls.map(({ label, url }) => (
              <a key={url} className="doc-link" href={url} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            ))}
          </div>
        )}
        <div className="issue-detail-actions">
          <span className="issue-file-chip">{issue.file}</span>
          <a className="doc-link" href={issue.docUrl} target="_blank" rel="noreferrer">
            Read the docs ↗
          </a>
        </div>
      </div>
    </section>
  )
}
