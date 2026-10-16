import { useEffect, useRef, useState } from 'react';
import { PetalBurst } from '../components/PetalBurst';
import { display } from '../data/display-copy';
import type { StampSpot } from '../data/stamps';
import { gsap, useGSAP } from '../motion/gsap';

/**
 * 集章成功: the seal presses down, the scenery text unfolds, petals burst. A native
 * modal dialog, so focus, Escape and the backdrop behave as the menu does.
 */
export function StampReveal({ spot, onClose }: { spot: StampSpot | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (spot && !dialog.current?.open) dialog.current?.showModal();
  }, [spot]);

  useGSAP(
    () => {
      if (!spot) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline()
          .from('.reveal-seal', {
            scale: 1.8,
            rotation: -14,
            autoAlpha: 0,
            duration: 0.42,
            ease: 'power4.in',
          })
          .call(() => setBurst((n) => n + 1))
          .from('.reveal-seal', { scale: 0.94, duration: 0.3, ease: 'back.out(3)' })
          .from(
            '.reveal-copy > *',
            { y: 18, autoAlpha: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
            '<',
          );
      });
      return () => mm.revert();
    },
    { scope: dialog, dependencies: [spot], revertOnUpdate: true },
  );

  return (
    <dialog ref={dialog} className="stamp-reveal" aria-labelledby="reveal-title" onClose={onClose}>
      {spot && (
        <>
          <PetalBurst play={burst} />
          <div className="reveal-seal" aria-hidden="true">
            <span className="display">{spot.name.slice(0, 2)}</span>
          </div>
          <div className="reveal-copy">
            <p className="display reveal-kicker">{display.sections.stamped}</p>
            <h2 id="reveal-title">{spot.name}</h2>
            <p>{spot.scenery}</p>
            <form method="dialog">
              <button type="submit" className="button">
                收進集章冊
              </button>
            </form>
          </div>
        </>
      )}
    </dialog>
  );
}
