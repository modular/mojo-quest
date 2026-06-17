import { useCallback, useEffect, useMemo, useState } from 'react'
import { issues } from '../data/issues'
import { dayOf } from '../data/days'
import type { Issue } from '../data/types'

const STORAGE_KEY = 'mojo-quest/v7'
const ASSIGNED_LIMIT = 3

const issueById = new Map(issues.map((i) => [i.id, i]))

type Persisted = {
  completedIds: string[]
  selectedIssueId: string | null
  /** Which day's board is open, or `null` when the player is on the day hub. */
  selectedDay: number | null
  /** edited source per issue id (absent → use the issue's starter) */
  sources: Record<string, string>
}

function load(): Persisted {
  const fallback: Persisted = {
    completedIds: [],
    selectedIssueId: issues[0]?.id ?? null,
    selectedDay: null,
    sources: {},
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return { ...fallback, ...(JSON.parse(raw) as Partial<Persisted>) }
  } catch {
    return fallback
  }
}

export type GameState = {
  issues: Issue[]
  /** The currently-open day (1..6), or `null` when on the day hub. */
  selectedDay: number | null
  /** Issues belonging to `selectedDay` (empty when no day is open). */
  dayIssues: Issue[]
  assigned: Issue[]
  backlog: Issue[]
  done: Issue[]
  completedIds: Set<string>
  selectedIssue: Issue | null
  /**
   * Issues whose latest "Run & check" passed but haven't been submitted yet.
   * Transient (not persisted): cleared on edit, on submit, and on reload.
   */
  passedIds: Set<string>
  /** Record whether an issue's latest check passed (drives the success banner). */
  markChecked: (id: string, passed: boolean) => void
  /** Current editor contents for an issue (edited value or its starter). */
  sourceFor: (issueId: string) => string
  setSource: (issueId: string, value: string) => void
  /** Restore an issue's editor to its starter code. */
  resetSource: (issueId: string) => void
  selectIssue: (id: string) => void
  /** Open a day's board and select its first open (or first) ticket. */
  selectDay: (dayId: number) => void
  /** Leave the day board and return to the day hub. */
  exitDay: () => void
  /** Mark an issue done and auto-advance to the next ticket within its day. */
  completeIssue: (id: string) => void
  resetProgress: () => void
}

export function useGameState(): GameState {
  const [state, setState] = useState<Persisted>(load)
  // Issues with a currently-passing check, awaiting submit. In-memory only.
  const [passedIds, setPassedIds] = useState<Set<string>>(() => new Set())

  const clearPassed = useCallback((id: string) => {
    setPassedIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const markChecked = useCallback((id: string, passed: boolean) => {
    setPassedIds((prev) => {
      if (passed === prev.has(id)) return prev
      const next = new Set(prev)
      if (passed) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [state])

  const completedIds = useMemo(() => new Set(state.completedIds), [state.completedIds])

  // Everything below the hub is scoped to the open day; on the hub
  // (`selectedDay == null`) the board isn't rendered, so the empty set is fine.
  const dayIssues = useMemo(
    () =>
      state.selectedDay == null
        ? []
        : issues.filter((i) => dayOf(i.id) === state.selectedDay),
    [state.selectedDay],
  )

  const notDone = useMemo(
    () => dayIssues.filter((i) => !completedIds.has(i.id)),
    [dayIssues, completedIds],
  )
  const assigned = useMemo(() => notDone.slice(0, ASSIGNED_LIMIT), [notDone])
  const backlog = useMemo(() => notDone.slice(ASSIGNED_LIMIT), [notDone])
  const done = useMemo(
    () => dayIssues.filter((i) => completedIds.has(i.id)),
    [dayIssues, completedIds],
  )

  const selectedIssue = useMemo(
    () => issues.find((i) => i.id === state.selectedIssueId) ?? null,
    [state.selectedIssueId],
  )

  const sourceFor = useCallback(
    (issueId: string) => {
      const edited = state.sources[issueId]
      return edited === undefined ? issueById.get(issueId)?.starter ?? '' : edited
    },
    [state.sources],
  )

  const setSource = useCallback(
    (issueId: string, value: string) => {
      setState((s) => ({ ...s, sources: { ...s.sources, [issueId]: value } }))
      // Editing invalidates a prior passing check until it's re-run.
      clearPassed(issueId)
    },
    [clearPassed],
  )

  const resetSource = useCallback((issueId: string) => {
    setState((s) => {
      const next = { ...s.sources }
      delete next[issueId]
      return { ...s, sources: next }
    })
  }, [])

  const selectIssue = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedIssueId: id }))
  }, [])

  const selectDay = useCallback((dayId: number) => {
    setState((s) => {
      const completedSet = new Set(s.completedIds)
      const inDay = issues.filter((i) => dayOf(i.id) === dayId)
      // Resume on the first open ticket, or fall back to the first ticket (so a
      // fully-completed day can still be opened for review).
      const resume = inDay.find((i) => !completedSet.has(i.id)) ?? inDay[0] ?? null
      return {
        ...s,
        selectedDay: dayId,
        selectedIssueId: resume ? resume.id : s.selectedIssueId,
      }
    })
  }, [])

  const exitDay = useCallback(() => {
    setState((s) => ({ ...s, selectedDay: null }))
  }, [])

  const completeIssue = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.completedIds.includes(id)) return s
        const completed = [...s.completedIds, id]
        const completedSet = new Set(completed)
        // Auto-advance only within the completed issue's own day; if nothing is
        // left in the day, keep the selection (the day-complete modal covers it).
        const day = dayOf(id)
        const next =
          issues.find((i) => dayOf(i.id) === day && !completedSet.has(i.id)) ?? null
        return {
          ...s,
          completedIds: completed,
          selectedIssueId: next ? next.id : s.selectedIssueId,
        }
      })
      clearPassed(id)
    },
    [clearPassed],
  )

  const resetProgress = useCallback(() => {
    setState({
      completedIds: [],
      selectedIssueId: issues[0]?.id ?? null,
      selectedDay: null,
      sources: {},
    })
    setPassedIds(new Set())
  }, [])

  return {
    issues,
    selectedDay: state.selectedDay,
    dayIssues,
    assigned,
    backlog,
    done,
    completedIds,
    selectedIssue,
    passedIds,
    markChecked,
    sourceFor,
    setSource,
    resetSource,
    selectIssue,
    selectDay,
    exitDay,
    completeIssue,
    resetProgress,
  }
}
