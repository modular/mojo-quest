/**
 * Thin client for the Compiler Explorer (godbolt.org) REST API.
 * See https://github.com/compiler-explorer/compiler-explorer/blob/main/docs/API.md
 *
 * We compile AND execute Mojo in one request (`executorRequest`/`filters.execute`)
 * so a single round-trip tells us whether the code built and what it printed.
 * The public API sends `Access-Control-Allow-Origin: *`, so the browser can call
 * it directly — no backend required.
 */

const CE_BASE = 'https://godbolt.org/api/compiler'

/**
 * Pinned Mojo toolchain. See GET /api/compilers/mojo for the full list.
 *
 * This stays pinned to the stable Mojo release that matches the mojolang.org
 * docs the game links to — deliberately NOT `mojo_nightly`. The exercises must
 * compile and behave as the docs describe, so do not bump this to track
 * nightly. `MOJO_COMPILER=mojo_nightly npm run verify:exercises` is an advisory
 * preview only; bump this constant (and update any affected exercises) as a
 * deliberate change when the docs move to a new stable release.
 */
export const MOJO_COMPILER = 'mojo_1_0_0'

/** Human-friendly label for the pinned toolchain (shown in the editor). */
export const MOJO_VERSION_LABEL = 'Mojo 1.0.0'

export type RunResult = {
  /** Compilation exit code was 0. */
  compiled: boolean
  /** Compiler diagnostics (errors + warnings). */
  buildStderr: string
  /** The program actually ran. */
  executed: boolean
  /** Program exit code (null if it never ran). */
  exitCode: number | null
  /** Program standard output. */
  stdout: string
  /** Program standard error. */
  stderr: string
  /** Execution exceeded the sandbox time limit. */
  timedOut: boolean
  /** Set if the request itself failed (network/HTTP), leaving the rest empty. */
  error?: string
}

type CeLine = { text?: string }
const joinLines = (arr: unknown): string =>
  Array.isArray(arr) ? (arr as CeLine[]).map((l) => l?.text ?? '').join('\n') : ''

const failure = (error: string): RunResult => ({
  compiled: false,
  buildStderr: '',
  executed: false,
  exitCode: null,
  stdout: '',
  stderr: '',
  timedOut: false,
  error,
})

export async function compileAndRun(
  source: string,
  signal?: AbortSignal,
  compilerId: string = MOJO_COMPILER,
): Promise<RunResult> {
  const body = {
    source,
    options: {
      userArguments: '',
      executeParameters: { args: [], stdin: '' },
      compilerOptions: { executorRequest: true, skipAsm: true },
      filters: { execute: true },
      tools: [],
      libraries: [],
    },
    lang: 'mojo',
    allowStoreCodeDebug: true,
  }

  let res: Response
  try {
    res = await fetch(`${CE_BASE}/${compilerId}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  } catch (e) {
    const err = e as { name?: string; message?: string }
    return failure(err?.name === 'AbortError' ? 'aborted' : err?.message ?? 'network error')
  }

  if (!res.ok) return failure(`Compiler Explorer returned HTTP ${res.status}`)

  let data: Record<string, unknown>
  try {
    data = await res.json()
  } catch {
    return failure('Could not parse the compiler response')
  }

  const build = (data.buildResult as Record<string, unknown>) ?? {}
  return {
    compiled: build.code === 0,
    buildStderr: joinLines(build.stderr),
    executed: !!data.didExecute,
    exitCode: typeof data.code === 'number' ? (data.code as number) : null,
    stdout: joinLines(data.stdout),
    stderr: joinLines(data.stderr),
    timedOut: !!data.timedOut,
  }
}
