import type { Issue } from '../data/types'

export type IssueLane = 'assigned' | 'backlog' | 'done'

type Props = {
  issue: Issue
  lane: IssueLane
  selected: boolean
  onSelect: () => void
}

const STATUS_LABEL: Record<IssueLane, string> = {
  assigned: 'In Progress',
  backlog: 'Backlog',
  done: 'Done',
}

export function IssueCard({ issue, lane, selected, onSelect }: Props) {
  return (
    <button
      className={`issue-card issue-card--${lane}${selected ? ' is-selected' : ''}`}
      onClick={onSelect}
    >
      <div className="issue-card-top">
        <span className={`prio prio--${issue.priority.toLowerCase()}`} title={`${issue.priority} priority`} />
        <span className="issue-id">{issue.id}</span>
        <span className={`status-badge status-badge--${lane}`}>{STATUS_LABEL[lane]}</span>
      </div>
      <div className="issue-card-title">{issue.title}</div>
      <div className="issue-card-meta">
        <span className="topic-chip">{issue.topic}</span>
      </div>
    </button>
  )
}
