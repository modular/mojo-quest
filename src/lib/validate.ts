import type { Issue } from '../data/types'
import type { RunResult } from './compile'

export type CheckOutcome = {
  passed: boolean
  /** Short verdict line shown in the console. */
  reason: string
  /** Optional extra detail (e.g. expected vs. actual output). */
  detail?: string
}

/** Trim trailing whitespace per line and collapse trailing blank lines. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
    .trim()
}

/** Decide whether a compiled+executed submission solves the issue. */
export function checkSolution(
  issue: Issue,
  result: RunResult,
  source: string,
): CheckOutcome {
  if (result.error) {
    return result.error === 'aborted'
      ? { passed: false, reason: 'Run cancelled.' }
      : { passed: false, reason: `Could not reach the compiler: ${result.error}` }
  }

  if (!result.compiled) {
    return { passed: false, reason: 'Compilation failed — check the errors above.' }
  }

  if (result.timedOut) {
    return { passed: false, reason: 'Execution timed out — does your program terminate?' }
  }

  if (!result.executed || result.exitCode !== 0) {
    const code = result.exitCode === null ? 'unknown' : String(result.exitCode)
    return { passed: false, reason: `Program exited abnormally (exit code ${code}).` }
  }

  if (issue.validation.kind === 'run') {
    const want = normalizeOutput(issue.validation.expectedStdout)
    const got = normalizeOutput(result.stdout)
    if (got === want) {
      return { passed: true, reason: 'Compiled, ran, and output matches. Ticket resolved!' }
    }
    return {
      passed: false,
      reason: 'It compiles and runs, but the output is not what we expect.',
      detail: `Expected:\n${want}\n\nGot:\n${got || '(no output)'}`,
    }
  }

  // kind === 'source': compiled + ran cleanly, now require the idiom in the code.
  const { patterns, flags, message } = issue.validation
  for (const p of patterns) {
    if (!new RegExp(p, flags).test(source)) {
      return { passed: false, reason: message }
    }
  }
  return { passed: true, reason: 'Compiled, ran, and the required change is in place. Resolved!' }
}
