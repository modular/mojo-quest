export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent'

/**
 * How a puzzle is judged. Every submission is compiled AND executed on
 * Compiler Explorer; the `kind` only decides the final pass condition.
 *
 * - `run`: the program must compile, exit 0, and print exactly `expectedStdout`.
 * - `source`: the program must compile and exit 0, and the edited source must
 *   match every `patterns` entry. Used for idioms that compile identically with
 *   or without the fix (e.g. `var`, a docstring, the transfer operator).
 */
export type Validation =
  | { kind: 'run'; expectedStdout: string }
  | {
      kind: 'source'
      /** Regex sources (RegExp string form) that must all match the edited code. */
      patterns: string[]
      flags?: string
      /** Shown when a pattern is missing. */
      message: string
    }

export type Issue = {
  /** e.g. "MQ-101" */
  id: string
  /**
   * The single Mojo concept this ticket teaches, in one sentence. Mirrors the
   * `# Mojo concept:` comment atop the matching `exercises/<id>.mojo` solution;
   * `npm run verify:exercises` enforces that the two stay identical.
   */
  concept: string
  title: string
  /** Manual section this drills, e.g. "Variables". */
  topic: string
  priority: Priority
  /** Deep link into the Mojo manual. */
  docUrl: string
  /** Reference doc links shown only on the first ticket of each day. */
  dayDocUrls?: { label: string; url: string }[]
  /** Markdown-ish body: what to do + a short example. */
  description: string
  /** Display path of the file the player edits, e.g. "src/odometry.mojo". */
  file: string
  /** The full, editable Mojo source the player starts from (buggy/incomplete). */
  starter: string
  /** How completion is verified. */
  validation: Validation
  /** Guidance shown if the player is stuck. */
  hint: string
}
