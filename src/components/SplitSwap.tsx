import { useRef } from 'react';
import { gsap, MOTION, ScrollTrigger, useGSAP } from '../motion/gsap';

/**
 * 上下裂開: a word splits along its middle, top half up and bottom half down, and the
 * next word is underneath. Cycles every 2.4s while on screen; reduced motion shows the
 * first word. The first word is the heading's accessible text; the visual words are
 * hidden.
 */
export function SplitSwap({
  words,
  className = '',
}: {
  words: readonly string[];
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const items = gsap.utils.toArray<HTMLElement>('.swap-word');
        const halves = (word: HTMLElement) => [...word.children];
        gsap.set(items, { autoAlpha: 0, zIndex: 0 });
        gsap.set(items[0], { autoAlpha: 1 });
        let current = 0;
        const swap = () => {
          const leaving = items[current];
          current = (current + 1) % items.length;
          const next = items[current];
          gsap.set(leaving, { zIndex: 2 });
          gsap.set(next, { zIndex: 1, autoAlpha: 1 });
          gsap.from(next, { scale: 0.92, duration: 0.7 });
          const [top, bottom] = halves(leaving);
          gsap
            .timeline({
              defaults: { duration: 0.6, ease: 'power3.in' },
              onComplete: () => {
                gsap.set(leaving, { autoAlpha: 0, zIndex: 0 });
                gsap.set(halves(leaving), { yPercent: 0, autoAlpha: 1 });
              },
            })
            .to(top, { yPercent: -60, autoAlpha: 0 }, 0)
            .to(bottom, { yPercent: 60, autoAlpha: 0 }, 0);
        };
        const loop = gsap.timeline({ repeat: -1, paused: true }).call(swap, [], 2.4);
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <span ref={root} className={`swap ${className}`}>
      <span className="sr-only">{words[0]}</span>
      {words.map((word) => (
        <span className="swap-word" key={word} aria-hidden="true">
          <span className="swap-top">{word}</span>
          <span className="swap-bottom">{word}</span>
        </span>
      ))}
    </span>
  );
}
