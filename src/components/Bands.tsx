/** One band of repeated text: its words, speed (seconds per loop), direction and style. */
export type Band = { text: string; seconds: number; reverse?: boolean; outline?: boolean };

/**
 * Bands of text that run sideways forever (CSS only, two copies per band so the loop at
 * -50% is seamless). One component, three FLOW techniques from ui.fearnot.tw:
 *   stack  14 跑馬燈    bands stacked at different speeds and weights
 *   cross  12 斜線帶    two bands tilted against each other, running opposite ways
 *   tape   16 封鎖膠帶  the cross, set on solid tape
 * Decorative: aria-hidden, and still for reduced motion.
 */
export function Bands({
  bands,
  variant = 'stack',
  className = '',
}: {
  bands: readonly Band[];
  variant?: 'stack' | 'cross' | 'tape';
  className?: string;
}) {
  return (
    <div className={`display bands is-${variant} ${className}`} aria-hidden="true">
      {bands.map((band) => (
        <p
          key={band.text}
          className={band.outline ? 'band-row is-outline' : 'band-row'}
          style={
            {
              '--seconds': `${band.seconds}s`,
              '--direction': band.reverse ? 'reverse' : 'normal',
            } as React.CSSProperties
          }
        >
          <span>{band.text.repeat(4)}</span>
          <span>{band.text.repeat(4)}</span>
        </p>
      ))}
    </div>
  );
}
