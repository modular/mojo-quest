/**
 * Exercise integrity test.
 *
 * For every issue in src/data/issues.ts this:
 *   1. compiles + runs the COMPLETED solution (exercises/<id>.mojo, where the
 *      ticket id's dash becomes an underscore, e.g. MQ-101 -> MQ_101.mojo) and asserts
 *      it satisfies the issue's `validation` (compiles, exits 0, and matches the
 *      expected output / source patterns), and
 *   2. compiles + runs the STARTER and asserts it does NOT pass (the puzzle is
 *      still genuinely broken).
 *
 * It reuses the app's real `compileAndRun` and `checkSolution`, so this test
 * mirrors exactly what the in-browser game does. Run it after bumping the
 * pinned Mojo toolchain (or against a newer one) to catch any exercise that a
 * Mojo language change has broken:
 *
 *   npm run verify:exercises                 # pinned MOJO_COMPILER
 *   MOJO_COMPILER=mojo_nightly npm run verify:exercises   # preview a newer build
 *
 * Exits non-zero if any exercise fails, so it works in CI.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { issues } from '../src/data/issues'
import { compileAndRun, MOJO_COMPILER } from '../src/lib/compile'
import { checkSolution } from '../src/lib/validate'

const compilerId = process.env.MOJO_COMPILER || MOJO_COMPILER
const SOLUTIONS_DIR = join(process.cwd(), 'exercises')
const CONCURRENCY = 6

type Row = { id: string; ok: boolean; detail: string }

async function checkOne(issue: (typeof issues)[number]): Promise<Row> {
  // Solution files use underscores (e.g. MQ_101.mojo) since the repo lint
  // forbids dashes in .mojo filenames, while issue ids keep the ticket-style
  // dash (MQ-101) for display.
  const solutionFile = `${issue.id.replace(/-/g, '_')}.mojo`
  let solution: string
  try {
    solution = readFileSync(join(SOLUTIONS_DIR, solutionFile), 'utf8')
  } catch {
    return { id: issue.id, ok: false, detail: `missing exercises/${solutionFile}` }
  }

  // 0. The solution's `# Mojo concept:` comment (shown inline in the file) must
  //    match the ticket's `concept` (shown in the UI), so the two never drift.
  const conceptMatch = solution.match(/^#\s*Mojo concept:\s*(.+?)\s*$/m)
  if (!conceptMatch) {
    return { id: issue.id, ok: false, detail: `${solutionFile} has no \`# Mojo concept:\` comment` }
  }
  if (conceptMatch[1] !== issue.concept) {
    return {
      id: issue.id,
      ok: false,
      detail:
        `concept mismatch between issues.ts and ${solutionFile}\n` +
        `      issues.ts: ${issue.concept}\n` +
        `      ${solutionFile}: ${conceptMatch[1]}`,
    }
  }

  // 1. The completed solution must satisfy the validation.
  const solRes = await compileAndRun(solution, undefined, compilerId)
  const solOutcome = checkSolution(issue, solRes, solution)
  if (!solOutcome.passed) {
    return {
      id: issue.id,
      ok: false,
      detail: `SOLUTION does not pass — ${solOutcome.reason}${
        solOutcome.detail ? `\n      ${solOutcome.detail.replace(/\n/g, '\n      ')}` : ''
      }`,
    }
  }

  // 2. The starter must still be broken.
  const startRes = await compileAndRun(issue.starter, undefined, compilerId)
  const startOutcome = checkSolution(issue, startRes, issue.starter)
  if (startOutcome.passed) {
    return { id: issue.id, ok: false, detail: 'STARTER already passes — puzzle is not broken' }
  }

  return { id: issue.id, ok: true, detail: `${issue.validation.kind} ✓` }
}

async function main() {
  console.log(`Verifying ${issues.length} exercises against ${compilerId}…\n`)
  const rows: Row[] = []
  let nextIndex = 0
  async function worker() {
    while (nextIndex < issues.length) {
      const issue = issues[nextIndex++]
      rows.push(await checkOne(issue))
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  rows.sort((a, b) => a.id.localeCompare(b.id))
  for (const r of rows) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.id}  ${r.detail}`)
  }

  const failed = rows.filter((r) => !r.ok)
  console.log(
    `\n${failed.length === 0 ? `All ${rows.length} exercises OK on ${compilerId}.` : `${failed.length} of ${rows.length} FAILED on ${compilerId}.`}`,
  )
  process.exit(failed.length === 0 ? 0 : 1)
}

main()
