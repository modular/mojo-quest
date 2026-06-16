import { useState } from 'react'
import { ConfirmModal } from './ConfirmModal'

type Props = {
  total: number
  onReview: () => void
  onReset: () => void
}

const NEXT_STEPS: {
  icon: string
  title: string
  body: string
  href: string
  cta: string
}[] = [
  {
    icon: '🧩',
    title: 'Learn GPU programming in Mojo',
    body: 'Mojo GPU Puzzles use this same puzzle-driven format to teach writing high-performance GPU kernels in Mojo.',
    href: 'https://puzzles.modular.com/',
    cta: 'Open Mojo GPU Puzzles ↗',
  },
  {
    icon: '💬',
    title: 'Join the Modular forum',
    body: 'Ask questions, share what you built, and talk Mojo and MAX with the community and the Modular team.',
    href: 'https://forum.modular.com/',
    cta: 'Visit the forum ↗',
  },
  {
    icon: '🛠️',
    title: 'Contribute to Mojo',
    body: 'The Mojo standard library is open source. File an issue, improve the docs, or send a pull request.',
    href: 'https://github.com/modular/modular',
    cta: 'Open the repo ↗',
  },
]

/** Shown once every ticket is closed: a send-off with where to take Mojo next. */
export function Completion({ total, onReview, onReset }: Props) {
  const [confirmReset, setConfirmReset] = useState(false)
  return (
    <div className="landing">
      <div className="landing-inner">
        <header className="landing-hero">
          <span className="landing-logo">🔥 Mojo Quest</span>
          <h1 className="landing-title">Backlog cleared. You closed all {total} tickets.</h1>
          <p className="landing-lede">
            You worked the entire MQ Robotics queue, from the program entry point through
            functions, types, ownership, traits, metaprogramming, and unsafe pointers. Every fix
            compiled and ran on a real Mojo toolchain. You have the language fundamentals down.
            Here is where to take Mojo next.
          </p>
        </header>

        <section className="landing-section">
          <h2 className="landing-h2">Where to go next</h2>
          <div className="landing-steps completion-links">
            {NEXT_STEPS.map((s) => (
              <a
                className="landing-step completion-card"
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="landing-step-icon">{s.icon}</span>
                <div className="landing-step-title">{s.title}</div>
                <p className="landing-step-body">{s.body}</p>
                <span className="completion-card-cta">{s.cta}</span>
              </a>
            ))}
          </div>
        </section>

        <footer className="landing-foot completion-foot">
          <button className="btn btn--primary landing-start" onClick={onReview}>
            ← Back to the board
          </button>
          <button className="btn" onClick={() => setConfirmReset(true)}>
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
