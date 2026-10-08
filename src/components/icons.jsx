// Shared professional LMS icon set (inline SVG, no emoji).
// Used across student pages instead of decorative emoji glyphs.

export function LockIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function DocIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 2h8l5 5v15H6z" />
      <path d="M14 2v5h5M9 13h7M9 17h7" />
    </svg>
  );
}

export function CheckIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function SparkIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 1l2.6 9.4L24 13l-9.4 2.6L12 25l-2.6-9.4L0 13l9.4-2.6z" transform="scale(0.96) translate(0.5,0.5)" />
    </svg>
  );
}

export function GradCapIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 4L2 9l10 5 10-5z" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v5" />
    </svg>
  );
}

export function TrendIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function BoltIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}

export function DotIcon({ size = 8, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill="currentColor" className={className} aria-hidden>
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

export function PlayIcon({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 4l13 8-13 8z" />
    </svg>
  );
}

// Social brand marks (footer only).
export function FacebookIcon({ size = 13, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8z" />
    </svg>
  );
}

export function InstagramIcon({ size = 13, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TelegramIcon({ size = 13, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.9 3.3L2.7 10.9c-.8.3-.8 1.4.1 1.6l4.8 1.5 1.8 5.6c.3.9 1.4 1 1.9.2l2.6-3.1 5 3.7c.6.5 1.6.1 1.8-.7l3.1-14.1c.2-1-.9-1.8-1.9-1.3zM8.5 13.2l9.5-6.2c.2-.1.4.1.2.3l-7.9 7.4-.3 3-1.5-4.5z" />
    </svg>
  );
}
