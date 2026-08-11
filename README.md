# 🔥 Mojo Quest

**Learn Mojo by closing tickets at a fictional robotics company.**

Mojo Quest is a small browser game. You're a new engineer on the autonomy team
at **MQ Robotics**, a fictional company building autonomous mobile robots using
software written in Mojo. The team's issue backlog is full of bugs and small
features you need to close. You'll write Mojo code in an in-browser IDE,
and learn the Mojo language one ticket at a time.

However, the issue scenarios are deliberately simplified to teach basic
Mojo language concepts. They are **not** a realistic depiction of robot
software.

Every change is **compiled and executed** on the real Mojo toolchain via the
[Compiler Explorer](https://godbolt.org) API — a ticket only closes when your
code builds, runs, and produces the right result.

It's built to feel like a real workflow: a Linear-style issue board, a VS
Code–style file explorer, and a CodeMirror editor wired to a live compiler.

[Learn Mojo now at quest.mojolang.org](https://quest.mojolang.org)

## Run it locally

The game is fully usable locally as well. Just clone this repo and
build it with the following commands.

> [!NOTE]
> Requires [Node.js](https://nodejs.org) 18+ and internet access (the
> editor calls the public Compiler Explorer API; no key needed).

Install the dependencies and start the live development server:

```sh
npm install
npm run dev
```

Or compile the production build and serve it:

```sh
npm run build
npm run preview
```

Either way, the app deploys at http://localhost:5173.

## Gameplay

1. **Pick up a ticket.** Three issues are assigned to you at a time; the rest
   wait in the backlog. Each names a topic (Variables, Traits, SIMD, …) and a
   file in the MQ Robotics codebase.
2. **Open the file.** Selecting a ticket (or its file in the explorer) loads the
   full Mojo source into the editor.
3. **Write the Mojo.** Edit the code directly. Each ticket deep-links to the
   exact page of the [Mojo Manual](https://mojolang.org/docs/manual/) that
   teaches the concept, and a hint is one click away.
4. **Compile & check.** Hit **Run & check**. The code is compiled and executed
   remotely; the console shows compiler diagnostics and program output. When it
   builds and the result is correct, a success banner on the ticket reveals the
   Mojo concept you just demonstrated.
5. **Submit.** Hit **Submit** on the ticket to close it, open the next one, and
   save your progress to `localStorage`. (Editing the code after a pass clears
   the success state — re-run the check before submitting.)

Optional sound effects (a chime on resolve, a soft tone on failure, a finishing
fanfare) are **off by default** — toggle them with the 🔇/🔊 button in the
header. Cues are synthesized with the Web Audio API (no audio files) and only
supplement the on-screen feedback.

The **80+ tickets** are sequenced to follow the
[Mojo Manual](https://mojolang.org/docs/manual/) and numbered in blocks by
chapter — `MQ-1xx` basics & functions, `MQ-2xx` variables/types/collections,
`MQ-3xx` operators & control flow, `MQ-4xx` errors & context managers, `MQ-5xx`
structs & modules, `MQ-6xx` value ownership, `MQ-7xx` value lifecycle, `MQ-8xx`
metaprogramming (compile-time evaluation, parameterization, traits, generics,
constraints, materialization, reflection), and `MQ-9xx` unsafe pointers &
testing. Coverage spans every key topic short of GPU programming. Each ticket's
`priority` doubles as a teaching tier (High = core, Medium = recommended, Low =
optional deep cut). No prior Mojo required — each fix is a single, focused
concept.

## Concepts by section

Tickets are numbered in blocks by chapter, and each one teaches a single,
focused concept (the same `# Mojo concept:` line that heads its solution in
[`exercises/`](exercises/)). Here's the full curriculum, section by section.

### MQ-1xx — Basics & functions

- **MQ-101** — every program needs a `main()` entry point.
- **MQ-102** — blocks (functions, conditions, loops) use a colon and
  indentation.
- **MQ-103** — defining functions with `def`.
- **MQ-104** — typing parameters/arguments and the `->` return type.
- **MQ-105** — returning values with `return` and the `-> type` syntax.
- **MQ-106** — docstrings (triple-quoted first statement of a function).
- **MQ-107** — keyword arguments (`name = value`, any order).
- **MQ-108** — optional arguments with default values.
- **MQ-109** — keyword-only arguments after a bare `*`.
- **MQ-110** — variadic arguments (`*args`).
- **MQ-111** — `pass` as a no-op placeholder for an empty block body.
- **MQ-113** — function overloading by argument type.
- **MQ-115** — propagating errors with the `raises` keyword.

### MQ-2xx — Variables, types & collections

- **MQ-201** — declaring variables with `var`.
- **MQ-202** — late initialization (requires a declared type).
- **MQ-203** — strong typing: no cross-type assignment.
- **MQ-207** — transferring ownership with the `^` sigil.
- **MQ-208** — binding a reference with `ref name`.
- **MQ-210** — numeric operators don't auto-narrow or auto-widen.
- **MQ-211** — converting operands to avoid integer truncation.
- **MQ-213** — the `SIMD` type (a `DType` plus an element count).
- **MQ-214** — elementwise math on SIMD values.
- **MQ-215** — `String` operators and methods (e.g. `upper()`).
- **MQ-220** — the `Tuple` collection (unpack or index).
- **MQ-221** — the `List` collection (single element type).
- **MQ-222** — the `Dict` key-value collection.
- **MQ-223** — the `Set` collection of unique values.
- **MQ-224** — `Optional` for maybe-present values.

### MQ-3xx — Operators & control flow

- **MQ-301** — exponentiation with `**`.
- **MQ-302** — floor division `//` and modulo `%`.
- **MQ-303** — the six comparison operators.
- **MQ-304** — chained comparisons (`a < b < c`).
- **MQ-305** — bitwise OR (`|`).
- **MQ-306** — short-circuiting `and`.
- **MQ-308** — membership with `in`.
- **MQ-309** — conditional expressions (`a if cond else b`).
- **MQ-310** — compound assignment (`*=`, …).
- **MQ-312** — operator precedence and parentheses.
- **MQ-320** — the `if` statement.
- **MQ-321** — the `while` loop.
- **MQ-322** — `for` loops and `continue`.
- **MQ-323** — multi-way branching with `elif`.
- **MQ-324** — `range(start, stop, step)`.
- **MQ-325** — mutating a collection in place with a `ref` loop variable.
- **MQ-326** — iterating any `collections` type with `for`.

### MQ-4xx — Errors & context managers

- **MQ-401** — raising errors (`raises` + `raise Error("...")`).
- **MQ-402** — handling errors with `try`/`except`.
- **MQ-403** — re-raising with `raise` and the `^` sigil.
- **MQ-412** — `with`-statement context managers and cleanup.

### MQ-5xx — Structs & modules

- **MQ-501** — struct fields (`var` + type, initialized in the constructor).
- **MQ-502** — instance methods and the implicit `self`.
- **MQ-503** — mutating the instance with `mut self`.
- **MQ-504** — `@staticmethod` (no `self`).
- **MQ-507** — move-only types (`Movable`, not `Copyable`).
- **MQ-510** — operator overloading via `__add__`.
- **MQ-511** — unary operators (`__neg__`).
- **MQ-512** — `__eq__` and the `Equatable` trait.
- **MQ-513** — subscript reads with `__getitem__`.
- **MQ-520** — `from module import name`.

### MQ-6xx — Value ownership

- **MQ-601** — the `mut` argument convention (write back to the caller).
- **MQ-602** — transferring into a `var` argument with `^`.
- **MQ-604** — `ref` return values that name an origin.

### MQ-7xx — Value lifecycle

- **MQ-702** — all fields must be initialized by the end of the constructor.
- **MQ-703** — overloading `__init__`.
- **MQ-704** — `@implicit` single-argument conversion constructors.
- **MQ-705** — the `Copyable` trait and its compiler-synthesized `.copy()`.
- **MQ-706** — the `ImplicitlyCopyable` trait.
- **MQ-710** — the `__deinit__` destructor and ASAP last-use destruction.

### MQ-8xx — Metaprogramming

- **MQ-801** — declaring a compile-time constant with `comptime`.
- **MQ-803** — compile-time loop unrolling with `comptime for`.
- **MQ-810** — parameters (`[]`, compile-time) vs arguments (`()`, run-time).
- **MQ-812** — parameterized structs (`Buffer[size: Int]`); parameters are
  accessible on instances (`b.size`).
- **MQ-825** — declaring and enforcing trait conformance.
- **MQ-827** — default method implementations on traits.
- **MQ-830** — the `Sized` trait and `__len__`.
- **MQ-835** — trait-constrained generic parameters (`[T: Writable]`) and the
  `Some[Writable]` shorthand.
- **MQ-845** — compile-time assertions with `comptime assert cond, "msg"`.
- **MQ-852** — forcing compile-time evaluation with `comptime`.
- **MQ-858** — compile-time reflection with `reflect[T]`.

### MQ-9xx — Unsafe pointers & testing

- **MQ-901** — allocating heap memory with the free function
  `alloc[T]({count = n}).unsafe_leak()`.
- **MQ-903** — pointer offset indexing (`ptr[unsafe_offset=i]`).
- **MQ-950** — `assert_equal` from the `testing` module.
- **MQ-951** — the `assert_raises` context manager.

## How validation works

Submissions are checked two ways, depending on the ticket:

- **`run`** — the program must compile, exit `0`, and print exactly the expected
  output. Used wherever the bug is a real compile error or a wrong result
  (indentation, type annotations, operator precedence, `mut self`, traits, …).
- **`source`** — the program must compile and run cleanly, and the edited code
  must match a regex. Used for idioms that compile identically with or without
  the fix, so output alone can't tell them apart: adding `var`, a docstring, or
  the `^` transfer operator.

The compiler/runner lives in [`src/lib/compile.ts`](src/lib/compile.ts) and the
pass/fail logic in [`src/lib/validate.ts`](src/lib/validate.ts). The pinned
toolchain is set by `MOJO_COMPILER` in `compile.ts` (see
`GET https://godbolt.org/api/compilers/mojo` for available versions).

## Tech

- **React 18 + TypeScript**, bundled with **Vite**.
- **CodeMirror 6** (`@uiw/react-codemirror`) for the editor.
- **Compiler Explorer REST API** for real compilation + execution. The public
  API sends `Access-Control-Allow-Origin: *`, so the static app calls it
  directly from the browser — no backend.
- Game progress (completed tickets, edited source per ticket, whether you've
  started) is persisted in the browser via `localStorage`.

## Project structure

```text
src/
├── App.tsx                 # shell: landing gate + 3-column game layout
├── components/
│   ├── Landing.tsx         # intro / start screen
│   ├── IssuesPanel.tsx     # the ticket board (assigned / backlog / done)
│   ├── IssueCard.tsx       # a single ticket card
│   ├── FileTreePanel.tsx   # file explorer (one file per ticket)
│   └── EditorPanel.tsx     # CodeMirror editor + Run & check + console
├── data/
│   ├── issues.ts           # the tickets: starter code + validation rule
│   └── types.ts            # Issue / Validation types
├── lib/
│   ├── compile.ts          # Compiler Explorer API client (compile + execute)
│   └── validate.ts         # judges a compiled+executed submission
├── state/
│   └── gameState.ts        # progress + per-ticket source (localStorage)
├── lib/sound.ts            # optional Web Audio cues (off by default)
└── styles/
    └── global.css          # all styling (dark, flame-accented theme)

exercises/                  # completed solution per ticket (MQ_###.mojo) — not bundled
scripts/verify-exercises.ts # compiles every solution + starter to catch breakage
```

## Adding or editing tickets

The game is data-driven — all content lives in
[`src/data/issues.ts`](src/data/issues.ts). Each `Issue` carries:

- a full, runnable-but-broken `starter` program (the puzzle),
- a `validation` of kind `run` (with `expectedStdout`) or `source` (with
  regex `patterns`),
- a one-sentence `concept` (the single thing the ticket teaches, surfaced in
  the issue detail panel), and
- a `hint`, `topic`, `priority`, `docUrl`, and display `file` path.

Keep `concept` identical to the `# Mojo concept:` comment atop the ticket's
solution in [`exercises/`](exercises/) — `npm run verify:exercises` fails if
they drift.

To add a ticket, append an `Issue` and add a matching completed solution at
`exercises/<id>.mojo`, where the ticket id's dash becomes an underscore
(`MQ-101` → `exercises/MQ_101.mojo`; repo lint forbids dashes in `.mojo`
filenames). See the next section. Tickets appear in array order, so
sequence them by difficulty. See [`src/data/types.ts`](src/data/types.ts) for
the full shape.

## Verifying exercises (guards against Mojo language changes)

Each ticket has a committed, completed solution as a real Mojo file in
[`exercises/`](exercises/) — `exercises/MQ_101.mojo`, `MQ_102.mojo`, … one per
`Issue.id` (with the id's dash mapped to an underscore). These files are
**never imported by the app**, so solutions don't
ship in the browser bundle.

```sh
npm run verify:exercises                       # test against the pinned toolchain
MOJO_COMPILER=mojo_nightly npm run verify:exercises   # preview an upcoming Mojo
```

For every issue, the runner
([`scripts/verify-exercises.ts`](scripts/verify-exercises.ts)) reuses the app's
own `compileAndRun` + `checkSolution` to:

1. compile + run the completed `exercises/<id>.mojo` and assert it satisfies the
   issue's `validation` (compiles, exits 0, output matches `expectedStdout` /
   source patterns), and
2. compile + run the `starter` and assert it still **fails** (the puzzle is
   broken).

It exits non-zero if anything fails, so it works in CI. Run it after bumping
`MOJO_COMPILER` in [`src/lib/compile.ts`](src/lib/compile.ts). Requires outbound
access to `godbolt.org`.

The pinned `MOJO_COMPILER` is a **stable** Mojo release that
matches the [Mojo Manual](https://mojolang.org/docs/manual/) the tickets link
to — not `mojo_nightly`.
