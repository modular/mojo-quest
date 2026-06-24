import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameState } from './state/gameState'
import { IssuesPanel } from './components/IssuesPanel'
import { IssueDetail } from './components/IssueDetail'
import { GuidedTour } from './components/GuidedTour'
import { EditorPanel } from './components/EditorPanel'
import { Landing } from './components/Landing'
import { Completion } from './components/Completion'
import { DayHub } from './components/DayHub'
import { DayCompleteModal } from './components/DayCompleteModal'
import { BarActions } from './components/BarActions'
import { days, dayOf, issuesForDay } from './data/days'
import { setSoundEnabled, playResolved, playFanfare } from './lib/sound'

const STARTED_KEY = 'mojo-quest/started'
const SOUND_KEY = 'mojo-quest/sound'
const THEME_KEY = 'mojo-quest/theme'
const TOUR_KEY = 'mojo-quest/tour-done'

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
  // The day whose completion modal is showing (set on closing a day's last
  // ticket). Transient so re-entering a finished day for review doesn't re-pop.
  const [dayCompleteModal, setDayCompleteModal] = useState<number | null>(null)
  const [issuesCollapsed, setIssuesCollapsed] = useState(false)
  const [tourActive, setTourActive] = useState(
    () => localStorage.getItem(TOUR_KEY) !== '1',
  )

  const startTour = useCallback(() => setTourActive(true), [])
  const endTour = useCallback(() => {
    setTourActive(false)
    try { localStorage.setItem(TOUR_KEY, '1') } catch { /* ignore */ }
  }, [])
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

  // Leave the day board and return to the day hub (progress preserved).
  const goToDays = useCallback(() => {
    setDayCompleteModal(null)
    game.exitDay()
  }, [game])

  // Submit the active ticket: only valid once its check has passed. Marks it
  // done and auto-advances to the next ticket in the day.
  const submitActive = useCallback(() => {
    const issue = game.selectedIssue
    if (!issue || !game.passedIds.has(issue.id) || game.completedIds.has(issue.id)) return
    // Did this close the very last open ticket overall, or the last in its day?
    const finishesAll = game.issues.length - game.completedIds.size === 1
    const inDay = issuesForDay(dayOf(issue.id))
    const dayDoneAfter = inDay.filter((i) => game.completedIds.has(i.id)).length + 1
    const finishesDay = inDay.length > 0 && dayDoneAfter === inDay.length
    if (finishesAll) playFanfare()
    else playResolved()
    notify(`✓ ${issue.id} resolved — nice work!`)
    game.completeIssue(issue.id)
    if (finishesDay) setDayCompleteModal(dayOf(issue.id))
  }, [game, notify])

  if (!started) {
    return <Landing onStart={startGame} />
  }

  const allComplete =
    game.issues.length > 0 && game.completedIds.size === game.issues.length

  // A day is open: render its board. This branch comes before the all-complete
  // check so closing the final day's last ticket shows the day-complete modal
  // first; "Back to days" then falls through to the Completion send-off.
  if (game.selectedDay != null) {
    const openDay = days.find((d) => d.id === game.selectedDay)
    return (
      <div className="app">
        <header className="app-bar">
          <button className="bar-btn bar-btn--back" onClick={goToDays}>
            ← Days
          </button>
          <span className="app-logo">🔥 Mojo Quest</span>
          <span className="app-tagline">{openDay ? openDay.title : 'Learn Mojo by closing tickets'}</span>
          <BarActions
            theme={theme}
            soundOn={soundOn}
            onToggleTheme={toggleTheme}
            onToggleSound={toggleSound}
            onStartTour={startTour}
          />
        </header>
        <main className={`columns${issuesCollapsed ? ' columns--issues-collapsed' : ''}`}>
          <IssuesPanel
            game={game}
            onReset={resetToLanding}
            collapsed={issuesCollapsed}
            onToggleCollapsed={() => setIssuesCollapsed((v) => !v)}
          />
          <div className="work-column">
            <IssueDetail game={game} onSubmit={submitActive} />
            <EditorPanel game={game} notify={notify} theme={theme} />
          </div>
        </main>
        {tourActive && <GuidedTour onDone={endTour} />}
        {toast && <div className="toast">{toast}</div>}
        {dayCompleteModal != null && (
          <DayCompleteModal
            dayTitle={days.find((d) => d.id === dayCompleteModal)?.title ?? `Day ${dayCompleteModal}`}
            count={issuesForDay(dayCompleteModal).length}
            lastDay={allComplete}
            onBackToDays={goToDays}
          />
        )}
      </div>
    )
  }

  // Every ticket closed: show the send-off until the player chooses to review.
  if (allComplete && !reviewing) {
    return (
      <Completion
        total={game.issues.length}
        onReview={() => setReviewing(true)}
        onReset={resetToLanding}
      />
    )
  }

  // No day open: the day-select hub (the "main page").
  return (
    <DayHub
      game={game}
      theme={theme}
      soundOn={soundOn}
      onToggleTheme={toggleTheme}
      onToggleSound={toggleSound}
      onReset={resetToLanding}
    />
  )
}
