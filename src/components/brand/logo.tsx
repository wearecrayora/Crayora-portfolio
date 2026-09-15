import {
  LOCKUP_C_PATH,
  LOCKUP_STAR_PATH,
  LOCKUP_VIEWBOX,
  LOCKUP_WORD_PATH,
  MARK_C_PATH,
  MARK_STAR_PATH,
  MARK_VIEWBOX,
  WORD_PATH,
  WORD_VIEWBOX,
} from "@/lib/logo-paths";

type LogoProps = {
  className?: string;
  /** Colour of the sparkle. The C and wordmark follow currentColor. */
  starColor?: string;
  title?: string;
};

export function Logo({ className, starColor = "var(--color-indigo)", title = "Crayora" }: LogoProps) {
  return (
    <svg viewBox={LOCKUP_VIEWBOX} className={className} role="img" aria-label={title}>
      <path fill="currentColor" fillRule="evenodd" d={`${LOCKUP_C_PATH} ${LOCKUP_WORD_PATH}`} />
      <path fill={starColor} d={LOCKUP_STAR_PATH} />
    </svg>
  );
}

export function Mark({ className, starColor = "var(--color-indigo)", title = "Crayora" }: LogoProps) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} role="img" aria-label={title}>
      <path fill="currentColor" fillRule="evenodd" d={MARK_C_PATH} />
      <path fill={starColor} d={MARK_STAR_PATH} />
    </svg>
  );
}

export function Wordmark({ className, title = "Crayora" }: Omit<LogoProps, "starColor">) {
  return (
    <svg viewBox={WORD_VIEWBOX} className={className} role="img" aria-label={title}>
      <path fill="currentColor" fillRule="evenodd" d={WORD_PATH} />
    </svg>
  );
}

/** The four-point sparkle on its own, used as a separator glyph and loader. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 -50 C4 -18 18 -4 50 0 C18 4 4 18 0 50 C-4 18 -18 4 -50 0 C-18 -4 -4 -18 0 -50 Z"
      />
    </svg>
  );
}
