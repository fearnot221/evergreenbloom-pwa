import { useId } from 'react';

export const RIBBON_REPEATS = 8;
const WAVE = 'M-200 150C150 20 450 20 750 140S1350 260 1650 120S2050 40 2200 130';

/**
 * 緞帶 (ui.fearnot.tw 13): a phrase along a wavy band. Markup only, so the shell can show
 * it without loading GSAP; `flowRibbon()` (motion/gsap.ts) makes it run.
 */
export function Ribbon({ text, className = '' }: { text: string; className?: string }) {
  const id = useId();
  return (
    <svg
      className={`ribbon ${className}`}
      viewBox="0 0 1600 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path id={id} d={WAVE} className="ribbon-line" />
      <text className="display ribbon-text">
        <textPath href={`#${id}`}>{text.repeat(RIBBON_REPEATS)}</textPath>
      </text>
    </svg>
  );
}
