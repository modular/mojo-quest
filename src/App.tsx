import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameState } from './state/gameState'
import { IssuesPanel } from './components/IssuesPanel'
import { FileTreePanel } from './components/FileTreePanel'
import { IssueDetail } from './components/IssueDetail'
import { EditorPanel } from './components/EditorPanel'
import { Landing } from './components/Landing'
import { Completion } from './components/Completion'
import { setSoundEnabled, playResolved, playFanfare } from './lib/sound'

const STARTED_KEY = 'mojo-quest/started'
const SOUND_KEY = 'mojo-quest/sound'
const THEME_KEY = 'mojo-quest/theme'

type Theme = 'dark' | 'light'

export function App() {
  const game = useGameState()
  const [toast, setToast] = useState<string | null>(null)
  const [started, setStarted] = useState<boolean>(
    () => localStorage.getItem(STARTED_KEY) === '1',
  )
  const [soundOn, setSoundOn] = useState<boolean>(
    () => localStorage.getItem(SOUND_KEY) === '1',
  )
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'),
  )
  // When every ticket is closed we show a send-off page; "Back to the board"
  // flips this so the player can still review their completed tickets.
  const [reviewing, setReviewing] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const notify = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 3000)
  }, [])

  const startGame = useCallback(() => {
    try {
      localStorage.setItem(STARTED_KEY, '1')
    } catch {
      /* ignore quota / private-mode errors */
    }
    setStarted(true)
  }, [])

  // Wipe all progress and return to the landing screen.
  const resetToLanding = useCallback(() => {
    game.resetProgress()
    try {
      localStorage.removeItem(STARTED_KEY)
    } catch {
      /* ignore quota / private-mode errors */
    }
    setReviewing(false)
    setStarted(false)
  }, [game])

  // Keep the sound engine in sync with the persisted preference.
  useEffect(() => {
    setSoundEnabled(soundOn)
  }, [soundOn])

  // Reflect the theme on the document root (drives the CSS variables) and persist.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SOUND_KEY, next ? '1' : '0')
      } catch {
        /* ignore quota / private-mode errors */
      }
      // Enable within this gesture, then confirm audibly that it works.
      if (next) {
        setSoundEnabled(true)
        playResolved()
      }
      return next
    })
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Submit the active ticket: only valid once its check has passed. Marks it
  // done and auto-advances to the next ticket.
  const submitActive = useCallback(() => {
    const issue = game.selectedIssue
    if (!issue || !game.passedIds.has(issue.id) || game.completedIds.has(issue.id)) return
    // Did this close the very last open ticket?
    const finishesAll = game.issues.length - game.completedIds.size === 1
    if (finishesAll) playFanfare()
    else playResolved()
    notify(`✓ ${issue.id} resolved — nice work!`)
    game.completeIssue(issue.id)
  }, [game, notify])

  if (!started) {
    return <Landing onStart={startGame} />
  }

  // Every ticket closed: show the send-off until the player chooses to review.
  const allComplete =
    game.issues.length > 0 && game.completedIds.size === game.issues.length
  if (allComplete && !reviewing) {
    return (
      <Completion
        total={game.issues.length}
        onReview={() => setReviewing(true)}
        onReset={resetToLanding}
      />
    )
  }

  return (
    <div className="app">
      <header className="app-bar">
        <span className="app-logo">🔥 Mojo Quest</span>
        <span className="app-tagline">Learn Mojo by closing tickets</span>
        <div className="bar-actions">
          <button
            className="bar-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              {theme === 'dark' ? (
                // Moon (currently dark → offer light).
                <path
                  d="M13 9.5A5 5 0 0 1 6.5 3a5 5 0 1 0 6.5 6.5z"
                  fill="currentColor"
                />
              ) : (
                // Sun (currently light → offer dark).
                <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
                  <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13" />
                </g>
              )}
            </svg>
          </button>
          <button
            className="bar-btn"
            onClick={toggleSound}
            aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
            aria-pressed={soundOn}
            title={soundOn ? 'Mute sounds' : 'Enable sounds'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 6h2.5L9 3v10L5.5 10H3z" fill="currentColor" />
              {soundOn ? (
                <path
                  d="M11 5.5a3.5 3.5 0 0 1 0 5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M11.5 6l3 4M14.5 6l-3 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </header>
      <main className="columns">
        <IssuesPanel game={game} onReset={resetToLanding} />
        <FileTreePanel game={game} />
        <div className="work-column">
          <IssueDetail game={game} onSubmit={submitActive} />
          <EditorPanel game={game} notify={notify} theme={theme} />
        </div>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
