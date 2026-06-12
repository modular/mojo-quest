import { useCallback, useEffect, useMemo, useState } from 'react'
import { issues } from '../data/issues'
import type { Issue } from '../data/types'

const STORAGE_KEY = 'mojo-quest/v7'
const ASSIGNED_LIMIT = 3

const issueById = new Map(issues.map((i) => [i.id, i]))

type Persisted = {
  completedIds: string[]
  selectedIssueId: string | null
  /** edited source per issue id (absent → use the issue's starter) */
  sources: Record<string, string>
}

function load(): Persisted {
  const fallback: Persisted = {
    completedIds: [],
    selectedIssueId: issues[0]?.id ?? null,
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
  /** Mark an issue done and auto-advance to the next assigned ticket. */
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

  const notDone = useMemo(
    () => issues.filter((i) => !completedIds.has(i.id)),
    [completedIds],
  )
  const assigned = useMemo(() => notDone.slice(0, ASSIGNED_LIMIT), [notDone])
  const backlog = useMemo(() => notDone.slice(ASSIGNED_LIMIT), [notDone])
  const done = useMemo(
    () => issues.filter((i) => completedIds.has(i.id)),
    [completedIds],
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

  const completeIssue = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.completedIds.includes(id)) return s
        const completed = [...s.completedIds, id]
        const completedSet = new Set(completed)
        const next = issues.find((i) => !completedSet.has(i.id)) ?? null
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
      sources: {},
    })
    setPassedIds(new Set())
  }, [])

  return {
    issues,
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
    completeIssue,
    resetProgress,
  }
}
