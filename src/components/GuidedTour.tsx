import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Step = {
  target: string // data-tour attribute value
  title: string
  body: string
  placement: 'right' | 'left' | 'bottom' | 'top'
}

const STEPS: Step[] = [
  {
    target: 'issues-panel',
    title: 'Ticket queue',
    body: 'Your exercises live here as tickets. Click one to open it in the editor. Work through them top-to-bottom to follow the curriculum.',
    placement: 'right',
  },
  {
    target: 'issue-detail',
    title: 'Active ticket',
    body: "Each ticket describes what's broken or missing and shows a short example. Read it before editing — the hint button is here too if you get stuck.",
    placement: 'bottom',
  },
  {
    target: 'code-editor',
    title: 'Code editor',
    body: 'Edit the Mojo source here to fix the bug or complete the exercise. Your changes are saved automatically.',
    placement: 'top',
  },
  {
    target: 'run-button',
    title: 'Run & check',
    body: 'Compile and run your code against the expected output. You can also press Ctrl+Cmd+Enter (Mac) or Ctrl+Shift+Enter (Windows/Linux).',
    placement: 'top',
  },
  {
    target: 'issues-panel',
    title: "That's it!",
    body: 'Once your output matches, a Submit button appears. Submit to close the ticket and move to the next one. Good luck!',
    placement: 'right',
  },
]

type Rect = { top: number; left: number; width: number; height: number }

function getTargetRect(target: string): Rect | null {
  const el = document.querySelector(`[data-tour="${target}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

const GAP = 16
const TIP_W = 300
const TIP_H_EST = 180 // estimated tooltip height for clamping
const VIEWPORT_PAD = 16

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function tooltipStyle(rect: Rect, placement: Step['placement']): React.CSSProperties {
  const vw = window.innerWidth
  const vh = window.innerHeight

  let top: number
  let left: number

  switch (placement) {
    case 'right': {
      top = rect.top + rect.height / 2 - TIP_H_EST / 2
      left = rect.left + rect.width + GAP
      break
    }
    case 'left': {
      top = rect.top + rect.height / 2 - TIP_H_EST / 2
      left = rect.left - TIP_W - GAP
      break
    }
    case 'bottom': {
      top = rect.top + rect.height + GAP
      left = rect.left + rect.width / 2 - TIP_W / 2
      break
    }
    case 'top': {
      top = rect.top - TIP_H_EST - GAP
      left = rect.left + rect.width / 2 - TIP_W / 2
      break
    }
  }

  // If the tooltip would overflow the right edge, flip to the left of the target
  if (placement === 'right' && left + TIP_W > vw - VIEWPORT_PAD) {
    left = rect.left - TIP_W - GAP
  }
  // If the tooltip would overflow the bottom edge, flip to above the target
  if (placement === 'bottom' && top + TIP_H_EST > vh - VIEWPORT_PAD) {
    top = rect.top - TIP_H_EST - GAP
  }
  // If the tooltip would go above the top edge, flip to below the target
  if ((placement === 'top') && top < VIEWPORT_PAD) {
    top = rect.top + rect.height + GAP
  }

  // Clamp to viewport
  top = clamp(top, VIEWPORT_PAD, vh - TIP_H_EST - VIEWPORT_PAD)
  left = clamp(left, VIEWPORT_PAD, vw - TIP_W - VIEWPORT_PAD)

  return { top, left }
}

type Props = { onDone: () => void }

export function GuidedTour({ onDone }: Props) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  const current = STEPS[step]

  useLayoutEffect(() => {
    setRect(getTargetRect(current.target))
  }, [step, current.target])

  // Recompute on resize
  useEffect(() => {
    const onResize = () => setRect(getTargetRect(current.target))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [current.target])

  // Dismiss on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else onDone()
  }

  const isLast = step === STEPS.length - 1

  const centeredStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: TIP_W,
    maxWidth: `calc(100vw - ${VIEWPORT_PAD * 2}px)`,
  }

  return (
    <div className="tour-overlay" aria-modal="true" role="dialog" aria-label="Guided tour">
      {/* Spotlight cutout — omitted on the final step */}
      {rect && !isLast && (
        <div
          className="tour-spotlight"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
          }}
        />
      )}

      {/* Tooltip — centered on final step, anchored to target otherwise */}
      <div
        ref={tipRef}
        className="tour-tip"
        style={isLast ? centeredStyle : { ...tooltipStyle(rect ?? { top: 0, left: 0, width: 0, height: 0 }, current.placement), width: TIP_W, maxWidth: `calc(100vw - ${VIEWPORT_PAD * 2}px)` }}
      >
          <p className="tour-tip-step">
            {step + 1} / {STEPS.length}
          </p>
          <h3 className="tour-tip-title">{current.title}</h3>
          <p className="tour-tip-body">{current.body}</p>
          <div className="tour-tip-actions">
            <button className="btn btn--ghost tour-skip" onClick={onDone}>
              Skip
            </button>
            <button className="btn btn--primary" onClick={next} autoFocus>
              {isLast ? 'Done' : 'Next →'}
            </button>
          </div>
        </div>
    </div>
  )
}
