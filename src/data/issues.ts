import type { Issue } from './types'

const DOCS = 'https://mojolang.org/docs/manual'

/**
 * Player-facing tickets for the MQ Robotics autonomy platform, sequenced to
 * follow the Mojo Manual and grouped into numbered blocks by chapter:
 *
 *   MQ-1xx  Basics, Functions & entry point
 *   MQ-2xx  Variables, Types, Literals & Collections
 *   MQ-3xx  Operators & Control Flow
 *   MQ-4xx  Errors & Context Managers
 *   MQ-5xx  Structs & Modules
 *   MQ-6xx  Value Ownership
 *   MQ-7xx  Value Lifecycle
 *   MQ-8xx  Metaprogramming (comptime, parameters, traits, generics,
 *           constraints, materialization, reflection)
 *   MQ-9xx  Pointers, Low-Level Interop & Testing
 *
 * Play order is exactly the array order below. Priority encodes teaching tier:
 * High = P1 core, Medium = P2 recommended, Low = P3 optional (Urgent = the very
 * first "get it compiling" ticket). MQ Robotics builds autonomous mobile robots
 * (AMRs), so scenarios are drawn from robot software.
 *
 * Each ticket ships a full, runnable (but broken or incomplete) Mojo program in
 * `starter`. The player edits it and submits; the code is compiled AND executed
 * on Compiler Explorer, and `validation` decides completion:
 *   - `run`    → must compile, exit 0, and print exactly `expectedStdout`.
 *   - `source` → must compile + exit 0, and the code must match `patterns`
 *                (used for idioms that compile identically either way).
 *
 * Every starter and solution is verified against the live Mojo toolchain
 * (mojo_1_0_0b1) via `npm run verify:exercises`.
 */
export const issues: Issue[] = [
  {
    id: 'MQ-101',
    concept: "Every Mojo program must include a function named `main()` as the entry point",
    title: 'Wire up the program entry point',
    topic: 'Language Basics',
    priority: 'Urgent',
    docUrl: `${DOCS}/functions/`,
    file: 'src/boot.mojo',
    description:
      'A Mojo executable starts at `main`. This file defines `boot()` but never ' +
      'declares `main`, so there is no entry point and nothing runs. Add a `main` ' +
      'that calls `boot()`.\n\n' +
      'Example:\n```\ndef main():\n    some_helper()\n```',
    starter: `def boot():
    print("MQ Robotics control daemon starting")
`,
    validation: { kind: 'run', expectedStdout: 'MQ Robotics control daemon starting' },
    hint: 'Add a `def main():` whose body calls `boot()`.',
  },
  {
    id: 'MQ-102',
    concept: "Code blocks such as functions, conditions, and loops are defined with a colon followed by indented lines",
    title: 'Get the navigation stack booting',
    topic: 'Language Basics',
    priority: 'High',
    docUrl: `${DOCS}/functions/#anatomy-of-a-function`,
    file: 'src/nav.mojo',
    description:
      'A Mojo program runs from `main`. The boot message is sitting at column 0, ' +
      'so it is not part of `main`\'s body — the file will not even compile. Mojo ' +
      'uses 4-space indentation for code blocks. Indent it.\n\n' +
      'Example:\n```\ndef main():\n    print("some message")\n```',
    starter: `def main():
print("MQ Robotics nav stack online")
`,
    validation: { kind: 'run', expectedStdout: 'MQ Robotics nav stack online' },
    hint: 'Put 4 spaces before the `print` so it lives inside `main`.',
  },
  {
    id: 'MQ-103',
    concept: "Mojo uses the `def` keyword to define functions",
    title: 'Define the heartbeat function',
    topic: 'Functions',
    priority: 'High',
    docUrl: `${DOCS}/functions/#anatomy-of-a-function`,
    file: 'src/heartbeat.mojo',
    description:
      'The watchdog calls `heartbeat()`, but its definition is missing the `def` ' +
      'keyword, so the file will not compile. Every function starts with `def`. ' +
      'Add it.\n\n' +
      'Example: `def some_function() -> String:`',
    starter: `heartbeat() -> String:
    return "heartbeat ok"


def main():
    print(heartbeat())
`,
    validation: { kind: 'run', expectedStdout: 'heartbeat ok' },
    hint: 'A function definition must begin with `def`. Add it before `heartbeat`.',
  },
  {
    id: 'MQ-104',
    concept: "You must declare the type of each function parameter and argument; the return type follows `->`",
    title: 'Annotate the occupancy-grid size helper',
    topic: 'Functions',
    priority: 'High',
    docUrl: `${DOCS}/functions/#function-arguments`,
    file: 'src/grid.mojo',
    description:
      "`grid_cells` multiplies an occupancy grid's rows and columns, but its " +
      'arguments have no types, so the compiler rejects it. A type annotation ' +
      'declares what kind of value a name holds, written `name: Type`; for a ' +
      'function you annotate each argument and put the return type after `->`. ' +
      'Annotate both arguments as `Int` and add the `Int` return type.\n\n' +
      'Example: `def someFunction(a: Int, b: Int) -> Int:`',
    starter: `def grid_cells(rows, cols):
    return rows * cols


def main():
    print("Grid cells:", grid_cells(3, 4))
`,
    validation: { kind: 'run', expectedStdout: 'Grid cells: 12' },
    hint: "A `def` won't compile with bare arguments. Give each argument an explicit type and declare the type the function returns — both are integers here.",
  },
  {
    id: 'MQ-105',
    concept: "Values are passed back using the `return` keyword; the return type is declared with the `-> type` syntax",
    title: 'Implement the ring-buffer capacity helper',
    topic: 'Functions',
    priority: 'High',
    docUrl: `${DOCS}/functions/#return-values`,
    file: 'src/ring_buffer.mojo',
    description:
      'When a sensor ring buffer fills up, the ingest loop grows it by doubling ' +
      'its capacity. A function hands a value back to its caller with the ' +
      '`return` keyword, declaring the type it returns after `->`. ' +
      '`grow_capacity` should return twice its input, but right now ' +
      'it returns the value unchanged. Fix the body so `grow_capacity(21)` is ' +
      '`42`.\n\n' +
      'Example:\n```\ndef someFunction(x: Int) -> Int:\n    return x + 1\n```',
    starter: `# Ring-buffer helpers for the sensor ingest loop

def grow_capacity(n: Int) -> Int:
    return n  # TODO: should double the buffer's capacity


def main():
    print("New capacity:", grow_capacity(21))
`,
    validation: { kind: 'run', expectedStdout: 'New capacity: 42' },
    hint: 'Right now the function hands back its input unchanged. Multiply it so the result is twice as large.',
  },
  {
    id: 'MQ-106',
    concept: "A docstring is a string literal in triple quotes placed as the first statement in a function body",
    title: 'Document the command logger',
    topic: 'Functions',
    priority: 'Medium',
    docUrl: `${DOCS}/functions/`,
    file: 'src/logging.mojo',
    description:
      '`log_command` has no documentation. A docstring is a string literal in ' +
      'triple quotes placed as the first statement of a function body, where it ' +
      'documents what the function does. Add a one-line docstring there using ' +
      'triple quotes.\n\n' +
      'Example: a short sentence summarizing the function, wrapped in triple quotes.',
    starter: `def log_command(name: String) -> String:
    return "Dispatching command: " + name


def main():
    print(log_command("rotate-90"))
`,
    validation: {
      kind: 'source',
      patterns: ['("""[\\s\\S]+?"""|\'\'\'[\\s\\S]+?\'\'\')'],
      message: 'Add a triple-quoted docstring (""" … """ or \'\'\' … \'\'\') just below the function definition.',
    },
    hint: 'Put a short sentence describing the function on its very first body line, wrapped in triple quotes — Mojo treats that as the docstring.',
  },
  {
    id: 'MQ-107',
    concept: "Keyword arguments are specified using `argument_name = argument_value` and can be passed in any order",
    title: 'Pass the speed limits by keyword',
    topic: 'Functions',
    priority: 'Medium',
    docUrl: `${DOCS}/functions/#keyword-arguments`,
    file: 'src/limits_set.mojo',
    description:
      '`set_limits` takes `max_speed` then `max_accel`, but the call passes `5` ' +
      'and `2` positionally — so the speed cap (should be 2) and accel cap (should ' +
      'be 5) come out swapped. A keyword argument is passed as `name = value`, ' +
      'which binds it to that argument by name regardless of position. Pass them ' +
      'by keyword so each value lands in the argument you mean.\n\n' +
      'Example: `some_fn(arg_name=value)`',
    starter: `def set_limits(max_speed: Int, max_accel: Int):
    print("speed:", max_speed, "accel:", max_accel)


def main():
    set_limits(5, 2)
`,
    validation: { kind: 'run', expectedStdout: 'speed: 2 accel: 5' },
    hint: 'Name each argument at the call site (the `name=value` form) so each value lands in the argument you intend, regardless of order.',
  },
  {
    id: 'MQ-108',
    concept: "An optional argument includes a default value, and must appear after any required arguments",
    title: 'Give the spin-up ramp a default',
    topic: 'Functions',
    priority: 'High',
    docUrl: `${DOCS}/functions/#optional-arguments`,
    file: 'src/spin_up.mojo',
    description:
      'The motor spin-up helper should take an optional ramp time, but `ramp_ms` ' +
      'has no default, so calling `spin_up(900)` with a single argument will not ' +
      'compile. An optional argument carries a default value and may be omitted ' +
      'by the caller; it must come after any required arguments. Give `ramp_ms` a ' +
      'default value of `100`.\n\n' +
      'Example: `def some_fn(x: Int, y: Int = 0) -> Int:`',
    starter: `def spin_up(rpm: Int, ramp_ms: Int) -> Int:
    return rpm + ramp_ms


def main():
    print("total:", spin_up(900))
`,
    validation: { kind: 'run', expectedStdout: 'total: 1000' },
    hint: 'Give the second argument a default value in the signature (assign it `100`). A one-argument call then fills it in automatically.',
  },
  {
    id: 'MQ-109',
    concept: "A single star (`*`) in the argument list marks the following arguments as keyword-only",
    title: 'Pass the keyword-only diagnostic flag',
    topic: 'Functions',
    priority: 'Medium',
    docUrl: `${DOCS}/functions/#positional-only-and-keyword-only-arguments`,
    file: 'src/diag.mojo',
    description:
      '`run_diagnostic` declares `verbose` after a bare `*`, which makes it ' +
      'keyword-only — it cannot be passed positionally. The call supplies `True` ' +
      'positionally, so it will not compile. Pass `verbose` by keyword.\n\n' +
      'Example: `some_fn(arg, flag_name=value)`',
    starter: `def run_diagnostic(name: String, *, verbose: Bool) -> String:
    if verbose:
        return name + " [verbose]"
    return name


def main():
    print(run_diagnostic("imu", True))
`,
    validation: { kind: 'run', expectedStdout: 'imu [verbose]' },
    hint: 'Everything after the bare `*` is keyword-only — supply that flag by name at the call site rather than positionally.',
  },
  {
    id: 'MQ-110',
    concept: "Use the variadic argument syntax `*argument_name` to accept a variable number of arguments",
    title: 'Sum a variadic list of readings',
    topic: 'Functions',
    priority: 'Medium',
    docUrl: `${DOCS}/functions/#variadic-arguments`,
    file: 'src/sum_readings.mojo',
    description:
      '`total` should accept any number of `Int` readings and add them up, but ' +
      '`readings` is declared as a single `Int`, so `total(3, 4, 5)` will not ' +
      'compile. A variadic argument, written `*name`, collects any number of ' +
      'positional arguments into one iterable you can loop over. Make `readings` ' +
      'a variadic argument with `*`.\n\n' +
      'Example: `def some_fn(*values: Int) -> Int:`',
    starter: `def total(readings: Int) -> Int:
    var s = 0
    for r in readings:
        s += r
    return s


def main():
    print("sum:", total(3, 4, 5))
`,
    validation: { kind: 'run', expectedStdout: 'sum: 12' },
    hint: 'Prefix the argument with `*` so it collects all the positional arguments into one iterable you can loop over.',
  },
  {
    id: 'MQ-111',
    concept: "Use `pass` as a no-op placeholder when a block requires a body but has nothing to do",
    title: 'Stub out the self-test routine',
    topic: 'Functions',
    priority: 'High',
    docUrl: `${DOCS}/functions/#anatomy-of-a-function`,
    file: 'src/self_test.mojo',
    description:
      'Boot wires in a `run_self_test` routine, but it is not implemented yet ' +
      'and its body is empty — and an empty block does not compile, because a ' +
      'comment is not a statement. `pass` is a do-nothing placeholder that ' +
      'satisfies the required indented block without performing any action. Give ' +
      'the stub a body of `pass` so the file compiles and boot continues.\n\n' +
      'Example:\n```\ndef todo():\n    pass\n```',
    starter: `def run_self_test():
    # TODO: implement the real self-test later; this is just a stub


def main():
    run_self_test()
    print("self-test stub ran")
`,
    validation: { kind: 'run', expectedStdout: 'self-test stub ran' },
    hint: 'An indented block cannot be empty, and a comment does not count as a statement. Add the do-nothing placeholder statement (`pass`) as the function body so it compiles.',
  },
  {
    id: 'MQ-113',
    concept: "Implement separate versions of a function with different argument types to \"overload\" it",
    title: 'Overload the footprint helper',
    topic: 'Functions',
    priority: 'Medium',
    docUrl: `${DOCS}/functions/#overloaded-functions`,
    file: 'src/footprint.mojo',
    description:
      '`footprint` computes a square chassis footprint from one side, but the ' +
      'fleet console also calls it with a width and a height — and that overload ' +
      'does not exist yet, so the build fails. Overloading means defining several ' +
      'functions with the same name but different argument types or counts; Mojo ' +
      'picks the one that matches each call. Add a second `footprint` taking ' +
      '`(w: Int, h: Int)` that returns `w * h`.\n\n' +
      'Example: two `def`s with the same name but different argument lists.',
    starter: `def footprint(side: Int) -> Int:
    return side * side


def main():
    print(footprint(4), footprint(2, 3))
`,
    validation: { kind: 'run', expectedStdout: '16 6' },
    hint: 'Mojo picks an overload by argument count/types. Add a second `def` with the same name but two `Int` arguments, alongside the existing one.',
  },
  {
    id: 'MQ-115',
    concept: "Functions are non-raising by default; add the `raises` keyword to propagate an error to the caller",
    title: 'Propagate a raising sensor read',
    topic: 'Functions',
    priority: 'Medium',
    docUrl: `${DOCS}/functions/#raising-and-non-raising-functions`,
    file: 'src/sensor_read.mojo',
    description:
      '`read_sensor` is declared `raises`. `main` calls it but is not marked ' +
      '`raises`, so the build fails — a non-raising function cannot call a raising ' +
      'one without handling the error. Mark `main` as `raises`.\n\n' +
      'Example: `def some_fn() raises:`',
    starter: `def read_sensor(id: Int) raises -> Int:
    if id < 0:
        raise Error("bad sensor id")
    return id * 10


def main():
    print("reading:", read_sensor(2))
`,
    validation: { kind: 'run', expectedStdout: 'reading: 20' },
    hint: 'Add `raises` to `main`’s signature so it can propagate the error from `read_sensor`.',
  },
  {
    id: 'MQ-201',
    concept: "Explicitly-declared variables are created with the `var` keyword",
    title: 'Declare the odometry tick counter with `var`',
    topic: 'Variables',
    priority: 'High',
    docUrl: `${DOCS}/variables/#explicitly-declared-variables`,
    file: 'src/odometry.mojo',
    description:
      'Our style guide requires explicit variable declarations. An ' +
      'explicitly-declared variable is introduced with the `var` keyword. The ' +
      'odometry tick counter is assigned without being declared. Declare it with ' +
      '`var`.\n\n' +
      'Example: `var someName = 0`',
    starter: `def main():
    tick_count = 0
    tick_count += 1
    print("Ticks processed:", tick_count)
`,
    validation: {
      kind: 'source',
      patterns: ['\\bvar\\s+tick_count\\b'],
      message: 'Declare `tick_count` explicitly with the `var` keyword.',
    },
    hint: "Without an explicit declaration keyword, the first assignment isn't a real variable definition. Add `var` to the line that first sets the counter.",
  },
  {
    id: 'MQ-202',
    concept: "Late initialization works only if the variable is declared with a type",
    title: 'Annotate a late-initialized variable',
    topic: 'Variables',
    priority: 'High',
    docUrl: `${DOCS}/variables/#explicitly-declared-variables`,
    file: 'src/threshold.mojo',
    description:
      'This variable is declared on one line and assigned on the next — late ' +
      'initialization, which works only when the declaration carries a type, ' +
      'since there is no value yet for Mojo to infer one from. With a bare ' +
      '`var threshold` the type is unknown, so the declaration is rejected. Give ' +
      'it an explicit `Int` type annotation.\n\n' +
      'Example: `var name: SomeType`',
    starter: `def main():
    var threshold
    threshold = 10
    print("threshold:", threshold)
`,
    validation: { kind: 'run', expectedStdout: 'threshold: 10' },
    hint: 'When a `var` has no initializer, Mojo can’t infer its type — give the declaration an explicit `Int` type annotation after the name.',
  },
  {
    id: 'MQ-203',
    concept: "Since variables are strongly typed, you can't assign a value of a different type",
    title: 'Fix the sensor-count type mismatch',
    topic: 'Variables',
    priority: 'Medium',
    docUrl: `${DOCS}/variables/#type-annotations`,
    file: 'src/cast.mojo',
    description:
      'Mojo variables are strongly typed — a variable holds only values of its ' +
      'declared type. This `Int` variable is initialized from a string literal ' +
      '`"5"`, and Mojo will not implicitly convert a string to an integer, so it ' +
      'fails to compile with:\n\n' +
      '```\n' +
      'error: cannot implicitly convert \'StringLiteral["5"]\' value to \'Int\'\n' +
      '```\n\n' +
      'Assign an integer literal instead.\n\n' +
      'Example: `var n: Int = 5`',
    starter: `def main():
    var count: Int = "5"
    print("count:", count)
`,
    validation: { kind: 'run', expectedStdout: 'count: 5' },
    hint: 'Replace the quoted `"5"` with the integer `5` — the value must match the declared `Int` type.',
  },
  {
    id: 'MQ-207',
    concept: "A variable owns its value; ownership is transferred with the `^` sigil, which leaves the source uninitialized",
    title: 'Keep the original after handing one off',
    topic: 'Value Semantics',
    priority: 'Low',
    docUrl: `${DOCS}/variables/#variable-semantics`,
    file: 'src/copy_move.mojo',
    description:
      'The starter transfers `a` into `b` with the `^` move operator, which ' +
      'consumes `a` — so the later `a.append(4)` uses a value that no longer ' +
      'exists and the build fails. We need both lists, so make an explicit copy ' +
      'instead of moving.\n\n' +
      'Example: `var b = original.copy()` copies; `var b = original^` moves (consumes the original).',
    starter: `def main():
    var a = [1, 2, 3]
    var b = a^
    a.append(4)
    print("a:", len(a), "b:", len(b))
`,
    validation: { kind: 'run', expectedStdout: 'a: 4 b: 3' },
    hint: 'The `^` hands ownership away, leaving the original consumed. Mojo wants copies to be explicit, so ask the list for one with its `.copy()` method instead of moving it.',
  },
  {
    id: 'MQ-208',
    concept: "Use the `ref name` syntax to bind a reference to a value rather than an owned copy",
    title: 'Bind a mutable reference into the buffer',
    topic: 'Value Semantics',
    priority: 'Low',
    docUrl: `${DOCS}/values/lifetimes/`,
    file: 'src/ref_bind.mojo',
    description:
      'Writing through `first` should change the first reading in place, but ' +
      '`var first = readings[0]` binds a *copy*, so the write never reaches the ' +
      'list and it still prints 10. The `ref name = expr` syntax binds a ' +
      'reference — an alias to an existing value rather than an owned copy — so ' +
      'writes reach the original. Bind a reference with `ref` instead.\n\n' +
      'Example: `ref name = container[index]`',
    starter: `def main():
    var readings = [10, 20, 30]
    var first = readings[0]
    first = 99
    print("first:", readings[0])
`,
    validation: { kind: 'run', expectedStdout: 'first: 99' },
    hint: 'Bind the name with `ref` instead of `var` so it aliases the list element in place rather than copying it out.',
  },
  {
    id: 'MQ-210',
    concept: "Numeric operators don't automatically narrow or widen operands to a common type",
    title: 'Add across two integer widths',
    topic: 'Types',
    priority: 'Medium',
    docUrl: `${DOCS}/types/#numeric-type-conversion`,
    file: 'src/numeric_types.mojo',
    description:
      '`widen_add` adds an `Int8` reading to an `Int64` running total, but Mojo ' +
      'will not implicitly mix the two widths, so the add does not compile. ' +
      'Convert the `Int8` to `Int64` before adding.\n\n' +
      'Example: `Int64(someInt8) + someInt64`',
    starter: `def widen_add(reading: Int8, total: Int64) -> Int64:
    return reading + total


def main():
    print("total:", widen_add(100, 1000))
`,
    validation: { kind: 'run', expectedStdout: 'total: 1100' },
    hint: 'Widen the narrow value to `Int64` before the addition so both operands share the same type.',
  },
  {
    id: 'MQ-211',
    concept: "Convert the operands to the target type's constructor before dividing to avoid integer truncation",
    title: 'Stop truncating the average loop latency',
    topic: 'Types',
    priority: 'High',
    docUrl: `${DOCS}/types/#numeric-type-conversion`,
    file: 'src/latency.mojo',
    description:
      'Average control-loop latency should be `3.5`, but dividing two `Int`s does ' +
      'integer division and discards the fraction before the result becomes a ' +
      '`Float64`. Convert the operands to floating point before dividing.\n\n' +
      'Example: `Float64(someInt) / Float64(otherInt)`',
    starter: `def avg_latency(total_ms: Int, num_loops: Int) -> Float64:
    return total_ms / num_loops


def main():
    print("avg latency:", avg_latency(7, 2))
`,
    validation: { kind: 'run', expectedStdout: 'avg latency: 3.5' },
    hint: 'Dividing two whole numbers happens in integer space and drops the remainder before the value is ever widened to a float, so 7 over 2 loses its .5. Convert each operand to a floating-point type first, then divide.',
  },
  {
    id: 'MQ-213',
    concept: "A `SIMD` value is a fixed-size vector defined by two parameters: a `DType` and the number of elements",
    title: 'Define the velocity vector type',
    topic: 'SIMD & DType',
    priority: 'High',
    docUrl: `${DOCS}/types/#simd-and-dtype`,
    file: 'src/velocity.mojo',
    description:
      '`main` uses a `Velocity` type that does not exist yet. A `SIMD` value is a ' +
      'fixed-size vector defined by two parameters: a `DType` (its element type) ' +
      'and the number of lanes. Define a `comptime` type alias named `Velocity` ' +
      'for a 4-lane float32 SIMD vector at the top of the file.\n\n' +
      'Example: `comptime SomeVector = SIMD[DType.float64, 8]`',
    starter: `def main():
    var v = Velocity(1.0, 2.0, 3.0, 4.0)
    print("Velocity lane 0:", v[0])
`,
    validation: { kind: 'run', expectedStdout: 'Velocity lane 0: 1.0' },
    hint: 'The name `Velocity` is undefined until you create it. Bind it with `comptime` at file scope (above `main`) to that 4-lane float32 SIMD type so it is in scope when `main` constructs it. (Mojo’s older `alias` keyword still works but is deprecated in favour of `comptime`.)',
  },
  {
    id: 'MQ-214',
    concept: "Math operations on SIMD values are applied elementwise, on each individual element in the vector",
    title: 'Combine per-axis counts from two IMUs',
    topic: 'SIMD & DType',
    priority: 'High',
    docUrl: `${DOCS}/types/#simd-and-dtype`,
    file: 'src/imu_counts.mojo',
    description:
      'Two IMUs each report how many samples they captured across four axes, ' +
      'stored as `SIMD` integer vectors. `combine_counts` should return the ' +
      'per-axis totals, but right now it returns only the first IMU. SIMD ' +
      'addition is lane-wise, so adding the two vectors gives `[11, 22, 33, 44]`. ' +
      'Return the sum of the two IMUs.\n\n' +
      'Example: `var result = someVector + anotherVector`',
    starter: `def combine_counts(
    a: SIMD[DType.int32, 4], b: SIMD[DType.int32, 4]
) -> SIMD[DType.int32, 4]:
    return a


def main():
    var imu_a = SIMD[DType.int32, 4](1, 2, 3, 4)
    var imu_b = SIMD[DType.int32, 4](10, 20, 30, 40)
    print("Combined counts:", combine_counts(imu_a, imu_b))
`,
    validation: { kind: 'run', expectedStdout: 'Combined counts: [11, 22, 33, 44]' },
    hint: 'The helper returns only the first IMU as written. Combine both vectors with the addition operator — on SIMD values it adds lane by lane — and return that instead.',
  },
  {
    id: 'MQ-215',
    concept: "`String` supports a variety of operators and common methods, such as `upper()`",
    title: 'Emit device tags in uppercase',
    topic: 'Strings',
    priority: 'High',
    docUrl: 'https://mojolang.org/docs/std/builtin/string_literal/StringLiteral/#upper',
    file: 'src/device_tag.mojo',
    description:
      'The fleet registry only accepts uppercase device tags, but `device_tag` ' +
      'returns the joined string as-is, so it emits `mq-amr`. A `String` is ' +
      'Mojo’s text type, and it offers operators and methods that return a ' +
      'transformed copy rather than changing the original. Call the String ' +
      'method that returns an upper-cased copy on the finished tag.\n\n' +
      'Example: `someString.someTransform()` applied to the whole joined result.',
    starter: `def device_tag(family: String, model: String) -> String:
    return family + "-" + model


def main():
    print(device_tag("mq", "amr"))
`,
    validation: { kind: 'run', expectedStdout: 'MQ-AMR' },
    hint: 'The pieces are joined correctly, but the registry only accepts a single case. String has a method that returns an upper-cased copy — apply it to the whole joined tag, watching the parentheses so the entire string is transformed.',
  },
  {
    id: 'MQ-219',
    concept: "Index a `List` with `list[i]` to read an element; assign to `list[i]` to replace it in place",
    title: 'Correct the first waypoint in the path',
    topic: 'Collections',
    priority: 'High',
    docUrl: `${DOCS}/types/#list`,
    file: 'src/path.mojo',
    description:
      'The path planner received a corrected coordinate for the first waypoint, ' +
      'but the fix code calls `path.append(corrected)` instead of replacing the ' +
      'existing element. `append` adds a new slot at the end, so the path grows ' +
      'to four waypoints and `path[0]` still holds the stale value.\n\n' +
      'Read and write individual elements with the subscript operator: ' +
      '`path[i]` reads the element at index `i`, and `path[i] = value` replaces ' +
      'it in place. Fix the code so `path[0]` holds `15` and the list stays ' +
      'three elements long.\n\n' +
      'Example: `myList[0] = newValue`',
    starter: `def main():
    var path: List[Int] = [10, 20, 30]
    var corrected = 15
    path.append(corrected)  # TODO: replace path[0] instead of appending
    print("first waypoint:", path[0])
    print("waypoints:", len(path))
`,
    validation: { kind: 'run', expectedStdout: 'first waypoint: 15\nwaypoints: 3' },
    hint: 'Remove the `append` call and write directly to the slot: `path[0] = corrected`.',
  },
  {
    id: 'MQ-220',
    concept: "A `Tuple` is an ordered collection; unpack it or index it to get individual values",
    title: 'Unpack the telemetry stats in the right order',
    topic: 'Tuples',
    priority: 'High',
    docUrl: `${DOCS}/types/#tuples`,
    file: 'src/telemetry.mojo',
    description:
      'The telemetry panel reads a `(scans, points)` tuple, but it unpacks the two ' +
      'slots in the wrong order, so the labels are swapped. A tuple keeps elements ' +
      'in the order they were packed — line up each index with its position.\n\n' +
      'Example: read `someTuple[0]` and `someTuple[1]` to match how the pair was built.',
    starter: `def scan_stats() -> Tuple[Int, Int]:
    var num_scans = 4
    var total_points = 512
    return (num_scans, total_points)


def main():
    var stats = scan_stats()
    var scans = stats[1]
    var points = stats[0]
    print("scans:", scans)
    print("points:", points)
`,
    validation: { kind: 'run', expectedStdout: 'scans: 4\npoints: 512' },
    hint: 'A tuple keeps its elements in the order they were packed. The pair is built as (scans, then points), but the two reads pull from the opposite slots. Match each index to the position it was placed in.',
  },
  {
    id: 'MQ-221',
    concept: "A given `List` can only hold one type of value, specified at compile time as a parameter",
    title: 'Type the waypoint queue',
    topic: 'Collections',
    priority: 'High',
    docUrl: `${DOCS}/types/#list`,
    file: 'src/waypoints.mojo',
    description:
      'A `List[T]` is a growable, ordered sequence whose elements all share one ' +
      'type `T`, fixed at compile time. The waypoint queue is created as an ' +
      'untyped `List()`, so Mojo cannot infer its element type and the build ' +
      "fails. We're storing waypoint ids as `Int`s — annotate the element " +
      'type.\n\n' +
      'Example: `var someList = List[SomeType]()`',
    starter: `def main():
    var waypoints = List()
    waypoints.append(128)
    waypoints.append(256)
    print("Queued waypoints:", len(waypoints))
`,
    validation: { kind: 'run', expectedStdout: 'Queued waypoints: 2' },
    hint: '`List` is generic, so it must know what it holds. Specify the element type in square brackets when you construct it.',
  },
  {
    id: 'MQ-222',
    concept: "`Dict` holds key-value pairs; specify the key type and value type as parameters",
    title: 'Compile the joint-angle lookup',
    topic: 'Collections',
    priority: 'High',
    docUrl: `${DOCS}/types/#dict`,
    file: 'src/joint_map.mojo',
    description:
      'The controller tracks each joint’s last commanded angle in a `Dict`. A ' +
      '`Dict[K, V]` maps keys of type `K` to values of type `V` — here ' +
      '`Dict[String, Int]` maps a joint id to an angle. You write an entry with ' +
      '`d[key] = value`, read it back with `d[key]`, and count the entries with ' +
      '`len(d)`.\n\n' +
      'This `main` is incomplete on two counts. First, only `joint_3` is ' +
      'recorded — add `joint_8` at an angle of `256` with `d[key] = value` so the ' +
      'map holds two joints. Second, reading `d[key]` raises if the key is ' +
      'absent, so a key lookup is a raising call; `main` performs one ' +
      '(`joint_angles["joint_3"]`) but does not declare that it can raise, so it ' +
      'will not compile. Record the second joint and mark `main` as raising.\n\n' +
      'Example: `def someFunction() raises:`',
    starter: `from std.collections import Dict


def main():
    var joint_angles = Dict[String, Int]()
    joint_angles["joint_3"] = 128
    # TODO: also record joint_8 at an angle of 256
    print("joint angle:", joint_angles["joint_3"])
    print("joints:", len(joint_angles))
`,
    validation: { kind: 'run', expectedStdout: 'joint angle: 128\njoints: 2' },
    hint: 'Two fixes. Add the missing entry with `joint_angles["joint_8"] = 256`. And because looking a key up in a `Dict` can fail when the key is absent, that read is a raising call — a function that calls something raising must advertise it, so add `raises` to the header of `main`.',
  },
  {
    id: 'MQ-223',
    concept: "`Set` represents a collection of unique values",
    title: 'Deduplicate sensor ids with a Set',
    topic: 'Collections',
    priority: 'Medium',
    docUrl: `${DOCS}/types/#set`,
    file: 'src/unique_ids.mojo',
    description:
      'A `Set` is created as an untyped `Set()`, so Mojo cannot infer its element ' +
      'type and the build fails. We are tracking unique sensor ids as `Int`s — ' +
      'annotate the element type. A set keeps only distinct values, so adding 1 ' +
      'twice still leaves two unique ids.\n\n' +
      'Example: `var s = Set[SomeType]()`',
    starter: `from std.collections import Set


def main():
    var seen = Set()
    seen.add(1)
    seen.add(1)
    seen.add(2)
    print("unique:", len(seen))
`,
    validation: { kind: 'run', expectedStdout: 'unique: 2' },
    hint: 'Specify the element type when constructing: `Set[Int]()`.',
  },
  {
    id: 'MQ-224',
    concept: "An `Optional` represents a value that may or may not be present",
    title: 'Survive a calibration-cache miss',
    topic: 'Options',
    priority: 'High',
    docUrl: `${DOCS}/types/#optional`,
    file: 'src/calib_cache.mojo',
    description:
      'A sensor lookup either finds a calibration value or finds nothing, so ' +
      '`cache_lookup` returns an `Optional[Int]`: it holds an `Int` on a hit and ' +
      'is `None` on a miss — the Optional itself carries the “value or nothing” ' +
      'distinction. The reporter unwraps both with `.value()`, but calling ' +
      '`.value()` on an empty Optional crashes at runtime. An Optional is truthy ' +
      'only when it holds a value, so test each one first: on a hit, unwrap and ' +
      'print the value; on a miss, print the Optional itself, which renders as ' +
      '`None` (the real none — not the text `"none"`).\n\n' +
      'Example:\n```\nif maybe_x:\n    print(maybe_x.value())\nelse:\n    print(maybe_x)  # prints None\n```',
    starter: `from std.collections import Optional


def cache_lookup(sensor_id: Int) -> Optional[Int]:
    if sensor_id == 7:
        return 512
    return None


def main() raises:
    var hit = cache_lookup(7)
    var miss = cache_lookup(3)
    print("hit:", hit.value())
    print("miss:", miss.value())
`,
    validation: { kind: 'run', expectedStdout: 'hit: 512\nmiss: None' },
    hint: 'An `Optional` either holds a value or is `None`. Unwrapping it with `.value()` unconditionally bets there is always something inside, and on a cache miss that bet crashes. Test the Optional first (it is truthy only when occupied): unwrap on a hit, and on a miss print the Optional itself — an empty Optional prints as `None`.',
  },
  {
    id: 'MQ-301',
    concept: "Exponentiation uses two stars (`**`), not a caret",
    title: 'Square the value with exponentiation',
    topic: 'Operators',
    priority: 'Medium',
    docUrl: `${DOCS}/operators/#arithmetic-operators`,
    file: 'src/exponent.mojo',
    description:
      '`square_area` should return its `side` raised to the power 2, but it ' +
      'multiplies the side by 2 instead of squaring it, so `square_area(4)` ' +
      'returns 8 instead of 16. Exponentiation uses the `**` operator ' +
      '(`base ** exp`), not a caret. Use the exponentiation operator.\n\n' +
      'Example: `var sq = base ** 2`',
    starter: `def square_area(side: Int) -> Int:
    return side * 2


def main():
    print("area:", square_area(4))
`,
    validation: { kind: 'run', expectedStdout: 'area: 16' },
    hint: 'Multiplying by 2 only doubles. Reach for the exponentiation operator (`**`) to raise the side to the power 2.',
  },
  {
    id: 'MQ-302',
    concept: "Use `//` for floor division; the modulo operator `%` returns the remainder",
    title: 'Split readings into full bins',
    topic: 'Operators',
    priority: 'Medium',
    docUrl: `${DOCS}/operators/#arithmetic-operators`,
    file: 'src/divmod.mojo',
    description:
      '`split_into_bins` should report how many full bins of 5 fit into 17 ' +
      'readings (`17 // 5` = 3) and how many are left over (`17 % 5` = 2). Floor ' +
      'division `//` keeps only the whole number of times one value divides ' +
      'another, while the modulo operator `%` returns the remainder. But the ' +
      'two operators are swapped, so it returns `(2, 3)` and prints ' +
      '`bins: 2 left: 3`. Put floor division `//` on the bin count and remainder ' +
      '`%` on the leftovers.\n\n' +
      'Example: `count = total // size`, `rest = total % size`',
    starter: `def split_into_bins(total: Int, per_bin: Int) -> Tuple[Int, Int]:
    return total % per_bin, total // per_bin


def main():
    var result = split_into_bins(17, 5)
    print("bins:", result[0], "left:", result[1])
`,
    validation: { kind: 'run', expectedStdout: 'bins: 3 left: 2' },
    hint: '`//` gives the whole number of bins; `%` gives the remainder. They are swapped — exchange them.',
  },
  {
    id: 'MQ-303',
    concept: "Mojo provides six comparison operators: `==`, `!=`, `<`, `<=`, `>`, and `>=`, each returning a `Bool`",
    title: 'Flag a low battery at the threshold',
    topic: 'Operators',
    priority: 'Medium',
    docUrl: `${DOCS}/operators/#comparison-operators`,
    file: 'src/compare.mojo',
    description:
      'Mojo’s comparison operators — `==`, `!=`, `<`, `<=`, `>`, and `>=` — test ' +
      'two values and return a `Bool`. `battery_low` should count a battery at ' +
      'exactly 20% as low, but it uses a strict `<`, so 20 is not flagged. Use ' +
      'the operator that also includes the threshold itself.\n\n' +
      'Example: `value <= limit`',
    starter: `def battery_low(level: Int) -> Bool:
    return level < 20


def main():
    print("low:", battery_low(20))
`,
    validation: { kind: 'run', expectedStdout: 'low: True' },
    hint: 'A strict `<` excludes the boundary. Use `<=` so 20 counts as low.',
  },
  {
    id: 'MQ-304',
    concept: "You can chain comparisons; `a < b < c` is equivalent to `(a < b) and (b < c)`",
    title: 'Bound-check with a chained comparison',
    topic: 'Operators',
    priority: 'Low',
    docUrl: `${DOCS}/operators/#comparison-operators`,
    file: 'src/chained.mojo',
    description:
      '`in_range` should reject a temperature outside the safe band of 0–85, but ' +
      'it only tests the lower bound, so 90°C reports in-range. A chained ' +
      'comparison like `a < b < c` tests several relations at once, equivalent to ' +
      '`(a < b) and (b < c)`. Use a chained comparison to test both bounds at ' +
      'once.\n\n' +
      'Example: `lo <= x <= hi`',
    starter: `def in_range(temp: Int) -> Bool:
    return 0 <= temp


def main():
    print("in range:", in_range(90))
`,
    validation: { kind: 'run', expectedStdout: 'in range: False' },
    hint: 'Extend the single comparison into a chained one that also tests the upper bound (85) in the same expression.',
  },
  {
    id: 'MQ-305',
    concept: "Bitwise OR (`|`) keeps bits that are set in either operand",
    title: 'Combine status flags with bitwise OR',
    topic: 'Operators',
    priority: 'Low',
    docUrl: `${DOCS}/operators/#bitwise-operators`,
    file: 'src/flags.mojo',
    description:
      '`status_word` should carry both the READY and ARMED bits, but it ANDs the ' +
      'two flag bits together (clearing everything) instead of ORing them, so the ' +
      'ARMED test reads false. Bitwise OR (`|`) keeps every bit that is set in ' +
      'either operand. Combine the flags with bitwise OR.\n\n' +
      'Example: `var flags = A | B`',
    starter: `def status_word(ready: Int, armed: Int) -> Int:
    return ready & armed


def main():
    var READY = 1
    var ARMED = 2
    var flags = status_word(READY, ARMED)
    print("armed:", (flags & ARMED) != 0)
`,
    validation: { kind: 'run', expectedStdout: 'armed: True' },
    hint: 'Combining flags means setting both bits — that’s bitwise OR (`|`), not AND. The `&` in the test below is correct; it checks whether a bit is set.',
  },
  {
    id: 'MQ-306',
    concept: "With `and`, both operands must be truthy; if the left side is falsy, the right side isn't evaluated",
    title: 'Require both preconditions',
    topic: 'Operators',
    priority: 'Medium',
    docUrl: `${DOCS}/operators/#boolean-operators`,
    file: 'src/preconditions.mojo',
    description:
      'The robot may only drive when it has a position fix AND is calibrated, but ' +
      '`can_drive` uses `or`, so it would go with either one alone. With boolean ' +
      '`and`, both operands must be truthy; it also short-circuits, skipping the ' +
      'right side when the left is false. Use boolean `and` so both must ' +
      'hold.\n\n' +
      'Example: `ready = cond_a and cond_b`',
    starter: `def can_drive(has_fix: Bool, calibrated: Bool) -> Bool:
    return has_fix or calibrated


def main():
    print("go:", can_drive(True, False))
`,
    validation: { kind: 'run', expectedStdout: 'go: False' },
    hint: 'Replace `or` with `and` so both preconditions are required before driving.',
  },
  {
    id: 'MQ-308',
    concept: "The `in` operator checks whether a collection contains a value",
    title: 'Check membership in the allow-list',
    topic: 'Operators',
    priority: 'Medium',
    docUrl: `${DOCS}/operators/#membership-operators`,
    file: 'src/membership.mojo',
    description:
      '`is_allowed` should report whether a sensor id is in the allow-list, but it ' +
      'uses `not in`, so it returns the opposite of what we want. The `in` ' +
      'operator checks whether a collection contains a value, and `not in` is its ' +
      'negation. Use the membership operator that tests for presence.\n\n' +
      'Example: `value in container`',
    starter: `def is_allowed(sensor_id: Int, allowed: List[Int]) -> Bool:
    return sensor_id not in allowed


def main():
    var allowed = [2, 4, 6]
    print("ok:", is_allowed(4, allowed))
`,
    validation: { kind: 'run', expectedStdout: 'ok: True' },
    hint: 'You want to test for presence, not absence — drop the `not` so it uses the plain membership operator.',
  },
  {
    id: 'MQ-309',
    concept: "A conditional expression has the form `value_if_true if condition else value_if_false`",
    title: 'Pick a label with a conditional expression',
    topic: 'Operators',
    priority: 'Medium',
    docUrl: `${DOCS}/operators/#conditional-expressions`,
    file: 'src/ternary.mojo',
    description:
      '`speed_label` chooses its label with C-style ternary syntax ' +
      '(`cond ? a : b`), which Mojo does not accept. A conditional expression in ' +
      'Mojo has the form `value_if_true if condition else value_if_false`. ' +
      'Rewrite it using Mojo’s conditional expression.\n\n' +
      'Example: `value_if_true if condition else value_if_false`',
    starter: `def speed_label(speed: Int) -> String:
    return speed > 10 ? "fast" : "slow"


def main():
    print("mode:", speed_label(12))
`,
    validation: { kind: 'run', expectedStdout: 'mode: fast' },
    hint: 'Mojo has no `? :` operator. Rewrite it in the `value if condition else other` form.',
  },
  {
    id: 'MQ-310',
    concept: "Compound assignment forms like `*=` update the left-hand value instead of creating a new one",
    title: 'Scale a value in place',
    topic: 'Operators',
    priority: 'Low',
    docUrl: `${DOCS}/operators/#assignment-operators`,
    file: 'src/assign_op.mojo',
    description:
      'The gain should be tripled in place, but the code overwrites it with `3` ' +
      'instead of multiplying, so it prints 3. A compound assignment such as ' +
      '`x *= y` updates the existing value in place, shorthand for `x = x * y`. ' +
      'Use the compound multiply-assign operator.\n\n' +
      'Example: `value *= factor`',
    starter: `def main():
    var scale = 2
    scale = 3
    print("scale:", scale)
`,
    validation: { kind: 'run', expectedStdout: 'scale: 6' },
    hint: 'Plain `=` replaces the value. Use the compound multiply-assign operator (`*=`) so it multiplies the existing value instead.',
  },
  {
    id: 'MQ-312',
    concept: "Precedence determines what runs first (multiply before add); when in doubt, use parentheses",
    title: 'Fix the path-cost formula',
    topic: 'Operators',
    priority: 'High',
    docUrl: `${DOCS}/operators/#precedence`,
    file: 'src/path_cost.mojo',
    description:
      '`path_cost` should add the fixed setup to the per-segment cost, then ' +
      'multiply by the segment count. But without parentheses `*` binds tighter ' +
      'than `+`, so it returns 14 instead of 20 for 4 segments at 2 setup + 3 ' +
      'per-segment. Add the parentheses.\n\n' +
      'Example: `var result: Int = (x + y) * z`',
    starter: `def path_cost(setup: Int, per_segment: Int, segments: Int) -> Int:
    # setup plus per-segment cost, then multiplied across the segments
    return setup + per_segment * segments


def main():
    print("Total distance:", path_cost(2, 3, 4))
`,
    validation: { kind: 'run', expectedStdout: 'Total distance: 20' },
    hint: 'Multiplication binds tighter than addition, so the multiply happens first as written. Group the addition so it evaluates before the multiply.',
  },
  {
    id: 'MQ-320',
    concept: "The `if` statement executes an indented block when its boolean expression evaluates to `True`",
    title: 'Route deep task queues to the backup core',
    topic: 'Control Flow',
    priority: 'High',
    docUrl: `${DOCS}/control-flow/#the-if-statement`,
    file: 'src/scheduler_route.mojo',
    description:
      'An `if` statement runs its indented block only when its boolean condition ' +
      'is `True`. Tasks behind a deep queue should be routed to the overflow ' +
      'core, but the comparison is backwards: a queue of 250 is sent to the fast ' +
      'core and a shallow queue of 40 to overflow. Fix the relational ' +
      'operator.\n\n' +
      'Example: `if someValue > limit:`',
    starter: `def route_task(queue_depth: Int) -> String:
    if queue_depth < 100:
        return "overflow-core"
    else:
        return "fast-core"


def main():
    print(route_task(250))
    print(route_task(40))
`,
    validation: { kind: 'run', expectedStdout: 'overflow-core\nfast-core' },
    hint: 'A deep queue means that core is busy. Read the condition against the threshold: a queue of 250 should reach the overflow branch, but the comparison currently sends it the other way. Flip the relational operator.',
  },
  {
    id: 'MQ-321',
    concept: "The `while` loop repeatedly executes a block while its boolean expression evaluates to `True`",
    title: 'Stop the reconnect loop from spinning forever',
    topic: 'Control Flow',
    priority: 'High',
    docUrl: `${DOCS}/control-flow/#the-while-statement`,
    file: 'src/reconnect.mojo',
    description:
      'A `while` loop repeats its block as long as its boolean condition stays ' +
      '`True`. This loop adds up the back-off delay across reconnect attempts 1 ' +
      'through 5 (a linear back-off), but `attempt` is never advanced, so it loops ' +
      'forever and times out. Add the increment as the last line of the loop ' +
      'body.\n\n' +
      'Example: `someCounter += 1`',
    starter: `def main():
    var attempt = 1
    var total = 0
    while attempt <= 5:
        total += attempt
        # missing: advance the loop counter
    print("Retry budget:", total)
`,
    validation: { kind: 'run', expectedStdout: 'Retry budget: 15' },
    hint: 'The loop variable never changes, so the condition stays true forever. Advance it by one at the end of each pass so the loop can eventually finish.',
  },
  {
    id: 'MQ-322',
    concept: "In a `for` loop, `continue` skips the rest of the block and resumes with the next element",
    title: 'Skip reserved slots in the loop scheduler',
    topic: 'Control Flow',
    priority: 'High',
    docUrl: `${DOCS}/control-flow/#for-loop-control-statements`,
    file: 'src/loop_scheduler.mojo',
    description:
      'Every third slot is reserved for the control loop and should be skipped, so ' +
      'the work total comes out to 27. The `if` body is empty — add the statement ' +
      'that jumps to the next loop iteration.\n\n' +
      'Example (a related loop-control keyword):\n```\nfor i in range(count):\n    if someCondition:\n        break\n```',
    starter: `def main():
    var total = 0
    for i in range(1, 10):
        if i % 3 == 0:
            # skip the reserved control-loop slots
        total += i
    print("Scheduled units:", total)
`,
    validation: { kind: 'run', expectedStdout: 'Scheduled units: 27' },
    hint: 'You want the loop-control statement that abandons only the current iteration and moves on to the next — not the one that exits the loop entirely. Put it where the comment is.',
  },
  {
    id: 'MQ-323',
    concept: "Use `elif` to add another condition to an `if`, checked only when the earlier branches were false",
    title: 'Add the cruise power tier',
    topic: 'Control Flow',
    priority: 'High',
    docUrl: `${DOCS}/control-flow/#the-if-statement`,
    file: 'src/power_mode.mojo',
    description:
      '`power_mode` should pick one of three tiers from the battery `level`, but ' +
      'it only handles the top tier (`boost`) and the fallback (`sleep`), so a ' +
      'mid-charge robot at 50 wrongly reports `sleep` instead of `cruise`. An ' +
      '`elif` branch tests a further condition when the preceding `if` was false ' +
      '(Mojo spells it `elif`, not `else if`). Add an `elif` between the `if` and ' +
      'the `else` that returns `cruise` for a level of 30 or more.\n\n' +
      'Example:\n```\nif a:\n    ...\nelif b:\n    ...\nelse:\n    ...\n```',
    starter: `def power_mode(level: Int) -> String:
    if level >= 80:
        return "boost"
    else:
        return "sleep"


def main():
    print(power_mode(95))
    print(power_mode(50))
    print(power_mode(10))
`,
    validation: { kind: 'run', expectedStdout: 'boost\ncruise\nsleep' },
    hint: 'The two-way `if`/`else` has no slot for the middle tier, so 50 falls through to `sleep`. Insert an `elif level >= 30:` branch between the `if` and the `else` that returns `cruise`.',
  },
  {
    id: 'MQ-324',
    concept: "A range is a sequence of integers generated by `range(start, stop, step)`",
    title: 'Step through every other slot',
    topic: 'Control Flow',
    priority: 'Medium',
    docUrl: `${DOCS}/control-flow/#iterating-over-a-range`,
    file: 'src/range_step.mojo',
    description:
      'A `range(start, stop, step)` produces the integers from `start` up to (but ' +
      'not including) `stop`, advancing by `step`. The loop should visit every ' +
      'other slot (0, 2, 4, 6, 8) and sum them to 20, but `range(0, 10)` walks ' +
      'every index and sums to 45. Add the step argument so the range advances by ' +
      '2.\n\n' +
      'Example: `range(start, stop, step)`',
    starter: `def main():
    var total = 0
    for i in range(0, 10):
        total += i
    print("total:", total)
`,
    validation: { kind: 'run', expectedStdout: 'total: 20' },
    hint: '`range` takes an optional third argument for the step. Give it one so the loop advances two at a time.',
  },
  {
    id: 'MQ-325',
    concept: "Add the `ref` keyword before the loop variable to bind a reference and mutate the collection in place",
    title: 'Mutate readings in place while iterating',
    topic: 'Control Flow',
    priority: 'Medium',
    docUrl: `${DOCS}/control-flow/#iterating-by-reference`,
    file: 'src/iter_ref.mojo',
    description:
      'Each reading should be bumped by 10 in place, but a plain `for r in ' +
      'readings` binds a copy of each element, so the list is never changed and ' +
      'the first value stays 1. Putting `ref` before the loop variable binds each ' +
      'element by reference rather than copying it, so writes land in the list. ' +
      'Iterate by reference with `ref`.\n\n' +
      'Example: `for ref item in container:`',
    starter: `def main():
    var readings = [1, 2, 3]
    for r in readings:
        r += 10
    print("first:", readings[0])
`,
    validation: { kind: 'run', expectedStdout: 'first: 11' },
    hint: 'Add `ref` to the loop binding so each element is aliased in place; then the `+= 10` writes back to the list instead of to a copy.',
  },
  {
    id: 'MQ-326',
    concept: "All collection types in the `collections` module support `for` loop iteration over each element",
    title: 'Sum every point in the scan batch',
    topic: 'Iterators',
    priority: 'High',
    docUrl: `${DOCS}/control-flow/#iterating-over-mojo-collections`,
    file: 'src/scan_meter.mojo',
    description:
      'Every collection type in the `collections` module supports `for`-loop ' +
      'iteration, visiting each element in turn. The scan meter loops over every ' +
      'lidar return but reports only the last one, because the running total is ' +
      'replaced each pass instead of grown. Accumulate into the total rather than ' +
      'overwriting it.\n\n' +
      'Example: `acc += item` inside the loop, not `acc = item`.',
    starter: `def total_points(batch: List[Int]) -> Int:
    var total = 0
    for count in batch:
        total = count
    return total


def main():
    var batch: List[Int] = [12, 8, 20, 5]
    print("total points:", total_points(batch))
`,
    validation: { kind: 'run', expectedStdout: 'total points: 45' },
    hint: 'The loop visits every return, but each pass throws away what came before and keeps only the current value — that is why you see the final element instead of the sum. The accumulator should grow with each item.',
  },
  {
    id: 'MQ-401',
    concept: "By declaring `raises`, you tell Mojo a function may raise an error; raise one with `raise Error(\"...\")`",
    title: 'Reject invalid velocity commands with an error',
    topic: 'Error Handling',
    priority: 'High',
    docUrl: `${DOCS}/errors/#raise-an-error`,
    file: 'src/limits.mojo',
    description:
      '`validate_velocity` should reject a non-positive command, but its bad-input ' +
      'branch does nothing, and neither it nor `main` is declared `raises`. A ' +
      'function reports failure by raising — `raise Error("...")` — and any ' +
      'function that raises (or calls one that does) must declare `raises` in its ' +
      'signature. Make three fixes: raise an `Error` in the `if n <= 0` branch, ' +
      'declare `validate_velocity` as `raises`, and declare `main` as `raises` so ' +
      'it can propagate the error.\n\n' +
      'Example: `def someFunction(x: Int) raises -> Int:` with `raise Error("...")` in its body.',
    starter: `def validate_velocity(n: Int) -> Int:
    if n <= 0:
        pass  # TODO: reject the invalid velocity by raising an Error
    return n


def main():
    print("Validated:", validate_velocity(256))
`,
    validation: {
      kind: 'source',
      patterns: [
        'validate_velocity\\([^)]*\\)\\s+raises',
        'def\\s+main\\(\\)\\s+raises',
        'raise\\s+Error\\(',
      ],
      message:
        'Raise an `Error` in the invalid-velocity branch, and declare both ' +
        '`validate_velocity` and `main` as `raises`.',
    },
    hint: 'Three edits. Replace the placeholder in the `if n <= 0` branch with `raise Error("velocity must be positive")`. Add `raises` to `validate_velocity`\'s signature (after the argument list, before `-> Int`). Then add `raises` to `main` so the error can propagate out of it.',
  },
  {
    id: 'MQ-402',
    concept: "Mojo uses `try`/`except` to detect and handle errors",
    title: 'Catch the error and fall back',
    topic: 'Error Handling',
    priority: 'High',
    docUrl: `${DOCS}/errors/#handle-an-error`,
    file: 'src/catch_fallback.mojo',
    description:
      '`checked` raises on a negative reading. `main` calls it with `-1`, so the ' +
      'program aborts instead of degrading gracefully. A `try`/`except` block ' +
      'runs risky code in the `try`, and if it raises, control jumps to the ' +
      '`except` block instead of aborting. Wrap the call in a `try`/`except` and ' +
      'print `value: 0` on failure.\n\n' +
      'Example:\n```\ntry:\n    risky()\nexcept:\n    handle()\n```',
    starter: `def checked(n: Int) raises -> Int:
    if n < 0:
        raise Error("negative reading")
    return n


def main():
    print("value:", checked(-1))
`,
    validation: { kind: 'run', expectedStdout: 'value: 0' },
    hint: 'Put the call inside a `try:` block and print the fallback in an `except:` block.',
  },
  {
    id: 'MQ-403',
    concept: "To re-raise a caught error, use `raise` with the `^` sigil to transfer ownership of the error value",
    title: 'Log and re-raise the fault',
    topic: 'Error Handling',
    priority: 'Medium',
    docUrl: `${DOCS}/errors/#re-raise-an-error`,
    file: 'src/reraise.mojo',
    description:
      '`attempt` should log a fault and then re-raise it so the caller can ' +
      'recover, but its `except e` block swallows the error, so `main` never ' +
      'reaches its recovery path and "recovered" is missing. Re-raise after ' +
      'logging by transferring ownership of the caught error with the `^` sigil.' +
      '\n\nExample: `raise e^` inside `except e` re-throws the caught error.',
    starter: `def attempt() raises:
    try:
        raise Error("sensor fault")
    except e:
        print("logging:", e)


def main():
    try:
        attempt()
    except:
        print("recovered")
`,
    validation: {
      kind: 'source',
      patterns: ['raise\\s+e\\s*\\^'],
      message: 'Re-raise the caught error by transferring it with the `^` sigil: `raise e^`.',
    },
    hint: 'Re-raise the same error you caught: add `raise e^` as the last line of the `except e` block. The `^` transfers ownership of the caught error `e` back out.',
  },
  {
    id: 'MQ-412',
    concept: "A `with` statement context manager releases its resource at the end of the block, even if an error occurs",
    title: 'Read the calibration profile with a `with` block',
    topic: 'Context Managers',
    priority: 'High',
    docUrl: `${DOCS}/errors/#use-a-context-manager`,
    file: 'src/calibration.mojo',
    description:
      'MQ Robotics keeps the active calibration profile on disk. The reader opens ' +
      'it with a `with` block — a context manager that closes the file ' +
      'automatically when the block ends. But the line that reads the contents ' +
      'sits *after* the block, where the handle `f` no longer exists, so it will ' +
      'not compile. Move the read inside the `with` block.\n\n' +
      'Example:\n```\nwith open(path, "r") as f:\n    print(f.read())\n```',
    starter: `def main() raises:
    # MQ Robotics stores the active calibration profile on disk.
    with open("calib.txt", "w") as f:
        f.write("max_speed=1.5")

    with open("calib.txt", "r") as f:
        pass
    print(f.read())
`,
    validation: { kind: 'run', expectedStdout: 'max_speed=1.5' },
    hint: 'A file opened with `with ... as f:` is only in scope inside that block — Mojo closes the file and releases `f` as soon as the block ends. The read currently runs after the block, where `f` no longer exists. Do the reading inside the `with` block.',
  },
  {
    id: 'MQ-501',
    concept: "All struct fields are declared with `var` and a type annotation, and must be initialized in the constructor",
    title: 'Finish the LidarScan struct',
    topic: 'Structs',
    priority: 'High',
    docUrl: `${DOCS}/structs/#fields`,
    file: 'src/scan.mojo',
    description:
      'A struct stores its data in fields, each declared with `var` and a type ' +
      'and initialized in the constructor. `LidarScan` is missing its ' +
      '`far_points` field, so `total()` and the constructor will not compile. ' +
      'Declare the `far_points` field (an `Int`) and assign it in `__init__`.\n\n' +
      'Example field: `var someField: SomeType`\n' +
      'Example assignment: `self.someField = someField`',
    starter: `struct LidarScan(Copyable, Movable):
    var near_points: Int

    def __init__(out self, near_points: Int, far_points: Int):
        self.near_points = near_points

    def total(self) -> Int:
        return self.near_points + self.far_points


def main():
    var scan = LidarScan(8, 256)
    print("Total points:", scan.total())
`,
    validation: { kind: 'run', expectedStdout: 'Total points: 264' },
    hint: "`total()` and the constructor both reference a second field that doesn't exist yet. Declare it next to the existing field with the same integer type, then set it from the matching constructor argument.",
  },
  {
    id: 'MQ-502',
    concept: "An instance method takes `self` as an explicit first argument, letting it act on a particular instance of the struct",
    title: 'Add the low-battery method',
    topic: 'Structs',
    priority: 'High',
    docUrl: `${DOCS}/structs/#methods`,
    file: 'src/battery.mojo',
    description:
      '`Battery` stores a charge level but has no `is_low` method, yet `main` ' +
      'calls `b.is_low()`. An instance method takes `self` as an explicit first ' +
      'argument, which is how it gets access to that instance’s fields. Add a ' +
      'method `is_low(self) -> Bool` that returns whether the charge is below 20.\n\n' +
      'Example:\n```\ndef some_method(self) -> Bool:\n    return self.field < limit\n```',
    starter: `struct Battery:
    var charge: Int

    def __init__(out self, charge: Int):
        self.charge = charge


def main():
    var b = Battery(15)
    print("low:", b.is_low())
`,
    validation: { kind: 'run', expectedStdout: 'low: True' },
    hint: 'Add a method (a `def` taking `self`) inside the struct that returns the `Bool` result of comparing the charge against 20.',
  },
  {
    id: 'MQ-503',
    concept: "To let a method mutate the instance, declare its receiver as `mut self`",
    title: 'Let FrameCounter mutate itself',
    topic: 'Structs',
    priority: 'High',
    docUrl: `${DOCS}/structs/#mutating-a-struct`,
    file: 'src/frame_counter.mojo',
    description:
      "`increment` writes to `self.count`, but it takes `self` immutably, so the " +
      'compiler rejects the in-place update. A method that modifies its own ' +
      'fields needs a mutable receiver, declared `mut self`. Fix the ' +
      'signature.\n\n' +
      'Example: `def someMethod(mut self):`',
    starter: `struct FrameCounter(Copyable, Movable):
    var count: Int

    def __init__(out self, count: Int):
        self.count = count

    def increment(self):
        self.count += 1

    def get(self) -> Int:
        return self.count


def main():
    var counter = FrameCounter(0)
    counter.increment()
    counter.increment()
    print("Frames handled:", counter.get())
`,
    validation: { kind: 'run', expectedStdout: 'Frames handled: 2' },
    hint: "The method updates one of its own fields, which it can't do through a read-only `self`. Mark its `self` argument as mutable.",
  },
  {
    id: 'MQ-504',
    concept: "A `@staticmethod` can be called without an instance and doesn't receive `self`, so it can't access fields",
    title: 'Expose the encoder constant as a static method',
    topic: 'Structs',
    priority: 'Medium',
    docUrl: `${DOCS}/structs/#static-methods`,
    file: 'src/encoder_static.mojo',
    description:
      '`ticks_per_rev` does not use any instance data, and `main` calls it on the ' +
      'type itself (`Encoder.ticks_per_rev()`). A `@staticmethod` belongs to the ' +
      'type rather than an instance: it takes no `self` and so cannot read ' +
      'fields. Without that decorator the type-level call will not compile. Mark ' +
      'it static.\n\n' +
      'Example:\n```\n@staticmethod\ndef some_method() -> Int:\n    ...\n```',
    starter: `struct Encoder:
    def ticks_per_rev() -> Int:
        return 4096


def main():
    print("ppr:", Encoder.ticks_per_rev())
`,
    validation: { kind: 'run', expectedStdout: 'ppr: 4096' },
    hint: 'Put `@staticmethod` on the line above `def ticks_per_rev()` so it belongs to the type, not an instance.',
  },
  {
    id: 'MQ-505',
    concept: "The `@fieldwise_init` decorator generates a field-wise constructor, so you don't have to write `__init__` by hand",
    title: 'Synthesize the LidarScan constructor',
    topic: 'Structs',
    priority: 'Medium',
    docUrl: `${DOCS}/structs/#struct-definition`,
    file: 'src/scan_fieldwise.mojo',
    description:
      'Most structs just need a field-wise constructor — one that takes an ' +
      'argument per field and assigns each directly. Rather than writing that ' +
      '`__init__` by hand (as in MQ-501), put the `@fieldwise_init` decorator on ' +
      'the struct and Mojo generates it for you. `LidarScan` has no constructor, ' +
      'so `LidarScan(8, 256)` will not compile. Add the decorator so the ' +
      'field-wise constructor is synthesized.\n\n' +
      'Example:\n```\n@fieldwise_init\nstruct SomeType:\n    var field: Int\n```',
    starter: `struct LidarScan(Copyable, Movable):
    var near_points: Int
    var far_points: Int

    def total(self) -> Int:
        return self.near_points + self.far_points


def main():
    var scan = LidarScan(8, 256)
    print("Total points:", scan.total())
`,
    validation: { kind: 'run', expectedStdout: 'Total points: 264' },
    hint: 'The struct has fields but no constructor, so `LidarScan(8, 256)` has nothing to call. Add `@fieldwise_init` on the line directly above `struct LidarScan` to have Mojo generate a constructor that takes one argument per field.',
  },
  {
    id: 'MQ-507',
    concept: "A move-only type is `Movable` but not `Copyable`; transfer it with the `^` sigil",
    title: 'Hand off a move-only handle',
    topic: 'Structs',
    priority: 'Medium',
    docUrl: `${DOCS}/values/ownership/#transfer-arguments-var-and-`,
    file: 'src/move_only.mojo',
    description:
      '`FileHandle` is `Movable` but not `Copyable` — a move-only type. `take` ' +
      'takes ownership of its argument, but the call passes `h` without ' +
      'transferring it, so the compiler would need a copy it is not allowed to ' +
      'make. Transfer ownership with `^`.\n\n' +
      'Example: `take(value^)`',
    starter: `struct FileHandle(Movable):
    var fd: Int

    def __init__(out self, fd: Int):
        self.fd = fd


def take(var h: FileHandle) -> Int:
    return h.fd


def main():
    var h = FileHandle(3)
    print("fd:", take(h))
`,
    validation: { kind: 'run', expectedStdout: 'fd: 3' },
    hint: 'A move-only value can’t be copied into the call — hand it over with the `^` transfer operator on the argument.',
  },
  {
    id: 'MQ-510',
    concept: "Mojo evaluates `a + b` by calling `a.__add__(b)`",
    title: 'Combine two energy budgets with `+`',
    topic: 'Operator Overloading',
    priority: 'High',
    docUrl: `${DOCS}/structs/operator-support/#support-binary-arithmetic`,
    file: 'src/energy.mojo',
    description:
      '`drive + sense` should give the combined allowance, but `EnergyBudget` ' +
      'defines no `__add__` method, so `+` has nothing to call and the program ' +
      'fails to compile (`EnergyBudget does not implement the __add__ method`). ' +
      'Mojo turns `a + b` into `a.__add__(b)`, so overload `+` by defining ' +
      '`__add__`, folding both operands into the returned value.\n\n' +
      'Example: `def __add__(self, other: Self) -> Self: return Self(self.field + other.field)`',
    starter: `struct EnergyBudget(Copyable, Movable):
    var millijoules: Int

    def __init__(out self, millijoules: Int):
        self.millijoules = millijoules


def main():
    var drive_budget = EnergyBudget(100)
    var sense_budget = EnergyBudget(56)
    var total = drive_budget + sense_budget
    print("combined budget:", total.millijoules)
`,
    validation: { kind: 'run', expectedStdout: 'combined budget: 156' },
    hint: 'Mojo evaluates `a + b` as `a.__add__(b)`, so `+` only works if the type defines `__add__`. Add a `def __add__(self, other: Self) -> Self` method that returns a new `EnergyBudget` summing both sides’ `millijoules`.',
  },
  {
    id: 'MQ-511',
    concept: "A unary operator like `-x` calls `__neg__()`, returning a new value representing the result",
    title: 'Negate an offset with a unary operator',
    topic: 'Operator Overloading',
    priority: 'Low',
    docUrl: `${DOCS}/structs/operator-support/#support-unary-operators`,
    file: 'src/offset.mojo',
    description:
      'Applying `-o` to an `Offset` should flip its sign, but `Offset` doesn’t ' +
      'define the unary-negation dunder, so `-o` has nothing to call and won’t ' +
      'compile (`Offset does not implement the __neg__ method`). Mojo evaluates ' +
      'the unary `-x` by calling `x.__neg__()`, which returns a new value — so ' +
      'add `__neg__`, returning a new `Offset` built from the negated field.\n\n' +
      'Example:\n```\ndef __neg__(self) -> Self:\n    return Self(-self.field)\n```',
    starter: `struct Offset(Copyable, Movable):
    var v: Int

    def __init__(out self, v: Int):
        self.v = v


def main():
    var o = Offset(5)
    var n = -o
    print("neg:", n.v)
`,
    validation: { kind: 'run', expectedStdout: 'neg: -5' },
    hint: 'Mojo evaluates `-x` as `x.__neg__()`, so unary `-` only works if the type defines `__neg__`. Add a `def __neg__(self) -> Self` that builds and returns a new `Self` from the negated field.',
  },
  {
    id: 'MQ-512',
    concept: "Implement `__eq__()` to support `==`; the `Equatable` trait provides `__eq__()` and `__ne__()`",
    title: 'Compare two firmware versions',
    topic: 'Operator Overloading',
    priority: 'Medium',
    docUrl: `${DOCS}/structs/operator-support/#support-comparisons`,
    file: 'src/version.mojo',
    description:
      'Comparing two `Version` values with `==` should test their major numbers, ' +
      'but the struct has no `__eq__`, so `a == b` will not compile. Mojo ' +
      'evaluates `a == b` by calling `a.__eq__(b)`, so `==` works only once the ' +
      'type defines that dunder. Add the equality dunder.\n\n' +
      'Example:\n```\ndef __eq__(self, other: Self) -> Bool:\n    return self.field == other.field\n```',
    starter: `struct Version(Copyable, Movable):
    var major: Int

    def __init__(out self, major: Int):
        self.major = major


def main():
    var a = Version(2)
    var b = Version(2)
    print("equal:", a == b)
`,
    validation: { kind: 'run', expectedStdout: 'equal: True' },
    hint: 'Define the equality dunder (`__eq__`) taking `other: Self` and returning whether the two majors match.',
  },
  {
    id: 'MQ-513',
    concept: "Implement `__getitem__()` to support subscript reads (`obj[i]`)",
    title: 'Index into a frame with a subscript',
    topic: 'Operator Overloading',
    priority: 'Medium',
    docUrl: `${DOCS}/structs/operator-support/#support-subscripting`,
    file: 'src/frame.mojo',
    description:
      'Reading `f[1]` should return the second channel of a `Frame`, but the ' +
      'struct does not define the subscript dunder, so indexing will not compile. ' +
      'Mojo turns a subscript read `obj[i]` into `obj.__getitem__(i)`, so add ' +
      '`__getitem__` returning the field for index 0, 1, or 2.\n\n' +
      'Example:\n```\ndef __getitem__(self, i: Int) -> Int:\n    ...\n```',
    starter: `struct Frame(Copyable, Movable):
    var a: Int
    var b: Int
    var c: Int

    def __init__(out self, a: Int, b: Int, c: Int):
        self.a = a
        self.b = b
        self.c = c


def main():
    var f = Frame(10, 20, 30)
    print("channel 1:", f[1])
`,
    validation: { kind: 'run', expectedStdout: 'channel 1: 20' },
    hint: 'Define the subscript dunder (`__getitem__`) taking an `Int` index and returning the matching field for 0, 1, or 2.',
  },
  {
    id: 'MQ-520',
    concept: "`from module import name` imports a specific member from a module",
    title: 'Import sqrt from the math module',
    topic: 'Modules',
    priority: 'High',
    docUrl: `${DOCS}/packages/#mojo-modules`,
    file: 'src/geometry.mojo',
    description:
      '`main` computes the magnitude of a displacement with `sqrt`, but nothing ' +
      'imports it, so the name is undefined. `from module import name` brings a ' +
      'single member of a module into scope. Add the import at the top of the ' +
      'file.\n\n' +
      'Example: `from std.someModule import someName`',
    starter: `def main():
    var root = sqrt(144.0)
    print("Square root:", root)
`,
    validation: { kind: 'run', expectedStdout: 'Square root: 12.0' },
    hint: '`sqrt` lives in the standard library’s `math` module, so the name is unknown until you bring it into scope. Fully qualify it with `std.` — `from std.math import …` — at the top of the file.',
  },
  {
    id: 'MQ-601',
    concept: "Arguments are read-only by default; the `mut` convention lets the function write back to the caller's value",
    title: 'Let the odometer update the running total',
    topic: 'Value Semantics',
    priority: 'High',
    docUrl: `${DOCS}/values/ownership/#mutable-arguments-mut`,
    file: 'src/odometer.mojo',
    description:
      '`record_sample` adds a wheel-encoder delta to a running `total`, but ' +
      'arguments are read-only by default, so the in-place update will not ' +
      'compile. Mark the `total` argument `mut` so the function can write back to ' +
      'it.\n\n' +
      'Example: `def someFunction(mut someArg: Int):`',
    starter: `def record_sample(total: Int, sample: Int):
    total += sample


def main():
    var total = 0
    record_sample(total, 12)
    record_sample(total, 8)
    print("Total distance:", total)
`,
    validation: { kind: 'run', expectedStdout: 'Total distance: 20' },
    hint: 'Arguments are read-only by default, so the in-place update is rejected. Mark the argument you write to as mutable so the change reaches the caller.',
  },
  {
    id: 'MQ-602',
    concept: "The `^` transfer sigil ends a variable's lifetime and transfers ownership into a `var` argument",
    title: 'Transfer the map buffer into the loader',
    topic: 'Ownership',
    priority: 'High',
    docUrl: `${DOCS}/values/ownership/#transfer-arguments-var-and-`,
    file: 'src/map_loader.mojo',
    description:
      '`load_map` takes ownership of its argument (`var cells`). Unlike a ' +
      '`String`, a `List` is not implicitly copyable, so passing `cells` by plain ' +
      'copy is rejected:\n\n' +
      '```\n' +
      "error: value of type 'List[Int]' cannot be implicitly copied, it does not conform to 'ImplicitlyCopyable'\n" +
      '```\n\n' +
      'We don’t need `cells` after the call, so hand ownership to the loader with ' +
      'the `^` transfer sigil: it ends the variable’s lifetime and moves the value ' +
      'into the `var` argument instead of copying it.\n\n' +
      'Example: `var result = someFunction(someValue^)`',
    starter: `def load_map(var cells: List[Int]) -> Int:
    return len(cells)


def main():
    var cells = [16, 32, 64, 128]
    var result = load_map(cells)
    print("map cells loaded:", result)
`,
    validation: {
      kind: 'source',
      patterns: ['load_map\\(\\s*cells\\s*\\^\\s*\\)'],
      message: 'Pass ownership into the call using the `^` transfer operator on the argument.',
    },
    hint: "The loader takes ownership and a `List` won't copy implicitly, so the plain call won't compile. You don't use `cells` afterward — hand it over with the `^` transfer operator (the compiler even suggests it) rather than making an explicit `.copy()`.",
  },
  {
    id: 'MQ-604',
    concept: "A `ref` return value must name an origin; it returns a reference to an existing value, not a copy",
    title: 'Fix the mutable handle into the command queue',
    topic: 'Lifetimes',
    priority: 'High',
    docUrl: `${DOCS}/values/lifetimes/#ref-return-values`,
    file: 'src/command_queue.mojo',
    description:
      'A `ref` return type hands back a reference to existing storage rather than ' +
      'a copy, and must name the origin it borrows from. ' +
      "`borrow_depth` returns a mutable `ref` so callers can edit the queue's " +
      '`depth` in place, but the origin in the return type names the whole `self` ' +
      'instead of the field actually returned, so the borrow checker rejects it. ' +
      'Make the origin point at the same storage the `return` does.\n\n' +
      'Example: a method returning `self.field` should be typed `ref [self.field] T`, not `ref [self] T`.',
    starter: `struct CommandQueue(Copyable, Movable):
    var depth: Int

    def __init__(out self, depth: Int):
        self.depth = depth

    def borrow_depth(ref self) -> ref [self] Int:
        return self.depth


def main():
    var q = CommandQueue(4)
    ref d = q.borrow_depth()
    d = 10
    print("queue depth:", q.depth)
`,
    validation: { kind: 'run', expectedStdout: 'queue depth: 10' },
    hint: 'A returned reference carries an origin describing exactly which storage it borrows. The method hands back one field, but the declared origin names the entire enclosing value — those do not line up. Point the origin at the same thing the `return` statement does.',
  },
  {
    id: 'MQ-702',
    concept: "By the end of a constructor, all of the struct's fields must be initialized",
    title: 'Initialize every field in the constructor',
    topic: 'Value Lifecycle',
    priority: 'High',
    docUrl: `${DOCS}/lifecycle/life/#field-initialization`,
    file: 'src/waypoint_init.mojo',
    description:
      'A constructor must leave every field initialized before it returns. ' +
      '`Waypoint.__init__` sets `x` but forgets `y`, so the struct is incompletely ' +
      'constructed and the build fails. Assign `y` too.\n\n' +
      'Example: `self.field = field`',
    starter: `struct Waypoint(Copyable, Movable):
    var x: Int
    var y: Int

    def __init__(out self, x: Int, y: Int):
        self.x = x


def main():
    var w = Waypoint(3, 7)
    print("y:", w.y)
`,
    validation: { kind: 'run', expectedStdout: 'y: 7' },
    hint: 'Every field must be assigned before `__init__` returns. Assign the second field from its matching argument too.',
  },
  {
    id: 'MQ-703',
    concept: "Like any method, `__init__()` can be overloaded to construct the object from different arguments",
    title: 'Re-badge a RobotConfig with a second constructor',
    topic: 'Value Lifecycle',
    priority: 'High',
    docUrl: `${DOCS}/lifecycle/life/#overloading-the-constructor`,
    file: 'src/robot_config.mojo',
    description:
      '`RobotConfig` can be built from an explicit `max_rate`, but the fleet ' +
      'console also re-badges an existing config under a new name — ' +
      '`RobotConfig("arm", base)` — and no constructor accepts that yet, so the ' +
      'program will not compile. Add a second `__init__` that takes a name and an ' +
      'existing `RobotConfig` template, copying the template’s `max_rate`.\n\n' +
      'Because the two constructors take different second-argument types (`Int` ' +
      'vs `RobotConfig`), they must be separate overloads — a default argument ' +
      'can’t express both. Every constructor must assign all fields.\n\n' +
      'Example:\n```\ndef __init__(out self, name: String, template: Self):\n    self.name = name\n    self.max_rate = template.max_rate\n```',
    starter: `struct RobotConfig(Copyable, Movable):
    var name: String
    var max_rate: Int

    def __init__(out self, name: String, max_rate: Int):
        self.name = name
        self.max_rate = max_rate


def main():
    # The fleet console re-badges an existing config under a new name.
    var base = RobotConfig("base", 512)
    var arm = RobotConfig("arm", base)
    print("Robot:", arm.name, "max_rate:", arm.max_rate)
`,
    validation: { kind: 'run', expectedStdout: 'Robot: arm max_rate: 512' },
    hint: 'The console builds a config from a name plus an existing config (a template), but the only constructor expects a name and an `Int`. A struct can have more than one `__init__`: add a second `__init__(out self, name: String, template: Self)` that keeps the new name and copies `max_rate` from the template — and make sure it assigns every field.',
  },
  {
    id: 'MQ-704',
    concept: "An `@implicit` single-argument constructor enables implicit conversion from the source type",
    title: 'Allow implicit construction of Celsius',
    topic: 'Value Lifecycle',
    priority: 'Medium',
    docUrl: `${DOCS}/lifecycle/life/#constructors-and-implicit-conversion`,
    file: 'src/celsius.mojo',
    description:
      '`report` expects a `Celsius`, but `main` passes a bare `Int` and relies on ' +
      'the single-argument constructor to convert it. That only happens when the ' +
      'constructor is marked `@implicit`; without it the call will not compile. ' +
      'Add the decorator.\n\n' +
      'Example:\n```\n@implicit\ndef __init__(out self, x: Int):\n    ...\n```',
    starter: `struct Celsius(Copyable, Movable):
    var deg: Int

    def __init__(out self, deg: Int):
        self.deg = deg


def report(t: Celsius):
    print("temp:", t.deg)


def main():
    report(25)
`,
    validation: { kind: 'run', expectedStdout: 'temp: 25' },
    hint: 'Put `@implicit` on the line above the single-argument `__init__` so an `Int` converts to a `Celsius` automatically.',
  },
  {
    id: 'MQ-705',
    concept: "Conforming to `Copyable` gives a type a compiler-synthesized `.copy()` method",
    title: 'Give ScanBuffer an independent copy',
    topic: 'Value Lifecycle',
    priority: 'High',
    docUrl: `${DOCS}/lifecycle/life/#copy-constructor`,
    file: 'src/scan_buffer.mojo',
    description:
      'Each `ScanBuffer` should be safe to clone, but the struct conforms to no ' +
      'traits, so it has no `.copy()` method and `snapshot.copy()` will not ' +
      'compile. Conforming to `Copyable` makes the compiler synthesize one: it ' +
      'copies each field, and because copying a `List` duplicates its contents, ' +
      'the two buffers stay independent (an edit to one never leaks into the ' +
      'other). Add the `Copyable` trait to the struct.\n\n' +
      'Example: `struct Wrapper(Copyable):`',
    starter: `struct ScanBuffer:
    var samples: List[Int]

    def __init__(out self, var samples: List[Int]):
        self.samples = samples^

    def push(mut self, t: Int):
        self.samples.append(t)

    def size(self) -> Int:
        return len(self.samples)


def main():
    var original: List[Int] = [1, 2, 3]
    var snapshot = ScanBuffer(original^)
    # The black-box recorder keeps an independent copy so later edits don't leak in.
    var working = snapshot.copy()
    working.push(99)
    print("snapshot size:", snapshot.size())
    print("working size:", working.size())
`,
    validation: { kind: 'run', expectedStdout: 'snapshot size: 3\nworking size: 4' },
    hint: 'The recorder asks the buffer for a copy of itself, but the struct never declared it can be copied. Add the `Copyable` trait to the struct header; the compiler then synthesizes a `.copy()` that duplicates each field — including the `List`, which it deep-copies — so the buffers stay independent. No copy constructor needed.',
  },
  {
    id: 'MQ-706',
    concept: "The `ImplicitlyCopyable` trait lets the compiler copy a value on a plain assignment (`var b = a`)",
    title: 'Make readings implicitly copyable',
    topic: 'Value Lifecycle',
    priority: 'Medium',
    docUrl: `${DOCS}/lifecycle/life/#implicitly-copyable-types`,
    file: 'src/implicit_copy.mojo',
    description:
      'Assigning `var b = a` should copy the `Reading`, but the struct is only ' +
      '`Copyable`, which requires an explicit `.copy()`; a plain assignment needs ' +
      'the stronger `ImplicitlyCopyable`. Add that trait so `var b = a` ' +
      'compiles.\n\n' +
      'Example: `struct S(ImplicitlyCopyable, Movable):`',
    starter: `struct Reading(Copyable, Movable):
    var v: Int

    def __init__(out self, v: Int):
        self.v = v


def main():
    var a = Reading(5)
    var b = a
    print("a:", a.v, "b:", b.v)
`,
    validation: { kind: 'run', expectedStdout: 'a: 5 b: 5' },
    hint: 'Add `ImplicitlyCopyable` to the struct’s trait list so a plain `var b = a` copies it.',
  },
  {
    id: 'MQ-710',
    concept: "Mojo calls a value's `__del__()` destructor when its lifetime ends (ASAP, last-use destruction)",
    title: 'Release the motor handle on teardown',
    topic: 'Value Lifecycle',
    priority: 'High',
    docUrl: `${DOCS}/lifecycle/death/#destructor`,
    file: 'src/motor_handle.mojo',
    description:
      'A `MotorHandle` should release its motor as soon as it goes out of scope ' +
      '(RAII), but right now no cleanup ever happens, so the release line is ' +
      'missing from the audit log. Add a destructor that prints the release; it ' +
      'runs automatically at end of scope.\n\n' +
      'Example:\n```\ndef __del__(deinit self):\n    print("Closed connection", self.conn_id)\n```',
    starter: `struct MotorHandle:
    var motor_id: Int

    def __init__(out self, motor_id: Int):
        self.motor_id = motor_id
        print("Acquired motor", self.motor_id)


def drive():
    var handle = MotorHandle(0)
    print("Driving with motor", handle.motor_id)


def main():
    drive()
    print("Scheduler idle")
`,
    validation: {
      kind: 'run',
      expectedStdout: 'Acquired motor 0\nDriving with motor 0\nReleased motor 0\nScheduler idle',
    },
    hint: 'The handle announces when it is acquired but never when it is released, so the release line is missing. Mojo runs a struct’s destructor automatically the moment a value leaves scope — add that destructor and have it print the release. Note its `self` must be taken specially as `deinit self`, not a plain `self`.',
  },
  {
    id: 'MQ-801',
    concept: "Assign an expression to a compile-time constant with `comptime`, which evaluates it once at compile time",
    title: 'Bake the control rate in at compile time',
    topic: 'Metaprogramming',
    priority: 'High',
    docUrl: `${DOCS}/metaprogramming/comptime-evaluation/`,
    file: 'src/control_rate.mojo',
    description:
      'The control loop runs at a fixed rate that is fully known when the ' +
      'firmware is built, so it belongs as a compile-time constant rather than a ' +
      'runtime value. The `comptime` keyword evaluates an expression at compile ' +
      'time and binds the result as a constant the compiler folds in (and can ' +
      'later use where a compile-time value is required, such as a parameter or a ' +
      '`comptime for` bound). Right now `tick_budget` is declared with `var`, ' +
      'making it an ordinary runtime variable. Declare it with `comptime` ' +
      'instead.\n\n' +
      'Example: `comptime LIMIT = 8 * 60`',
    starter: `def main():
    var tick_budget = 50 * 20
    print("tick budget:", tick_budget)
`,
    validation: {
      kind: 'source',
      patterns: ['\\bcomptime\\s+tick_budget\\b'],
      message: 'Declare `tick_budget` as a compile-time constant with the `comptime` keyword.',
    },
    hint: 'A value fully known at build time can be a compile-time constant. Swap `var` for `comptime` on the `tick_budget` declaration so the expression is evaluated at compile time rather than at run time.',
  },
  {
    id: 'MQ-803',
    concept: "`comptime for` fully unrolls a loop at compile time over a compile-time sequence like `range(LIMIT)`",
    title: 'Unroll the drive-axis loop at compile time',
    topic: 'Metaprogramming',
    priority: 'High',
    docUrl: `${DOCS}/metaprogramming/comptime-evaluation/#comptime-for`,
    file: 'src/drive_axes.mojo',
    description:
      'The drive kernel unrolls a loop over its axes at compile time with ' +
      '`comptime for`, but it drives the loop with a runtime `var`, which the ' +
      'compiler cannot accept — a `comptime for` needs a bound known at compile ' +
      'time. Promote the count to a compile-time constant.\n\n' +
      'Example: declare `comptime SOME_COUNT = 4` and loop over `range(SOME_COUNT)`.',
    starter: `def main():
    var num_axes = 4
    var total = 0
    comptime for i in range(num_axes):
        total += i
    print("axis sum:", total)
`,
    validation: { kind: 'run', expectedStdout: 'axis sum: 6' },
    hint: 'A `comptime for` loop is unrolled while the program is compiled, so the compiler must already know how many iterations there are. A `var` is only decided at run time — bind the count as a compile-time constant instead.',
  },
  {
    id: 'MQ-810',
    concept: "Parameters in `[]` are compile-time inputs; arguments in `()` are run-time values",
    title: 'Bake the control gain in at compile time',
    topic: 'Parameterization',
    priority: 'High',
    docUrl: `${DOCS}/parameters/#parameterized-functions`,
    file: 'src/gain.mojo',
    description:
      'This helper multiplies a value by a fixed control gain that should be baked ' +
      'in at compile time. In Mojo, inputs in square brackets `[]` are ' +
      'compile-time parameters, while inputs in parentheses `()` are run-time ' +
      'arguments. Here `factor` is declared as an ordinary runtime argument while ' +
      'callers pass it in square brackets — so it will not compile. Move ' +
      "`factor` into the function's compile-time parameter list.\n\n" +
      'Example: `def scaleBy[k: Int](x: Int) -> Int:`',
    starter: `def scale(factor: Int, x: Int) -> Int:
    return x * factor


def main():
    print("Scaled:", scale[3](14))
`,
    validation: { kind: 'run', expectedStdout: 'Scaled: 42' },
    hint: 'The value in square brackets at the call site is a compile-time parameter, but the function only declares runtime arguments in parentheses. Move the gain factor into the function’s `[...]` parameter list so it is known at compile time.',
  },
  {
    id: 'MQ-812',
    concept: "A parameterized struct adds compile-time parameters in `[]` after its name; they are accessible on instances (e.g. `b.size`)",
    title: 'Parameterize the buffer by size',
    topic: 'Parameterization',
    priority: 'Medium',
    docUrl: `${DOCS}/parameters/#parameterized-structs`,
    file: 'src/buffer_param.mojo',
    description:
      'A parameterized struct adds compile-time parameters in `[]` after its ' +
      'name, like `Buffer[size: Int]`. `Buffer` is constructed as `Buffer[8]`, ' +
      'its `capacity` method reads `Self.size`, and `main` prints `b.size` ' +
      'directly — but the struct never declares a `size` parameter, so none of ' +
      'that compiles. Add a compile-time parameter `[size: Int]` to the struct. ' +
      'Parameters are also accessible on instances as `b.size`.\n\n' +
      'Example: `struct Thing[n: Int]:`',
    starter: `struct Buffer(Copyable, Movable):
    def __init__(out self):
        pass

    def capacity(self) -> Int:
        return Self.size


def main():
    var b = Buffer[8]()
    print("capacity:", b.capacity())
    print("size:", b.size)
`,
    validation: { kind: 'run', expectedStdout: 'capacity: 8\nsize: 8' },
    hint: 'Add a compile-time parameter list (`[size: Int]`) to the struct header, before the trait list — `Self.size` and `b.size` then resolve.',
  },
  {
    id: 'MQ-825',
    concept: "Declare trait conformance in parentheses after the struct name; the compiler enforces the trait's requirements",
    title: 'Register Lidar as a Sensor',
    topic: 'Traits',
    priority: 'High',
    docUrl: `${DOCS}/traits/#adding-traits-to-structs`,
    file: 'src/sensors.mojo',
    description:
      '`announce` only accepts types that conform to the `Sensor` trait — a set ' +
      'of method requirements a type promises to meet. A struct declares ' +
      'conformance by listing the trait in parentheses after its name, and the ' +
      'compiler then enforces it. `Lidar` already implements `read`, but it does ' +
      'not declare conformance, so the call is rejected. Add `Sensor` to its ' +
      'declaration.\n\n' +
      'Example: `struct SomeStruct(SomeTrait):`',
    starter: `trait Sensor:
    def read(self) -> String:
        ...


struct Lidar:
    var name: String

    def __init__(out self, name: String):
        self.name = name

    def read(self) -> String:
        return "Reading from " + self.name


def announce[T: Sensor](sensor: T):
    print(sensor.read())


def main():
    announce(Lidar("lidar-front"))
`,
    validation: { kind: 'run', expectedStdout: 'Reading from lidar-front' },
    hint: 'The generic function only accepts trait conformers. Declare that the struct conforms by listing the trait in parentheses after the struct name.',
  },
  {
    id: 'MQ-827',
    concept: "A trait can include a default method implementation that conforming structs inherit unless they override it",
    title: 'Give the trait a default greeting',
    topic: 'Traits',
    priority: 'Medium',
    docUrl: `${DOCS}/traits/#default-method-implementations`,
    file: 'src/trait_default.mojo',
    description:
      'A trait method can carry a default implementation, which conforming ' +
      'structs inherit unless they override it. `Robot` conforms to `Greeter` ' +
      'but only implements `name`; it relies on `greet` having a default. Right ' +
      'now `greet` is declared with `...` (no body), so `Robot` does not satisfy ' +
      'the trait. Give `greet` a default implementation in the trait that ' +
      'returns `"hello "` followed by the robot’s name from `self.name()` — so ' +
      '`Robot`, whose name is `amr`, prints `hello amr`.\n\n' +
      'Example: a trait method may have a real body that conformers inherit.',
    starter: `trait Greeter:
    def name(self) -> String:
        ...

    def greet(self) -> String:
        ...


struct Robot(Greeter):
    def __init__(out self):
        pass

    def name(self) -> String:
        return "amr"


def main():
    var r = Robot()
    print(r.greet())
`,
    validation: { kind: 'run', expectedStdout: 'hello amr' },
    hint: 'Replace the `...` in the trait’s `greet` with a real body — `return "hello " + self.name()`. Conformers then inherit it.',
  },
  {
    id: 'MQ-830',
    concept: "The `Sized` trait requires a type to implement `__len__()`, which the built-in `len()` function uses",
    title: 'Make the track report its length',
    topic: 'Traits',
    priority: 'Medium',
    docUrl: `${DOCS}/traits/#the-sized-trait`,
    file: 'src/track_sized.mojo',
    description:
      '`len(t)` only works on types that conform to the `Sized` trait by ' +
      'implementing `__len__`. `Track` holds a list of waypoints but does ' +
      'neither, so the call fails. Declare `Sized` conformance and add a ' +
      '`__len__` that returns the number of waypoints (`len(self.waypoints)`).\n\n' +
      'Example:\n```\nstruct S(Sized):\n    def __len__(self) -> Int:\n        ...\n```',
    starter: `struct Track:
    var name: String
    var waypoints: List[Int]

    def __init__(out self, name: String, var waypoints: List[Int]):
        self.name = name
        self.waypoints = waypoints^


def main():
    var t = Track("loop-a", [10, 20, 30, 40, 50])
    print("len:", len(t))
`,
    validation: { kind: 'run', expectedStdout: 'len: 5' },
    hint: 'Declare `Sized` conformance on the struct and give it a `__len__` method that returns `len(self.waypoints)`.',
  },
  {
    id: 'MQ-835',
    concept: "`Some[Trait]` is shorthand for a trait-constrained generic parameter; `def f(v: Some[Writable])` is equivalent to `def f[T: Writable](v: T)`",
    title: 'Make the telemetry logger generic',
    topic: 'Generics',
    priority: 'High',
    docUrl: `${DOCS}/generics/#setting-generic-parameter-bounds`,
    file: 'src/telemetry_log.mojo',
    description:
      '`log_value` should accept any printable value, but it references a type ' +
      '`T` that was never introduced, so the build fails. Fix it by constraining ' +
      'the argument to the `Writable` trait.\n\n' +
      'The explicit form declares a named type parameter: ' +
      '`def log_value[T: Writable](value: T):`. The `Some` shorthand is terser ' +
      'and equivalent: `def log_value(value: Some[Writable]):`. Either compiles.',
    starter: `# Logs any value the telemetry bus touches, whatever its type.
def log_value(value: T):
    print("telemetry:", value)


def main():
    log_value(42)
    log_value("ready")
`,
    validation: { kind: 'run', expectedStdout: 'telemetry: 42\ntelemetry: ready' },
    hint: 'You reference a type that was never introduced. Either add `[T: Writable]` before the argument list and change the argument type to `T`, or use the `Some` shorthand: replace `T` with `Some[Writable]` and drop the `[]` entirely.',
  },
  {
    id: 'MQ-845',
    concept: "`comptime assert cond, \"msg\"` asserts a condition at compile time; if false, compilation fails",
    title: 'Guard the motor count',
    topic: 'Constraints',
    priority: 'High',
    docUrl: `${DOCS}/metaprogramming/constraints/#compile-time-assertions`,
    file: 'src/drive_train.mojo',
    description:
      'The drive train pairs motors left and right, so `make_drive` uses a ' +
      '`comptime assert` statement to reject an odd motor count at compile time. ' +
      'It is currently instantiated with an odd value, so the build fails. Pick a ' +
      'motor count the assertion accepts — do not weaken the guard.\n\n' +
      'Example: `make_drive[someEvenN]()`',
    starter: `def make_drive[num_motors: Int]() -> Int:
    # The drive train must pair motors across an even motor count.
    comptime assert num_motors % 2 == 0, "num_motors must be even"
    return num_motors * 64


def main():
    print("Drive slots:", make_drive[7]())
`,
    validation: { kind: 'run', expectedStdout: 'Drive slots: 512' },
    hint: 'The `comptime assert` statement is a compile-time assertion: it stops the build whenever its condition is false for the chosen parameter. Read the message, then instantiate the function with a parameter value that satisfies it — do not weaken the guard.',
  },
  {
    id: 'MQ-852',
    concept: "The `comptime` keyword forces an expression to be evaluated at compile time",
    title: 'Materialize the transform-matrix size',
    topic: 'Materialization',
    priority: 'High',
    docUrl: `${DOCS}/metaprogramming/materialization/#using-the-comptime-keyword`,
    file: 'src/transform.mojo',
    description:
      '`transform_size` reports how many entries a `dim` × `dim` transform matrix ' +
      'holds (`dim` squared). The dimension is a parameter (in square brackets), ' +
      'so it must be known at compile time — the result is then materialized into ' +
      'the runtime `print`. But the caller feeds it a runtime `var`, and the ' +
      'compiler rejects passing a dynamic value into a parameter list. Bind the ' +
      'dimension as a compile-time constant instead.\n\n' +
      'Example: declare `comptime SOME_DIM = 8` and pass it as `someFunction[SOME_DIM]()`.',
    starter: `def transform_size[dim: Int]() -> Int:
    # a dim x dim transform matrix has dim * dim entries
    return dim * dim


def main():
    var dim = 8
    print("matrix entries:", transform_size[dim]())
`,
    validation: { kind: 'run', expectedStdout: 'matrix entries: 64' },
    hint: 'A value in a parameter list (the square brackets) has to be settled while the program compiles, but a `var` is only decided at run time, so the compiler refuses to use it there. Declare the dimension as a compile-time constant so it can flow into the parameter list — its result is then materialized into the runtime print.',
  },
  {
    id: 'MQ-858',
    concept: "Use `reflect[T]` to inspect a type at compile time, querying members like `field_count()`",
    title: 'Count the robot-config fields by reflection',
    topic: 'Reflection',
    priority: 'High',
    docUrl: `${DOCS}/metaprogramming/reflection/#inspect-a-type`,
    file: 'src/config_inspect.mojo',
    description:
      'Compile-time reflection with `reflect[T]` inspects a type and returns a ' +
      'handle you can query for its members. The config inspector reflects over ' +
      '`RobotConfig` with `reflect[...]()` and should report how many fields it ' +
      'has (3). But it calls a reflection method that does not exist, so the ' +
      'build fails. Call the method on the reflected handle that returns the ' +
      'field count.\n\n' +
      'Example: `comptime r = reflect[SomeType]()`. Check the linked reflection ' +
      'docs for the accessor that returns the field count.',
    starter: `struct RobotConfig(Copyable, Movable):
    var max_speed: Int
    var wheel_radius: Int
    var num_sensors: Int

    def __init__(out self, max_speed: Int, wheel_radius: Int, num_sensors: Int):
        self.max_speed = max_speed
        self.wheel_radius = wheel_radius
        self.num_sensors = num_sensors


def main():
    comptime r = reflect[RobotConfig]()
    print("RobotConfig fields:", r.num_fields())
`,
    validation: { kind: 'run', expectedStdout: 'RobotConfig fields: 3' },
    hint: 'The handle has no `num_fields` method — that is the wrong name. Open the linked reflection docs, find the accessor that returns how many fields the struct declares, and call it with parentheses.',
  },
  {
    id: 'MQ-901',
    concept: "Use the free function `alloc[T](n)` to allocate uninitialized heap memory for `n` values",
    title: 'Allocate the encoder-sample scratch buffer',
    topic: 'Pointers',
    priority: 'High',
    docUrl: `${DOCS}/pointers/unsafe-pointers/#allocating-memory`,
    file: 'src/scratch.mojo',
    description:
      'An `UnsafePointer[T]` is a raw handle to heap memory; you reserve space ' +
      'for `n` uninitialized values with the free function `alloc[T](n)`. The ' +
      'driver stages a single encoder reading in a one-slot heap buffer: ' +
      'allocate, initialize the pointee, read it back with `[]`, then destroy and ' +
      'free it. The allocation call uses an API that does not exist in this ' +
      'toolchain, so it will not compile. Use the free allocation function ' +
      'instead.\n\n' +
      'Example: `p = alloc[SomeType](n)`',
    starter: `def main():
    # Stage a single encoder reading in a scratch buffer on the heap.
    # BUG: allocate, write the value, read it back, then release it.
    ptr = UnsafePointer[Int].alloc(1)
    ptr.init_pointee_copy(99)
    value = ptr[]
    print("Encoder count:", value)
    ptr.destroy_pointee()
    ptr.free()
`,
    validation: { kind: 'run', expectedStdout: 'Encoder count: 99' },
    hint: 'In this toolchain there is no `.alloc` method on `UnsafePointer`. Reach for the free allocation function that takes the element type as a parameter and the count as an argument; everything after it (initialize the pointee, dereference with `[]`, destroy, free) is already correct.',
  },
  {
    id: 'MQ-903',
    concept: "With space for multiple values, `ptr[i]` accesses the element at offset `i`",
    title: 'Read the right slot of the scratch buffer',
    topic: 'Pointers',
    priority: 'High',
    docUrl: `${DOCS}/pointers/unsafe-pointers/#storing-multiple-values`,
    file: 'src/ptr_index.mojo',
    description:
      'When a pointer has space for multiple values, `ptr[i]` accesses the ' +
      'element at offset `i`. This two-slot heap buffer stores 10 at index 0 and ' +
      '20 at index 1, then should print the second slot (20). But it reads index ' +
      '0, so it prints 10. Fix the index it dereferences.\n\n' +
      'Example: `ptr[i]` reads the element at offset `i`.',
    starter: `def main():
    ptr = alloc[Int](2)
    ptr[0] = 10
    ptr[1] = 20
    print("second:", ptr[0])
    ptr.free()
`,
    validation: { kind: 'run', expectedStdout: 'second: 20' },
    hint: 'The second slot lives at index 1, not 0 — dereference that index instead.',
  },
  {
    id: 'MQ-950',
    concept: "`assert_equal` from the `testing` module asserts that two values are equal",
    title: 'Make the odometry test pass',
    topic: 'Testing',
    priority: 'High',
    docUrl: `${DOCS}/errors/`,
    file: 'src/odometry_test.mojo',
    description:
      'A unit test checks `total_distance(near, far)` with `assert_equal`, which ' +
      'comes from the `testing` module and fails the test unless its two ' +
      'arguments are equal. The function is correct, but the expected value in ' +
      'the assertion is wrong, so the test fails. Keep the `assert_equal` check ' +
      'and correct the expected total.\n\n' +
      'Example: `assert_equal(add(2, 3), 5)` — the expected operand must match the real sum.',
    starter: `from std.testing import assert_equal


def total_distance(near: Int, far: Int) -> Int:
    return near + far


def main() raises:
    assert_equal(total_distance(100, 50), 200)
    print("All checks passed!")
`,
    validation: {
      kind: 'source',
      patterns: ['assert_equal\\('],
      message: 'Keep the `assert_equal` check in place and make it pass.',
    },
    hint: 'The function under test is correct — add a near distance of 100 and a far distance of 50 by hand and compare with the number the assertion checks against. One of those two numbers is wrong, and it is not the one the code computes.',
  },
  {
    id: 'MQ-951',
    concept: "`assert_raises` from the `testing` module is a context manager that asserts its `with` block raises an error",
    title: 'Assert that bad input raises',
    topic: 'Testing',
    priority: 'Medium',
    docUrl: `${DOCS}/errors/`,
    file: 'src/test_raises.mojo',
    description:
      '`clamp` raises on a negative value. `assert_raises()` from the `testing` ' +
      'module is a context manager whose `with` block must raise an error for the ' +
      'test to pass. The test uses it to check that, but it calls `clamp(5)`, ' +
      'which does not raise — so the assertion itself fails. Call `clamp` with an ' +
      'input that actually raises.\n\n' +
      'Example:\n```\nwith assert_raises():\n    risky()\n```',
    starter: `from std.testing import assert_raises


def clamp(n: Int) raises -> Int:
    if n < 0:
        raise Error("negative speed")
    return n


def main() raises:
    with assert_raises():
        _ = clamp(5)
    print("raised as expected")
`,
    validation: { kind: 'run', expectedStdout: 'raised as expected' },
    hint: 'The `assert_raises` block only passes if its body actually raises. Give `clamp` a negative input so it hits the `raise`.',
  },
]
