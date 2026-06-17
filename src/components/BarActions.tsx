type Theme = 'dark' | 'light'

type Props = {
  theme: Theme
  soundOn: boolean
  onToggleTheme: () => void
  onToggleSound: () => void
}

/** Theme and sound toggle buttons, shared by the day hub and the board header. */
export function BarActions({ theme, soundOn, onToggleTheme, onToggleSound }: Props) {
  return (
    <div className="bar-actions">
      <button
        className="bar-btn"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          {theme === 'dark' ? (
            // Moon (currently dark → offer light).
            <path d="M13 9.5A5 5 0 0 1 6.5 3a5 5 0 1 0 6.5 6.5z" fill="currentColor" />
          ) : (
            // Sun (currently light → offer dark).
            <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
              <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13" />
            </g>
          )}
        </svg>
      </button>
      <button
        className="bar-btn"
        onClick={onToggleSound}
        aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
        aria-pressed={soundOn}
        title={soundOn ? 'Mute sounds' : 'Enable sounds'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 6h2.5L9 3v10L5.5 10H3z" fill="currentColor" />
          {soundOn ? (
            <path
              d="M11 5.5a3.5 3.5 0 0 1 0 5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M11.5 6l3 4M14.5 6l-3 4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </div>
  )
}
