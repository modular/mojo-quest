import { issues } from './issues'
import type { Issue } from './types'

/**
 * The curriculum is played as six "days." Each day owns one or more chapters,
 * identified by the leading digit of the ticket id (MQ-1xx, MQ-2xx, …), so the
 * day grouping is derived from the existing ticket numbering — no ticket data
 * needs to be re-tagged.
 */
export type Day = {
  /** 1-based day number, also its display order. */
  id: number
  title: string
  /** One-line description shown on the day-select hub card. */
  blurb: string
  /** Leading digits of the MQ ids that belong to this day, e.g. `['3', '4']`. */
  chapters: string[]
}

export const days: Day[] = [
  {
    id: 1,
    title: 'Language Basics & Functions',
    blurb: 'The program entry point, indentation, and writing functions.',
    chapters: ['1'],
  },
  {
    id: 2,
    title: 'Variables, Types & Collections',
    blurb: 'Variables, value semantics, SIMD, strings, and collection types.',
    chapters: ['2'],
  },
  {
    id: 3,
    title: 'Operators, Control Flow & Errors',
    blurb: 'Operators, conditionals and loops, iterators, and error handling.',
    chapters: ['3', '4'],
  },
  {
    id: 4,
    title: 'Structs & Modules',
    blurb: 'Defining structs, overloading operators, and importing modules.',
    chapters: ['5'],
  },
  {
    id: 5,
    title: 'Value Ownership & Lifecycle',
    blurb: 'Ownership, lifetimes, and the value lifecycle.',
    chapters: ['6', '7'],
  },
  {
    id: 6,
    title: 'Metaprogramming, Pointers & Testing',
    blurb: 'comptime, parameters, traits, generics, pointers, and testing.',
    chapters: ['8', '9'],
  },
]

/** Map a chapter digit to its owning day id, derived once from `days`. */
const dayByChapter = new Map<string, number>()
for (const day of days) {
  for (const chapter of day.chapters) dayByChapter.set(chapter, day.id)
}

/** The day id (1..6) an issue belongs to, from its `MQ-<digit>xx` id. */
export function dayOf(issueId: string): number {
  const chapter = issueId.match(/MQ-(\d)/)?.[1] ?? ''
  return dayByChapter.get(chapter) ?? 0
}

/** All issues in a given day, in curriculum order. */
export function issuesForDay(dayId: number): Issue[] {
  return issues.filter((i) => dayOf(i.id) === dayId)
}
