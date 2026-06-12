import { issues } from '../data/issues'

type Props = {
  onStart: () => void
}

const STEPS: { icon: string; title: string; body: string }[] = [
  {
    icon: '🎫',
    title: 'Pick up a ticket',
    body: 'Your board lists bugs and tasks in the MQ Robotics codebase. Three are assigned to you at a time — the rest wait in the backlog.',
  },
  {
    icon: '📂',
    title: 'Open the file',
    body: 'Each ticket names a file in the robot software stack. Open it in the explorer to see the highlighted line(s) that need your fix.',
  },
  {
    icon: '⌨️',
    title: 'Write the Mojo',
    body: 'Edit the file in a real code editor. Stuck? Every ticket links to the exact page of the Mojo Manual that teaches the concept.',
  },
  {
    icon: '✅',
    title: 'Compile & ship',
    body: 'Hit Run & check to compile and execute your code on a real Mojo toolchain. When it builds and the output is right, the ticket closes and the next opens.',
  },
]

export function Landing({ onStart }: Props) {
  const topics = Array.from(new Set(issues.map((i) => i.topic)))

  return (
    <div className="landing">
      <div className="landing-inner">
        <header className="landing-hero">
          <span className="landing-logo">🔥 Mojo Quest</span>
          <h1 className="landing-title">
            Learn Mojo by closing tickets at a fictional robotics company.
          </h1>
          <p className="landing-lede">
            You've just joined the autonomy team at <strong>MQ Robotics</strong>,
            a company building autonomous mobile robots. Their robot software
            stack is written in Mojo — and the backlog is full. Work the queue,
            fix real code, and pick up the language one ticket at a time. Every
            fix is compiled and run on an actual Mojo compiler before it counts.
          </p>
          <p className="landing-disclaimer">
            Heads up: the robotics scenarios are a deliberately simplified,
            engaging backdrop for teaching Mojo language concepts — they are{' '}
            <strong>not</strong> a realistic depiction of how robot software is
            actually built.
          </p>
          <div className="landing-cta">
            <button className="btn btn--primary landing-start" onClick={onStart}>
              Start game →
            </button>
            <span className="landing-cta-note">No setup. Progress saves automatically.</span>
          </div>
        </header>

        <section className="landing-section">
          <h2 className="landing-h2">How you'll play</h2>
          <div className="landing-steps">
            {STEPS.map((s) => (
              <div className="landing-step" key={s.title}>
                <span className="landing-step-icon">{s.icon}</span>
                <div className="landing-step-title">{s.title}</div>
                <p className="landing-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <h2 className="landing-h2">What you'll cover</h2>
          <p className="landing-scope">
            <strong>{issues.length} tickets</strong> that climb the Mojo learning
            curve — from language basics through value ownership, traits and
            generics, and SIMD vectors. No prior Mojo required; each fix is a
            single focused concept.
          </p>
          <div className="landing-topics">
            {topics.map((t) => (
              <span className="landing-topic" key={t}>
                {t}
              </span>
            ))}
          </div>
        </section>

        <footer className="landing-foot">
          <button className="btn btn--primary landing-start" onClick={onStart}>
            Start game →
          </button>
        </footer>
      </div>
    </div>
  )
}
