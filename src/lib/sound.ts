/**
 * Tiny, dependency-free sound engine built on the Web Audio API.
 *
 * Design goals:
 *  - No asset files and no libraries — every cue is synthesized from oscillators.
 *  - Off by default; every `play*` is a no-op unless explicitly enabled, so call
 *    sites stay decoupled (no prop drilling) and silence is the default.
 *  - The AudioContext is created lazily on first enable/play (inside a user
 *    gesture), never at import — browsers block audio that isn't gesture-driven.
 *  - Fully guarded: if Web Audio is missing or throws, calls silently no-op and
 *    never break the app. Audio only ever supplements the visual feedback.
 */

let enabled = false
let ctx: AudioContext | null = null

/** Lazily create / resume the shared AudioContext. Safe to call repeatedly. */
function audio(): AudioContext | null {
  if (!enabled) return null
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function isSoundEnabled(): boolean {
  return enabled
}

export function setSoundEnabled(on: boolean): void {
  enabled = on
  // Warm up the context within the enabling gesture so later cues are instant.
  if (on) audio()
}

/** Master volume kept deliberately low so repeated cues never grate. */
const MASTER = 0.13

/**
 * Play one short tone with a quick attack + decay envelope (no clicks).
 * `start` is an offset (seconds) from "now" so cues can be sequenced.
 */
function tone(
  c: AudioContext,
  freq: number,
  start: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'sine',
): void {
  const osc = c.createOscillator()
  const env = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = c.currentTime + start
  env.gain.setValueAtTime(0, t0)
  env.gain.linearRampToValueAtTime(gain * MASTER, t0 + 0.012)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(env)
  env.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

/** Subtle blip when a run/compile is submitted. */
export function playRunStart(): void {
  const c = audio()
  if (!c) return
  try {
    tone(c, 660, 0, 0.05, 0.5, 'triangle')
  } catch {
    /* ignore */
  }
}

/** Gentle low descending two-tone for a failed build / wrong output. */
export function playFail(): void {
  const c = audio()
  if (!c) return
  try {
    tone(c, 220, 0, 0.14, 0.6, 'sine')
    tone(c, 160, 0.1, 0.18, 0.6, 'sine')
  } catch {
    /* ignore */
  }
}

/** Pleasant rising arpeggio (C5–E5–G5) when a ticket resolves. */
export function playResolved(): void {
  const c = audio()
  if (!c) return
  try {
    tone(c, 523.25, 0, 0.18, 0.8, 'triangle')
    tone(c, 659.25, 0.09, 0.18, 0.8, 'triangle')
    tone(c, 783.99, 0.18, 0.26, 0.8, 'triangle')
  } catch {
    /* ignore */
  }
}

/** Slightly longer major arpeggio (C5–E5–G5–C6) for finishing every ticket. */
export function playFanfare(): void {
  const c = audio()
  if (!c) return
  try {
    tone(c, 523.25, 0, 0.16, 0.85, 'triangle')
    tone(c, 659.25, 0.12, 0.16, 0.85, 'triangle')
    tone(c, 783.99, 0.24, 0.16, 0.85, 'triangle')
    tone(c, 1046.5, 0.36, 0.4, 0.9, 'triangle')
  } catch {
    /* ignore */
  }
}
