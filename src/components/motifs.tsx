/**
 * Flat petal motifs (hand-built SVG, no external artwork): a single petal and the
 * five-petal 松櫻 blossom. aria-hidden, coloured only through tokens.
 */
import type { CSSProperties } from 'react';

type MotifProps = { className?: string; style?: CSSProperties };

/* One notched cherry petal, base at the origin, tip pointing up. */
export const PETAL = 'M0 0C-15-7-25-25-19-41C-15-50-6-51 0-44C6-51 15-50 19-41C25-25 15-7 0 0Z';

export function Petal({ className = '', style }: MotifProps) {
  return (
    <svg
      className={`motif petal ${className}`}
      style={style}
      viewBox="-26 -54 52 58"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PETAL} style={{ fill: 'var(--motif-petal-deep)' }} opacity="0.85" />
    </svg>
  );
}

/**
 * Flat five-petal blossom, the 松櫻 mark: solid petals, an ink centre, no gradients.
 * Petal and centre colours come from --blossom-petal and --blossom-centre.
 */
export function Blossom({ className = '', style }: MotifProps) {
  return (
    <svg
      className={`motif blossom ${className}`}
      style={style}
      viewBox="-55 -55 110 110"
      aria-hidden="true"
      focusable="false"
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d={PETAL}
          transform={`rotate(${angle}) translate(0 -4)`}
          style={{ fill: 'var(--blossom-petal)' }}
        />
      ))}
      <circle r="7" style={{ fill: 'var(--blossom-centre)' }} />
    </svg>
  );
}
