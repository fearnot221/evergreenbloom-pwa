import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, MOTION, ScrollTrigger, useGSAP } from '../motion/gsap';

/**
 * 標題切換 (ui.fearnot.tw 30): a news ticker. Every 3.2s the headline slides up and out
 * and the next one rises in, while on screen. Every headline is a real link; only the
 * current one is visible and focusable. Reduced motion: the first headline, static.
 */
export function HeadlineSwap({ items }: { items: readonly { id: string; title: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const lines = gsap.utils.toArray<HTMLElement>('.ticker-item');
        if (lines.length < 2) return;
        let current = 0;
        const show = (el: HTMLElement, on: boolean) => {
          el.inert = !on;
        };
        for (const [i, line] of lines.entries()) show(line, i === 0);
        gsap.set(lines.slice(1), { yPercent: 110, autoAlpha: 0 });
        const swap = () => {
          const leaving = lines[current];
          current = (current + 1) % lines.length;
          const next = lines[current];
          show(leaving, false);
          show(next, true);
          gsap.to(leaving, { yPercent: -110, autoAlpha: 0, duration: 0.6, ease: 'power3.in' });
          gsap.fromTo(
            next,
            { yPercent: 110, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', delay: 0.25 },
          );
        };
        const loop = gsap.timeline({ repeat: -1, paused: true }).call(swap, [], 3.2);
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
        return () => {
          for (const line of lines) line.inert = false;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="ticker" role="region" aria-label="快訊">
      <span className="ticker-label">快訊</span>
      <ul className="ticker-lines">
        {items.map((item) => (
          <li className="ticker-item" key={item.id}>
            <Link to={`/news/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
