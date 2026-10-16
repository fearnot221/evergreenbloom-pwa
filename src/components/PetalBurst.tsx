import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap';
import { Petal } from './motifs';

const COUNT = 22;

/**
 * 櫻花爆開: petals burst from the centre of the parent box, then drift down and fade.
 * Plays each time `play` changes to a new truthy value. Reduced motion: nothing plays.
 */
export function PetalBurst({ play }: { play: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!play || !root.current) return;
      const { width, height } = root.current.getBoundingClientRect();
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const petals = gsap.utils.toArray<SVGElement>('.burst-petal', root.current);
        gsap
          .timeline({ defaults: { stagger: { amount: 0.18, from: 'random' } } })
          .set(petals, { autoAlpha: 1, x: 0, y: 0, scale: 0.2, rotation: 0 })
          .to(petals, {
            x: () => gsap.utils.random(-0.5, 0.5) * width,
            y: () => gsap.utils.random(-0.45, 0.1) * height,
            scale: () => gsap.utils.random(0.6, 1.25),
            rotation: () => gsap.utils.random(-200, 200),
            duration: 0.75,
            ease: 'expo.out',
          })
          .to(
            petals,
            {
              y: `+=${height * 0.6}`,
              x: () => `+=${gsap.utils.random(-60, 60)}`,
              rotation: () => `+=${gsap.utils.random(-140, 140)}`,
              autoAlpha: 0,
              duration: () => gsap.utils.random(1.8, 2.8),
              ease: 'sine.in',
            },
            '-=0.2',
          );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [play], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="petal-burst" aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical decorative petals.
        <Petal key={i} className="burst-petal" />
      ))}
    </div>
  );
}
