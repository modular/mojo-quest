import { useCallback, useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import type { GameState } from '../state/gameState'
import { compileAndRun, MOJO_VERSION_LABEL, type RunResult } from '../lib/compile'
import { checkSolution, type CheckOutcome } from '../lib/validate'
import { playRunStart, playResolved, playFail } from '../lib/sound'

type Props = {
  game: GameState
  notify: (message: string) => void
  theme: 'dark' | 'light'
}

type Phase = 'idle' | 'running' | 'done'

export function EditorPanel({ game, notify, theme }: Props) {
  const { selectedIssue } = game
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<RunResult | null>(null)
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null)
  const [showHint, setShowHint] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // Reset the console + hint whenever the active ticket changes.
  useEffect(() => {
    setPhase('idle')
    setResult(null)
    setOutcome(null)
    setShowHint(false)
    abortRef.current?.abort()
  }, [selectedIssue?.id])

  useEffect(() => () => abortRef.current?.abort(), [])

  const issue = selectedIssue
  const source = issue ? game.sourceFor(issue.id) : ''
  const solved = issue ? game.completedIds.has(issue.id) : false

  const onChange = useCallback(
    (value: string) => {
      if (issue) game.setSource(issue.id, value)
    },
    [issue, game],
  )

  const run = useCallback(async () => {
    if (!issue) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const submitted = game.sourceFor(issue.id)

    setPhase('running')
    setResult(null)
    setOutcome(null)
    playRunStart()

    const res = await compileAndRun(submitted, ctrl.signal)
    if (ctrl.signal.aborted) return

    const verdict = checkSolution(issue, res, submitted)
    setResult(res)
    setOutcome(verdict)
    setPhase('done')

    // Run & check only validates now — it records the result, which reveals the
    // success banner + Submit button on the ticket. Submitting closes it.
    game.markChecked(issue.id, verdict.passed)
    if (verdict.passed) {
      playResolved()
      if (!game.completedIds.has(issue.id)) {
        notify(`✓ Check passed — hit Submit to close ${issue.id}`)
      }
    } else {
      playFail()
    }
  }, [issue, game, notify])

  if (!issue) {
    return (
      <section className="panel editor-panel">
        <header className="panel-header">Editor</header>
        <div className="editor-empty">Select a ticket to open its file.</div>
      </section>
    )
  }

  const filename = issue.file.split('/').pop()

  return (
    <section className="panel editor-panel">
      <header className="panel-header">
        <span>Editor</span>
        <span className="compiler-badge" title="Compiled & executed on Compiler Explorer">
          {MOJO_VERSION_LABEL}
        </span>
      </header>

      <div className="editor-tabs">
        <span className="editor-tab editor-tab--active">
          {filename}
          {solved && <span className="tab-check"> ✓</span>}
        </span>
        <span className="editor-path">{issue.file}</span>
      </div>

      <div className="code-editor">
        <CodeMirror
          value={source}
          height="100%"
          theme={theme}
          extensions={[python()]}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            tabSize: 4,
            // The editor uses CodeMirror's Python mode as a stand-in for Mojo
            // (there is no Mojo language package), so its keyword/global
            // completions are for the wrong language. Disable them.
            autocompletion: false,
          }}
        />
      </div>

      <div className="editor-toolbar">
        <button className="btn btn--primary" onClick={run} disabled={phase === 'running'}>
          {phase === 'running' ? 'Compiling…' : '▶ Run & check'}
        </button>
        <button
          className="btn"
          onClick={() => {
            game.resetSource(issue.id)
            setPhase('idle')
            setResult(null)
            setOutcome(null)
          }}
          disabled={phase === 'running'}
        >
          Reset code
        </button>
        <button className="btn btn--ghost" onClick={() => setShowHint((v) => !v)}>
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>
      </div>

      {showHint && <div className="editor-hint">💡 {issue.hint}</div>}

      <Console phase={phase} result={result} outcome={outcome} />
    </section>
  )
}

function Console({
  phase,
  result,
  outcome,
}: {
  phase: Phase
  result: RunResult | null
  outcome: CheckOutcome | null
}) {
  if (phase === 'idle') {
    return (
      <div className="console console--idle">
        <span className="console-prompt">$</span> Press “Run &amp; check” to compile and
        execute your code on a real Mojo toolchain.
      </div>
    )
  }

  if (phase === 'running') {
    return (
      <div className="console">
        <div className="console-line console-line--info">Sending to Compiler Explorer…</div>
        <div className="console-line console-line--dim">
          Compiling and running Mojo — this can take a few seconds.
        </div>
      </div>
    )
  }

  if (!result || !outcome) return null

  return (
    <div className="console">
      {result.error ? (
        <div className="console-line console-line--err">{result.error}</div>
      ) : (
        <>
          <div
            className={`console-line ${result.compiled ? 'console-line--ok' : 'console-line--err'}`}
          >
            {result.compiled ? '✓ Compiled' : '✗ Compilation failed'}
          </div>
          {result.buildStderr && (
            <pre className="console-block console-block--diag">{clip(result.buildStderr)}</pre>
          )}
          {result.compiled && (
            <div
              className={`console-line ${result.exitCode === 0 ? 'console-line--ok' : 'console-line--err'}`}
            >
              {result.timedOut
                ? '✗ Execution timed out'
                : `Program exited with code ${result.exitCode ?? '?'}`}
            </div>
          )}
          {result.stdout && (
            <pre className="console-block console-block--stdout">{clip(result.stdout)}</pre>
          )}
          {result.stderr && (
            <pre className="console-block console-block--diag">{clip(result.stderr)}</pre>
          )}
        </>
      )}

      <div className={`console-verdict ${outcome.passed ? 'is-pass' : 'is-fail'}`}>
        {outcome.passed ? '✓ ' : '✗ '}
        {outcome.reason}
      </div>
      {outcome.detail && <pre className="console-block console-block--diff">{outcome.detail}</pre>}
    </div>
  )
}

/** Keep console output from blowing up the panel. */
function clip(text: string, max = 1600): string {
  return text.length > max ? text.slice(0, max) + '\n…(truncated)' : text
}
